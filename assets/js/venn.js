// Motor de diagramas de Venn. Necesita assets/js/conjuntos-expr.js.
// Datos: { id, tipo: 'venn', ejercicios: [ … ] }, cada ejercicio es uno de estos:
//   { id, modo: 'sombrear',     conjuntos: ['A', 'B'],      expr: 'A \\ B', nota? }
//   { id, modo: 'identificar',  conjuntos: ['A', 'B', 'C'], expr: '…', equivalentes?: ['…'], nota? }
//   { id, modo: 'ley',          conjuntos: [...], izq: '…', der: '…', cumple: true | false, nota? }
(function () {
  const { el, barajar } = ESTUDIO;
  const C = window.CONJUNTOS;
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attrs = {}, ...hijos) => {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) if (v != null) n.setAttribute(k, v);
    hijos.flat().forEach((h) => h && n.append(h));
    return n;
  };

  const GEOMETRIA = {
    2: { alto: 220, circulos: { A: [125, 112, 72], B: [195, 112, 72] }, etiquetas: { A: [70, 44], B: [250, 44] } },
    3: { alto: 262, circulos: { A: [126, 100, 66], B: [194, 100, 66], C: [160, 160, 66] },
      etiquetas: { A: [62, 40], B: [258, 40], C: [236, 232] } },
  };
  const MODOS = [
    ['sombrear', 'Sombrea'],
    ['identificar', '¿Qué expresión es?'],
    ['ley', '¿Se cumple la ley?'],
  ];

  let contador = 0;
  // Un diagrama: devuelve { nodo, pintar(estados), firmas, onToggle }
  // estados: Map firmaClave → 'sombreada' | 'sobra' | 'falta' | 'diferencia'
  function diagrama(nombres, interactivo, alToggle) {
    const pre = `venn${++contador}`;
    const g = GEOMETRIA[nombres.length];
    const W = 320, H = g.alto;
    const U = { x: 8, y: 8, w: W - 16, h: H - 16 };
    // Los nombres reales se dibujan en las posiciones A, B, C
    const pos = ['A', 'B', 'C'];
    const circ = Object.fromEntries(nombres.map((n, i) => [n, g.circulos[pos[i]]]));
    const etq = Object.fromEntries(nombres.map((n, i) => [n, g.etiquetas[pos[i]]]));

    const defs = svgEl('defs', {},
      svgEl('pattern', { id: `${pre}-rayas`, width: 8, height: 8, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' },
        svgEl('rect', { width: 8, height: 8, class: 'venn-rayas-fondo' }),
        svgEl('line', { x1: 0, y1: 0, x2: 0, y2: 8, class: 'venn-rayas-linea' })),
      ...nombres.map((n) => svgEl('clipPath', { id: `${pre}-en-${n}` },
        svgEl('circle', { cx: circ[n][0], cy: circ[n][1], r: circ[n][2] }))),
      ...nombres.map((n) => svgEl('mask', { id: `${pre}-fuera-${n}`, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: H },
        svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: 'white' }),
        svgEl('circle', { cx: circ[n][0], cy: circ[n][1], r: circ[n][2], fill: 'black' }))));

    const capaRegiones = svgEl('g', {});
    const marco = svgEl('rect', { x: U.x, y: U.y, width: U.w, height: U.h, rx: 10, class: 'venn-universo' });
    const lineas = svgEl('g', { class: 'venn-lineas' },
      ...nombres.map((n) => svgEl('circle', { cx: circ[n][0], cy: circ[n][1], r: circ[n][2] })));
    const textos = svgEl('g', { class: 'venn-etiquetas' },
      svgEl('text', { x: U.x + 12, y: U.y + 22 }, 'U'),
      ...nombres.map((n) => svgEl('text', { x: etq[n][0], y: etq[n][1], 'text-anchor': 'middle' }, n)));
    const svg = svgEl('svg', {
      viewBox: `0 0 ${W} ${H}`, class: 'venn' + (interactivo ? ' interactivo' : ''), role: 'img',
      'aria-label': `Diagrama de Venn con ${nombres.join(', ')}` + (interactivo ? '. Toca una región para sombrearla.' : ''),
    }, defs, marco, capaRegiones, lineas, textos);

    const firmas = [];
    for (let k = 0; k < 2 ** nombres.length; k++) {
      firmas.push(Object.fromEntries(nombres.map((n, j) => [n, !!(k & (1 << j))])));
    }
    const clave = (f) => nombres.map((n) => (f[n] ? '1' : '0')).join('');

    function region(f, clase) {
      let nodo = svgEl('rect', { x: U.x, y: U.y, width: U.w, height: U.h, rx: 10 });
      for (const n of nombres) if (!f[n]) nodo = svgEl('g', { mask: `url(#${pre}-fuera-${n})` }, nodo);
      for (const n of nombres) if (f[n]) nodo = svgEl('g', { 'clip-path': `url(#${pre}-en-${n})` }, nodo);
      return svgEl('g', { class: `region ${clase}`, fill: clase === 'falta' || clase === 'diferencia-vacia' ? `url(#${pre}-rayas)` : null }, nodo);
    }
    function pintar(estados) {
      capaRegiones.replaceChildren(...firmas.filter((f) => estados.has(clave(f)))
        .map((f) => region(f, estados.get(clave(f)))));
    }

    if (interactivo) {
      svg.addEventListener('click', (ev) => {
        const pt = svg.createSVGPoint();
        pt.x = ev.clientX; pt.y = ev.clientY;
        const p = pt.matrixTransform(svg.getScreenCTM().inverse());
        if (p.x < U.x || p.y < U.y || p.x > U.x + U.w || p.y > U.y + U.h) return;
        const f = Object.fromEntries(nombres.map((n) => [n, Math.hypot(p.x - circ[n][0], p.y - circ[n][1]) <= circ[n][2]]));
        alToggle(clave(f));
      });
    }
    return { nodo: svg, pintar, firmas, clave };
  }

  // Firmas (claves) que pertenecen a una expresión
  function regionesDe(expr, nombres, d) {
    return new Set(d.firmas.filter((f) => C.enRegion(expr, f)).map(d.clave));
  }
  const iguales = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));

  // Un tablero sombreable: el usuario marca regiones; se puede comprobar contra una expresión
  function tablero(nombres, expr) {
    const marcadas = new Set();
    let marcas = null; // resultado de comprobar (se borra al tocar)
    const d = diagrama(nombres, true, (k) => {
      marcadas.has(k) ? marcadas.delete(k) : marcadas.add(k);
      marcas = null; repintar();
      if (t.alCambiar) t.alCambiar();
    });
    const correctas = regionesDe(expr, nombres, d);
    function repintar() {
      const est = new Map();
      if (marcas) marcas.forEach((v, k) => est.set(k, v));
      else marcadas.forEach((k) => est.set(k, 'sombreada'));
      d.pintar(est);
    }
    const t = {
      nodo: d.nodo, d, marcadas, correctas,
      comprobar() {
        const sobra = [...marcadas].filter((k) => !correctas.has(k));
        const falta = [...correctas].filter((k) => !marcadas.has(k));
        marcas = new Map();
        marcadas.forEach((k) => marcas.set(k, correctas.has(k) ? 'sombreada' : 'sobra'));
        falta.forEach((k) => marcas.set(k, 'falta'));
        repintar();
        return { sobra: sobra.length, falta: falta.length };
      },
      mostrarRespuesta(extra = new Map()) {
        marcadas.clear(); correctas.forEach((k) => marcadas.add(k));
        marcas = new Map([...marcadas].map((k) => [k, 'sombreada']));
        extra.forEach((v, k) => marcas.set(k, v));
        repintar();
      },
      limpiar() { marcadas.clear(); marcas = null; repintar(); },
    };
    repintar();
    return t;
  }
  function mensajeComprobar({ sobra, falta }) {
    if (!sobra && !falta) return ['ok', '¡Correcto!'];
    const partes = [];
    if (sobra) partes.push(`${sobra} ${sobra === 1 ? 'región sobra' : 'regiones sobran'} (en rojo)`);
    if (falta) partes.push(`${falta} ${falta === 1 ? 'región falta' : 'regiones faltan'} (rayadas)`);
    return ['mal', partes.join(' y ') + '.'];
  }

  // Contraejemplo concreto a partir de una región donde los dos lados difieren
  function contraejemplo(nombres, firma, izq, der) {
    const asignar = nombres.map((n) => `${n} = ${firma[n] ? '{1}' : 'Ø'}`);
    const usaU = /U|ᶜ/.test(izq + der);
    const ver = (x) => (C.enRegion(x, firma) ? '{1}' : 'Ø');
    return `Por ejemplo, con ${usaU ? 'U = {1}, ' : ''}${asignar.join(', ')}: ${izq} = ${ver(izq)}, pero ${der} = ${ver(der)}.`;
  }

  ESTUDIO.motor('venn', function (cont, act) {
    const pref = ESTUDIO.leer(`${act.id}:modo`, null);
    let modo = MODOS.some(([m]) => m === pref) ? pref : 'sombrear';
    const grupoModo = el('div', { class: 'segmentado', role: 'group', 'aria-label': 'Modo' });
    const zona = el('div', { class: 'zona-venn' });
    cont.append(el('div', { class: 'controles' },
      el('div', { class: 'control' }, el('span', { class: 'etiqueta' }, 'Modo'), grupoModo)), zona);

    function pintarModos() {
      grupoModo.replaceChildren(...MODOS.map(([m, txt]) => {
        const n = act.ejercicios.filter((e) => e.modo === m).length;
        return el('button', { class: 'seg', 'aria-pressed': String(modo === m),
          onclick: () => { modo = m; ESTUDIO.guardar(`${act.id}:modo`, m); pintarModos(); empezar(); } }, `${txt} (${n})`);
      }));
    }

    let estado;
    const claveRonda = () => `${act.id}:ronda:${modo}`;
    function empezar(nueva) {
      const ids = act.ejercicios.filter((e) => e.modo === modo).map((e) => e.id);
      estado = nueva ? null : ESTUDIO.leer(claveRonda(), null);
      if (!estado || !Array.isArray(estado.orden) || estado.orden.length !== ids.length ||
          !estado.orden.every((id) => ids.includes(id))) estado = { orden: barajar(ids), pos: 0 };
      guardar(); mostrar();
    }
    const guardar = () => ESTUDIO.guardar(claveRonda(), estado);

    function mostrar() {
      if (estado.pos >= estado.orden.length) return terminado();
      const ej = act.ejercicios.find((e) => e.id === estado.orden[estado.pos]);
      const n = estado.orden.length;
      const mensaje = el('p', { class: 'venn-mensaje', 'aria-live': 'polite' });
      const decir = ([tipo, txt]) => { mensaje.className = `venn-mensaje ${tipo}`; mensaje.textContent = txt; };
      const nota = ej.nota ? el('p', { class: 'nota oculto' }, ej.nota) : null;
      const verNota = () => nota && nota.classList.remove('oculto');
      const siguiente = () => { estado.pos++; guardar(); mostrar(); };
      let acciones = [], cuerpo = [], teclas = {};

      if (ej.modo === 'sombrear') {
        const t = tablero(ej.conjuntos, ej.expr);
        t.alCambiar = () => decir(['', '']);
        const comprobar = () => { const r = t.comprobar(); decir(mensajeComprobar(r)); if (!r.sobra && !r.falta) verNota(); };
        const respuesta = () => { t.mostrarRespuesta(); decir(['', 'Esta es la respuesta.']); verNota(); };
        cuerpo = [el('p', { class: 'pedido' }, 'Sombrea:'), el('div', { class: 'formula grande enunciado' }, ej.expr),
          el('div', { class: 'venn-uno' }, t.nodo)];
        acciones = [
          el('button', { class: 'btn', onclick: () => { t.limpiar(); decir(['', '']); } }, 'Borrar'),
          el('button', { class: 'btn', onclick: respuesta }, 'Ver respuesta'),
          el('button', { class: 'btn primario-suave', onclick: comprobar }, 'Comprobar')];
        teclas = { c: comprobar, s: respuesta };
      } else if (ej.modo === 'identificar') {
        const d = diagrama(ej.conjuntos, false);
        d.pintar(new Map([...regionesDe(ej.expr, ej.conjuntos, d)].map((k) => [k, 'sombreada'])));
        const resp = el('div', { class: 'venn-respuesta oculto' },
          el('div', { class: 'formula grande' }, ej.expr),
          ej.equivalentes && ej.equivalentes.length
            ? el('p', {}, 'También se puede escribir: ', ...ej.equivalentes.flatMap((e, i) => [i ? ' · ' : '', el('span', { class: 'formula-linea' }, e)]))
            : null);
        const respuesta = () => { resp.classList.remove('oculto'); verNota(); };
        cuerpo = [el('p', { class: 'pedido' }, 'Escribe en papel una expresión para la parte sombreada:'),
          el('div', { class: 'venn-uno' }, d.nodo), resp];
        acciones = [el('button', { class: 'btn primario-suave', onclick: respuesta }, 'Ver respuesta')];
        teclas = { s: respuesta };
      } else {
        const ti = tablero(ej.conjuntos, ej.izq), td = tablero(ej.conjuntos, ej.der);
        ti.alCambiar = td.alCambiar = () => decir(['', '']);
        let decidido = false;
        const comprobar = () => {
          const a = ti.comprobar(), b = td.comprobar();
          const [ta] = mensajeComprobar(a), [tb] = mensajeComprobar(b);
          decir(ta === 'ok' && tb === 'ok'
            ? ['ok', 'Los dos lados están bien sombreados. ¿Se cumple la ley?']
            : ['mal', `Izquierda: ${mensajeComprobar(a)[1]} Derecha: ${mensajeComprobar(b)[1]}`]);
        };
        function veredicto(dice) {
          if (decidido) return;
          decidido = true;
          const cumple = iguales(ti.correctas, td.correctas);
          const dif = new Map();
          ti.d.firmas.forEach((f) => {
            const k = ti.d.clave(f);
            if (ti.correctas.has(k) !== td.correctas.has(k)) dif.set(k, 'diferencia');
          });
          // Las regiones donde difieren se pintan en naranja (rayado si ese lado no las incluye)
          const marcarDif = (t) => new Map([...dif].map(([k]) => [k, t.correctas.has(k) ? 'diferencia' : 'diferencia-vacia']));
          ti.mostrarRespuesta(marcarDif(ti)); td.mostrarRespuesta(marcarDif(td));
          const acierto = dice === cumple;
          let txt = (acierto ? '¡Correcto! ' : 'No. ') + (cumple
            ? 'Los dos lados sombrean exactamente las mismas regiones: la ley se cumple.'
            : 'Los lados no coinciden en lo marcado en naranja: un elemento ahí está en un lado y no en el otro. ');
          if (!cumple) {
            const f = ti.d.firmas.find((x) => dif.has(ti.d.clave(x)));
            txt += contraejemplo(ej.conjuntos, f, ej.izq, ej.der);
          }
          decir([acierto ? 'ok' : 'mal', txt]);
          verNota();
        }
        cuerpo = [el('p', { class: 'pedido' }, 'Sombrea cada lado y decide si la igualdad se cumple siempre:'),
          el('div', { class: 'formula grande enunciado' }, `${ej.izq} = ${ej.der}`),
          el('div', { class: 'venn-dos' },
            el('figure', {}, ti.nodo, el('figcaption', { class: 'formula-linea' }, ej.izq)),
            el('figure', {}, td.nodo, el('figcaption', { class: 'formula-linea' }, ej.der)))];
        acciones = [
          el('button', { class: 'btn', onclick: comprobar }, 'Comprobar sombreado'),
          el('button', { class: 'btn primario-suave', onclick: () => veredicto(true) }, 'Sí se cumple'),
          el('button', { class: 'btn primario-suave', onclick: () => veredicto(false) }, 'No se cumple')];
        teclas = { c: comprobar };
      }

      zona.replaceChildren(
        el('div', { class: 'progreso' },
          el('span', {}, `Ejercicio ${estado.pos + 1} de ${n}`),
          el('span', {}, ''),
          el('button', { class: 'btn-texto', onclick: () => empezar(true) }, 'Reiniciar ronda')),
        el('div', { class: 'barra' }, el('div', { style: `width:${(100 * estado.pos) / n}%` })),
        el('article', { class: 'problema' }, ...cuerpo),
        mensaje,
        el('div', { class: 'acciones' }, ...acciones,
          el('button', { class: 'btn primario', onclick: siguiente }, estado.pos + 1 < n ? 'Siguiente →' : 'Terminar ronda')),
          ...(nota ? [nota] : []), // replaceChildren escribiría "null" si no hay nota
        el('p', { class: 'ayuda-teclas' }, 'Teclado: ' + [teclas.c ? 'C = comprobar' : '', teclas.s ? 'S = ver respuesta' : '', 'N o → = siguiente'].filter(Boolean).join(' · ')));
      ESTUDIO.teclado = (ev) => {
        const k = ev.key.toLowerCase();
        if (teclas[k]) teclas[k]();
        else if (k === 'n' || ev.key === 'ArrowRight') siguiente();
      };
    }

    function terminado() {
      ESTUDIO.teclado = null;
      zona.replaceChildren(el('div', { class: 'resumen' },
        el('h3', {}, '¡Terminaste la ronda!'),
        el('p', {}, `Hiciste los ${estado.orden.length} ejercicios de este modo.`),
        el('div', { class: 'acciones' }, el('button', { class: 'btn primario', onclick: () => empezar(true) }, 'Nueva ronda'))));
    }

    pintarModos();
    empezar();
  });
})();
