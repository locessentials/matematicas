// Motor de tarjetas (flashcards) con dos direcciones y filtro por categoría.
// Datos esperados: { id, tipo: 'tarjetas', tarjetas: [{ cat, nombre, formula, nota }] }
ESTUDIO.motor('tarjetas', function (cont, act) {
  const { el, barajar, formula } = ESTUDIO;
  const categorias = [...new Set(act.tarjetas.map((t) => t.cat))];
  const pref = ESTUDIO.leer(`${act.id}:pref`, {});
  let direccion = pref.direccion || 'nombre';
  let activas = new Set((pref.cats || categorias).filter((c) => categorias.includes(c)));
  if (!activas.size) activas = new Set(categorias);

  let cola = [], total = 0, hechas = 0, sabidas = 0, falladas = new Set(), volteada = false;

  const DIRECCIONES = [
    ['nombre', 'Nombre → fórmula'],
    ['formula', 'Fórmula → nombre'],
    ['mixto', 'Mezclado'],
  ];

  // ---------- Controles ----------
  const grupoDir = el('div', { class: 'segmentado', role: 'group', 'aria-label': 'Dirección' });
  const grupoCat = el('div', { class: 'chips', role: 'group', 'aria-label': 'Categorías' });
  const zona = el('div', { class: 'zona-tarjeta' });
  cont.append(
    el('div', { class: 'controles' },
      el('div', { class: 'control' }, el('span', { class: 'etiqueta' }, 'Dirección'), grupoDir),
      el('div', { class: 'control' }, el('span', { class: 'etiqueta' }, 'Categorías'), grupoCat)),
    zona,
    el('p', { class: 'ayuda-teclas' }, 'Teclado: Espacio voltea · 1 = repasar · 2 = la sabía'),
  );

  function pintarControles() {
    grupoDir.replaceChildren(...DIRECCIONES.map(([v, txt]) =>
      el('button', { class: 'seg', 'aria-pressed': String(direccion === v),
        onclick: () => { direccion = v; guardarPref(); pintarControles(); empezar(); } }, txt)));
    grupoCat.replaceChildren(...categorias.map((c) => {
      const n = act.tarjetas.filter((t) => t.cat === c).length;
      return el('button', { class: 'chip', 'aria-pressed': String(activas.has(c)),
        onclick: () => {
          if (activas.has(c) && activas.size === 1) return; // siempre al menos una
          activas.has(c) ? activas.delete(c) : activas.add(c);
          guardarPref(); pintarControles(); empezar();
        } }, `${c} (${n})`);
    }));
  }
  function guardarPref() { ESTUDIO.guardar(`${act.id}:pref`, { direccion, cats: [...activas] }); }

  // ---------- Mazo ----------
  function empezar(soloEstas) {
    const base = soloEstas || act.tarjetas.filter((t) => activas.has(t.cat));
    cola = barajar(base).map((t) => ({
      t, dir: direccion === 'mixto' ? (Math.random() < 0.5 ? 'nombre' : 'formula') : direccion,
    }));
    total = cola.length; hechas = 0; sabidas = 0; falladas = new Set();
    mostrar();
  }

  function mostrar() {
    volteada = false;
    if (!cola.length) return resumen();
    const { t, dir } = cola[0];
    const pregunta = dir === 'nombre'
      ? [el('div', { class: 'indicacion' }, 'Escribe la fórmula y explica cómo funciona'), el('div', { class: 'nombre-grande' }, t.nombre)]
      : [el('div', { class: 'indicacion' }, '¿Qué ley, regla o técnica es?'), formula(t.formula, 'formula grande')];
    const respuesta = dir === 'nombre'
      ? [formula(t.formula, 'formula grande')]
      : [el('div', { class: 'nombre-grande' }, t.nombre)];
    if (t.nota) respuesta.push(el('p', { class: 'nota' }, t.nota));

    const frente = el('div', { class: 'cara frente' }, el('span', { class: 'cat' }, t.cat), ...pregunta,
      el('div', { class: 'toca' }, 'Toca para voltear'));
    const reverso = el('div', { class: 'cara reverso' }, el('span', { class: 'cat' }, t.cat), ...respuesta);
    const tarjeta = el('button', { class: 'tarjeta', 'aria-label': 'Voltear tarjeta', onclick: voltear }, frente, reverso);

    const acciones = el('div', { class: 'acciones oculto' },
      el('button', { class: 'btn repasar', onclick: () => responder(false) }, '↺ Repasar otra vez'),
      el('button', { class: 'btn sabia', onclick: () => responder(true) }, '✓ La sabía'));

    zona.replaceChildren(
      el('div', { class: 'progreso' },
        el('span', {}, `${hechas} de ${total} dominadas`),
        el('span', {}, falladas.size ? `↺ ${falladas.size} con repaso` : ''),
        el('button', { class: 'btn-texto', onclick: () => empezar() }, 'Mezclar de nuevo')),
      el('div', { class: 'barra' }, el('div', { style: `width:${(100 * hechas) / Math.max(total, 1)}%` })),
      tarjeta, acciones);

    function voltear() {
      volteada = !volteada;
      tarjeta.classList.toggle('volteada', volteada);
      acciones.classList.toggle('oculto', !volteada);
    }
    ESTUDIO.teclado = (ev) => {
      if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); voltear(); }
      else if (volteada && ev.key === '1') responder(false);
      else if (volteada && ev.key === '2') responder(true);
    };
  }

  function responder(sabia) {
    const actual = cola.shift();
    if (sabia) { hechas++; if (!falladas.has(actual.t)) sabidas++; }
    else {
      falladas.add(actual.t);
      // vuelve a salir más adelante en esta misma ronda
      const pos = Math.min(cola.length, 3 + Math.floor(Math.random() * 3));
      cola.splice(pos, 0, actual);
    }
    mostrar();
  }

  function resumen() {
    ESTUDIO.teclado = null;
    const fallas = [...falladas];
    zona.replaceChildren(el('div', { class: 'resumen' },
      el('h3', {}, '¡Terminaste los flashcards!'),
      el('p', {}, `Sabías ${sabidas} de ${total} a la primera.`),
      fallas.length ? el('div', {},
        el('p', {}, 'Las que tuviste que repasar:'),
        el('ul', {}, ...fallas.map((t) => el('li', {}, t.nombre, ' — ', el('span', { class: 'formula-linea' }, t.formula.replace(/\n/g, ' ; ')))))) : null,
      el('div', { class: 'acciones' },
        fallas.length ? el('button', { class: 'btn', onclick: () => empezar(fallas) }, `Repasar solo esas ${fallas.length}`) : null,
        el('button', { class: 'btn primario', onclick: () => empezar() }, 'Empezar de nuevo'))));
  }

  pintarControles();
  empezar();
});
