// Relaciones finitas: un solo archivo para el motor de matrices (navegador) y para tools/verificar.mjs (node).
//
// Una relación es { X, Y, P }: X y Y son listas de elementos (números o textos) y P es un Set de claves "x|y".
// Una relación "sobre X" tiene X = Y.
//
// Textos que se pueden leer:
//   conjuntos:  '{1, 2, 3}'  '{a, b, c}'  '{-2, -1, 0}'
//   parejas:    '{(1, 2), (2, 3)}'  'Ø'  '{}'
//   expresiones (operar):  R  S  T  I  Ø  R⁻¹  Rᶜ  S ∘ R  R²  R³  R⁺  R ∪ S  R ∩ S  (R ∪ S)⁻¹
//     ∘ se lee de derecha a izquierda: en S ∘ R se aplica primero R.
//     Para mezclar ∘, ∪ y ∩ hay que usar paréntesis.
(function (raiz) {
  const K = (a, b) => `${a}|${b}`;
  const txt = (x) => String(x);

  // ---------- Leer textos ----------
  function elementoDe(s) {
    s = s.trim();
    return /^-?\d+$/.test(s) ? Number(s) : s;
  }
  function leerConjunto(s) {
    if (Array.isArray(s)) return s;
    s = s.trim();
    if (s === 'Ø' || s === '{}') return [];
    if (!/^\{.*\}$/.test(s)) throw new Error(`"${s}" no es un conjunto como {1, 2, 3}`);
    const dentro = s.slice(1, -1).trim();
    return dentro ? dentro.split(',').map(elementoDe) : [];
  }
  function leerPares(s) {
    if (Array.isArray(s)) return s;
    s = s.trim();
    if (s === 'Ø' || s === '{}') return [];
    if (!/^\{.*\}$/.test(s)) throw new Error(`"${s}" no es un conjunto de parejas como {(1, 2)}`);
    const pares = [];
    const re = /\(\s*([^,()]+?)\s*,\s*([^,()]+?)\s*\)/g;
    let m, resto = s.slice(1, -1);
    while ((m = re.exec(s))) pares.push([elementoDe(m[1]), elementoDe(m[2])]);
    resto = resto.replace(re, '').replace(/[\s,]/g, '');
    if (resto) throw new Error(`no se entiende "${resto}" en "${s}"`);
    return pares;
  }

  // ---------- Construir ----------
  function relacion(X, Y, pares = []) {
    X = leerConjunto(X); Y = Y == null ? X : leerConjunto(Y);
    const xs = new Set(X.map(txt)), ys = new Set(Y.map(txt));
    const P = new Set();
    for (const [a, b] of leerPares(pares)) {
      if (!xs.has(txt(a))) throw new Error(`${a} no está en ${conjuntoTexto(X)}`);
      if (!ys.has(txt(b))) throw new Error(`${b} no está en ${conjuntoTexto(Y)}`);
      P.add(K(a, b));
    }
    return { X, Y, P };
  }
  function desdeRegla(X, Y, regla) {
    X = leerConjunto(X); Y = Y == null ? X : leerConjunto(Y);
    const P = new Set();
    for (const a of X) for (const b of Y) if (regla(a, b)) P.add(K(a, b));
    return { X, Y, P };
  }
  // Partición → relación de equivalencia: xRy si están en el mismo bloque
  function desdeParticion(bloques) {
    const X = bloques.flat();
    const bloque = new Map();
    bloques.forEach((b, i) => b.forEach((x) => bloque.set(txt(x), i)));
    return desdeRegla(X, X, (a, b) => bloque.get(txt(a)) === bloque.get(txt(b)));
  }
  // Relación de un ejercicio: { X, Y?, pares?, regla?, particion? }
  function deDatos(d, Xdef) {
    if (typeof d === 'string') return relacion(Xdef, Xdef, d);
    if (d.particion) return desdeParticion(d.particion);
    const X = d.X || Xdef, Y = d.Y || X;
    if (d.regla) return desdeRegla(X, Y, d.regla);
    return relacion(X, Y, d.pares || []);
  }

  const tiene = (R, a, b) => R.P.has(K(a, b));
  const pares = (R) => R.X.flatMap((a) => R.Y.filter((b) => tiene(R, a, b)).map((b) => [a, b]));
  const sobreUno = (R) => R.X.length === R.Y.length && R.X.every((x, i) => txt(x) === txt(R.Y[i]));
  const igual = (R, S) => R.P.size === S.P.size && [...R.P].every((k) => S.P.has(k));
  const contenida = (R, S) => [...R.P].every((k) => S.P.has(k));

  // ---------- Texto ----------
  const conjuntoTexto = (xs) => (xs.length ? `{${xs.join(', ')}}` : 'Ø');
  const paresTexto = (ps) => (ps.length ? `{${ps.map(([a, b]) => `(${a}, ${b})`).join(', ')}}` : 'Ø');
  const texto = (R) => paresTexto(pares(R));
  const dominio = (R) => R.X.filter((a) => R.Y.some((b) => tiene(R, a, b)));
  const imagen = (R) => R.Y.filter((b) => R.X.some((a) => tiene(R, a, b)));

  // ---------- Operaciones ----------
  const inversa = (R) => ({ X: R.Y, Y: R.X, P: new Set(pares(R).map(([a, b]) => K(b, a))) });
  const complemento = (R) => {
    const P = new Set();
    for (const a of R.X) for (const b of R.Y) if (!tiene(R, a, b)) P.add(K(a, b));
    return { X: R.X, Y: R.Y, P };
  };
  function mismaForma(R, S, op) {
    const ok = R.X.map(txt).join() === S.X.map(txt).join() && R.Y.map(txt).join() === S.Y.map(txt).join();
    if (!ok) throw new Error(`"${op}" entre relaciones de conjuntos distintos`);
  }
  const union = (R, S) => { mismaForma(R, S, '∪'); return { X: R.X, Y: R.Y, P: new Set([...R.P, ...S.P]) }; };
  const interseccion = (R, S) => { mismaForma(R, S, '∩'); return { X: R.X, Y: R.Y, P: new Set([...R.P].filter((k) => S.P.has(k))) }; };
  // S ∘ R: primero R (de X en Y), después S (de Y en Z)
  function componer(S, R) {
    if (R.Y.map(txt).join() !== S.X.map(txt).join()) {
      throw new Error('S ∘ R necesita que R llegue al conjunto donde empieza S');
    }
    const P = new Set();
    for (const a of R.X) for (const c of S.Y) if (R.Y.some((b) => tiene(R, a, b) && tiene(S, b, c))) P.add(K(a, c));
    return { X: R.X, Y: S.Y, P };
  }
  function potencia(R, n) {
    let r = R;
    for (let i = 1; i < n; i++) r = componer(r, R);
    return r;
  }
  function mas(R) { // R⁺ = R ∪ R² ∪ … ∪ Rⁿ
    let r = R, p = R;
    for (let i = 1; i < R.X.length; i++) { p = componer(p, R); r = union(r, p); }
    return r;
  }
  const identidad = (X) => desdeRegla(X, X, (a, b) => txt(a) === txt(b));
  const vacia = (X, Y) => relacion(X, Y, []);

  // ---------- Expresiones ----------
  const SUP = { '²': 2, '³': 3, '⁴': 4, '⁵': 5 };
  function evaluar(expr, env) {
    const t = [...expr.replace(/\s+/g, '').replace(/⁻¹/g, '⁻')];
    let i = 0;
    const ver = () => t[i];
    const falla = (m) => { throw new Error(`${m} en "${expr}"`); };
    function binaria() {
      let a = composicion();
      let op = null;
      while (ver() === '∪' || ver() === '∩') {
        if (op && op !== ver()) falla('mezcla ∪ y ∩ sin paréntesis');
        op = t[i++];
        const b = composicion();
        a = op === '∪' ? union(a, b) : interseccion(a, b);
      }
      return a;
    }
    function composicion() {
      const xs = [postfijo()];
      while (ver() === '∘') { i++; xs.push(postfijo()); }
      // derecha a izquierda: T ∘ S ∘ R = T ∘ (S ∘ R)
      return xs.reduceRight((r, s) => componer(s, r));
    }
    function postfijo() {
      let a = primario();
      for (;;) {
        if (ver() === '⁻') { i++; a = inversa(a); }
        else if (ver() === 'ᶜ') { i++; a = complemento(a); }
        else if (ver() === '⁺') { i++; a = mas(a); }
        else if (SUP[ver()]) { a = potencia(a, SUP[t[i++]]); }
        else return a;
      }
    }
    function primario() {
      const x = t[i];
      if (x === '(') { i++; const e = binaria(); if (t[i++] !== ')') falla('falta ")"'); return e; }
      if (x === 'I') { i++; if (!env.X) falla('I necesita el conjunto X'); return identidad(env.X); }
      if (x === 'Ø') { i++; if (!env.X) falla('Ø necesita el conjunto X'); return vacia(env.X, env.X); }
      if (/[A-Z]/.test(x || '')) { i++; if (!env[x]) falla(`no hay relación ${x}`); return env[x]; }
      falla('falta una relación');
    }
    const r = binaria();
    if (i !== t.length) falla(`sobra "${t.slice(i).join('')}"`);
    return r;
  }

  // ---------- Propiedades (relación sobre un conjunto) ----------
  // Cada una: { ok, por } — "por" explica por qué sí o por qué no, con un caso concreto cuando no se cumple
  const P2 = (a, b) => `(${a}, ${b})`;
  function propiedades(R) {
    if (!sobreUno(R)) throw new Error('las propiedades son para relaciones sobre un solo conjunto');
    const X = R.X, vacioR = R.P.size === 0;
    const r = {};

    const sinLazo = X.find((x) => !tiene(R, x, x));
    r.reflexiva = sinLazo === undefined
      ? { ok: true, por: `Todos los elementos tienen su pareja (x, x): ${X.map((x) => P2(x, x)).join(', ')}.` }
      : { ok: false, por: `${P2(sinLazo, sinLazo)} ∉ R.` };

    const conLazo = X.find((x) => tiene(R, x, x));
    r.irreflexiva = conLazo === undefined
      ? { ok: true, por: 'No hay ninguna pareja de la forma (x, x).' }
      : { ok: false, por: `${P2(conLazo, conLazo)} ∈ R.` };

    const distintos = pares(R).filter(([a, b]) => txt(a) !== txt(b));
    const sinRegreso = distintos.find(([a, b]) => !tiene(R, b, a));
    r.simetrica = sinRegreso
      ? { ok: false, por: `${P2(...sinRegreso)} ∈ R pero ${P2(sinRegreso[1], sinRegreso[0])} ∉ R.` }
      : { ok: true, por: vacioR ? 'R no tiene parejas: se cumple por vacuidad.'
        : distintos.length ? 'Cada pareja (x, y) con x ≠ y tiene su pareja (y, x).' : 'Solo hay parejas (x, x), que son su propio regreso.' };

    const ida = distintos.find(([a, b]) => tiene(R, b, a));
    r.antisimetrica = ida
      ? { ok: false, por: `${P2(...ida)} y ${P2(ida[1], ida[0])} están en R, con ${ida[0]} ≠ ${ida[1]}.` }
      : { ok: true, por: vacioR ? 'R no tiene parejas: se cumple por vacuidad.'
        : distintos.length ? 'Ninguna pareja (x, y) con x ≠ y tiene su regreso (y, x).' : 'Solo hay parejas (x, x); los lazos sí se permiten.' };

    r.asimetrica = !r.irreflexiva.ok ? { ok: false, por: `${P2(conLazo, conLazo)} ∈ R (no puede haber lazos).` }
      : !r.antisimetrica.ok ? { ok: false, por: r.antisimetrica.por }
      : { ok: true, por: 'Es irreflexiva y antisimétrica: ninguna pareja tiene regreso.' };

    let falla = null;
    buscar: for (const [a, b] of pares(R)) for (const c of X) {
      if (tiene(R, b, c) && !tiene(R, a, c)) { falla = [a, b, c]; break buscar; }
    }
    const cadenas = pares(R).some(([a, b]) => X.some((c) => tiene(R, b, c)));
    r.transitiva = falla
      ? { ok: false, por: `${P2(falla[0], falla[1])} y ${P2(falla[1], falla[2])} están en R, pero ${P2(falla[0], falla[2])} ∉ R.` }
      : { ok: true, por: vacioR ? 'R no tiene parejas: se cumple por vacuidad.'
        : cadenas ? 'Cada camino x → y → z tiene su flecha directa x → z.' : 'No hay ningún camino x → y → z: se cumple por vacuidad.' };

    // Ley de tricotomía (definición del curso): para cada x, y se cumple EXACTAMENTE una de x = y, xRy, yRx
    let tri = null;
    buscarT: for (const a of X) for (const b of X) {
      const n = (txt(a) === txt(b) ? 1 : 0) + (tiene(R, a, b) ? 1 : 0) + (tiene(R, b, a) && txt(a) !== txt(b) ? 1 : 0);
      if (txt(a) === txt(b) && tiene(R, a, a)) { tri = `${P2(a, a)} ∈ R y además ${a} = ${a}: se cumplen dos a la vez.`; break buscarT; }
      if (n === 0) { tri = `Para ${a} y ${b} no se cumple ninguna: ${a} ≠ ${b}, ${P2(a, b)} ∉ R y ${P2(b, a)} ∉ R.`; break buscarT; }
      if (n > 1) { tri = `Para ${a} y ${b} se cumplen dos a la vez: ${P2(a, b)} y ${P2(b, a)} están en R.`; break buscarT; }
    }
    r.tricotomia = tri ? { ok: false, por: tri } : { ok: true, por: 'Cada par de elementos distintos está relacionado en exactamente un sentido, y no hay lazos.' };
    return r;
  }

  // Tipos de relación con las definiciones del curso
  const TIPOS = [
    ['orden', 'Orden', (p) => p.antisimetrica.ok && p.transitiva.ok, 'antisimétrica y transitiva'],
    ['ordenParcial', 'Orden parcial', (p) => p.reflexiva.ok && p.antisimetrica.ok && p.transitiva.ok, 'reflexiva, antisimétrica y transitiva'],
    ['ordenTotal', 'Orden total', (p) => p.antisimetrica.ok && p.transitiva.ok && p.tricotomia.ok, 'antisimétrica, transitiva y cumple la ley de tricotomía'],
    ['cuasiorden', 'Cuasiorden', (p) => p.reflexiva.ok && p.transitiva.ok, 'reflexiva y transitiva'],
    ['equivalencia', 'Equivalencia', (p) => p.reflexiva.ok && p.simetrica.ok && p.transitiva.ok, 'reflexiva, simétrica y transitiva'],
  ];
  const tipos = (p) => Object.fromEntries(TIPOS.map(([k, , f]) => [k, f(p)]));

  // Clases de equivalencia (solo si R es de equivalencia)
  function clases(R) {
    const vistos = new Set(), cs = [];
    for (const a of R.X) {
      if (vistos.has(txt(a))) continue;
      const c = R.X.filter((x) => tiene(R, x, a));
      c.forEach((x) => vistos.add(txt(x)));
      cs.push(c);
    }
    return cs;
  }
  const claseDe = (R, a) => R.X.filter((x) => tiene(R, x, a));

  // Requisitos de "Dar un ejemplo": { reflexiva: true, simetrica: false, …, equivalencia: true, clases: 4 }
  const NOMBRES = {
    reflexiva: 'reflexiva', irreflexiva: 'irreflexiva', simetrica: 'simétrica', antisimetrica: 'antisimétrica',
    asimetrica: 'asimétrica', transitiva: 'transitiva', tricotomia: 'cumple la ley de tricotomía',
    orden: 'de orden', ordenParcial: 'de orden parcial', ordenTotal: 'de orden total',
    cuasiorden: 'de cuasiorden', equivalencia: 'de equivalencia',
  };
  function revisarPide(R, pide) {
    const p = propiedades(R), ti = tipos(p);
    return Object.entries(pide).map(([k, quiere]) => {
      if (k === 'clases') {
        const n = ti.equivalencia ? clases(R).length : null;
        return { k, texto: `exactamente ${quiere} clases de equivalencia`, ok: n === quiere,
          por: n === null ? 'No es de equivalencia, así que no tiene clases.' : `Tiene ${n}: ${clases(R).map(conjuntoTexto).join(', ')}.` };
      }
      if (k in p) {
        const ok = p[k].ok === quiere;
        return { k, texto: (quiere ? '' : 'no ') + NOMBRES[k], ok, por: p[k].por };
      }
      if (k in ti) {
        const ok = ti[k] === quiere;
        const def = TIPOS.find((x) => x[0] === k)[3];
        return { k, texto: (quiere ? 'es ' : 'no es ') + NOMBRES[k], ok, por: `Ser ${NOMBRES[k]} es ser ${def}.` };
      }
      throw new Error(`requisito desconocido "${k}"`);
    });
  }

  const API = {
    relacion, desdeRegla, desdeParticion, deDatos, leerConjunto, leerPares,
    tiene, pares, sobreUno, igual, contenida, texto, paresTexto, conjuntoTexto, dominio, imagen,
    inversa, complemento, union, interseccion, componer, potencia, mas, identidad, vacia, evaluar,
    propiedades, tipos, TIPOS, NOMBRES, clases, claseDe, revisarPide,
  };
  raiz.RELACIONES = API;
  if (raiz.ESTUDIO) raiz.ESTUDIO.relaciones = API;
})(typeof window !== 'undefined' ? window : globalThis);
