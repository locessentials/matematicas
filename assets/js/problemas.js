// Motor de problemas: muestra uno al azar, sin repetir hasta terminar la ronda, con solución oculta.
//   tipo 'problemas': { problemas: [...], instrucciones: [...], instruccionCorta }
//   tipo 'mezcla':    { fuentes: ['directa', 'tecnicas', ...], cantidad: 10 }  (toma problemas de otras actividades)
// Un problema: { id, enunciado, texto?: [líneas], variables?: [{v, s}], solucion }
// solucion: { tecnica, pasos: [{ f, j, tipo?, sub? }], nota? }  o  { tecnica, contraejemplo, evaluacion: [...], nota? }
(function () {
  const { el, barajar, formula } = ESTUDIO;

  function motorProblemas(cont, act) {
    const esMezcla = act.tipo === 'mezcla';
    const fuentes = esMezcla ? act.fuentes.map(ESTUDIO.buscar).filter(Boolean) : [act];

    // Referencias "actividad|problema" para poder guardarlas
    const todos = fuentes.flatMap((a) => a.problemas.map((p) => `${a.id}|${p.id}`));
    const resolver = (ref) => {
      const [aid, pid] = ref.split('|');
      const a = ESTUDIO.buscar(aid);
      const i = a ? a.problemas.findIndex((p) => p.id === pid) : -1;
      return i < 0 ? null : { a, p: a.problemas[i], num: i + 1 };
    };

    function nuevaRonda() {
      const orden = barajar(todos).slice(0, esMezcla ? Math.min(act.cantidad || 10, todos.length) : todos.length);
      estado = { orden, pos: 0 };
      guardar();
    }
    const guardar = () => ESTUDIO.guardar(`${act.id}:ronda`, estado);
    let estado = ESTUDIO.leer(`${act.id}:ronda`, null);
    // Si los datos cambiaron (problemas nuevos o borrados), empezamos otra ronda
    if (!estado || !Array.isArray(estado.orden) || !estado.orden.every(resolver) ||
        (!esMezcla && estado.orden.length !== todos.length)) nuevaRonda();

    if (!esMezcla && act.instrucciones) {
      cont.append(el('details', { class: 'instrucciones', open: true },
        el('summary', {}, 'Instrucciones'),
        // Si las instrucciones empiezan con "1.", "2."… se muestran como lista numerada
        act.instrucciones.every((t) => /^\d+\.\s/.test(t))
          ? el('ol', {}, ...act.instrucciones.map((t) => el('li', {}, t.replace(/^\d+\.\s/, ''))))
          : el('ul', {}, ...act.instrucciones.map((t) => el('li', {}, t)))));
    }
    const zona = el('div');
    cont.append(zona);

    function mostrar() {
      if (estado.pos >= estado.orden.length) return terminado();
      const { a, p, num } = resolver(estado.orden[estado.pos]);
      const n = estado.orden.length;

      const solucion = el('div', { class: 'solucion oculto' }, pintarSolucion(p.solucion));
      const btnSol = el('button', { class: 'btn', onclick: verSolucion }, 'Ver solución');
      let btnVars = null, bloqueVars = null;

      const cuerpo = [];
      if (esMezcla) cuerpo.push(el('p', { class: 'instruccion-corta' }, a.instruccionCorta || ''));
      if (p.texto) {
        cuerpo.push(el('div', { class: 'narrativa' }, ...p.texto.map((l) =>
          el('p', { class: /^por lo tanto/i.test(l) ? 'conclusion' : '' }, l))));
        bloqueVars = el('div', { class: 'variables oculto' },
          el('table', {}, ...p.variables.map((x) =>
            el('tr', {}, el('td', { class: 'var' }, x.v), el('td', {}, x.s)))),
          formula(p.enunciado, 'formula grande'));
        btnVars = el('button', { class: 'btn', onclick: () => {
          bloqueVars.classList.remove('oculto'); btnVars.remove();
        } }, 'Ver variables y fórmula');
        cuerpo.push(bloqueVars);
      } else {
        cuerpo.push(formula(p.enunciado, 'formula grande enunciado'));
      }

      function verSolucion() {
        if (bloqueVars) bloqueVars.classList.remove('oculto');
        if (btnVars) btnVars.remove();
        solucion.classList.remove('oculto');
        btnSol.remove();
      }
      function siguiente() { estado.pos++; guardar(); mostrar(); window.scrollTo({ top: zona.offsetTop - 80, behavior: 'smooth' }); }

      zona.replaceChildren(
        el('div', { class: 'progreso' },
          el('span', {}, `Problema ${estado.pos + 1} de ${n}`),
          el('span', { class: 'etiqueta-origen' }, `${a.corto} · #${num}`),
          el('button', { class: 'btn-texto', onclick: () => { if (confirm('¿Empezar una ronda nueva?')) { nuevaRonda(); mostrar(); } } },
            'Reiniciar ronda')),
        el('div', { class: 'barra' }, el('div', { style: `width:${(100 * estado.pos) / n}%` })),
        el('article', { class: 'problema' }, ...cuerpo),
        el('div', { class: 'acciones' }, btnVars, btnSol,
          el('button', { class: 'btn primario', onclick: siguiente },
            estado.pos + 1 < n ? 'Siguiente →' : 'Terminar ronda')),
        solucion,
        el('p', { class: 'ayuda-teclas' }, 'Teclado: S = ver solución · N o → = siguiente'));

      ESTUDIO.teclado = (ev) => {
        if (ev.key === 's' || ev.key === 'S') verSolucion();
        else if (ev.key === 'n' || ev.key === 'N' || ev.key === 'ArrowRight') siguiente();
      };
    }

    function terminado() {
      ESTUDIO.teclado = null;
      zona.replaceChildren(el('div', { class: 'resumen' },
        el('h3', {}, '¡Terminaste la ronda!'),
        el('p', {}, esMezcla
          ? `Resolviste ${estado.orden.length} problemas mezclados.`
          : `Viste los ${estado.orden.length} problemas sin repetir.`),
        el('div', { class: 'acciones' },
          el('button', { class: 'btn primario', onclick: () => { nuevaRonda(); mostrar(); } }, 'Nueva ronda'))));
    }

    mostrar();
  }

  function pintarSolucion(s) {
    const partes = [el('div', { class: 'tecnica' }, 'Técnica: ', el('strong', {}, s.tecnica))];

    if (s.contraejemplo) {
      partes.push(
        el('div', { class: 'asignacion' }, ...Object.entries(s.contraejemplo).map(([v, val]) =>
          el('span', { class: 'chip-valor' }, `${v} = ${val ? 'V' : 'F'}`))),
        el('div', { class: 'evaluacion' }, ...s.evaluacion.map((l) => el('div', {}, l))),
        el('p', { class: 'qed' }, 'La fórmula no es tautología: queda refutada.'));
    } else {
      const tabla = el('table', { class: 'demostracion' });
      let separado = false;
      s.pasos.forEach((x, i) => {
        const esInicial = x.tipo === 'premisa' || x.tipo === 'negacion';
        if (!esInicial && !separado) {
          separado = true;
          if (i > 0) tabla.append(el('tr', { class: 'separador' }, el('td', { colspan: 3 })));
        }
        tabla.append(el('tr', { class: [x.sub ? 'sub' : '', x.tipo || ''].join(' ').trim() },
          el('td', { class: 'n' }, `${i + 1}.`),
          el('td', { class: 'f' }, x.f),
          el('td', { class: 'j' }, x.j)));
      });
      partes.push(el('div', { class: 'tabla-scroll' }, tabla));
      const porContradiccion = s.pasos.some((x) => x.tipo === 'negacion');
      partes.push(el('p', { class: 'qed' }, porContradiccion
        ? 'Suponer la negación de la conclusión lleva a F, así que la fórmula es tautología. Q.E.D.'
        : 'Q.E.D.'));
    }
    if (s.nota) partes.push(el('p', { class: 'nota' }, s.nota));
    return partes;
  }

  ESTUDIO.motor('problemas', motorProblemas);
  ESTUDIO.motor('mezcla', motorProblemas);
})();
