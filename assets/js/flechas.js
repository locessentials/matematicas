// Motor de funciones finitas con diagramas de flechas. Necesita relaciones.js y funciones.js.
// Datos: { id, tipo: 'flechas', ejercicios: [ … ] }. Cada ejercicio es uno de estos:
//   { id, modo: 'clasificar', f: { A, B, pares } }
//       ¿Es función? ¿Inyectiva? ¿Sobre? ¿Biyectiva?  (la página calcula las respuestas y explica por qué)
//   { id, modo: 'ejemplo', A, B, pide: { inyectiva: true, sobre: false, … }, ejemplo: '{(…)}' }
//       se construye una función con lo que se pide; cualquier respuesta correcta vale
//   { id, modo: 'calcular', datos: { f: { A, B, pares }, g: { … } }, expr: 'f ∘ g' }
//       se construye el resultado; si no existe (inversa de algo no biyectivo, composición no definida)
//       la respuesta correcta es el botón "No existe"
//   { id, modo: 'imagen', datos: { f: { … } }, expr: 'f({a, b})' | 'f⁻¹({1})' }
//       se marcan los elementos del resultado
// Campos comunes: origen, enunciado, pedido, nota.
(function () {
  const { el, barajar } = ESTUDIO;
  const F = window.FUNCIONES;
  const Rel = window.RELACIONES;
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attrs = {}, ...hijos) => {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) if (v != null) n.setAttribute(k, v);
    hijos.flat().forEach((h) => h != null && n.append(h));
    return n;
  };
  const txt = (x) => String(x);

  const MODOS = [
    ['clasificar', 'Clasificar'],
    ['ejemplo', 'Dar un ejemplo'],
    ['calcular', 'Componer e invertir'],
    ['imagen', 'Imagen e imagen inversa'],
  ];
  const PROPS = [
    ['funcion', '¿Es función?'], ['inyectiva', 'Inyectiva (uno a uno)'], ['sobre', 'Sobre (suprayectiva)'], ['biyectiva', 'Biyectiva'],
  ];

  // ---------- Diagrama de flechas ----------
  // columnas: [{ titulo, elems, marcados?: Set de textos }]; flechas: [{ de: [col, elem], a: [col, elem], clase? }]
  let contador = 0;
  function diagrama(columnas, flechas) {
    const id = `fn-punta${++contador}`;
    const ancho = (e) => Math.max(34, 16 + 8.6 * txt(e).length);
    const anchoCol = columnas.map((c) => Math.max(34, ...c.elems.map(ancho)));
    const xs = [];
    let x = anchoCol[0] / 2 + 26;
    columnas.forEach((c, i) => { if (i) x += anchoCol[i - 1] / 2 + anchoCol[i] / 2 + 92; xs.push(x); });
    const W = x + anchoCol[anchoCol.length - 1] / 2 + 26;
    const n = Math.max(...columnas.map((c) => c.elems.length), 1);
    const H = 56 + n * 44 + 14;
    const pos = new Map();
    columnas.forEach((c, i) => c.elems.forEach((e, k) =>
      pos.set(`${i}|${txt(e)}`, [xs[i], 56 + (H - 70) / 2 + (k - (c.elems.length - 1) / 2) * 44])));
    const f1 = (v) => v.toFixed(1);
    const fondo = columnas.map((c, i) => svgEl('ellipse', {
      class: 'fn-conjunto', cx: xs[i], cy: 56 + (H - 70) / 2, rx: anchoCol[i] / 2 + 16, ry: Math.max(c.elems.length, 1) * 22 + 12 }));
    const titulos = columnas.map((c, i) => svgEl('text', { x: xs[i], y: 22, 'text-anchor': 'middle', class: 'fn-titulo' }, c.titulo));
    const lineas = flechas.map((fl) => {
      const p = pos.get(`${fl.de[0]}|${txt(fl.de[1])}`), q = pos.get(`${fl.a[0]}|${txt(fl.a[1])}`);
      if (!p || !q) return null;
      const x1 = p[0] + ancho(fl.de[1]) / 2 + 2, x2 = q[0] - ancho(fl.a[1]) / 2 - 3;
      return svgEl('path', { d: `M${f1(x1)},${f1(p[1])} L${f1(x2)},${f1(q[1])}`, class: fl.clase || '', 'marker-end': `url(#${id})` });
    });
    const nodos = columnas.flatMap((c, i) => c.elems.map((e) => {
      const [cx, cy] = pos.get(`${i}|${txt(e)}`), w = ancho(e);
      const marcado = c.marcados && c.marcados.has(txt(e));
      return svgEl('g', { class: 'fn-nodo' + (marcado ? ' marcado' : '') },
        svgEl('rect', { x: f1(cx - w / 2), y: cy - 15, width: f1(w), height: 30, rx: 15 }),
        svgEl('text', { x: cx, y: cy + 5, 'text-anchor': 'middle' }, txt(e)));
    }));
    return svgEl('svg', { viewBox: `0 0 ${f1(W)} ${H}`, class: 'fn-diagrama', style: `max-width:${Math.round(W * 1.15)}px`, role: 'img' },
      svgEl('defs', {}, svgEl('marker', { id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 8, markerHeight: 8,
        markerUnits: 'userSpaceOnUse', orient: 'auto' }, svgEl('path', { d: 'M0,0 L10,5 L0,10 z' }))),
      ...fondo, ...titulos, svgEl('g', { class: 'fn-flechas' }, lineas), ...nodos);
  }
  // Diagrama de una sola función (o asignación)
  function diagramaDe(f, nombre = 'f', marcadosA, marcadosB) {
    return diagrama(
      [{ titulo: 'Dominio', elems: f.A, marcados: marcadosA }, { titulo: 'Codominio', elems: f.B, marcados: marcadosB }],
      f.pares.map(([a, b]) => ({ de: [0, a], a: [1, b] })));
  }
  // Varias funciones encadenadas si se puede (g: A → B y f: B → C se dibujan A → B → C)
  function diagramasDatos(env, nombres) {
    const caja = (f, n) => el('figure', { class: 'fn-figura' }, diagramaDe(f, n),
      el('figcaption', { class: 'formula-linea' }, `${n} = ${F.texto(f)}`));
    return el('div', { class: 'fn-datos' }, ...nombres.map((n) => caja(env[n], n)));
  }

  // ---------- Elegir imágenes (para "dar un ejemplo" y "calcular") ----------
  function constructor(A, B, nombre) {
    const m = new Map();
    let marcas = null; // Map elemento → 'bien' | 'mal'
    const nodo = el('div', { class: 'fn-constructor' });
    const c = {
      nodo, m, alCambiar: null, bloqueado: false,
      actual: () => F.deMapa(A, B, m),
      completo: () => A.every((a) => m.has(txt(a))),
      pintar() {
        const filas = A.map((a) => el('div', { class: 'fn-fila' + (marcas && marcas.has(txt(a)) ? ' ' + marcas.get(txt(a)) : '') },
          el('span', { class: 'fn-etiqueta formula-linea' }, `${nombre}(${a}) =`),
          el('div', { class: 'segmentado' }, ...B.map((b) => el('button', {
            class: 'seg', 'aria-pressed': String(m.has(txt(a)) && txt(m.get(txt(a))) === txt(b)),
            onclick: () => {
              if (c.bloqueado) return;
              m.set(txt(a), b); marcas = null; c.pintar(); if (c.alCambiar) c.alCambiar();
            } }, txt(b))))));
        nodo.replaceChildren(
          el('div', { class: 'fn-filas' }, ...filas),
          el('div', { class: 'fn-vista' }, diagramaDe(c.actual(), nombre)));
      },
      marcar(correcta) {
        marcas = new Map(A.map((a) => [txt(a), m.has(txt(a)) && txt(m.get(txt(a))) === txt(F.valor(correcta, a)) ? 'bien' : 'mal']));
        c.pintar();
        return [...marcas.values()].filter((v) => v === 'mal').length;
      },
      poner(f) { m.clear(); f.pares.forEach(([a, b]) => m.set(txt(a), b)); marcas = null; c.pintar(); },
      limpiar() { m.clear(); marcas = null; c.pintar(); },
    };
    c.pintar();
    return c;
  }

  // ---------- Motor ----------
  ESTUDIO.motor('flechas', function (cont, act) {
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
      grupoModo.replaceChildren(...presentes.map(([m, t]) => {
        const n = act.ejercicios.filter((e) => e.modo === m).length;
        return el('button', { class: 'seg', 'aria-pressed': String(modo === m),
          onclick: () => { modo = m; ESTUDIO.guardar(`${act.id}:modo`, m); pintarModos(); empezar(); } }, `${t} (${n})`);
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
      const decir = ([tipo, t]) => { mensaje.className = `venn-mensaje ${tipo}`; mensaje.textContent = t; };
      const despues = el('div', { class: 'rel-despues oculto' });
      const mostrarDespues = (...xs) => { despues.replaceChildren(...xs.filter(Boolean)); despues.classList.remove('oculto'); };
      const nota = ej.nota ? el('p', { class: 'nota' }, ej.nota) : null;
      const siguiente = () => { estado.pos++; guardar(); mostrar(); };
      const enunciado = ej.enunciado ? ESTUDIO.formula(ej.enunciado, 'formula grande enunciado') : null;
      const lineas = (xs) => el('div', { class: 'rel-info' }, ...xs.filter(Boolean).map((x) => el('p', { class: 'formula-linea' }, x)));
      let cuerpo = [], acciones = [], teclas = {};

      if (ej.modo === 'clasificar') {
        const f = F.asignacion(ej.f);
        const p = F.propiedades(f);
        const resp = {};
        let revisado = false;
        const filas = PROPS.map(([k, t]) => {
          const si = el('button', { class: 'seg', 'aria-pressed': 'false', onclick: () => elegir(k, true) }, 'Sí');
          const no = el('button', { class: 'seg', 'aria-pressed': 'false', onclick: () => elegir(k, false) }, 'No');
          const por = el('div', { class: 'rel-por oculto' });
          const fila = el('div', { class: 'rel-prop' }, el('span', { class: 'rel-prop-nombre' }, t), el('div', { class: 'segmentado' }, si, no), por);
          return { k, si, no, por, fila };
        });
        const pintarFilas = () => filas.forEach((x) => {
          x.si.setAttribute('aria-pressed', String(resp[x.k] === true));
          x.no.setAttribute('aria-pressed', String(resp[x.k] === false));
          // Si dijo que no es función, las demás no aplican
          x.fila.classList.toggle('apagada', x.k !== 'funcion' && resp.funcion === false);
        });
        function elegir(k, v) {
          if (revisado || (k !== 'funcion' && resp.funcion === false)) return;
          resp[k] = v;
          filas.forEach((x) => { x.fila.classList.remove('bien', 'mal'); x.por.classList.add('oculto'); });
          pintarFilas(); decir(['', '']);
        }
        function revisar(verRespuesta) {
          if (revisado) return;
          const aplica = (k) => k === 'funcion' || p.funcion.ok;
          if (!verRespuesta) {
            if (!('funcion' in resp)) return decir(['mal', 'Primero contesta si es función.']);
            if (resp.funcion && PROPS.some(([k]) => !(k in resp))) return decir(['mal', 'Contesta Sí o No en cada renglón.']);
          }
          if (verRespuesta) {
            revisado = true;
            for (const [k] of PROPS) { if (aplica(k)) resp[k] = p[k].ok; else delete resp[k]; }
            if (!p.funcion.ok) resp.funcion = false;
            pintarFilas();
          }
          let malas = 0;
          for (const x of filas) {
            x.fila.classList.remove('bien', 'mal');
            if (!aplica(x.k)) {
              x.por.textContent = 'No aplica: no es función.';
              x.por.classList.remove('oculto');
              if (resp.funcion !== false) { x.fila.classList.add('mal'); malas++; }
              continue;
            }
            if (!(x.k in resp)) { x.por.classList.add('oculto'); continue; }
            const bien = resp[x.k] === p[x.k].ok;
            if (!bien) malas++;
            x.fila.classList.add(bien ? 'bien' : 'mal');
            x.por.textContent = `${p[x.k].ok ? 'Sí' : 'No'}: ${p[x.k].por}`;
            x.por.classList.remove('oculto');
          }
          if (!verRespuesta && p.funcion.ok && resp.funcion === false) malas = Math.max(malas, 1);
          mostrarDespues(lineas([
            p.funcion.ok ? `Rango = ${F.conjuntoTexto(F.rango(f))}` : null,
            p.funcion.ok ? `Codominio = ${F.conjuntoTexto(f.B)}` : null,
          ]), nota);
          if (verRespuesta) decir(['', 'Estas son las respuestas.']);
          else decir(!malas ? ['ok', '¡Todo correcto!'] : ['mal', `${malas} ${malas === 1 ? 'respuesta mal' : 'respuestas mal'}. Corrige lo marcado en rojo y vuelve a comprobar.`]);
        }
        cuerpo = [el('p', { class: 'pedido' }, ej.pedido || 'Decide qué es esta asignación:'), enunciado,
          el('div', { class: 'fn-vista' }, diagramaDe(f)),
          el('p', { class: 'rel-pares formula-linea' }, `${F.texto(f)}  de ${F.conjuntoTexto(f.A)} en ${F.conjuntoTexto(f.B)}`),
          el('div', { class: 'rel-props' }, ...filas.map((x) => x.fila))];
        acciones = [
          el('button', { class: 'btn', onclick: () => revisar(true) }, 'Ver respuesta'),
          el('button', { class: 'btn primario-suave', onclick: () => revisar(false) }, 'Comprobar')];
        teclas = { c: () => revisar(false), s: () => revisar(true) };
      } else if (ej.modo === 'ejemplo') {
        const A = Rel.leerConjunto(ej.A), B = Rel.leerConjunto(ej.B == null ? ej.A : ej.B);
        const c = constructor(A, B, 'f');
        c.alCambiar = () => decir(['', '']);
        const pideTxt = Object.entries(ej.pide).map(([k, v]) => (v ? '' : 'no ') + F.NOMBRES[k]);
        function revisarActual(titulo) {
          if (!c.completo()) return decir(['mal', 'Falta elegir la imagen de algún elemento: una función le da imagen a todos.']);
          const rs = F.revisarPide(c.actual(), ej.pide);
          const todo = rs.every((r) => r.ok);
          mostrarDespues(el('ul', { class: 'rel-tipos' }, ...rs.map((r) =>
            el('li', { class: r.ok ? 'si' : 'no' }, `${r.ok ? '✓' : '✗'} ${r.texto}. `, el('span', { class: 'rel-por-linea' }, r.por)))),
            todo ? nota : null);
          decir(titulo ? ['', titulo] : todo ? ['ok', '¡Tu función cumple todo lo pedido!'] : ['mal', 'Todavía no: revisa lo marcado con ✗.']);
        }
        const verEjemplo = () => { c.poner(F.asignacion({ A: ej.A, B: ej.B, pares: ej.ejemplo })); revisarActual('Este es un ejemplo; hay muchas respuestas correctas.'); };
        cuerpo = [el('p', { class: 'pedido' }, ej.pedido || `Construye una función f : ${F.conjuntoTexto(A)} → ${F.conjuntoTexto(B)} que sea:`),
          enunciado, el('ul', { class: 'rel-pide' }, ...pideTxt.map((x) => el('li', {}, x))), c.nodo];
        acciones = [
          el('button', { class: 'btn', onclick: () => { c.limpiar(); decir(['', '']); } }, 'Borrar'),
          el('button', { class: 'btn', onclick: verEjemplo }, 'Ver un ejemplo'),
          el('button', { class: 'btn primario-suave', onclick: () => revisarActual() }, 'Comprobar')];
        teclas = { c: () => revisarActual(), s: verEjemplo };
      } else if (ej.modo === 'calcular') {
        const env = {};
        for (const [k, d] of Object.entries(ej.datos)) env[k] = F.asignacion(d);
        let R = null, porQue = null;
        try { R = F.evaluar(ej.expr, env); } catch (e) { if (e instanceof F.SinResultado) porQue = e.message; else throw e; }
        // El dominio y codominio del resultado se adivinan de la expresión: si no existe, se usan los de la primera función
        const base = R || (() => { const k = Object.keys(env)[0]; return env[k]; })();
        const A = R ? R.A : base.A, B = R ? R.B : base.B;
        const c = constructor(A, B, ej.expr.includes('∘') || ej.expr.includes('⁻¹') ? `(${ej.expr})` : ej.expr);
        let dijoNoExiste = false;
        const btnNo = el('button', { class: 'btn', 'aria-pressed': 'false', onclick: () => {
          dijoNoExiste = !dijoNoExiste; btnNo.setAttribute('aria-pressed', String(dijoNoExiste));
          c.nodo.classList.toggle('apagada', dijoNoExiste); decir(['', '']);
        } }, 'No existe / no está definida');
        c.alCambiar = () => { if (dijoNoExiste) { dijoNoExiste = false; btnNo.setAttribute('aria-pressed', 'false'); c.nodo.classList.remove('apagada'); } decir(['', '']); };
        const explicar = () => (R ? lineas([`${ej.expr} = ${F.texto(R)}`]) : el('div', { class: 'rel-info' }, el('p', {}, porQue)));
        function comprobar() {
          if (dijoNoExiste) {
            if (!R) { decir(['ok', '¡Correcto! No existe.']); mostrarDespues(explicar(), nota); }
            else decir(['mal', 'Sí existe: calcúlala.']);
            return;
          }
          if (!R) return decir(['mal', 'Revisa si de verdad existe.']);
          if (!c.completo()) return decir(['mal', 'Falta la imagen de algún elemento.']);
          const malas = c.marcar(R);
          if (!malas) { decir(['ok', '¡Correcto!']); mostrarDespues(explicar(), nota); }
          else decir(['mal', `${malas} ${malas === 1 ? 'imagen mal' : 'imágenes mal'} (en rojo).`]);
        }
        function respuesta() {
          if (R) c.poner(R);
          else { dijoNoExiste = true; btnNo.setAttribute('aria-pressed', 'true'); c.nodo.classList.add('apagada'); }
          decir(['', 'Esta es la respuesta.']); mostrarDespues(explicar(), nota);
        }
        cuerpo = [el('p', { class: 'pedido' }, ej.pedido || 'Con estas funciones, calcula:'), enunciado,
          diagramasDatos(env, Object.keys(ej.datos)),
          ESTUDIO.formula(ej.expr, 'formula grande enunciado'),
          el('p', { class: 'rel-por-linea' }, 'Elige la imagen de cada elemento, o di que no existe.'),
          c.nodo, el('div', { class: 'acciones' }, btnNo)];
        acciones = [
          el('button', { class: 'btn', onclick: () => { c.limpiar(); decir(['', '']); } }, 'Borrar'),
          el('button', { class: 'btn', onclick: respuesta }, 'Ver respuesta'),
          el('button', { class: 'btn primario-suave', onclick: comprobar }, 'Comprobar')];
        teclas = { c: comprobar, s: respuesta };
      } else {
        // imagen
        const env = {};
        for (const [k, d] of Object.entries(ej.datos)) env[k] = F.asignacion(d);
        const r = F.evaluarImagen(ej.expr, env);
        const elegidos = new Set();
        let revisado = false;
        const fichas = el('div', { class: 'rel-fichas' });
        const tuya = el('p', { class: 'rel-pares formula-linea' });
        const vista = el('div', { class: 'fn-vista' });
        const S = new Set(r.S.map(txt));
        function pintar(marcas) {
          fichas.replaceChildren(...r.universo.map((x) => el('button', {
            class: 'ficha' + (elegidos.has(txt(x)) ? ' g1' : '') + (marcas && marcas.has(txt(x)) ? ' ' + marcas.get(txt(x)) : ''),
            'aria-pressed': String(elegidos.has(txt(x))),
            onclick: () => { if (revisado) return; elegidos.has(txt(x)) ? elegidos.delete(txt(x)) : elegidos.add(txt(x)); decir(['', '']); pintar(); } }, txt(x))));
          const lista = r.universo.filter((x) => elegidos.has(txt(x)));
          tuya.textContent = `Tu respuesta: ${F.conjuntoTexto(lista)}`;
          const marcB = r.inversa ? S : new Set();
          const marcA = r.inversa ? new Set() : S;
          vista.replaceChildren(diagramaDe(r.f, 'f', marcA, marcB));
        }
        function comprobar() {
          const bien = new Set(r.resultado.map(txt));
          const marcas = new Map();
          r.universo.forEach((x) => {
            const u = elegidos.has(txt(x)), c = bien.has(txt(x));
            if (u && !c) marcas.set(txt(x), 'sobra');
            if (!u && c) marcas.set(txt(x), 'falta');
          });
          pintar(marcas);
          if (!marcas.size) { revisado = true; decir(['ok', '¡Correcto!']); mostrarDespues(lineas([`${ej.expr} = ${F.conjuntoTexto(r.resultado)}`]), nota); }
          else decir(['mal', 'Todavía no: lo rojo sobra y lo punteado falta.']);
        }
        function respuesta() {
          elegidos.clear(); r.resultado.forEach((x) => elegidos.add(txt(x)));
          revisado = true; pintar();
          decir(['', 'Esta es la respuesta.']);
          mostrarDespues(lineas([`${ej.expr} = ${F.conjuntoTexto(r.resultado)}`]), nota);
        }
        pintar();
        cuerpo = [el('p', { class: 'pedido' }, ej.pedido || (r.inversa
          ? 'Marca los elementos del dominio que van a dar al conjunto (resaltado en el codominio):'
          : 'Marca las imágenes de los elementos del conjunto (resaltado en el dominio):')),
          enunciado, ESTUDIO.formula(ej.expr, 'formula grande enunciado'), vista, fichas, tuya];
        acciones = [
          el('button', { class: 'btn', onclick: () => { if (revisado) return; elegidos.clear(); pintar(); decir(['', '']); } }, 'Borrar'),
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
