// Tarea 4: Demostración directa.
// Cada paso: { f: fórmula, j: justificación, c: [líneas citadas], tipo: 'premisa' | 'supuesto' | 'negacion', sub: true }
// "c" la usa tools/verificar.mjs para comprobar con tablas de verdad que cada paso se sigue de las líneas citadas.
ESTUDIO.actividad({
  id: 'directa',
  titulo: 'Demostraciones directas',
  corto: 'Demostración directa',
  tipo: 'problemas',
  descripcion: 'Un problema al azar de la Tarea 4. Resuélvelo en papel y luego compara con la solución.',
  instrucciones: [
    'Demuestra de forma directa: escribe las premisas iniciales (el antecedente separado por sus ∧) y llega al consecuente usando reglas de inferencia y leyes de equivalencia. Nombra la regla de cada paso.',
    'Ojo: la demostración directa solo funciona con tautologías. Si no logras llegar a la conclusión, puede que la fórmula no sea tautología: en ese caso se refuta (en la tarea, con tabla de verdad; un contraejemplo basta).',
    'Las reglas de inferencia se aplican a líneas completas; las leyes de equivalencia se pueden aplicar a cualquier parte de una fórmula.',
  ],
  instruccionCorta: 'Demuestra de forma directa (o refuta si no es tautología).',
  problemas: [
    {
      id: 't4-1', enunciado: 'p → (q → p)',
      solucion: { tecnica: 'Directa', pasos: [
        { f: 'p', j: 'premisa inicial', tipo: 'premisa' },
        { f: 'p ∨ ¬q', j: 'Agregación (1)', c: [1] },
        { f: '¬q ∨ p', j: 'Conmutatividad (2)', c: [2] },
        { f: 'q → p', j: 'Implicación (3)', c: [3] },
      ], nota: 'Truco: para llegar a una implicación, piensa en su forma de disyunción (¬q ∨ p) y constrúyela con agregación.' },
    },
    {
      id: 't4-2', enunciado: '((a ∨ b) ∧ (b ∧ c)) ∧ a → b',
      solucion: { tecnica: 'Directa', pasos: [
        { f: '(a ∨ b) ∧ (b ∧ c)', j: 'premisa inicial', tipo: 'premisa' },
        { f: 'a', j: 'premisa inicial', tipo: 'premisa' },
        { f: 'b ∧ c', j: 'Simplificación (1)', c: [1] },
        { f: 'b', j: 'Simplificación (3)', c: [3] },
      ], nota: 'La premisa a no se usa, y está bien: no es obligatorio usar todas las premisas.' },
    },
    {
      id: 't4-3', enunciado: '(p ∨ q ∧ r) ∧ ¬p → (p ∨ q)',
      solucion: { tecnica: 'Directa', pasos: [
        { f: 'p ∨ (q ∧ r)', j: 'premisa inicial (por precedencia de operadores)', tipo: 'premisa' },
        { f: '¬p', j: 'premisa inicial', tipo: 'premisa' },
        { f: 'q ∧ r', j: 'Silogismo disyuntivo (1) y (2)', c: [1, 2] },
        { f: 'q', j: 'Simplificación (3)', c: [3] },
        { f: 'q ∨ p', j: 'Agregación (4)', c: [4] },
        { f: 'p ∨ q', j: 'Conmutatividad (5)', c: [5] },
      ] },
    },
    {
      id: 't4-4', enunciado: '(p → q) ∧ (q → r) ∧ ¬r → (¬q ∨ ¬p)',
      solucion: { tecnica: 'Directa', pasos: [
        { f: 'p → q', j: 'premisa inicial', tipo: 'premisa' },
        { f: 'q → r', j: 'premisa inicial', tipo: 'premisa' },
        { f: '¬r', j: 'premisa inicial', tipo: 'premisa' },
        { f: '¬q', j: 'Modus tollendo tollens (2) y (3)', c: [2, 3] },
        { f: '¬q ∨ ¬p', j: 'Agregación (4)', c: [4] },
      ] },
    },
    {
      id: 't4-5', enunciado: '¬(q → p) ∧ ¬p → ¬q',
      solucion: {
        tecnica: 'Refutar (no es tautología)',
        contraejemplo: { q: true, p: false },
        evaluacion: [
          'Con q = V y p = F:',
          '¬(V → F) ∧ ¬F → ¬V',
          '¬F ∧ V → F',
          'V ∧ V → F',
          'V → F',
          'F',
        ],
        nota: 'Pista para detectarlo: ¬(q → p) ≡ ¬(¬q ∨ p) ≡ q ∧ ¬p. Las premisas obligan a que q sea verdadera, pero la conclusión dice ¬q. Por eso no se puede demostrar: hay que refutar. En la Tarea 4 se refuta con tabla de verdad; la fila q = V, p = F es la que sale F.',
      },
    },
    {
      id: 't4-6', enunciado: '(p → q) ∧ ¬s ∧ (q → r) ∧ (s ∨ ¬r) → ¬p',
      solucion: { tecnica: 'Directa', pasos: [
        { f: 'p → q', j: 'premisa inicial', tipo: 'premisa' },
        { f: '¬s', j: 'premisa inicial', tipo: 'premisa' },
        { f: 'q → r', j: 'premisa inicial', tipo: 'premisa' },
        { f: 's ∨ ¬r', j: 'premisa inicial', tipo: 'premisa' },
        { f: '¬r', j: 'Silogismo disyuntivo (4) y (2)', c: [4, 2] },
        { f: '¬q', j: 'Modus tollendo tollens (3) y (5)', c: [3, 5] },
        { f: '¬p', j: 'Modus tollendo tollens (1) y (6)', c: [1, 6] },
      ], nota: 'Cadena de "tollens": cada negación que obtienes "regresa" por la implicación anterior.' },
    },
    {
      id: 't4-7', enunciado: '(a ∨ ¬c) ∧ (c ∨ ¬b) → (b → a)',
      solucion: { tecnica: 'Directa', pasos: [
        { f: 'a ∨ ¬c', j: 'premisa inicial', tipo: 'premisa' },
        { f: 'c ∨ ¬b', j: 'premisa inicial', tipo: 'premisa' },
        { f: '¬c ∨ a', j: 'Conmutatividad (1)', c: [1] },
        { f: 'c → a', j: 'Implicación (3)', c: [3] },
        { f: '¬b ∨ c', j: 'Conmutatividad (2)', c: [2] },
        { f: 'b → c', j: 'Implicación (5)', c: [5] },
        { f: 'b → a', j: 'Silogismo hipotético (6) y (4)', c: [6, 4] },
      ], nota: 'Convertir las disyunciones en implicaciones permite encadenarlas con silogismo hipotético.' },
    },
    {
      id: 't4-8', enunciado: '(b → d) ∧ (a ∨ c → b) → (¬d → ¬c)',
      solucion: { tecnica: 'Directa', pasos: [
        { f: 'b → d', j: 'premisa inicial', tipo: 'premisa' },
        { f: 'a ∨ c → b', j: 'premisa inicial', tipo: 'premisa' },
        { f: 'a ∨ c → d', j: 'Silogismo hipotético (2) y (1)', c: [2, 1] },
        { f: '¬(a ∨ c) ∨ d', j: 'Implicación (3)', c: [3] },
        { f: '(¬a ∧ ¬c) ∨ d', j: 'De Morgan (4)', c: [4] },
        { f: 'd ∨ (¬a ∧ ¬c)', j: 'Conmutatividad (5)', c: [5] },
        { f: '(d ∨ ¬a) ∧ (d ∨ ¬c)', j: 'Distributividad (6)', c: [6] },
        { f: 'd ∨ ¬c', j: 'Simplificación (7)', c: [7] },
        { f: '¬c ∨ d', j: 'Conmutatividad (8)', c: [8] },
        { f: 'c → d', j: 'Implicación (9)', c: [9] },
        { f: '¬d → ¬c', j: 'Contrapositiva (10)', c: [10] },
      ], nota: 'Se usa distributividad para poder separar con simplificación la parte que nos interesa (d ∨ ¬c).' },
    },
    {
      id: 't4-9', enunciado: '¬b ∧ (a → b) → (¬a ∨ b) ∧ ¬b',
      solucion: { tecnica: 'Directa', pasos: [
        { f: '¬b', j: 'premisa inicial', tipo: 'premisa' },
        { f: 'a → b', j: 'premisa inicial', tipo: 'premisa' },
        { f: '¬a ∨ b', j: 'Implicación (2)', c: [2] },
        { f: '(¬a ∨ b) ∧ ¬b', j: 'Conjunción (3) y (1)', c: [3, 1] },
      ] },
    },
    {
      id: 't4-10', enunciado: '¬e ∧ ((¬a ∧ ¬b) ∨ c) ∧ (c → e) → ¬a',
      solucion: { tecnica: 'Directa', pasos: [
        { f: '¬e', j: 'premisa inicial', tipo: 'premisa' },
        { f: '(¬a ∧ ¬b) ∨ c', j: 'premisa inicial', tipo: 'premisa' },
        { f: 'c → e', j: 'premisa inicial', tipo: 'premisa' },
        { f: '¬c', j: 'Modus tollendo tollens (3) y (1)', c: [3, 1] },
        { f: 'c ∨ (¬a ∧ ¬b)', j: 'Conmutatividad (2)', c: [2] },
        { f: '¬a ∧ ¬b', j: 'Silogismo disyuntivo (5) y (4)', c: [5, 4] },
        { f: '¬a', j: 'Simplificación (6)', c: [6] },
      ] },
    },
  ],
});
