// Gráficas de funciones escalonadas (piso, techo y sus combinaciones) para las soluciones de problemas.
// En un problema: solucion: { grafica: { f: (x) => piso(2 * x), de: -3, a: 3, y?: [-6, 6] }, … }
// Supone que f es constante por tramos y que los saltos caen en múltiplos de 1/240 (mitades, tercios,
// cuartos, quintos, sextos…). Dibuja cada tramo con punto cerrado donde la función toma el valor y
// punto abierto donde no. Si f(x) no es un número finito (por ejemplo 1/0), ese punto queda sin dibujar.
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attrs = {}, ...hijos) => {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) if (v != null) n.setAttribute(k, v);
    hijos.flat().forEach((h) => h != null && n.append(h));
    return n;
  };
  const PASO = 240;
  const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
  const igual = (a, b) => a !== null && b !== null && Math.abs(a - b) < 1e-9;

  function tramos(f, de, a) {
    const N = Math.round((a - de) * PASO);
    const x = (k) => (de * PASO + k) / PASO;
    const medio = [], punto = [];
    for (let k = 0; k < N; k++) medio.push(num(f((de * PASO + k + 0.5) / PASO)));
    for (let k = 0; k <= N; k++) punto.push(num(f(x(k))));
    const segs = [];
    let ini = 0;
    for (let k = 1; k <= N; k++) {
      if (k === N || !igual(medio[k], medio[ini])) {
        if (medio[ini] !== null) segs.push({ x1: x(ini), x2: x(k), y: medio[ini] });
        ini = k;
      }
    }
    const cerrados = [], abiertos = [];
    for (let k = 1; k < N; k++) {
      const L = medio[k - 1], R = medio[k], P = punto[k];
      if (igual(L, R) && igual(L, P)) continue;
      if (P !== null) cerrados.push([x(k), P]);
      if (L !== null && !igual(L, P)) abiertos.push([x(k), L]);
      if (R !== null && !igual(R, P) && !igual(R, L)) abiertos.push([x(k), R]);
    }
    // Extremos de la ventana: punto cerrado si la función vale ahí lo mismo que el tramo
    if (N > 0 && igual(punto[0], medio[0])) cerrados.push([x(0), punto[0]]);
    if (N > 0 && igual(punto[N], medio[N - 1])) cerrados.push([x(N), punto[N]]);
    return { segs, cerrados, abiertos };
  }

  function grafica(spec) {
    const de = spec.de ?? -3, a = spec.a ?? 3;
    const t = tramos(spec.f, de, a);
    let [y0, y1] = spec.y || (() => {
      const ys = [...t.segs.map((s) => s.y), ...t.cerrados.map((p) => p[1])].filter((v) => Math.abs(v) <= 12);
      return [Math.min(-1, Math.floor(Math.min(...ys))) - 1, Math.max(1, Math.ceil(Math.max(...ys))) + 1];
    })();
    const ux = Math.min(56, 440 / (a - de)), uy = Math.min(40, Math.max(18, 300 / (y1 - y0)));
    const m = 26;
    const W = (a - de) * ux + 2 * m, H = (y1 - y0) * uy + 2 * m;
    const X = (x) => +(m + (x - de) * ux).toFixed(1), Y = (y) => +(m + (y1 - y) * uy).toFixed(1);
    const dentro = (y) => y >= y0 - 1e-9 && y <= y1 + 1e-9;
    const cada = (a - de) > 10 ? 2 : 1, cadaY = (y1 - y0) > 14 ? 2 : 1;

    const rejilla = [], marcas = [];
    for (let x = Math.ceil(de); x <= a; x++) {
      rejilla.push(svgEl('line', { x1: X(x), y1: Y(y1), x2: X(x), y2: Y(y0), class: 'gr-rejilla' }));
      if (x !== 0 && x % cada === 0) marcas.push(svgEl('text', { x: X(x), y: Y(0) + 15, 'text-anchor': 'middle', class: 'gr-num' }, String(x).replace('-', '−')));
    }
    for (let y = Math.ceil(y0); y <= y1; y++) {
      rejilla.push(svgEl('line', { x1: X(de), y1: Y(y), x2: X(a), y2: Y(y), class: 'gr-rejilla' }));
      if (y !== 0 && y % cadaY === 0) marcas.push(svgEl('text', { x: X(0) - 6, y: Y(y) + 4, 'text-anchor': 'end', class: 'gr-num' }, String(y).replace('-', '−')));
    }
    const ejes = [];
    if (dentro(0)) ejes.push(svgEl('line', { x1: X(de), y1: Y(0), x2: X(a), y2: Y(0), class: 'gr-eje' }));
    if (de <= 0 && a >= 0) ejes.push(svgEl('line', { x1: X(0), y1: Y(y1), x2: X(0), y2: Y(y0), class: 'gr-eje' }));
    const segs = t.segs.filter((s) => dentro(s.y)).map((s) =>
      svgEl('line', { x1: X(s.x1), y1: Y(s.y), x2: X(s.x2), y2: Y(s.y), class: 'gr-tramo' }));
    const cerrados = t.cerrados.filter((p) => dentro(p[1])).map(([x, y]) => svgEl('circle', { cx: X(x), cy: Y(y), r: 4, class: 'gr-cerrado' }));
    const abiertos = t.abiertos.filter((p) => dentro(p[1])).map(([x, y]) => svgEl('circle', { cx: X(x), cy: Y(y), r: 4, class: 'gr-abierto' }));
    return svgEl('svg', { viewBox: `0 0 ${W.toFixed(0)} ${H.toFixed(0)}`, class: 'grafica', role: 'img',
      'aria-label': spec.titulo || 'Gráfica de la función', style: `max-width:${Math.round(W)}px` },
      ...rejilla, ...ejes, ...marcas, ...segs, ...abiertos, ...cerrados);
  }

  ESTUDIO.grafica = grafica;
})();
