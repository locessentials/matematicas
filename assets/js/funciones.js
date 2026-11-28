// Funciones finitas: un solo archivo para el motor de flechas (navegador) y para tools/verificar.mjs (node).
// Necesita relaciones.js (para leer conjuntos y parejas).
//
// Una asignación es { A, B, pares }: A es el dominio, B el codominio y pares la lista [a, b].
// Puede NO ser función (un elemento sin imagen o con dos); esFuncion() lo dice.
//
// Textos que se pueden leer:
//   datos:       { A: '{a, b, c}', B: '{1, 2, 3}', pares: '{(a, 2), (b, 3), (c, 1)}' }   (sin B, B = A)
//   expresiones: f   f⁻¹   f ∘ g   (f ∘ g)⁻¹   g⁻¹ ∘ f⁻¹      (∘ de derecha a izquierda: en f ∘ g va primero g)
//   imágenes:    f({a, b})   f⁻¹({1, 2})   f(Ø)
//
// También define estas funciones globales, que usan los archivos de datos:
//   piso(x), techo(x): como Math.floor y Math.ceil, pero sin errores de punto flotante (3 · (1/3) = 0.9999… cuenta como 1)
//   casi(a, b): a y b son iguales salvo errores de redondeo
//   enteros(a, b): [a, a + 1, …, b]     parejas(xs): todas las parejas [x, y] con x, y en xs
(function (raiz) {
  const Rel = raiz.RELACIONES;
  const txt = (x) => String(x);
  const mismo = (a, b) => txt(a) === txt(b);

  const entero = (x) => { const r = Math.round(x); return Math.abs(x - r) < 1e-9 ? r : null; };
  const piso = (x) => { const r = entero(x); return r !== null ? r : Math.floor(x); };
  const techo = (x) => { const r = entero(x); return r !== null ? r : Math.ceil(x); };

  // Cuando el resultado de una expresión no existe (inversa de algo no biyectivo, composición no definida)
  class SinResultado extends Error {}

  // ---------- Leer ----------
  function asignacion(d) {
    const A = Rel.leerConjunto(d.A), B = Rel.leerConjunto(d.B == null ? d.A : d.B);
    const pares = Rel.leerPares(d.pares || []);
    for (const [a, b] of pares) {
      if (!A.some((x) => mismo(x, a))) throw new Error(`${a} no está en el dominio ${Rel.conjuntoTexto(A)}`);
      if (!B.some((y) => mismo(y, b))) throw new Error(`${b} no está en el codominio ${Rel.conjuntoTexto(B)}`);
    }
    return { A, B, pares };
  }
  // Función a partir de un mapa elemento → imagen
  const deMapa = (A, B, m) => ({ A, B, pares: A.filter((a) => m.has(txt(a))).map((a) => [a, m.get(txt(a))]) });

  const imagenesDe = (f, a) => f.pares.filter(([x]) => mismo(x, a)).map(([, y]) => y);
  const valor = (f, a) => imagenesDe(f, a)[0];
  const texto = (f) => Rel.paresTexto(f.pares);
  const conjuntoTexto = Rel.conjuntoTexto;

  // ---------- Propiedades ----------
  function esFuncion(f) {
    const sin = f.A.find((a) => imagenesDe(f, a).length === 0);
    if (sin !== undefined) return { ok: false, por: `${sin} no tiene imagen: cada elemento del dominio necesita exactamente una.` };
    const dos = f.A.find((a) => new Set(imagenesDe(f, a).map(txt)).size > 1);
    if (dos !== undefined) return { ok: false, por: `${dos} tiene dos imágenes (${imagenesDe(f, dos).join(' y ')}): debe tener exactamente una.` };
    return { ok: true, por: 'Cada elemento del dominio tiene exactamente una imagen.' };
  }
  function inyectiva(f) {
    for (let i = 0; i < f.A.length; i++) for (let j = i + 1; j < f.A.length; j++) {
      const a = f.A[i], b = f.A[j];
      if (mismo(valor(f, a), valor(f, b))) return { ok: false, por: `f(${a}) = f(${b}) = ${valor(f, a)}, con ${a} ≠ ${b}.` };
    }
    return { ok: true, por: 'Elementos distintos del dominio van a imágenes distintas.' };
  }
  function sobre(f) {
    const falta = f.B.find((b) => !f.A.some((a) => mismo(valor(f, a), b)));
    if (falta !== undefined) return { ok: false, por: `${falta} no es imagen de nadie: rango = ${conjuntoTexto(rango(f))} ≠ codominio.` };
    return { ok: true, por: 'Cada elemento del codominio es imagen de alguien: rango = codominio.' };
  }
  function propiedades(f) {
    const fun = esFuncion(f);
    if (!fun.ok) return { funcion: fun, inyectiva: null, sobre: null, biyectiva: null };
    const iny = inyectiva(f), sob = sobre(f);
    const biy = iny.ok && sob.ok
      ? { ok: true, por: 'Es inyectiva y sobre.' }
      : { ok: false, por: !iny.ok ? `No es inyectiva: ${iny.por}` : `No es sobre: ${sob.por}` };
    return { funcion: fun, inyectiva: iny, sobre: sob, biyectiva: biy };
  }
  const rango = (f) => f.B.filter((b) => f.A.some((a) => imagenesDe(f, a).some((y) => mismo(y, b))));

  // ---------- Operaciones (solo para funciones) ----------
  function exigirFuncion(f, nombre) {
    const r = esFuncion(f);
    if (!r.ok) throw new Error(`${nombre} no es función: ${r.por}`);
  }
  // f ∘ g: primero g (de A en B), después f
  function componer(f, g, nf = 'f', ng = 'g') {
    exigirFuncion(f, nf); exigirFuncion(g, ng);
    const fuera = rango(g).find((y) => !f.A.some((x) => mismo(x, y)));
    if (fuera !== undefined) {
      throw new SinResultado(`${nf} ∘ ${ng} no está definida: ${ng} manda algo a ${fuera}, que no está en el dominio de ${nf} (${conjuntoTexto(f.A)}).`);
    }
    const m = new Map(g.A.map((a) => [txt(a), valor(f, valor(g, a))]));
    return deMapa(g.A, f.B, m);
  }
  function inversa(f, nf = 'f') {
    exigirFuncion(f, nf);
    const p = propiedades(f);
    if (!p.biyectiva.ok) throw new SinResultado(`${nf}⁻¹ no existe: ${nf} no es biyectiva (${p.biyectiva.por.replace(/^No es/, 'no es')})`);
    const m = new Map(f.pares.map(([a, b]) => [txt(b), a]));
    return deMapa(f.B, f.A, m);
  }
  function imagen(f, S) {
    return f.B.filter((b) => S.some((a) => imagenesDe(f, a).some((y) => mismo(y, b))));
  }
  function preimagen(f, T) {
    return f.A.filter((a) => imagenesDe(f, a).some((y) => T.some((t) => mismo(t, y))));
  }

  // ---------- Expresiones ----------
  function evaluar(expr, env) {
    const t = [...expr.replace(/\s+/g, '').replace(/⁻¹/g, '⁻')];
    let i = 0;
    const falla = (m) => { throw new Error(`${m} en "${expr}"`); };
    // nombres para los mensajes: "f ∘ g", "(f ∘ g)⁻¹"
    function comp() {
      const xs = [post()];
      while (t[i] === '∘') { i++; xs.push(post()); }
      return xs.reduceRight((g, f) => ({ v: componer(f.v, g.v, f.n, g.n), n: `${f.n} ∘ ${g.n}` }));
    }
    function post() {
      let a = prim();
      while (t[i] === '⁻') {
        i++;
        const n = /∘/.test(a.n) ? `(${a.n})` : a.n;
        a = { v: inversa(a.v, n), n: `${n}⁻¹` };
      }
      return a;
    }
    function prim() {
      const x = t[i];
      if (x === '(') { i++; const e = comp(); if (t[i++] !== ')') falla('falta ")"'); return e; }
      if (/^[a-zA-Z]$/.test(x || '')) { i++; if (!env[x]) falla(`no hay función ${x}`); return { v: env[x], n: x }; }
      falla('falta una función');
    }
    const r = comp();
    if (i !== t.length) falla(`sobra "${t.slice(i).join('')}"`);
    return r.v;
  }
  // 'f({a, b})' o 'f⁻¹({1})' → { nombre, inversa, S, resultado, universo }
  function evaluarImagen(expr, env) {
    const m = expr.replace(/\s+/g, ' ').trim().match(/^([a-zA-Z])\s*(⁻¹)?\s*\((.*)\)$/);
    if (!m) throw new Error(`no se entiende "${expr}" (se espera f({…}) o f⁻¹({…}))`);
    const f = env[m[1]];
    if (!f) throw new Error(`no hay función ${m[1]} en "${expr}"`);
    const S = Rel.leerConjunto(m[3]);
    const dentro = m[2] ? f.B : f.A;
    for (const s of S) if (!dentro.some((x) => mismo(x, s))) throw new Error(`${s} no está en ${conjuntoTexto(dentro)} en "${expr}"`);
    return m[2]
      ? { inversa: true, S, resultado: preimagen(f, S), universo: f.A, f }
      : { inversa: false, S, resultado: imagen(f, S), universo: f.B, f };
  }

  // ---------- "Dar un ejemplo" ----------
  const NOMBRES = { inyectiva: 'inyectiva (uno a uno)', sobre: 'sobre (suprayectiva)', biyectiva: 'biyectiva' };
  function revisarPide(f, pide) {
    const p = propiedades(f);
    return Object.entries(pide).map(([k, quiere]) => {
      if (!(k in NOMBRES)) throw new Error(`requisito desconocido "${k}"`);
      const texto = (quiere ? '' : 'no ') + NOMBRES[k];
      if (!p.funcion.ok) return { k, texto, ok: false, por: p.funcion.por };
      return { k, texto, ok: p[k].ok === quiere, por: p[k].por };
    });
  }

  const API = {
    asignacion, deMapa, imagenesDe, valor, texto, conjuntoTexto, mismo,
    esFuncion, inyectiva, sobre, propiedades, rango,
    componer, inversa, imagen, preimagen, evaluar, evaluarImagen, SinResultado,
    revisarPide, NOMBRES, piso, techo,
  };
  raiz.FUNCIONES = API;
  raiz.piso = piso;
  raiz.techo = techo;
  raiz.casi = (a, b) => Math.abs(a - b) <= 1e-9 * (1 + Math.abs(a) + Math.abs(b));
  raiz.enteros = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  raiz.parejas = (xs) => xs.flatMap((x) => xs.map((y) => [x, y]));
  if (raiz.ESTUDIO) raiz.ESTUDIO.funciones = API;
})(typeof window !== 'undefined' ? window : globalThis);
