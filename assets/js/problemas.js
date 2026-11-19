// Motor de problemas: muestra uno al azar, sin repetir hasta terminar la ronda, con solución oculta.
//   tipo 'problemas': { problemas: [...], instrucciones: [...], instruccionCorta }
//   tipo 'mezcla':    { fuentes: ['directa', 'tecnicas', ...], cantidad: 10 }  (toma problemas de otras actividades)
// Un problema: { id, enunciado, pedido?, pista?, texto?: [líneas], variables?: [{v, s}], solucion }
//   pedido: línea corta arriba del enunciado ("Demuestra o refuta:")
//   pista:  texto (o lista de textos) que se muestra con el botón "Pista", sin enseñar la solución
// solucion (una de estas formas):
//   { tecnica, pasos: [{ f, j, op?, tipo?, sub? }], nota?, cierre? }
//       op: conector al inicio del renglón (⟺, ⇒, =, ⊆); si algún paso lo tiene, se muestra una columna extra
//       tipo: 'premisa' | 'supuesto' | 'negacion' | 'titulo' (renglón de encabezado que ocupa toda la fila)
//   { tecnica, contraejemplo: { p: false } o { A: '{1}' }, evaluacion: [...], nota?, cierre? }
//   { respuesta: true | false, evaluacion: [...], nota? }   (preguntas de verdadero o falso)
// Los demás campos (tesis, hipotesis, datos, verificar, c) solo los usa tools/verificar.mjs.
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

      const sol = pintarSolucion(p.solucion);
      const solucion = el('div', { class: 'solucion oculto' }, sol.partes);
      const btnSol = el('button', { class: 'btn', onclick: verSolucion }, 'Ver solución');
      const btnPaso = sol.grupos.length > 1
        ? el('button', { class: 'btn', onclick: unPaso, title: 'Muestra un renglón de la solución a la vez' }, 'Un renglón más')
        : null;
      let btnVars = null, bloqueVars = null, btnPista = null, bloquePista = null;
      let mostrados = -1; // -1: todavía no se abre la solución paso a paso

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
        if (p.pedido) cuerpo.push(el('p', { class: 'pedido' }, p.pedido));
        cuerpo.push(formula(p.enunciado, 'formula grande enunciado'));
      }
      if (p.pista) {
        const pistas = [].concat(p.pista);
        bloquePista = el('div', { class: 'pista oculto' }, el('strong', {}, 'Pista: '),
          ...pistas.map((t, i) => (i ? [el('br'), t] : t)));
        btnPista = el('button', { class: 'btn', onclick: verPista }, 'Pista');
        cuerpo.push(bloquePista);
      }

      function verPista() {
        if (!bloquePista) return;
        bloquePista.classList.remove('oculto');
        if (btnPista) { btnPista.remove(); btnPista = null; }
      }
      function abrirVariables() {
        if (bloqueVars) bloqueVars.classList.remove('oculto');
        if (btnVars) { btnVars.remove(); btnVars = null; }
      }
      function verSolucion() {
        abrirVariables();
        sol.grupos.flat().concat(sol.final).forEach((x) => x.classList.remove('oculto'));
        solucion.classList.remove('oculto');
        btnSol.remove();
        if (btnPaso) btnPaso.remove();
      }
      function unPaso() {
        if (!btnPaso || !btnPaso.isConnected) return;
        abrirVariables();
        if (mostrados < 0) {
          sol.grupos.flat().concat(sol.final).forEach((x) => x.classList.add('oculto'));
          solucion.classList.remove('oculto');
          mostrados = 0;
        }
        sol.grupos[mostrados].forEach((x) => x.classList.remove('oculto'));
        mostrados++;
        if (mostrados >= sol.grupos.length) verSolucion();
      }
      function siguiente() { estado.pos++; guardar(); mostrar(); window.scrollTo({ top: zona.offsetTop - 80, behavior: 'smooth' }); }

      zona.replaceChildren(
        el('div', { class: 'progreso' },
          el('span', {}, `Problema ${estado.pos + 1} de ${n}`),
          el('span', { class: 'etiqueta-origen' }, p.origen ? `${a.corto} · ${p.origen}` : `${a.corto} · #${num}`),
          el('button', { class: 'btn-texto', onclick: () => { if (confirm('¿Empezar una ronda nueva?')) { nuevaRonda(); mostrar(); } } },
            'Reiniciar ronda')),
        el('div', { class: 'barra' }, el('div', { style: `width:${(100 * estado.pos) / n}%` })),
        el('article', { class: 'problema' }, ...cuerpo),
        el('div', { class: 'acciones' }, btnVars, btnPista, btnPaso, btnSol,
          el('button', { class: 'btn primario', onclick: siguiente },
            estado.pos + 1 < n ? 'Siguiente →' : 'Terminar ronda')),
        solucion,
        el('p', { class: 'ayuda-teclas' },
          'Teclado: ' + [p.pista ? 'P = pista' : '', btnPaso ? 'L = un renglón más' : '',
            'S = ver solución', 'N o → = siguiente'].filter(Boolean).join(' · ')));

      ESTUDIO.teclado = (ev) => {
        const k = ev.key.toLowerCase();
        if (k === 's') verSolucion();
        else if (k === 'p') verPista();
        else if (k === 'l') unPaso();
        else if (k === 'n' || ev.key === 'ArrowRight') siguiente();
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

  // Devuelve { partes, grupos, final }:
  //   partes: lo que se pinta dentro del bloque de solución
  //   grupos: renglones que se revelan juntos con "Un renglón más" (encabezados y separadores van con el renglón siguiente)
  //   final:  lo que aparece al terminar (Q.E.D., nota)
  function pintarSolucion(s) {
    const partes = [];
    const grupos = [];
    const final = [];
    if (s.tecnica) partes.push(el('div', { class: 'tecnica' }, 'Técnica: ', el('strong', {}, s.tecnica)));

    if ('respuesta' in s) {
      const lineas = (s.evaluacion || []).map((l) => el('div', {}, l));
      partes.push(el('div', { class: `veredicto ${s.respuesta ? 'si' : 'no'}` }, s.respuesta ? 'Verdadero' : 'Falso'),
        el('div', { class: 'evaluacion' }, ...lineas));
      // Sin "un renglón más": el veredicto ya es la respuesta
    } else if (s.contraejemplo) {
      const lineas = s.evaluacion.map((l) => el('div', {}, l));
      const cierre = el('p', { class: 'qed' }, s.cierre || 'La fórmula no es tautología: queda refutada.');
      partes.push(
        el('div', { class: 'asignacion' }, ...Object.entries(s.contraejemplo).map(([v, val]) =>
          el('span', { class: 'chip-valor' }, typeof val === 'boolean' ? `${v} = ${val ? 'V' : 'F'}` : `${v} = ${val}`))),
        el('div', { class: 'evaluacion' }, ...lineas), cierre);
      lineas.forEach((l) => grupos.push([l]));
      final.push(cierre);
    } else {
      const conOp = s.pasos.some((x) => x.op);
      const cols = conOp ? 4 : 3;
      const tabla = el('table', { class: 'demostracion' + (conOp ? ' con-op' : '') });
      let separado = false, numero = 0, pendientes = [];
      s.pasos.forEach((x, i) => {
        if (x.tipo === 'titulo') {
          const tr = el('tr', { class: 'titulo' }, el('td', { colspan: cols }, x.f));
          tabla.append(tr); pendientes.push(tr);
          return;
        }
        const esInicial = x.tipo === 'premisa' || x.tipo === 'negacion';
        if (!esInicial && !separado) {
          separado = true;
          if (i > 0 && s.pasos.slice(0, i).some((y) => y.tipo === 'premisa' || y.tipo === 'negacion')) {
            const sep = el('tr', { class: 'separador' }, el('td', { colspan: cols }));
            tabla.append(sep); pendientes.push(sep);
          }
        }
        numero++;
        const tr = el('tr', { class: [x.sub ? 'sub' : '', x.tipo || ''].join(' ').trim() },
          el('td', { class: 'n' }, `${numero}.`),
          conOp ? el('td', { class: 'op' }, x.op || '') : null,
          el('td', { class: 'f' }, x.f),
          el('td', { class: 'j' }, x.j || ''));
        tabla.append(tr);
        grupos.push([...pendientes, tr]); pendientes = [];
      });
      partes.push(el('div', { class: 'tabla-scroll' }, tabla));
      const porContradiccion = s.pasos.some((x) => x.tipo === 'negacion');
      const qed = el('p', { class: 'qed' }, s.cierre || (porContradiccion
        ? 'Suponer la negación de la conclusión lleva a F, así que la fórmula es tautología. Q.E.D.'
        : 'Q.E.D.'));
      partes.push(qed); final.push(qed);
    }
    if (s.nota) {
      const nota = el('p', { class: 'nota' }, s.nota);
      partes.push(nota); final.push(nota);
    }
    return { partes, grupos, final };
  }

  ESTUDIO.motor('problemas', motorProblemas);
  ESTUDIO.motor('mezcla', motorProblemas);
})();
