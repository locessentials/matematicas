// Núcleo compartido por todas las unidades.
// Una página de unidad carga: este archivo, los motores (tarjetas.js, problemas.js),
// los archivos de datos de la unidad (cada uno llama ESTUDIO.actividad) y al final ESTUDIO.iniciar().
(function () {
  const actividades = [];
  const motores = {};
  let unidad = { id: 'unidad', titulo: '' };

  const ESTUDIO = {
    unidad(cfg) { unidad = cfg; },
    actividad(a) { actividades.push(a); },
    motor(tipo, fn) { motores[tipo] = fn; },
    buscar(id) { return actividades.find((a) => a.id === id); },

    // ---------- Utilidades ----------
    el(tag, attrs = {}, ...hijos) {
      const n = document.createElement(tag);
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === 'class') n.className = v;
        else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
        else n.setAttribute(k, v === true ? '' : v);
      }
      for (const h of hijos.flat()) if (h != null && h !== false) n.append(h);
      return n;
    },
    barajar(xs) {
      const a = xs.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    // Bloque de fórmula: respeta los saltos de línea (\n)
    formula(texto, clase = 'formula') {
      return ESTUDIO.el('div', { class: clase }, ...texto.split('\n').map((l) => ESTUDIO.el('div', {}, l)));
    },
    // localStorage puede fallar (modo privado, etc.): nunca rompemos la página por eso
    guardar(clave, valor) {
      try { localStorage.setItem(`estudio:${unidad.id}:${clave}`, JSON.stringify(valor)); } catch (e) {}
    },
    leer(clave, def) {
      try {
        const v = localStorage.getItem(`estudio:${unidad.id}:${clave}`);
        return v ? JSON.parse(v) : def;
      } catch (e) { return def; }
    },

    // ---------- Página de unidad ----------
    iniciar() {
      const raiz = document.getElementById('app');
      const nav = ESTUDIO.el('nav', { class: 'pestanas', 'aria-label': 'Actividades' });
      const panel = ESTUDIO.el('section', { class: 'panel' });
      raiz.append(nav, panel);

      const botones = actividades.map((a, i) =>
        ESTUDIO.el('button', { class: 'pestana', 'data-id': a.id, onclick: () => abrir(a.id) },
          ESTUDIO.el('span', { class: 'num' }, String(i + 1)), a.corto || a.titulo));
      nav.append(...botones);

      function abrir(id) {
        const a = ESTUDIO.buscar(id) || actividades[0];
        botones.forEach((b) => b.setAttribute('aria-current', b.dataset.id === a.id ? 'page' : 'false'));
        if (location.hash !== '#' + a.id) history.replaceState(null, '', '#' + a.id);
        panel.replaceChildren(
          ESTUDIO.el('h2', {}, a.titulo),
          a.descripcion ? ESTUDIO.el('p', { class: 'descripcion' }, a.descripcion) : null,
        );
        const cuerpo = ESTUDIO.el('div');
        panel.append(cuerpo);
        ESTUDIO.teclado = null; // cada motor puede poner su propio manejador de teclas
        const motor = motores[a.tipo];
        if (motor) motor(cuerpo, a);
        else cuerpo.append(ESTUDIO.el('p', {}, `No hay motor para el tipo "${a.tipo}".`));
      }

      window.addEventListener('hashchange', () => abrir(location.hash.slice(1)));
      document.addEventListener('keydown', (ev) => {
        if (ev.ctrlKey || ev.metaKey || ev.altKey || /INPUT|TEXTAREA|SELECT/.test(ev.target.tagName)) return;
        if (ESTUDIO.teclado) ESTUDIO.teclado(ev);
      });
      abrir(location.hash.slice(1));
    },
  };

  window.ESTUDIO = ESTUDIO;
})();
