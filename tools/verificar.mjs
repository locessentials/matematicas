// Verifica con tablas de verdad el contenido de una unidad de lógica.
// Uso: node tools/verificar.mjs logica
//  - Tarjetas de equivalencias/inferencia: cada línea debe ser una equivalencia o tautología válida.
//  - Problemas: la clasificación (demostrable vs. refutar) debe ser correcta, cada paso debe seguirse
//    de las líneas que cita, y la demostración debe terminar en el consecuente (o en F si es por contradicción).
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
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.js')).sort()) {
  vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), ctx, { filename: f });
}

// ---------- Parser ----------
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

// ---------- Verificación ----------
let errores = 0, revisados = 0;
const error = (donde, msg) => { errores++; console.log(`✗ ${donde}: ${msg}`); };

for (const act of actividades) {
  if (act.tipo === 'tarjetas') {
    for (const [k, t] of act.tarjetas.entries()) {
      if (!['Equivalencias', 'Inferencia'].includes(t.cat)) continue;
      for (const linea of t.formula.split('\n')) {
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
console.log(`\n${revisados} elementos revisados, ${errores} errores.`);
process.exit(errores ? 1 : 0);
