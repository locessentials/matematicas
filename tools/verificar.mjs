// Verifica el contenido de una unidad.
// Uso: node tools/verificar.mjs logica
//      node tools/verificar.mjs conjuntos
//      node tools/verificar.mjs relaciones
//
// Lógica (tablas de verdad):
//  - Tarjetas de equivalencias/inferencia: cada línea debe ser una equivalencia o tautología válida.
//  - Problemas: la clasificación (demostrable vs. refutar) debe ser correcta, cada paso debe seguirse
//    de las líneas que cita, y la demostración debe terminar en el consecuente (o en F si es por contradicción).
//
// Conjuntos (regiones del diagrama de Venn, que es lo mismo que una tabla de verdad):
//  - Tarjetas de leyes: cada línea debe ser válida.
//  - Venn: las expresiones se pueden leer y "¿se cumple la ley?" tiene la respuesta correcta.
//  - Verdadero/falso y cálculos: se calculan con los conjuntos concretos.
//  - Contraejemplos: los conjuntos dados de verdad hacen falsa la afirmación.
//  - Demostraciones: cada renglón se sigue del anterior con su conector (=, ⊆, ⟺, ⇒), y lo que demuestran
//    las secciones juntas es exactamente lo que se pedía.
// Relaciones (con todas las relaciones sobre conjuntos chicos):
//  - Matrices: cada ejercicio se puede leer; los de "clases" son de equivalencia; cada "ejemplo" cumple lo que pide.
//  - Problemas con "teorema": se prueba con todas las relaciones sobre conjuntos de 1 a 3 elementos (o se revisa el contraejemplo).
//  - Problemas con "muestra": las propiedades que dice la solución se revisan con una muestra finita (p. ej. enteros de −8 a 8).
//  - Problemas con "cuenta": se cuentan las relaciones de ese tipo.
// Las tarjetas que tienen una etiqueta ("∧ respecto a ∨: …") o una cadena (a ≡ b ≡ c) se revisan por partes.
// Algunas afirmaciones (las que dicen "existe" o "≠", o A × B = Ø ⟺ …) no se pueden revisar así;
// se cuentan como "no verificables" y hay que revisarlas a mano. No revisa que el NOMBRE de la ley sea el correcto.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const unidad = process.argv[2] || 'logica';
const raiz = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dir = path.join(raiz, unidad, 'datos');

// ---------- Cargar datos con un ESTUDIO mínimo ----------
const actividades = [];
const ctx = { ESTUDIO: { actividad: (a) => actividades.push(a), unidad: () => {} } };
vm.createContext(ctx);
for (const lib of ['conjuntos-expr.js', 'relaciones.js']) {
  vm.runInContext(fs.readFileSync(path.join(raiz, 'assets/js', lib), 'utf8'), ctx, { filename: lib });
}
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.js')).sort()) {
  vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), ctx, { filename: f });
}

let errores = 0, revisados = 0;
const omitidos = [];
const error = (donde, msg) => { errores++; console.log(`✗ ${donde}: ${msg}`); };

if (unidad === 'conjuntos') verificarConjuntos(ctx.CONJUNTOS);
else if (unidad === 'relaciones') verificarRelaciones(ctx.RELACIONES);
else verificarLogica();

// Una línea de tarjeta sin su etiqueta ("∧ respecto a ∨: p ∧ …" → "p ∧ …") y partida en una cadena (a ≡ b ≡ c → a ≡ b, b ≡ c)
function piezas(linea, op) {
  const m = linea.match(/^([^:{}]*?[a-záéíóú]{2,}[^:{}]*):\s+(.*)$/);
  if (m) linea = m[2];
  const xs = linea.split(` ${op} `);
  if (xs.length <= 2 || /[⟺⇒↔→]/.test(linea)) return [linea];
  return xs.slice(1).map((x, i) => `${xs[i]} ${op} ${x}`);
}

if (omitidos.length) {
  console.log(`\nNo verificables automáticamente (revísalos a mano):`);
  omitidos.forEach((x) => console.log(`  · ${x}`));
}
console.log(`\n${revisados} elementos revisados, ${omitidos.length} no verificables, ${errores} errores.`);
process.exit(errores ? 1 : 0);

// =====================================================================
// Lógica
// =====================================================================
function verificarLogica() {
  // Precedencia: ¬ > ∧ > ∨,⊕ > → (asociativa a la derecha) > ↔ > ≡
  function tokenizar(s) {
    const t = [];
    for (const ch of s.replace(/\s+/g, '')) {
      if ('()[]{}¬∧∨⊕→↔≡'.includes(ch)) t.push('([{'.includes(ch) ? '(' : ')]}'.includes(ch) ? ')' : ch);
      else if (/^[a-zVF]$/.test(ch)) t.push(ch);
      else throw new Error(`símbolo inesperado "${ch}" en "${s}"`);
    }
    return t;
  }
  function parsear(s) {
    const t = tokenizar(s);
    let i = 0;
    const ver = () => t[i];
    const tomar = (x) => { if (t[i] !== x) throw new Error(`se esperaba ${x} en "${s}"`); i++; };
    const bin = (op, a, b) => ({ op, a, b });
    function equiv() { let a = bicond(); while (ver() === '≡') { i++; a = bin('≡', a, bicond()); } return a; }
    function bicond() { let a = impl(); while (ver() === '↔') { i++; a = bin('↔', a, impl()); } return a; }
    function impl() { const a = disy(); if (ver() === '→') { i++; return bin('→', a, impl()); } return a; }
    function disy() { let a = conj(); while (ver() === '∨' || ver() === '⊕') { const op = t[i++]; a = bin(op, a, conj()); } return a; }
    function conj() { let a = neg(); while (ver() === '∧') { i++; a = bin('∧', a, neg()); } return a; }
    function neg() {
      if (ver() === '¬') { i++; return { op: '¬', a: neg() }; }
      if (ver() === '(') { i++; const e = equiv(); tomar(')'); return e; }
      const x = t[i++];
      if (x === undefined || !/^[a-zVF]$/.test(x)) throw new Error(`fórmula incompleta: "${s}"`);
      return x === 'V' ? { c: true } : x === 'F' ? { c: false } : { v: x };
    }
    const e = equiv();
    if (i !== t.length) throw new Error(`sobra texto en "${s}"`);
    return e;
  }
  function evaluar(e, m) {
    if ('c' in e) return e.c;
    if ('v' in e) return m[e.v];
    const a = () => evaluar(e.a, m), b = () => evaluar(e.b, m);
    switch (e.op) {
      case '¬': return !a();
      case '∧': return a() && b();
      case '∨': return a() || b();
      case '⊕': return a() !== b();
      case '→': return !a() || b();
      case '↔': case '≡': return a() === b();
    }
  }
  function vars(e, s = new Set()) {
    if ('v' in e) s.add(e.v);
    if (e.a) vars(e.a, s);
    if (e.b) vars(e.b, s);
    return s;
  }
  function* modelos(vs) {
    vs = [...vs];
    for (let k = 0; k < 2 ** vs.length; k++) {
      const m = {};
      vs.forEach((v, j) => (m[v] = !!(k & (1 << j))));
      yield m;
    }
  }
  // ¿las fórmulas "hip" implican "concl"? (hip vacío = tautología)
  function implica(hip, concl) {
    const vs = new Set();
    [...hip, concl].forEach((e) => vars(e, vs));
    for (const m of modelos(vs)) if (hip.every((h) => evaluar(h, m)) && !evaluar(concl, m)) return false;
    return true;
  }
  const equivalentes = (a, b) => implica([a], b) && implica([b], a);
  const Y = (xs) => xs.reduce((a, b) => ({ op: '∧', a, b }));

  for (const act of actividades) {
    if (act.tipo === 'tarjetas') {
      for (const [k, t] of act.tarjetas.entries()) {
        if (!['Equivalencias', 'Inferencia'].includes(t.cat)) continue;
        for (const linea of t.formula.split('\n').flatMap((l) => piezas(l, '≡'))) {
          const donde = `${act.id} #${k + 1} ${t.nombre} [${linea}]`;
          try {
            if (linea.includes(',')) {
              // "a, b → a ∧ b": premisas separadas por comas
              const [izq, der] = linea.split('→');
              if (!implica(izq.split(',').map(parsear), parsear(der))) error(donde, 'no es válida');
            } else if (!implica([], parsear(linea))) error(donde, 'no es tautología / equivalencia');
            revisados++;
          } catch (e) { error(donde, e.message); }
        }
      }
    }
    if (act.tipo === 'problemas') {
      for (const p of act.problemas) {
        const donde = `${act.id}/${p.id}`;
        try {
          const f = parsear(p.enunciado);
          if (f.op !== '→') { error(donde, 'el conectivo principal no es →'); continue; }
          const taut = implica([], f);
          const s = p.solucion;
          if (s.contraejemplo) {
            if (taut) error(donde, 'se refuta pero ES tautología');
            const m = { ...s.contraejemplo };
            vars(f).forEach((v) => { if (!(v in m)) error(donde, `contraejemplo sin valor para ${v}`); });
            if (evaluar(f, m)) error(donde, 'el contraejemplo no hace F la fórmula');
            revisados++;
            continue;
          }
          if (!taut) error(donde, 'se "demuestra" pero NO es tautología');
          const pasos = s.pasos.map((x) => ({ ...x, e: parsear(x.f) }));
          const prem = pasos.filter((x) => x.tipo === 'premisa').map((x) => x.e);
          if (!equivalentes(Y(prem), f.a)) error(donde, 'las premisas no equivalen al antecedente');
          const neg = pasos.find((x) => x.tipo === 'negacion');
          if (neg && !equivalentes(neg.e, { op: '¬', a: f.b })) error(donde, 'la negación de la conclusión está mal');
          pasos.forEach((x, k) => {
            if (x.tipo) return;
            if (!x.c || !x.c.length) return error(donde, `paso ${k + 1} no cita líneas`);
            const citadas = x.c.map((n) => pasos[n - 1].e);
            if (!implica(citadas, x.e)) error(donde, `paso ${k + 1} "${x.f}" no se sigue de (${x.c.join(', ')})`);
            if (x.c.some((n) => n > k)) error(donde, `paso ${k + 1} cita una línea posterior`);
          });
          const ultimo = pasos[pasos.length - 1].e;
          if (neg) { if (!equivalentes(ultimo, { c: false })) error(donde, 'por contradicción pero no termina en F'); }
          else if (!equivalentes(ultimo, f.b)) error(donde, 'la última línea no es el consecuente');
          revisados++;
        } catch (e) { error(donde, e.message); }
      }
    }
  }
}

// =====================================================================
// Conjuntos
// =====================================================================
function verificarConjuntos(C) {
  const CATS_LEYES = ['Operaciones', 'Leyes', 'Contención', 'Diferencia', 'Producto'];
  const esNoVerif = (e) => e instanceof C.NoVerificable || e.constructor?.name === 'NoVerificable';

  for (const act of actividades) {
    if (act.tipo === 'tarjetas') {
      for (const [k, t] of act.tarjetas.entries()) {
        if (!CATS_LEYES.includes(t.cat) || t.verificar === false) continue;
        for (const linea of t.formula.split('\n').flatMap((l) => piezas(l, '='))) {
          const donde = `${act.id} #${k + 1} ${t.nombre} [${linea}]`;
          try {
            if (!C.valida(linea)) error(donde, 'no es válida');
            else revisados++;
          } catch (e) { esNoVerif(e) ? omitidos.push(`${donde} (${e.message})`) : error(donde, e.message); }
        }
      }
    }

    if (act.tipo === 'venn') {
      for (const x of act.ejercicios) {
        const donde = `${act.id}/${x.id}`;
        try {
          const permitidas = new Set(x.conjuntos);
          const exprs = x.modo === 'ley' ? [x.izq, x.der] : [x.expr, ...(x.equivalentes || [])];
          for (const e of exprs) {
            const n = C.parsear(e);
            if (n.clase !== 'conjunto') throw new Error(`"${e}" no es un conjunto`);
            for (const v of C.variables(n.e)) if (!permitidas.has(v)) error(donde, `usa ${v}, que no está en el diagrama`);
          }
          if (x.modo === 'ley' && C.iguales(x.izq, x.der) !== x.cumple) error(donde, `dice cumple: ${x.cumple}, pero es al revés`);
          for (const e of x.equivalentes || []) if (!C.iguales(x.expr, e)) error(donde, `"${e}" no es igual a "${x.expr}"`);
          revisados++;
        } catch (e) { error(donde, e.message); }
      }
    }

    if (act.tipo === 'problemas') {
      for (const p of act.problemas) {
        const donde = `${act.id}/${p.id}`;
        if (p.verificar === false) { omitidos.push(`${donde} (marcado para revisión manual)`); continue; }
        try {
          verificarProblema(p, donde);
        } catch (e) { esNoVerif(e) ? omitidos.push(`${donde} (${e.message})`) : error(donde, e.message); }
      }
    }
  }

  function verificarProblema(p, donde) {
    const s = p.solucion;
    const hip = p.hipotesis || [];
    const tesis = p.tesis || p.enunciado;
    const nTesis = C.parsear(tesis);

    if ('respuesta' in s) {
      const env = p.datos ? C.entorno(p.datos) : {};
      if (C.verdad(tesis, env) !== s.respuesta) error(donde, `la respuesta es ${!s.respuesta ? 'Verdadero' : 'Falso'}`);
      revisados++;
      return;
    }
    if (s.contraejemplo) {
      const env = C.entorno(s.contraejemplo);
      for (const h of hip) if (!C.verdad(h, env)) error(donde, `el contraejemplo no cumple la hipótesis ${h}`);
      if (C.verdad(tesis, env)) error(donde, 'el contraejemplo NO hace falsa la afirmación');
      revisados++;
      return;
    }

    const env = p.datos ? C.entorno(p.datos) : null;
    if (env && nTesis.clase === 'afirmacion' && !C.verdad(tesis, env)) error(donde, 'con estos datos la tesis es falsa');
    if (!env) {
      if (nTesis.clase !== 'afirmacion') throw new Error('la tesis debe ser una afirmación (A = B, A ⊆ B, …)');
      if (!C.valida(tesis, hip)) error(donde, 'se "demuestra" pero la tesis NO es válida');
    }

    // Separar en secciones por los renglones de título; numerar como los muestra la página
    const secciones = [[]];
    const numerados = [];
    for (const x of s.pasos) {
      if (x.tipo === 'titulo') { if (secciones[secciones.length - 1].length) secciones.push([]); continue; }
      const paso = { ...x, num: numerados.length + 1, n: x.libre ? null : C.parsear(x.f) };
      numerados.push(paso);
      secciones[secciones.length - 1].push(paso);
    }

    const hechos = []; // lo que demuestra cada sección
    for (const sec of secciones) {
      let completa = sec.length > 0;
      for (let k = 1; k < sec.length; k++) {
        const ant = sec[k - 1], act = sec[k];
        const aqui = `${donde} renglón ${act.num}`;
        if (ant.libre || act.libre) { completa = false; continue; }
        if (!act.op) { error(aqui, 'falta el conector (op)'); completa = false; continue; }
        if (ant.n.clase !== act.n.clase) { error(aqui, 'mezcla un conjunto con una afirmación'); completa = false; continue; }
        try {
          if (act.n.clase === 'conjunto') {
            let ok;
            if (env) {
              const a = C.valor(ant.f, env), b = C.valor(act.f, env);
              const sub = (x, y) => x.every((e) => y.includes(e));
              ok = act.op === '=' ? sub(a, b) && sub(b, a) : act.op === '⊆' ? sub(a, b) : act.op === '⊇' ? sub(b, a) : null;
            } else {
              ok = act.op === '=' ? C.iguales(ant.f, act.f, hip)
                : act.op === '⊆' ? C.contenido(ant.f, act.f, hip)
                : act.op === '⊇' ? C.contenido(act.f, ant.f, hip) : null;
            }
            if (ok === null) error(aqui, `conector "${act.op}" no sirve entre conjuntos (usa =, ⊆ o ⊇)`);
            else if (!ok) error(aqui, `"${act.f}" no es ${act.op} "${ant.f}"`);
          } else {
            const citadas = (act.c || []).map((n) => numerados[n - 1].f);
            let ok;
            if (act.op === '⟺') ok = C.implica([ant.f, ...citadas], act.f, hip) && C.implica([act.f, ...citadas], ant.f, hip);
            else if (act.op === '⇒') ok = C.implica([ant.f, ...citadas], act.f, hip);
            else ok = null;
            if (ok === null) error(aqui, `conector "${act.op}" no sirve entre afirmaciones (usa ⟺ o ⇒)`);
            else if (!ok) error(aqui, `"${act.f}" no se sigue de "${ant.f}" con ${act.op}`);
          }
        } catch (e) {
          if (esNoVerif(e)) { omitidos.push(`${aqui} (${e.message})`); completa = false; } else throw e;
        }
      }
      if (!completa || !sec.length) continue;
      const ops = new Set(sec.slice(1).map((x) => x.op));
      const primero = sec[0], ultimo = sec[sec.length - 1];
      if (env) {
        // Cálculo: cada sección empieza con una expresión y termina con el conjunto ya calculado
        if (!['lit', 'vacio'].includes(ultimo.n.e.t) && sec.length > 1) error(`${donde} renglón ${ultimo.num}`, 'el cálculo no termina en un conjunto concreto');
        hechos.push({ tipo: 'calculo', inicio: primero.f });
        continue;
      }
      if (primero.n.clase === 'conjunto') {
        const rel = [...ops].every((o) => o === '=') ? '=' : ops.has('⊆') && !ops.has('⊇') ? '⊆' : ops.has('⊇') && !ops.has('⊆') ? '⊇' : null;
        if (rel === '⊇') hechos.push({ tipo: 'rel', rel: '⊆', L: ultimo.f, R: primero.f });
        else if (rel) hechos.push({ tipo: 'rel', rel, L: primero.f, R: ultimo.f });
        continue;
      }
      const a = primero.n.e, b = ultimo.n.e;
      const puntoIgual = (u, v) => JSON.stringify(u) === JSON.stringify(v);
      const equiv = [...ops].every((o) => o === '⟺');
      if (a.t === 'en' && !a.neg && b.t === 'en' && !b.neg && puntoIgual(a.a, b.a) && ['pt', 'par'].includes(a.a.t)) {
        hechos.push({ tipo: 'rel', rel: equiv ? '=' : '⊆', L: C.forma(textoDe(primero)), R: C.forma(textoDe(ultimo)), formas: true });
      } else if (a.t === 'en' && !a.neg && b.t === 'k' && b.v === false) {
        hechos.push({ tipo: 'rel', rel: '=', L: C.forma(textoDe(primero)), R: C.forma('Ø'), formas: true });
      }
      hechos.push({ tipo: 'imp', equiv, a: primero.f, b: ultimo.f });
    }

    // ¿Las secciones demuestran la tesis?
    if (env) {
      const lados = nTesis.clase === 'conjunto' ? [tesis] : [];
      if (nTesis.clase === 'afirmacion' && nTesis.e.t === 'rel') lados.push(texto(nTesis.e.a), texto(nTesis.e.b));
      for (const h of hechos) {
        if (lados.length && !lados.some((l) => C.mismaForma(l, h.inicio))) error(donde, `la sección que empieza en "${h.inicio}" no es un lado de la tesis`);
      }
      revisados++;
      return;
    }
    const f = (x) => (x.formas ? x : { ...x, L: C.forma(x.L), R: C.forma(x.R) });
    const rels = hechos.filter((h) => h.tipo === 'rel').map(f);
    const tiene = (rel, L, R) => rels.some((h) => (h.rel === rel || h.rel === '=') && h.L === L && h.R === R) ||
      (rel === '=' && rels.some((h) => h.rel === '=' && h.L === R && h.R === L));
    const e = nTesis.e;
    let ok = false;
    if (e.t === 'rel' && (e.op === '=' || e.op === '⊆' || e.op === '⊇')) {
      const A = C.forma({ e: e.a }), B = C.forma({ e: e.b });
      if (e.op === '=') ok = tiene('=', A, B) || (tiene('⊆', A, B) && tiene('⊆', B, A));
      if (e.op === '⊆') ok = tiene('⊆', A, B);
      if (e.op === '⊇') ok = tiene('⊆', B, A);
    }
    if (!ok && (e.t === 'imp' || e.t === 'iff')) {
      ok = hechos.some((h) => h.tipo === 'imp' && (h.equiv || e.t === 'imp') &&
        C.mismaForma(h.a, { e: e.a }) && C.mismaForma(h.b, { e: e.b }));
    }
    if (!ok) error(donde, 'los renglones son correctos, pero no demuestran exactamente la tesis');
    revisados++;
  }

  // Forma del conjunto en "x ∈ CONJUNTO" (para comparar con los lados de la tesis)
  function textoDe(paso) { return { e: paso.n.e.b }; }
  function texto(e) { return { e }; }
}

// =====================================================================
// Relaciones
// =====================================================================
function verificarRelaciones(Rel) {
  // Todas las relaciones sobre X (2^(n²) de ellas)
  const cache = new Map();
  function todas(X) {
    const clave = X.join();
    if (cache.has(clave)) return cache.get(clave);
    const ps = X.flatMap((a) => X.map((b) => [a, b]));
    const rs = [];
    for (let m = 0; m < 2 ** ps.length; m++) rs.push(Rel.relacion(X, X, ps.filter((_, i) => m & (1 << i))));
    cache.set(clave, rs);
    return rs;
  }
  // 'simetrica(R ∪ S)', 'R ⊆ S', 'R = R⁻¹', 'a ⟺ b'
  function predicado(s) {
    s = s.trim();
    const lados = s.split('⟺');
    if (lados.length === 2) { const a = predicado(lados[0]), b = predicado(lados[1]); return (env) => a(env) === b(env); }
    let m = s.match(/^(\w+)\((.*)\)$/);
    if (m) {
      const [, nombre, expr] = m;
      return (env) => {
        const p = Rel.propiedades(Rel.evaluar(expr, env));
        if (nombre in p) return p[nombre].ok;
        const t = Rel.tipos(p);
        if (nombre in t) return t[nombre];
        throw new Error(`propiedad desconocida "${nombre}"`);
      };
    }
    m = s.match(/^(.*?)\s*(⊆|=)\s*(.*)$/);
    if (m) return (env) => {
      const a = Rel.evaluar(m[1], env), b = Rel.evaluar(m[3], env);
      return m[2] === '=' ? Rel.igual(a, b) : Rel.contenida(a, b);
    };
    throw new Error(`no se entiende "${s}"`);
  }
  const textoEnv = (env, vs) => `X = ${Rel.conjuntoTexto(env.X)}, ` + vs.map((v) => `${v} = ${Rel.texto(env[v])}`).join(', ');

  for (const act of actividades) {
    if (act.tipo === 'matriz') {
      for (const ej of act.ejercicios) {
        const donde = `${act.id}/${ej.id}`;
        try {
          if (ej.modo === 'operar') {
            const env = {};
            for (const [k, d] of Object.entries(ej.datos)) env[k] = Rel.deDatos(d, ej.X);
            env.X = ej.X ? Rel.leerConjunto(ej.X) : Object.values(env)[0].X;
            Rel.evaluar(ej.expr, env);
          } else if (ej.modo === 'ejemplo') {
            const X = Rel.leerConjunto(ej.X);
            const malos = Rel.revisarPide(Rel.relacion(X, X, ej.ejemplo), ej.pide).filter((r) => !r.ok);
            if (malos.length) error(donde, `el ejemplo no cumple: ${malos.map((r) => `${r.texto} (${r.por})`).join('; ')}`);
          } else {
            const R = Rel.deDatos(ej, ej.X);
            if (ej.regla) for (const a of R.X) for (const b of R.Y) if (typeof ej.regla(a, b) !== 'boolean') throw new Error(`la regla no da V/F en (${a}, ${b})`);
            if (ej.modo === 'propiedades' || ej.modo === 'clases') {
              const p = Rel.propiedades(R);
              if (ej.modo === 'clases' && !Rel.tipos(p).equivalencia) error(donde, 'se piden clases, pero no es de equivalencia');
            }
          }
          revisados++;
        } catch (e) { error(donde, e.message); }
      }
    }

    if (act.tipo === 'problemas') {
      for (const p of act.problemas) {
        const donde = `${act.id}/${p.id}`;
        let algo = false;
        try {
          for (const m of [].concat(p.muestra || [])) {
            algo = true;
            const R = Rel.desdeRegla(m.dominio, m.dominio, m.regla);
            const props = Rel.propiedades(R);
            for (const [k, dice] of Object.entries(m.propiedades)) {
              if (!(k in props)) throw new Error(`propiedad desconocida "${k}"`);
              if (props[k].ok !== dice) {
                error(donde + (m.k != null ? ` (k = ${m.k})` : ''),
                  `dice ${k}: ${dice ? 'sí' : 'no'}, pero con la muestra ${dice ? `falla: ${props[k].por}` : 'no aparece ningún contraejemplo'}`);
              }
            }
          }
          if (p.teorema) {
            algo = true;
            const hip = p.teorema.hip.map(predicado), tesis = predicado(p.teorema.tesis);
            const vs = ['R', 'S', 'T'].filter((v) => [...p.teorema.hip, p.teorema.tesis].some((x) => x.includes(v)));
                    const hipOk = (env) => hip.every((h) => h(env));
            const ce = p.solucion.contraejemplo;
            if (ce) {
              const env = { X: Rel.leerConjunto(ce.X) };
              for (const v of vs) env[v] = Rel.relacion(env.X, env.X, ce[v] || 'Ø');
              if (!hipOk(env)) error(donde, `el contraejemplo no cumple las hipótesis (${textoEnv(env, vs)})`);
              else if (tesis(env)) error(donde, `el contraejemplo sí cumple la tesis (${textoEnv(env, vs)})`);
            } else {
              const max = vs.length >= 3 ? 2 : 3;
              let falla = null;
              buscar: for (let n = 1; n <= max; n++) {
                const X = Array.from({ length: n }, (_, i) => i + 1), rs = todas(X);
                const combos = vs.reduce((acc) => acc.flatMap((c) => rs.map((r) => [...c, r])), [[]]);
                for (const c of combos) {
                  const env = { X };
                  vs.forEach((v, i) => (env[v] = c[i]));
                  if (hipOk(env) && !tesis(env)) { falla = textoEnv(env, vs); break buscar; }
                }
              }
              if (falla) error(donde, `el teorema es falso; contraejemplo: ${falla}`);
            }
          }
          if (p.cuenta) {
            algo = true;
            const X = Rel.leerConjunto(p.cuenta.X);
            const n = todas(X).filter((r) => {
              const pr = Rel.propiedades(r);
              return p.cuenta.que in pr ? pr[p.cuenta.que].ok : Rel.tipos(pr)[p.cuenta.que];
            }).length;
            if (n !== p.cuenta.n) error(donde, `dice ${p.cuenta.n}, pero hay ${n}`);
          }
          if (algo) revisados++;
          else omitidos.push(`${donde} (revisar a mano)`);
        } catch (e) { error(donde, e.message); }
      }
    }
  }
}
