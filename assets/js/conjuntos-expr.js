// Expresiones de conjuntos: un solo parser para el motor de Venn (navegador) y para tools/verificar.mjs (node).
//
// Conjuntos:   A  B  …  U (universo)  Ø  {1, 2, a}  {x : afirmación}  2ᴬ (potencia)
//              ∩  ∪  \  ∆  ×  ᶜ (complemento, se escribe después: Aᶜ, (A ∪ B)ᶜ)
//              Para mezclar operaciones distintas hay que usar paréntesis: (A ∩ B) ∪ C
// Elementos:   x  y  (x, y)  1  a  Ø  {1, 2}  (1, a)  |A| (cardinalidad)
// Afirmaciones: x ∈ A,  x ∉ A,  A ⊆ B,  A ⊂ B,  A = B,  A ≠ B, …  unidas con  y / ∧,  o / ∨,  ¬,  ⇒,  ⟺
//              V y F son las constantes verdadero y falso. Para mezclar "y" con "o" hay que usar paréntesis.
//
// Evaluación simbólica (para demostrar leyes): cada conjunto es "¿el punto está o no está?" en cada región
// del diagrama de Venn, igual que una tabla de verdad. Para productos cartesianos se usan dos puntos, x y y.
// Una afirmación sobre conjuntos (A ⊆ B, A = B) se evalúa punto por punto; eso solo es correcto cuando
// aparece "en positivo" (unida con y, o a los lados de un ⇒ / ⟺ principal). En otros lugares se marca
// como no verificable en vez de dar un resultado equivocado.
(function (raiz) {
  const SUP = { 'ᴬ': 'A', 'ᴮ': 'B', 'ᴰ': 'D', 'ᴱ': 'E', 'ᴳ': 'G', 'ᴴ': 'H', 'ᴵ': 'I', 'ᴶ': 'J', 'ᴷ': 'K',
    'ᴸ': 'L', 'ᴹ': 'M', 'ᴺ': 'N', 'ᴼ': 'O', 'ᴾ': 'P', 'ᴿ': 'R', 'ᵀ': 'T', 'ᵁ': 'U', 'ᵂ': 'W' };
  const NORMAL = { 'Δ': '∆', '∅': 'Ø', '⇔': '⟺', '↔': '⟺', '→': '⇒', '⊄': '⊈', '[': '(', ']': ')' };
  const SIMBOLOS = '(){},:/|∈∉⊆⊂⊇⊃⊈=≠∩∪\\∆×ᶜ¬∧∨⟺⇒';
  const REL_CONJ = ['⊆', '⊂', '⊇', '⊃', '⊈', '=', '≠'];

  class NoVerificable extends Error {}

  function tokenizar(s) {
    const t = [];
    const cs = [...s];
    for (let i = 0; i < cs.length; i++) {
      let ch = NORMAL[cs[i]] || cs[i];
      if (/\s/.test(ch)) continue;
      if (ch === '2' && SUP[cs[i + 1]]) { t.push({ k: 'pot', v: SUP[cs[++i]] }); continue; }
      if (/[0-9]/.test(ch)) {
        let n = ch;
        while (i + 1 < cs.length && /[0-9]/.test(cs[i + 1])) n += cs[++i];
        t.push({ k: 'num', v: n });
      } else if (/[a-z]/.test(ch)) t.push({ k: 'min', v: ch });
      else if (/[A-Z]/.test(ch)) t.push({ k: 'may', v: ch });
      else if (ch === 'Ø') t.push({ k: 'vacio', v: ch });
      else if (SIMBOLOS.includes(ch)) t.push({ k: ch, v: ch });
      else throw new Error(`símbolo inesperado "${ch}" en "${s}"`);
    }
    return t;
  }

  // ---------- Parser ----------
  function parsear(s) {
    const t = tokenizar(s);
    let i = 0;
    const ver = (d = 0) => t[i + d] || { k: 'fin' };
    const falla = (msg) => { throw new Error(`${msg} en "${s}"`); };
    const tomar = (k) => { if (ver().k !== k) falla(`se esperaba "${k}"`); i++; };
    const intentar = (fn) => {
      const guardado = i;
      try { return fn(); } catch (e) { i = guardado; return null; }
    };
    const esConectorY = () => (ver().k === 'min' && ver().v === 'y' && !['∈', '∉'].includes(ver(1).k)) || ver().k === '∧';
    const esConectorO = () => (ver().k === 'min' && ver().v === 'o') || ver().k === '∨';

    // ----- conjuntos -----
    function conj() {
      const xs = [termino()], ops = [];
      while (['∩', '∪', '\\', '∆'].includes(ver().k)) { ops.push(t[i++].k); xs.push(termino()); }
      if (new Set(ops).size > 1) falla('mezcla de operaciones sin paréntesis');
      if (ops.length > 1 && (ops[0] === '\\' || ops[0] === '∆')) falla(`"${ops[0]}" encadenada sin paréntesis`);
      return xs.reduce((a, b, k) => ({ t: 'bin', op: ops[k - 1], a, b }));
    }
    function termino() {
      const a = postfijo();
      if (ver().k === '×') { i++; return { t: 'x', a, b: postfijo() }; }
      return a;
    }
    function postfijo() {
      let a = primario();
      while (ver().k === 'ᶜ') { i++; a = { t: 'c', a }; }
      return a;
    }
    function primario() {
      const x = ver();
      if (x.k === 'may') {
        if (x.v === 'V' || x.v === 'F') falla('V y F no son conjuntos');
        i++;
        return x.v === 'U' ? { t: 'U' } : { t: 'var', n: x.v };
      }
      if (x.k === 'vacio') { i++; return { t: 'vacio' }; }
      if (x.k === 'pot') { i++; return { t: 'pot', n: x.v }; }
      if (x.k === '(') { i++; const e = conj(); tomar(')'); return e; }
      if (x.k === '{') {
        i++;
        if (ver().k === 'min' && ver().v === 'x' && (ver(1).k === ':' || ver(1).k === '/')) {
          i += 2;
          const a = afirm();
          tomar('}');
          return { t: 'comp', s: a };
        }
        return literal();
      }
      falla('falta un conjunto');
    }
    function literal() { // ya se tomó "{"
      const el = [];
      if (ver().k !== '}') {
        el.push(elemento());
        while (ver().k === ',') { i++; el.push(elemento()); }
      }
      tomar('}');
      return { t: 'lit', el };
    }

    // ----- elementos -----
    function elemento() {
      const x = ver();
      if (x.k === 'num') { i++; return { t: 'val', v: x.v }; }
      if (x.k === 'min') {
        if (x.v === 'o') falla('"o" no puede ser un elemento');
        i++;
        return x.v === 'x' || x.v === 'y' ? { t: 'pt', n: x.v } : { t: 'val', v: x.v };
      }
      if (x.k === 'vacio') { i++; return { t: 'vacio' }; }
      if (x.k === '{') { i++; return literal(); }
      if (x.k === '(') { i++; const a = elemento(); tomar(','); const b = elemento(); tomar(')'); return { t: 'par', a, b }; }
      if (x.k === '|') { i++; const a = conj(); tomar('|'); return { t: 'card', a }; }
      // Un conjunto con nombre como elemento de otro: A ∈ 2ᴬ
      if (x.k === 'may' && x.v !== 'V' && x.v !== 'F') return { t: 'conjel', a: postfijo() };
      falla('falta un elemento');
    }

    // ----- afirmaciones -----
    function afirm() {
      let a = implica();
      while (ver().k === '⟺') { i++; a = { t: 'iff', a, b: implica() }; }
      return a;
    }
    function implica() {
      const a = disy();
      if (ver().k === '⇒') { i++; return { t: 'imp', a, b: implica() }; }
      return a;
    }
    function disy() {
      const xs = [conjun()];
      while (esConectorO()) { i++; xs.push(conjun()); }
      if (xs.length > 1 && xs.some((x) => x.t === 'y' && !x.paren)) falla('mezcla "y" con "o" sin paréntesis');
      return xs.reduce((a, b) => ({ t: 'o', a, b }));
    }
    function conjun() {
      let a = negacion();
      while (esConectorY()) { i++; a = { t: 'y', a, b: negacion() }; }
      return a;
    }
    function negacion() {
      if (ver().k === '¬') { i++; return { t: 'no', a: negacion() }; }
      const x = ver();
      if (x.k === 'may' && (x.v === 'V' || x.v === 'F')) { i++; return { t: 'k', v: x.v === 'V' }; }
      const r = intentar(relacion);
      if (r) return r;
      if (x.k === '(') {
        i++;
        const e = afirm();
        tomar(')');
        return { ...e, paren: true };
      }
      return relacion(); // para que el error tenga sentido
    }
    function relacion() {
      const r1 = intentar(() => {
        const a = conj();
        if (!REL_CONJ.includes(ver().k)) falla('falta relación');
        const op = t[i++].k;
        return { t: 'rel', op, a, b: conj() };
      });
      if (r1) return r1;
      const a = elemento();
      const op = ver().k;
      if (op === '∈' || op === '∉') { i++; return { t: 'en', neg: op === '∉', a, b: conj() }; }
      if (op === '=' || op === '≠') { i++; return { t: 'releq', op, a, b: elemento() }; }
      falla('falta ∈, ∉, ⊆, = …');
    }

    // Primero intentamos leer todo como conjunto; si no, como afirmación
    let errConjunto = null;
    try {
      const e = conj();
      if (i !== t.length) falla(`sobra texto desde "${ver().v}"`);
      return { clase: 'conjunto', e };
    } catch (err) { errConjunto = err; }
    // Si no hay nada de afirmación (∈, ⊆, =, ⇒ …), el error útil es el del conjunto
    if (!t.some((x) => ['∈', '∉', '⇒', '⟺', '¬', '∧', '∨', ...REL_CONJ].includes(x.k) || (x.k === 'may' && (x.v === 'V' || x.v === 'F')))) throw errConjunto;
    i = 0;
    const e = afirm();
    if (i !== t.length) falla(`sobra texto desde "${ver().v}"`);
    return { clase: 'afirmacion', e };
  }

  const nodo = (x) => (typeof x === 'string' ? parsear(x) : x);

  // ---------- Dimensión: 1 = conjunto de elementos, 2 = conjunto de parejas, 0 = sirve para los dos (U, Ø) ----------
  function dim(e) {
    switch (e.t) {
      case 'var': case 'lit': case 'comp': case 'pot': return 1;
      case 'U': case 'vacio': return 0;
      case 'c': return dim(e.a);
      case 'x':
        if (dim(e.a) === 2 || dim(e.b) === 2) throw new Error('producto de productos');
        return 2;
      case 'bin': {
        const a = dim(e.a), b = dim(e.b);
        if (a && b && a !== b) throw new Error(`"${e.op}" entre un conjunto y un conjunto de parejas`);
        return a || b;
      }
    }
    throw new Error(`no es un conjunto (${e.t})`);
  }

  // ---------- Evaluación simbólica ----------
  // m: { A: { x: bool, y: bool }, … }; p: 'x' | 'y' | 'par'
  function en(e, m, p) {
    switch (e.t) {
      case 'var':
        if (p === 'par') throw new Error(`${e.n} no es un conjunto de parejas`);
        return m[e.n][p];
      case 'U': return true;
      case 'vacio': return false;
      case 'c': return !en(e.a, m, p);
      case 'comp':
        if (p === 'par') throw new Error('{x : …} no es un conjunto de parejas');
        return verdad(e.s, m, { x: p, y: p === 'x' ? 'y' : 'x' }, { seguro: false });
      case 'x':
        if (p !== 'par') throw new Error('un producto cartesiano solo contiene parejas');
        return en(e.a, m, 'x') && en(e.b, m, 'y');
      case 'bin': {
        const a = en(e.a, m, p), b = en(e.b, m, p);
        switch (e.op) {
          case '∩': return a && b;
          case '∪': return a || b;
          case '\\': return a && !b;
          case '∆': return a !== b;
        }
      }
    }
    throw new NoVerificable('conjunto concreto en una expresión simbólica');
  }
  function puntoDe(a, bind) {
    if (a.t === 'pt') return bind[a.n];
    if (a.t === 'par' && a.a.t === 'pt' && a.b.t === 'pt' && a.a.n === 'x' && a.b.n === 'y') return 'par';
    throw new NoVerificable('elemento concreto en una expresión simbólica');
  }
  function verdad(s, m, bind = { x: 'x', y: 'y' }, ctx = { seguro: true, enImp: false }) {
    const inseguro = { seguro: false, enImp: true };
    switch (s.t) {
      case 'k': return s.v;
      case 'no': return !verdad(s.a, m, bind, inseguro);
      case 'y': return verdad(s.a, m, bind, ctx) && verdad(s.b, m, bind, ctx);
      case 'o': return verdad(s.a, m, bind, inseguro) || verdad(s.b, m, bind, inseguro);
      case 'imp': case 'iff': {
        const c = ctx.seguro && !ctx.enImp ? { seguro: true, enImp: true } : inseguro;
        const a = verdad(s.a, m, bind, c), b = verdad(s.b, m, bind, c);
        return s.t === 'imp' ? !a || b : a === b;
      }
      case 'en': {
        const r = en(s.b, m, puntoDe(s.a, bind));
        return s.neg ? !r : r;
      }
      case 'rel': {
        if (!ctx.seguro) throw new NoVerificable(`"${s.op}" dentro de ¬, "o" o un ⇒ interno`);
        if (!['⊆', '⊇', '='].includes(s.op)) throw new NoVerificable(`"${s.op}" no se puede revisar punto por punto`);
        const d = dim(s.a) || dim(s.b);
        if (dim(s.a) && dim(s.b) && dim(s.a) !== dim(s.b)) throw new Error('compara un conjunto con un conjunto de parejas');
        const puntos = d === 2 ? ['par'] : ['x', 'y'];
        return puntos.every((p) => {
          const a = en(s.a, m, p), b = en(s.b, m, p);
          return s.op === '⊆' ? !a || b : s.op === '⊇' ? !b || a : a === b;
        });
      }
    }
    throw new NoVerificable('comparación de elementos concretos');
  }

  function variables(e, s = new Set()) {
    if (!e || typeof e !== 'object') return s;
    if (e.t === 'var' || e.t === 'pot') s.add(e.n);
    for (const k of ['a', 'b', 's']) if (e[k]) variables(e[k], s);
    if (e.el) e.el.forEach((x) => variables(x, s));
    return s;
  }
  function* modelos(vs) {
    vs = [...vs];
    const n = vs.length * 2;
    for (let k = 0; k < 2 ** n; k++) {
      const m = {};
      vs.forEach((v, j) => (m[v] = { x: !!(k & (1 << (2 * j))), y: !!(k & (1 << (2 * j + 1))) }));
      yield m;
    }
  }
  const comoAfirm = (x) => {
    const n = nodo(x);
    if (n.clase !== 'afirmacion') throw new Error('se esperaba una afirmación, no un conjunto');
    return n.e;
  };
  const comoConj = (x) => {
    const n = nodo(x);
    if (n.clase !== 'conjunto') throw new Error('se esperaba un conjunto');
    return n.e;
  };

  // ¿premisas (y las hipótesis) implican la conclusión? Todas son afirmaciones.
  function implicaA(premisas, conclusion, hip = []) {
    const ps = premisas.map(comoAfirm), hs = hip.map(comoAfirm), c = comoAfirm(conclusion);
    const vs = new Set();
    [...ps, ...hs, c].forEach((e) => variables(e, vs));
    for (const m of modelos(vs)) {
      if (hs.every((h) => verdad(h, m)) && ps.every((p) => verdad(p, m)) && !verdad(c, m)) return false;
    }
    return true;
  }
  const equivalentesA = (a, b, hip = []) => implicaA([a], b, hip) && implicaA([b], a, hip);
  const relacion = (op, a, b) => ({ clase: 'afirmacion', e: { t: 'rel', op, a: comoConj(a), b: comoConj(b) } });
  const igualesC = (a, b, hip = []) => implicaA([], relacion('=', a, b), hip);
  const contenidoC = (a, b, hip = []) => implicaA([], relacion('⊆', a, b), hip);
  const valida = (x, hip = []) => implicaA([], x, hip);

  // Para Venn: ¿la región con firma { A: true, B: false, … } está en el conjunto?
  function enRegion(x, firma) {
    const m = {};
    for (const [v, b] of Object.entries(firma)) m[v] = { x: b, y: false };
    return en(comoConj(x), m, 'x');
  }

  // ---------- Evaluación concreta ----------
  const unicos = (xs) => [...new Set(xs)].sort();
  const canon = (xs) => `{${unicos(xs).join(', ')}}`;
  function valor(e, env, bind = {}) {
    switch (e.t) {
      case 'var':
        if (!env[e.n]) throw new Error(`falta el valor de ${e.n}`);
        return env[e.n];
      case 'U':
        if (!env.U) throw new Error('falta el universo U');
        return env.U;
      case 'vacio': return [];
      case 'lit': return unicos(e.el.map((x) => elem(x, env, bind)));
      case 'pot': {
        const base = valor({ t: e.n === 'U' ? 'U' : 'var', n: e.n }, env);
        const r = [];
        for (let k = 0; k < 2 ** base.length; k++) r.push(canon(base.filter((_, j) => k & (1 << j))));
        return unicos(r);
      }
      case 'comp': return valor({ t: 'U' }, env).filter((u) => verdadC(e.s, env, { ...bind, x: u }));
      case 'c': { const a = valor(e.a, env, bind); return valor({ t: 'U' }, env).filter((u) => !a.includes(u)); }
      case 'x': {
        const a = valor(e.a, env, bind), b = valor(e.b, env, bind);
        return unicos(a.flatMap((p) => b.map((q) => `(${p}, ${q})`)));
      }
      case 'bin': {
        const a = valor(e.a, env, bind), b = valor(e.b, env, bind);
        switch (e.op) {
          case '∩': return a.filter((x) => b.includes(x));
          case '∪': return unicos([...a, ...b]);
          case '\\': return a.filter((x) => !b.includes(x));
          case '∆': return unicos([...a.filter((x) => !b.includes(x)), ...b.filter((x) => !a.includes(x))]);
        }
      }
    }
    throw new Error(`no es un conjunto (${e.t})`);
  }
  function elem(e, env, bind = {}) {
    switch (e.t) {
      case 'val': return e.v;
      case 'pt':
        if (!(e.n in bind)) throw new Error(`"${e.n}" no tiene valor`);
        return bind[e.n];
      case 'vacio': return '{}';
      case 'lit': return canon(valor(e, env, bind));
      case 'par': return `(${elem(e.a, env, bind)}, ${elem(e.b, env, bind)})`;
      case 'card': return String(valor(e.a, env, bind).length);
      case 'conjel': return canon(valor(e.a, env, bind));
    }
    throw new Error(`no es un elemento (${e.t})`);
  }
  function verdadC(s, env, bind = {}) {
    switch (s.t) {
      case 'k': return s.v;
      case 'no': return !verdadC(s.a, env, bind);
      case 'y': return verdadC(s.a, env, bind) && verdadC(s.b, env, bind);
      case 'o': return verdadC(s.a, env, bind) || verdadC(s.b, env, bind);
      case 'imp': return !verdadC(s.a, env, bind) || verdadC(s.b, env, bind);
      case 'iff': return verdadC(s.a, env, bind) === verdadC(s.b, env, bind);
      case 'en': { const r = valor(s.b, env, bind).includes(elem(s.a, env, bind)); return s.neg ? !r : r; }
      case 'releq': { const r = elem(s.a, env, bind) === elem(s.b, env, bind); return s.op === '=' ? r : !r; }
      case 'rel': {
        const a = valor(s.a, env, bind), b = valor(s.b, env, bind);
        const sub = (x, y) => x.every((e) => y.includes(e));
        switch (s.op) {
          case '⊆': return sub(a, b);
          case '⊇': return sub(b, a);
          case '⊂': return sub(a, b) && b.length > a.length;
          case '⊃': return sub(b, a) && a.length > b.length;
          case '⊈': return !sub(a, b);
          case '=': return sub(a, b) && sub(b, a);
          case '≠': return !(sub(a, b) && sub(b, a));
        }
      }
    }
    throw new Error(`no se puede evaluar (${s.t})`);
  }
  // datos: { U: '{1, 2, 3}', A: '{1}', … } → entorno con los valores calculados (en orden)
  function entorno(datos) {
    const env = {};
    for (const [k, v] of Object.entries(datos)) {
      if (typeof v !== 'string') throw new Error(`el valor de ${k} debe ser un texto como "{1, 2}"`);
      env[k] = valor(comoConj(v), env);
    }
    return env;
  }
  const valorDe = (x, env) => valor(comoConj(x), env);
  const verdadDe = (x, env) => verdadC(comoAfirm(x), env);

  // Igualdad de forma (sin importar espacios ni paréntesis de más)
  const forma = (x) => JSON.stringify(nodo(x).e, (k, v) => (k === 'paren' ? undefined : v));
  const mismaForma = (a, b) => forma(a) === forma(b);

  const API = {
    parsear, dim, NoVerificable, variables,
    implica: implicaA, equivalentes: equivalentesA, iguales: igualesC, contenido: contenidoC, valida,
    enRegion, entorno, valor: valorDe, verdad: verdadDe, canon, mismaForma, forma,
  };
  raiz.CONJUNTOS = API;
  if (raiz.ESTUDIO) raiz.ESTUDIO.conjuntos = API;
})(typeof window !== 'undefined' ? window : globalThis);
