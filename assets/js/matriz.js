// Motor de relaciones con matriz cero-uno y dígrafo. Necesita assets/js/relaciones.js.
// Datos: { id, tipo: 'matriz', ejercicios: [ … ] }. Cada ejercicio es uno de estos:
//   { id, modo: 'construir',   X, Y?, enunciado, regla: (x, y) => bool  (o particion: [[1, 2], [3]]), dominio?: false }
//   { id, modo: 'operar',      datos: { R: { X, Y?, pares } | 'pares sobre X' }, X?, expr: 'S ∘ R' }
//   { id, modo: 'propiedades', X, pares | regla, enunciado, clases?: true }
//   { id, modo: 'ejemplo',     X, pide: { reflexiva: true, transitiva: false, … , clases: 4 }, ejemplo: '{(…)}' }
//   { id, modo: 'clases',      X, pares | regla | particion, enunciado }
// Campos comunes: origen ("Ej. 3.7 a"), nota, dibujo: false (sin dígrafo), verMatriz: false (sin matriz ni dígrafo).
(function () {
  const { el, barajar } = ESTUDIO;
  const Rel = window.RELACIONES;
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attrs = {}, ...hijos) => {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) if (v != null) n.setAttribute(k, v);
    hijos.flat().forEach((h) => h && n.append(h));
    return n;
  };
  const K = (a, b) => `${a}|${b}`;

  const MODOS = [
    ['construir', 'Construir'],
    ['operar', 'Operar'],
    ['propiedades', 'Propiedades'],
    ['ejemplo', 'Dar un ejemplo'],
    ['clases', 'Clases'],
  ];
  const PROPS = [
    ['reflexiva', 'Reflexiva'], ['irreflexiva', 'Irreflexiva'], ['simetrica', 'Simétrica'],
    ['antisimetrica', 'Antisimétrica'], ['transitiva', 'Transitiva'],
  ];

  // ---------- Matriz cero-uno ----------
  // marcas: Map clave → 'sobra' | 'falta'
  function matriz(R, { editable = false, alTocar, marcas } = {}) {
    const cab = el('tr', {}, el('th', { class: 'esquina', scope: 'col' }, ''),
      ...R.Y.map((b) => el('th', { scope: 'col' }, String(b))));
    const filas = R.X.map((a) => el('tr', {}, el('th', { scope: 'row' }, String(a)),
      ...R.Y.map((b) => {
        const k = K(a, b), uno = R.P.has(k), m = marcas && marcas.get(k);
        const clase = ['celda', uno ? 'uno' : '', m || ''].join(' ').trim();
        const contenido = uno ? '1' : '0';
        return el('td', {}, editable
          ? el('button', { class: clase, 'aria-pressed': String(uno), 'aria-label': `(${a}, ${b})`, onclick: () => alTocar(k) }, contenido)
          : el('span', { class: clase }, contenido));
      })));
    return el('table', { class: 'rel-matriz' + (editable ? ' editable' : '') }, el('tbody', {}, cab, ...filas));
  }

  // ---------- Dígrafo ----------
  let contador = 0;
  function digrafo(R) {
    const id = `flecha${++contador}`;
    const uno = Rel.sobreUno(R);
    const nodos = new Map(); // clave "x:elemento" (lado) → [x, y]
    const ladoX = (a) => `x:${a}`, ladoY = (b) => (uno ? `x:${b}` : `y:${b}`);
    let W, H, centro = null;
    const largo = Math.max(...[...R.X, ...R.Y].map((e) => String(e).length));
    const rNodo = Math.max(15, 5 + 4.2 * largo);
    if (uno) {
      const n = R.X.length;
      W = H = n <= 3 ? 220 : n <= 6 ? 270 : 320;
      const radio = W / 2 - rNodo - 26;
      centro = [W / 2, H / 2];
      R.X.forEach((a, i) => {
        const ang = -Math.PI / 2 + (2 * Math.PI * i) / n;
        nodos.set(ladoX(a), n === 1 ? [W / 2, H / 2 + 14] : [W / 2 + radio * Math.cos(ang), H / 2 + radio * Math.sin(ang)]);
      });
    } else {
      W = 280;
      const n = Math.max(R.X.length, R.Y.length);
      H = n * 50 + 46;
      const col = (xs, x, lado) => xs.forEach((e, i) =>
        nodos.set(lado(e), [x, 46 + (H - 46) / 2 + (i - (xs.length - 1) / 2) * 50]));
      col(R.X, 60, ladoX); col(R.Y, W - 60, ladoY);
    }
    const resta = (p, q) => [p[0] - q[0], p[1] - q[1]];
    const largoV = (v) => Math.hypot(v[0], v[1]) || 1;
    const hacia = (p, q, d) => { const v = resta(q, p), l = largoV(v); return [p[0] + (v[0] / l) * d, p[1] + (v[1] / l) * d]; };
    const f = (p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;

    const flechas = [];
    for (const [a, b] of Rel.pares(R)) {
      const p = nodos.get(ladoX(a)), q = nodos.get(ladoY(b));
      if (uno && String(a) === String(b)) {
        const fuera = centro && R.X.length > 1 ? resta(p, centro) : [0, -1];
        const l = largoV(fuera), u = [fuera[0] / l, fuera[1] / l];
        const rot = (v, g) => [v[0] * Math.cos(g) - v[1] * Math.sin(g), v[0] * Math.sin(g) + v[1] * Math.cos(g)];
        const en = (v, d) => [p[0] + v[0] * d, p[1] + v[1] * d];
        const s = en(rot(u, 0.55), rNodo), e = en(rot(u, -0.55), rNodo + 2);
        const c1 = en(rot(u, 0.6), rNodo + 34), c2 = en(rot(u, -0.6), rNodo + 34);
        flechas.push(svgEl('path', { d: `M${f(s)} C${f(c1)} ${f(c2)} ${f(e)}`, 'marker-end': `url(#${id})` }));
        continue;
      }
      const doble = uno && Rel.tiene(R, b, a);
      if (doble) {
        const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], v = resta(q, p), l = largoV(v);
        const c = [m[0] - (v[1] / l) * 22, m[1] + (v[0] / l) * 22];
        flechas.push(svgEl('path', { d: `M${f(hacia(p, c, rNodo))} Q${f(c)} ${f(hacia(q, c, rNodo + 2))}`, 'marker-end': `url(#${id})` }));
      } else {
        flechas.push(svgEl('path', { d: `M${f(hacia(p, q, rNodo))} L${f(hacia(q, p, rNodo + 2))}`, 'marker-end': `url(#${id})` }));
      }
    }
    const circulos = [...nodos].map(([k, [x, y]]) => svgEl('g', { class: 'nodo' },
      svgEl('circle', { cx: x, cy: y, r: rNodo }),
      svgEl('text', { x, y: y + 5, 'text-anchor': 'middle' }, k.slice(2))));
    const titulos = uno ? [] : [
      svgEl('text', { x: 60, y: 22, 'text-anchor': 'middle', class: 'titulo-col' }, 'X'),
      svgEl('text', { x: W - 60, y: 22, 'text-anchor': 'middle', class: 'titulo-col' }, 'Y')];
    return svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'rel-digrafo', role: 'img', 'aria-label': `Dígrafo de ${Rel.texto(R)}` },
      svgEl('defs', {}, svgEl('marker', { id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 9, markerHeight: 9,
        markerUnits: 'userSpaceOnUse', orient: 'auto-start-reverse' }, svgEl('path', { d: 'M0,0 L10,5 L0,10 z' }))),
      ...titulos, svgEl('g', { class: 'flechas' }, flechas), ...circulos);
  }

  // Matriz + dígrafo + "R = {…}", solo para mirar
  function vista(R, ej, nombre = 'R') {
    if (ej.verMatriz === false) return null;
    return el('div', { class: 'rel-vista' },
      el('div', { class: 'rel-lado' }, matriz(R)),
      ej.dibujo === false ? null : el('div', { class: 'rel-lado' }, digrafo(R)),
      el('p', { class: 'rel-pares formula-linea' }, `${nombre} = ${Rel.texto(R)}`));
  }

  // Tablero editable: matriz que se toca + dígrafo y parejas que se actualizan solos
  function tablero(X, Y, ej, nombre = 'R') {
    const actual = { X, Y, P: new Set() };
    let marcas = null;
    const nodo = el('div', { class: 'rel-vista' });
    const t = {
      nodo, actual,
      alCambiar: null,
      pintar() {
        nodo.replaceChildren(...[
          el('div', { class: 'rel-lado' }, matriz(actual, { editable: true, marcas, alTocar: (k) => {
            actual.P.has(k) ? actual.P.delete(k) : actual.P.add(k);
            marcas = null; t.pintar(); if (t.alCambiar) t.alCambiar();
          } })),
          ej.dibujo === false ? null : el('div', { class: 'rel-lado' }, digrafo(actual)),
          el('p', { class: 'rel-pares formula-linea' }, `${nombre} = ${Rel.texto(actual)}`),
        ].filter(Boolean));
      },
      comprobar(correcta) {
        marcas = new Map();
        for (const a of X) for (const b of Y) {
          const k = K(a, b), u = actual.P.has(k), c = correcta.P.has(k);
          if (u && !c) marcas.set(k, 'sobra');
          if (!u && c) marcas.set(k, 'falta');
        }
        t.pintar();
        const vals = [...marcas.values()];
        return { sobra: vals.filter((v) => v === 'sobra').length, falta: vals.filter((v) => v === 'falta').length };
      },
      poner(R) { actual.P = new Set(R.P); marcas = null; t.pintar(); },
      limpiar() { actual.P.clear(); marcas = null; t.pintar(); },
    };
    t.pintar();
    return t;
  }
  function mensajeMatriz({ sobra, falta }) {
    if (!sobra && !falta) return ['ok', '¡Correcto!'];
    const partes = [];
    if (sobra) partes.push(`${sobra} ${sobra === 1 ? 'pareja sobra' : 'parejas sobran'} (en rojo)`);
    if (falta) partes.push(`${falta} ${falta === 1 ? 'pareja falta' : 'parejas faltan'} (punteadas)`);
    return ['mal', partes.join(' y ') + '.'];
  }

  const lineas = (xs) => el('div', { class: 'rel-info' }, ...xs.filter(Boolean).map((x) =>
    typeof x === 'string' ? el('p', { class: 'formula-linea' }, x) : x));

  // ---------- Motor ----------
  ESTUDIO.motor('matriz', function (cont, act) {
    const presentes = MODOS.filter(([m]) => act.ejercicios.some((e) => e.modo === m));
    const pref = ESTUDIO.leer(`${act.id}:modo`, null);
    let modo = presentes.some(([m]) => m === pref) ? pref : presentes[0][0];
    const grupoModo = el('div', { class: 'segmentado', role: 'group', 'aria-label': 'Modo' });
    const zona = el('div', { class: 'zona-matriz' });
    if (act.instrucciones) {
      cont.append(el('details', { class: 'instrucciones' }, el('summary', {}, 'Instrucciones'),
        el('ul', {}, ...act.instrucciones.map((t) => el('li', {}, t)))));
    }
    if (presentes.length > 1) {
      cont.append(el('div', { class: 'controles' },
        el('div', { class: 'control' }, el('span', { class: 'etiqueta' }, 'Modo'), grupoModo)));
    }
    cont.append(zona);

    function pintarModos() {
      grupoModo.replaceChildren(...presentes.map(([m, txt]) => {
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
      const despues = el('div', { class: 'rel-despues oculto' });
      const mostrarDespues = (...xs) => { despues.replaceChildren(...xs.filter(Boolean)); despues.classList.remove('oculto'); };
      const nota = ej.nota ? el('p', { class: 'nota' }, ej.nota) : null;
      const siguiente = () => { estado.pos++; guardar(); mostrar(); };
      const enunciado = ej.enunciado ? ESTUDIO.formula(ej.enunciado, 'formula grande enunciado') : null;
      let cuerpo = [], acciones = [], teclas = {};

      if (ej.modo === 'construir') {
        const R = Rel.deDatos(ej, ej.X);
        const t = tablero(R.X, R.Y, ej);
        t.alCambiar = () => decir(['', '']);
        const extra = () => lineas([
          `R = ${Rel.texto(R)}`,
          ej.dominio === false ? null : `D_R = ${Rel.conjuntoTexto(Rel.dominio(R))}`,
          ej.dominio === false ? null : `I_R = ${Rel.conjuntoTexto(Rel.imagen(R))}`,
        ]);
        const comprobar = () => { const r = t.comprobar(R); decir(mensajeMatriz(r)); if (!r.sobra && !r.falta) mostrarDespues(extra(), nota); };
        const respuesta = () => { t.poner(R); decir(['', 'Esta es la respuesta.']); mostrarDespues(extra(), nota); };
        cuerpo = [el('p', { class: 'pedido' }, ej.pedido || 'Marca en la matriz las parejas de la relación:'), enunciado, t.nodo];
        acciones = [
          el('button', { class: 'btn', onclick: () => { t.limpiar(); decir(['', '']); } }, 'Borrar'),
          el('button', { class: 'btn', onclick: respuesta }, 'Ver respuesta'),
          el('button', { class: 'btn primario-suave', onclick: comprobar }, 'Comprobar')];
        teclas = { c: comprobar, s: respuesta };
      } else if (ej.modo === 'operar') {
        const env = {};
        for (const [k, d] of Object.entries(ej.datos)) env[k] = Rel.deDatos(d, ej.X);
        env.X = ej.X ? Rel.leerConjunto(ej.X) : Object.values(env)[0].X;
        const R = Rel.evaluar(ej.expr, env);
        const t = tablero(R.X, R.Y, ej, ej.expr);
        t.alCambiar = () => decir(['', '']);
        const datos = Object.keys(ej.datos).map((k) => {
          const r = env[k], uno = Rel.sobreUno(r);
          return `${k} = ${Rel.texto(r)}` + (uno ? `  sobre ${Rel.conjuntoTexto(r.X)}` : `  de ${Rel.conjuntoTexto(r.X)} en ${Rel.conjuntoTexto(r.Y)}`);
        });
        const verDatos = el('details', { class: 'rel-datos' }, el('summary', {}, 'Ver los datos como matriz y dígrafo'),
          ...Object.keys(ej.datos).map((k) => el('div', {}, el('p', { class: 'rel-nombre' }, k), vista(env[k], ej, k))));
        const comprobar = () => { const r = t.comprobar(R); decir(mensajeMatriz(r)); if (!r.sobra && !r.falta) mostrarDespues(lineas([`${ej.expr} = ${Rel.texto(R)}`]), nota); };
        const respuesta = () => { t.poner(R); decir(['', 'Esta es la respuesta.']); mostrarDespues(lineas([`${ej.expr} = ${Rel.texto(R)}`]), nota); };
        cuerpo = [el('p', { class: 'pedido' }, 'Con los datos, calcula y marca el resultado en la matriz:'),
          el('div', { class: 'rel-info' }, ...datos.map((d) => el('p', { class: 'formula-linea' }, d))),
          ESTUDIO.formula(ej.expr, 'formula grande enunciado'), verDatos, t.nodo];
        acciones = [
          el('button', { class: 'btn', onclick: () => { t.limpiar(); decir(['', '']); } }, 'Borrar'),
          el('button', { class: 'btn', onclick: respuesta }, 'Ver respuesta'),
          el('button', { class: 'btn primario-suave', onclick: comprobar }, 'Comprobar')];
        teclas = { c: comprobar, s: respuesta };
      } else if (ej.modo === 'propiedades') {
        const R = Rel.deDatos(ej, ej.X);
        const p = Rel.propiedades(R), ti = Rel.tipos(p);
        const resp = {}; const tiposMarcados = new Set();
        let revisado = false;
        const filas = PROPS.map(([k, txt]) => {
          const si = el('button', { class: 'seg', 'aria-pressed': 'false', onclick: () => elegir(k, true) }, 'Sí');
          const no = el('button', { class: 'seg', 'aria-pressed': 'false', onclick: () => elegir(k, false) }, 'No');
          const por = el('div', { class: 'rel-por oculto' });
          const fila = el('div', { class: 'rel-prop' }, el('span', { class: 'rel-prop-nombre' }, txt),
            el('div', { class: 'segmentado' }, si, no), por);
          return { k, si, no, por, fila };
        });
        function elegir(k, v) {
          if (revisado) return; // ya se vio la respuesta
          resp[k] = v;
          const f = filas.find((x) => x.k === k);
          f.fila.classList.remove('bien', 'mal'); f.por.classList.add('oculto');
          f.si.setAttribute('aria-pressed', String(v === true)); f.no.setAttribute('aria-pressed', String(v === false));
          decir(['', '']);
        }
        const chips = Rel.TIPOS.map(([k, txt]) => el('button', { class: 'chip', 'aria-pressed': 'false', onclick: (ev) => {
          if (revisado) return;
          tiposMarcados.has(k) ? tiposMarcados.delete(k) : tiposMarcados.add(k);
          ev.currentTarget.setAttribute('aria-pressed', String(tiposMarcados.has(k)));
          ev.currentTarget.classList.remove('bien', 'mal', 'aplica', 'no-aplica');
        } }, txt));
        const explicarTipos = () => {
          const son = Rel.TIPOS.filter(([k]) => ti[k]).map(([, txt]) => txt.toLowerCase());
          const partes = [el('p', {}, el('strong', {}, son.length ? `Es de: ${son.join(', ')}.` : 'No es de ningún tipo de la tabla.'))];
          partes.push(el('ul', { class: 'rel-tipos' }, ...Rel.TIPOS.map(([k, txt, , def]) =>
            el('li', { class: ti[k] ? 'si' : 'no' }, `${ti[k] ? '✓' : '✗'} ${txt}: ${def}.`))));
          if (p.antisimetrica.ok && p.transitiva.ok) partes.push(el('p', { class: 'rel-por-linea' }, `Tricotomía: ${p.tricotomia.por}`));
          if (ti.equivalencia && ej.clases !== false) {
            const cs = Rel.clases(R);
            partes.push(el('p', { class: 'formula-linea' }, `X/R = {${cs.map(Rel.conjuntoTexto).join(', ')}}`));
          }
          return el('div', { class: 'rel-info' }, ...partes);
        };
        function revisar(mostrarRespuesta) {
          if (revisado) return;
          if (!mostrarRespuesta && PROPS.some(([k]) => !(k in resp))) return decir(['mal', 'Contesta Sí o No en cada propiedad.']);
          if (mostrarRespuesta) revisado = true; // después de comprobar se puede corregir; después de ver la respuesta, no
          let malas = 0;
          for (const f of filas) {
            const ok = p[f.k].ok;
            if (mostrarRespuesta) { resp[f.k] = ok; f.si.setAttribute('aria-pressed', String(ok)); f.no.setAttribute('aria-pressed', String(!ok)); }
            const bien = resp[f.k] === ok;
            if (!bien) malas++;
            f.fila.classList.remove('bien', 'mal'); f.fila.classList.add(bien ? 'bien' : 'mal');
            f.por.textContent = `${ok ? 'Sí' : 'No'}: ${p[f.k].por}`;
            f.por.classList.remove('oculto');
          }
          let tiposMal = 0;
          chips.forEach((c, i) => {
            const k = Rel.TIPOS[i][0];
            if (mostrarRespuesta) { if (ti[k]) tiposMarcados.add(k); else tiposMarcados.delete(k); c.setAttribute('aria-pressed', String(ti[k])); }
            const picked = tiposMarcados.has(k);
            const applies = Boolean(ti[k]);
            if (picked !== applies) tiposMal++;
            c.classList.remove('bien', 'mal', 'aplica', 'no-aplica');
            c.classList.add(applies ? 'aplica' : 'no-aplica');
          });
          mostrarDespues(explicarTipos(), nota);
          if (mostrarRespuesta) decir(['', 'Estas son las respuestas.']);
          else decir(!malas && !tiposMal ? ['ok', '¡Todo correcto!']
            : ['mal', [malas ? `${malas} ${malas === 1 ? 'propiedad mal' : 'propiedades mal'}` : '', tiposMal ? `${tiposMal} ${tiposMal === 1 ? 'tipo mal' : 'tipos mal'}` : ''].filter(Boolean).join(' y ') + '. Corrige lo marcado en rojo y vuelve a comprobar.']);
        }
        cuerpo = [el('p', { class: 'pedido' }, ej.pedido || '¿Qué propiedades cumple? ¿De qué tipo es?'), enunciado, vista(R, ej),
          el('div', { class: 'rel-props' }, ...filas.map((f) => f.fila)),
          el('div', { class: 'rel-tipos-elegir' }, el('span', { class: 'etiqueta' }, 'Tipo (todos los que apliquen)'), el('div', { class: 'chips' }, ...chips))];
        acciones = [
          el('button', { class: 'btn', onclick: () => revisar(true) }, 'Ver respuesta'),
          el('button', { class: 'btn primario-suave', onclick: () => revisar(false) }, 'Comprobar')];
        teclas = { c: () => revisar(false), s: () => revisar(true) };
      } else if (ej.modo === 'ejemplo') {
        const X = Rel.leerConjunto(ej.X);
        const t = tablero(X, X, ej);
        t.alCambiar = () => decir(['', '']);
        const pideTxt = Rel.revisarPide(Rel.vacia(X, X), ej.pide).map((r) => r.texto);
        function revisarActual(titulo) {
          const rs = Rel.revisarPide(t.actual, ej.pide);
          const todo = rs.every((r) => r.ok);
          mostrarDespues(el('ul', { class: 'rel-tipos' }, ...rs.map((r) =>
            el('li', { class: r.ok ? 'si' : 'no' }, `${r.ok ? '✓' : '✗'} ${r.texto}. `, el('span', { class: 'rel-por-linea' }, r.por)))),
            todo ? nota : null);
          decir(titulo ? ['', titulo] : todo ? ['ok', '¡Tu relación cumple todo lo pedido!'] : ['mal', 'Todavía no: revisa lo marcado con ✗.']);
        }
        const verEjemplo = () => { t.poner(Rel.relacion(X, X, ej.ejemplo)); revisarActual('Este es un ejemplo; hay muchas respuestas correctas.'); };
        cuerpo = [el('p', { class: 'pedido' }, `Construye una relación sobre X = ${Rel.conjuntoTexto(X)} que sea:`),
          el('ul', { class: 'rel-pide' }, ...pideTxt.map((x) => el('li', {}, x))), t.nodo];
        acciones = [
          el('button', { class: 'btn', onclick: () => { t.limpiar(); decir(['', '']); } }, 'Borrar'),
          el('button', { class: 'btn', onclick: verEjemplo }, 'Ver un ejemplo'),
          el('button', { class: 'btn primario-suave', onclick: () => revisarActual() }, 'Comprobar')];
        teclas = { c: () => revisarActual(), s: verEjemplo };
      } else {
        // clases
        const R = Rel.deDatos(ej, ej.X);
        const correcto = Rel.clases(R);
        const grupo = new Map(R.X.map((x) => [String(x), 0]));
        const maxG = Math.min(R.X.length, 9); // hay 9 colores
        let revisado = false;
        const fichas = el('div', { class: 'rel-fichas' });
        const grupos = el('p', { class: 'rel-pares formula-linea' });
        function pintarFichas() {
          fichas.replaceChildren(...R.X.map((x) => {
            const g = grupo.get(String(x));
            return el('button', { class: `ficha g${g}`, 'aria-label': `${x}: ${g ? `grupo ${g}` : 'sin grupo'}`,
              onclick: () => { if (revisado) return; grupo.set(String(x), (g + 1) % (maxG + 1)); decir(['', '']); pintarFichas(); } },
            String(x), g ? el('small', {}, String(g)) : null);
          }));
          const bloques = [];
          for (let g = 1; g <= maxG; g++) {
            const b = R.X.filter((x) => grupo.get(String(x)) === g);
            if (b.length) bloques.push(Rel.conjuntoTexto(b));
          }
          grupos.textContent = `Tus clases: ${bloques.length ? bloques.join(', ') : '(ninguna todavía)'}`;
        }
        const explicar = () => lineas([
          ...R.X.map((x) => `[${x}] = ${Rel.conjuntoTexto(Rel.claseDe(R, x))}`),
          `X/R = {${correcto.map(Rel.conjuntoTexto).join(', ')}}`,
        ]);
        function comprobar() {
          const sin = R.X.filter((x) => !grupo.get(String(x)));
          if (sin.length) return decir(['mal', `Falta ponerle grupo a ${sin.join(', ')}.`]);
          let fallo = null;
          buscar: for (const a of R.X) for (const b of R.X) {
            const juntos = grupo.get(String(a)) === grupo.get(String(b));
            if (Rel.tiene(R, a, b) && !juntos) { fallo = `(${a}, ${b}) ∈ R, así que ${a} y ${b} van en la misma clase.`; break buscar; }
            if (!Rel.tiene(R, a, b) && juntos) { fallo = `(${a}, ${b}) ∉ R, así que ${a} y ${b} no van en la misma clase.`; break buscar; }
          }
          if (fallo) return decir(['mal', fallo]);
          revisado = true;
          decir(['ok', '¡Correcto!']);
          mostrarDespues(explicar(), nota);
        }
        function respuesta() {
          correcto.forEach((c, i) => c.forEach((x) => grupo.set(String(x), i + 1)));
          revisado = true; pintarFichas();
          decir(['', 'Esta es la respuesta.']);
          mostrarDespues(explicar(), nota);
        }
        pintarFichas();
        cuerpo = [el('p', { class: 'pedido' }, 'Encuentra las clases de equivalencia: toca cada elemento para cambiarle el grupo (mismo número = misma clase).'),
          enunciado, vista(R, ej), fichas, grupos];
        acciones = [
          el('button', { class: 'btn', onclick: () => { if (revisado) return; grupo.forEach((_, k) => grupo.set(k, 0)); pintarFichas(); decir(['', '']); } }, 'Borrar'),
          el('button', { class: 'btn', onclick: respuesta }, 'Ver respuesta'),
          el('button', { class: 'btn primario-suave', onclick: comprobar }, 'Comprobar')];
        teclas = { c: comprobar, s: respuesta };
      }

      zona.replaceChildren(
        el('div', { class: 'progreso' },
          el('span', {}, `Ejercicio ${estado.pos + 1} de ${n}`),
          ej.origen ? el('span', { class: 'etiqueta-origen' }, ej.origen) : el('span', {}, ''),
          el('button', { class: 'btn-texto', onclick: () => empezar(true) }, 'Reiniciar ronda')),
        el('div', { class: 'barra' }, el('div', { style: `width:${(100 * estado.pos) / n}%` })),
        el('article', { class: 'problema' }, ...cuerpo.filter(Boolean)),
        mensaje,
        el('div', { class: 'acciones' }, ...acciones,
          el('button', { class: 'btn primario', onclick: siguiente }, estado.pos + 1 < n ? 'Siguiente →' : 'Terminar ronda')),
        despues,
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
