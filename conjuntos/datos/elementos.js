// Demostraciones con elementos: cadena de ⟺, doble contención, contradicción para = Ø, productos cartesianos
// y el estilo "por comprensión" de la Tarea 3.
// Cada paso: { op: '⟺' | '⇒' | '=', f, j }. { f, tipo: 'titulo' } separa las partes de una doble contención.
// tools/verificar.mjs revisa cada renglón contra el anterior y que las partes juntas demuestren la tesis.
// "hipotesis" son las suposiciones del enunciado ("Si A ⊆ B, …"); "tesis" es lo que se demuestra.
const PEDIDO_EL = 'Demuestra o refuta (con elementos):';
const CIERRE_REFUTA_EL = 'La afirmación no se cumple siempre: queda refutada.';

ESTUDIO.actividad({
  id: 'elementos',
  titulo: 'Demostraciones con elementos',
  corto: 'Elementos',
  tipo: 'problemas',
  descripcion:
    'Tomar un elemento cualquiera y seguirlo: cadenas de ⟺, doble contención, contradicción para demostrar que algo es Ø, ' +
    'y productos cartesianos con parejas (x, y). Es el tipo de demostración que más aparece en las lecturas y en las tareas.',
  instrucciones: [
    'Para A ⊆ B: empieza con "x ∈ A" (un elemento cualquiera) y llega a "x ∈ B".',
    'Para A = B: si todos los pasos van en los dos sentidos (definiciones y leyes de equivalencia), basta una cadena de ⟺. Si algún paso solo va hacia adelante (simplificación, agregación, usar una hipótesis), haz doble contención: A ⊆ B y B ⊆ A por separado.',
    'Para A = Ø: supón que hay un x ∈ A y llega a algo imposible (F).',
    'Traduce con las definiciones: ∩ es "y", ∪ es "o", ᶜ es "no" (∉), A \\ B es "x ∈ A y x ∉ B". Usa una ley de lógica y traduce de regreso.',
    'En un producto el elemento es una pareja: (x, y) ∈ A × B ⟺ x ∈ A y y ∈ B.',
    'Por comprensión (Tarea 3): escribe el conjunto como {x : …} y simplifica la afirmación de adentro con una ley de lógica.',
  ],
  instruccionCorta: 'Demuestra o refuta con elementos (⟺, ⇒, doble contención o contradicción).',
  problemas: [
    // ---------- Cadenas de ⟺ ----------
    {
      id: 'e1', origen: 'Tarea 2 #2', pedido: PEDIDO_EL, enunciado: 'A ∩ B = B ∩ A',
      pista: 'Traduce x ∈ A ∩ B a lógica, usa una ley de lógica y traduce de regreso.',
      solucion: { tecnica: 'Cadena de ⟺', pasos: [
        { f: 'x ∈ A ∩ B', j: 'sea x cualquier elemento' },
        { op: '⟺', f: 'x ∈ A y x ∈ B', j: 'Definición de intersección' },
        { op: '⟺', f: 'x ∈ B y x ∈ A', j: 'Conmutatividad de "y" (lógica)' },
        { op: '⟺', f: 'x ∈ B ∩ A', j: 'Definición de intersección' },
      ], nota: 'En la tarea se hizo con doble contención (y el regreso "de manera similar"). Como todos los pasos son ⟺, una cadena ya demuestra las dos contenciones.' },
    },
    {
      id: 'e2', origen: 'Tarea 2 #3', pedido: PEDIDO_EL, enunciado: '(A ∩ B) ∩ C = A ∩ (B ∩ C)',
      solucion: { tecnica: 'Cadena de ⟺', pasos: [
        { f: 'x ∈ (A ∩ B) ∩ C', j: 'sea x cualquier elemento' },
        { op: '⟺', f: 'x ∈ A ∩ B y x ∈ C', j: 'Definición de intersección' },
        { op: '⟺', f: '(x ∈ A y x ∈ B) y x ∈ C', j: 'Definición de intersección' },
        { op: '⟺', f: 'x ∈ A y (x ∈ B y x ∈ C)', j: 'Asociatividad de "y" (lógica)' },
        { op: '⟺', f: 'x ∈ A y x ∈ B ∩ C', j: 'Definición de intersección' },
        { op: '⟺', f: 'x ∈ A ∩ (B ∩ C)', j: 'Definición de intersección' },
      ] },
    },
    {
      id: 'e3', origen: 'Teorema 3', pedido: PEDIDO_EL, enunciado: '(Aᶜ)ᶜ = A',
      solucion: { tecnica: 'Cadena de ⟺', pasos: [
        { f: 'x ∈ (Aᶜ)ᶜ', j: 'sea x cualquier elemento' },
        { op: '⟺', f: 'x ∉ Aᶜ', j: 'Definición de complemento' },
        { op: '⟺', f: '¬(x ∉ A)', j: 'Definición de complemento' },
        { op: '⟺', f: 'x ∈ A', j: 'Doble negación (lógica)' },
      ] },
    },
    {
      id: 'e4', pedido: PEDIDO_EL, enunciado: 'A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)',
      pista: 'Después de traducir te queda "p y (q o r)". ¿Qué ley de lógica reparte el "y"?',
      solucion: { tecnica: 'Cadena de ⟺', pasos: [
        { f: 'x ∈ A ∩ (B ∪ C)', j: 'sea x cualquier elemento' },
        { op: '⟺', f: 'x ∈ A y x ∈ B ∪ C', j: 'Definición de intersección' },
        { op: '⟺', f: 'x ∈ A y (x ∈ B o x ∈ C)', j: 'Definición de unión' },
        { op: '⟺', f: '(x ∈ A y x ∈ B) o (x ∈ A y x ∈ C)', j: 'Distributividad (lógica)' },
        { op: '⟺', f: 'x ∈ A ∩ B o x ∈ A ∩ C', j: 'Definición de intersección' },
        { op: '⟺', f: 'x ∈ (A ∩ B) ∪ (A ∩ C)', j: 'Definición de unión' },
      ] },
    },
    {
      id: 'e5', origen: 'Teorema 10', pedido: PEDIDO_EL, enunciado: 'A \\ B = A ∩ Bᶜ',
      solucion: { tecnica: 'Cadena de ⟺', pasos: [
        { f: 'x ∈ A \\ B', j: 'sea x cualquier elemento' },
        { op: '⟺', f: 'x ∈ A y x ∉ B', j: 'Definición de diferencia' },
        { op: '⟺', f: 'x ∈ A y x ∈ Bᶜ', j: 'Definición de complemento' },
        { op: '⟺', f: 'x ∈ A ∩ Bᶜ', j: 'Definición de intersección' },
      ], nota: 'Esta es la ley "diferencia como intersección" que se usa en casi todos los ejercicios de álgebra.' },
    },

    // ---------- Doble contención ----------
    {
      id: 'e6', origen: 'Tarea 2 #6 (Teorema 9 ii)', pedido: PEDIDO_EL, enunciado: 'A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C)',
      pista: 'Doble contención. En la primera, x ∈ A ∪ (B ∩ C) da "p o (q y r)": reparte el "o".',
      solucion: { tecnica: 'Doble contención', pasos: [
        { f: '(⊆) Primera contención', tipo: 'titulo' },
        { f: 'x ∈ A ∪ (B ∩ C)', j: 'sea x cualquier elemento del lado izquierdo' },
        { op: '⇒', f: 'x ∈ A o x ∈ B ∩ C', j: 'Definición de unión' },
        { op: '⇒', f: 'x ∈ A o (x ∈ B y x ∈ C)', j: 'Definición de intersección' },
        { op: '⇒', f: '(x ∈ A o x ∈ B) y (x ∈ A o x ∈ C)', j: 'Distributividad (lógica)' },
        { op: '⇒', f: 'x ∈ A ∪ B y x ∈ A ∪ C', j: 'Definición de unión' },
        { op: '⇒', f: 'x ∈ (A ∪ B) ∩ (A ∪ C)', j: 'Definición de intersección' },
        { f: '(⊇) Segunda contención', tipo: 'titulo' },
        { f: 'x ∈ (A ∪ B) ∩ (A ∪ C)', j: 'sea x cualquier elemento del lado derecho' },
        { op: '⇒', f: 'x ∈ A ∪ B y x ∈ A ∪ C', j: 'Definición de intersección' },
        { op: '⇒', f: '(x ∈ A o x ∈ B) y (x ∈ A o x ∈ C)', j: 'Definición de unión' },
        { op: '⇒', f: 'x ∈ A o (x ∈ B y x ∈ C)', j: 'Distributividad (lógica)' },
        { op: '⇒', f: 'x ∈ A o x ∈ B ∩ C', j: 'Definición de intersección' },
        { op: '⇒', f: 'x ∈ A ∪ (B ∩ C)', j: 'Definición de unión' },
      ], cierre: 'Se cumplen las dos contenciones, así que los conjuntos son iguales. c.q.d.',
      nota: 'Así lo hizo el profesor. Como cada paso en realidad va en los dos sentidos, también se puede escribir como una sola cadena de ⟺.' },
    },
    {
      id: 'e7', origen: 'Tarea 2 #8 (Teorema 11 ii)', pedido: PEDIDO_EL, enunciado: '(A ∪ B)ᶜ = Aᶜ ∩ Bᶜ',
      pista: 'x ∈ (A ∪ B)ᶜ es "no (p o q)". ¿Qué ley de lógica mete la negación?',
      solucion: { tecnica: 'Doble contención', pasos: [
        { f: '(⊆) Primera contención', tipo: 'titulo' },
        { f: 'x ∈ (A ∪ B)ᶜ', j: 'sea x cualquier elemento del lado izquierdo' },
        { op: '⇒', f: 'x ∉ A ∪ B', j: 'Definición de complemento' },
        { op: '⇒', f: '¬(x ∈ A o x ∈ B)', j: 'Definición de unión' },
        { op: '⇒', f: 'x ∉ A y x ∉ B', j: 'De Morgan (lógica)' },
        { op: '⇒', f: 'x ∈ Aᶜ y x ∈ Bᶜ', j: 'Definición de complemento' },
        { op: '⇒', f: 'x ∈ Aᶜ ∩ Bᶜ', j: 'Definición de intersección' },
        { f: '(⊇) Segunda contención', tipo: 'titulo' },
        { f: 'x ∈ Aᶜ ∩ Bᶜ', j: 'sea x cualquier elemento del lado derecho' },
        { op: '⇒', f: 'x ∈ Aᶜ y x ∈ Bᶜ', j: 'Definición de intersección' },
        { op: '⇒', f: 'x ∉ A y x ∉ B', j: 'Definición de complemento' },
        { op: '⇒', f: '¬(x ∈ A o x ∈ B)', j: 'De Morgan (lógica)' },
        { op: '⇒', f: 'x ∉ A ∪ B', j: 'Definición de unión' },
        { op: '⇒', f: 'x ∈ (A ∪ B)ᶜ', j: 'Definición de complemento' },
      ], cierre: 'Se cumplen las dos contenciones: (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ. c.q.d.' },
    },
    {
      id: 'e8', origen: 'Tarea 2 #7 (Teorema 10 ii)', pedido: PEDIDO_EL, enunciado: '(A ∪ B) ∩ B = B',
      pista: 'Aquí sí hay pasos de un solo sentido: simplificación en una contención y agregación en la otra.',
      solucion: { tecnica: 'Doble contención', pasos: [
        { f: '(⊆) Primera contención', tipo: 'titulo' },
        { f: 'x ∈ (A ∪ B) ∩ B', j: 'sea x cualquier elemento del lado izquierdo' },
        { op: '⟺', f: 'x ∈ A ∪ B y x ∈ B', j: 'Definición de intersección' },
        { op: '⇒', f: 'x ∈ B', j: 'Simplificación' },
        { f: '(⊇) Segunda contención', tipo: 'titulo' },
        { f: 'x ∈ B', j: 'sea x cualquier elemento de B' },
        { op: '⇒', f: 'x ∈ A ∪ B y x ∈ B', j: 'Agregación (x ∈ B ⇒ x ∈ A ∪ B), y seguimos teniendo x ∈ B' },
        { op: '⟺', f: 'x ∈ (A ∪ B) ∩ B', j: 'Definición de intersección' },
      ], cierre: 'Se cumplen las dos contenciones: (A ∪ B) ∩ B = B. c.q.d.',
      nota: 'En la tarea se usó el Teorema 6 (si B ⊆ A ∪ B, entonces B ∩ (A ∪ B) = B) y conmutatividad; también es válido si ya está demostrado.' },
    },
    {
      id: 'e9', origen: 'Teorema 6', pedido: PEDIDO_EL, enunciado: 'Si A ⊆ B, entonces A ∩ B = A',
      hipotesis: ['A ⊆ B'], tesis: 'A ∩ B = A',
      pista: 'Doble contención. La hipótesis A ⊆ B se usa en una sola de las dos: ¿en cuál necesitas pasar de x ∈ A a x ∈ B?',
      solucion: { tecnica: 'Doble contención con hipótesis', pasos: [
        { f: '(⊆) Primera contención', tipo: 'titulo' },
        { f: 'x ∈ A ∩ B', j: 'sea x cualquier elemento de A ∩ B' },
        { op: '⟺', f: 'x ∈ A y x ∈ B', j: 'Definición de intersección' },
        { op: '⇒', f: 'x ∈ A', j: 'Simplificación' },
        { f: '(⊇) Segunda contención', tipo: 'titulo' },
        { f: 'x ∈ A', j: 'sea x cualquier elemento de A' },
        { op: '⇒', f: 'x ∈ A y x ∈ B', j: 'Hipótesis A ⊆ B: como x ∈ A, x ∈ B' },
        { op: '⟺', f: 'x ∈ A ∩ B', j: 'Definición de intersección' },
      ], cierre: 'Se cumplen las dos contenciones: A ∩ B = A. c.q.d.' },
    },
    {
      id: 'e10', pedido: PEDIDO_EL, enunciado: 'Si A ⊆ B, entonces A ∪ B = B',
      hipotesis: ['A ⊆ B'], tesis: 'A ∪ B = B',
      solucion: { tecnica: 'Doble contención con hipótesis', pasos: [
        { f: '(⊆) Primera contención', tipo: 'titulo' },
        { f: 'x ∈ A ∪ B', j: 'sea x cualquier elemento de A ∪ B' },
        { op: '⟺', f: 'x ∈ A o x ∈ B', j: 'Definición de unión' },
        { op: '⇒', f: 'x ∈ B', j: 'Si x ∈ A, por la hipótesis A ⊆ B, x ∈ B; si x ∈ B, ya está' },
        { f: '(⊇) Segunda contención', tipo: 'titulo' },
        { f: 'x ∈ B', j: 'sea x cualquier elemento de B' },
        { op: '⇒', f: 'x ∈ A o x ∈ B', j: 'Agregación' },
        { op: '⟺', f: 'x ∈ A ∪ B', j: 'Definición de unión' },
      ], cierre: 'Se cumplen las dos contenciones: A ∪ B = B. c.q.d.' },
    },

    // ---------- Contención con ⇒ ----------
    {
      id: 'e11', pedido: PEDIDO_EL, enunciado: 'A ∩ B ⊆ A ∪ B',
      solucion: { tecnica: 'Elemento arbitrario (⇒)', pasos: [
        { f: 'x ∈ A ∩ B', j: 'sea x cualquier elemento de A ∩ B' },
        { op: '⟺', f: 'x ∈ A y x ∈ B', j: 'Definición de intersección' },
        { op: '⇒', f: 'x ∈ A', j: 'Simplificación' },
        { op: '⇒', f: 'x ∈ A o x ∈ B', j: 'Agregación' },
        { op: '⟺', f: 'x ∈ A ∪ B', j: 'Definición de unión' },
      ], cierre: 'Todo elemento de A ∩ B está en A ∪ B. c.q.d.',
      nota: 'Como hay pasos con ⇒, la cadena solo demuestra ⊆, que es justo lo que se pide.' },
    },
    {
      id: 'e12', origen: 'Tarea 5 #2', pedido: PEDIDO_EL, enunciado: 'Si A ⊆ B, entonces Bᶜ ⊆ Aᶜ',
      hipotesis: ['A ⊆ B'], tesis: 'Bᶜ ⊆ Aᶜ',
      pista: 'Toma x ∈ Bᶜ. Si x estuviera en A, ¿dónde más estaría?',
      solucion: { tecnica: 'Elemento arbitrario (⇒)', pasos: [
        { f: 'x ∈ Bᶜ', j: 'sea x cualquier elemento de Bᶜ' },
        { op: '⟺', f: 'x ∉ B', j: 'Definición de complemento' },
        { op: '⇒', f: 'x ∉ A', j: 'Hipótesis A ⊆ B: si x estuviera en A, estaría en B (contrapositiva)' },
        { op: '⟺', f: 'x ∈ Aᶜ', j: 'Definición de complemento' },
      ], cierre: 'Todo elemento de Bᶜ está en Aᶜ: Bᶜ ⊆ Aᶜ. c.q.d.' },
    },
    {
      id: 'e13', origen: 'Tarea 5 #2', pedido: PEDIDO_EL, enunciado: 'Si A ⊆ B, entonces Aᶜ ⊆ Bᶜ', tesis: 'A ⊆ B ⇒ Aᶜ ⊆ Bᶜ',
      pista: 'Haz el diagrama con A dentro de B. ¿Hay algo fuera de A que esté dentro de B?',
      solucion: { tecnica: 'Contraejemplo', contraejemplo: { U: '{1, 2}', A: '{1}', B: '{1, 2}' },
        evaluacion: ['A = {1} ⊆ {1, 2} = B: se cumple la hipótesis', 'Aᶜ = {2} y Bᶜ = Ø', '2 ∈ Aᶜ pero 2 ∉ Bᶜ, así que Aᶜ ⊈ Bᶜ'], cierre: CIERRE_REFUTA_EL,
        nota: 'Lo que sí se cumple es al revés: Bᶜ ⊆ Aᶜ (la contrapositiva).' },
    },

    // ---------- Contradicción para = Ø ----------
    {
      id: 'e14', origen: 'Tarea 2 #1 (Teorema 5)', pedido: PEDIDO_EL, enunciado: 'Uᶜ = Ø',
      pista: 'Supón que Uᶜ tiene un elemento x y traduce qué significa.',
      solucion: { tecnica: 'Contradicción (para = Ø)', pasos: [
        { f: 'x ∈ Uᶜ', j: 'supongamos que Uᶜ tiene algún elemento x' },
        { op: '⟺', f: 'x ∉ U', j: 'Definición de complemento' },
        { op: '⟺', f: 'F', j: 'Todo objeto está en U, así que "x ∉ U" es imposible' },
      ], cierre: 'Ningún x puede estar en Uᶜ, así que Uᶜ = Ø. c.q.d.',
      nota: 'En la tarea se dijo también que Ø ⊆ Uᶜ (el vacío está en todo). Juntando las dos contenciones, Uᶜ = Ø.' },
    },
    {
      id: 'e15', origen: 'Tarea 5 #6', pedido: 'Demuestra que A \\ B y B \\ A son ajenos, es decir:', enunciado: '(A \\ B) ∩ (B \\ A) = Ø',
      pista: 'Supón que hay un x en la intersección y traduce todo: vas a encontrar algo y su negación.',
      solucion: { tecnica: 'Contradicción (para = Ø)', pasos: [
        { f: 'x ∈ (A \\ B) ∩ (B \\ A)', j: 'supongamos que hay un x en la intersección' },
        { op: '⟺', f: 'x ∈ A \\ B y x ∈ B \\ A', j: 'Definición de intersección' },
        { op: '⟺', f: '(x ∈ A y x ∉ B) y (x ∈ B y x ∉ A)', j: 'Definición de diferencia' },
        { op: '⟺', f: '(x ∈ A y x ∉ A) y (x ∉ B y x ∈ B)', j: 'Conmutatividad y asociatividad' },
        { op: '⟺', f: 'F', j: 'Complemento (p ∧ ¬p ≡ F) y dominación' },
      ], cierre: 'No existe tal x: (A \\ B) ∩ (B \\ A) = Ø, y los conjuntos son ajenos. c.q.d.' },
    },

    // ---------- Por comprensión (Tarea 3) ----------
    {
      id: 'e16', origen: 'Tarea 3 #1 i', pedido: 'Demuestra por comprensión (con la definición):', enunciado: 'A ∩ Ø = Ø',
      pista: 'Escribe A ∩ Ø como {x : … } y fíjate qué valor tiene "x ∈ Ø".',
      solucion: { tecnica: 'Por comprensión', pasos: [
        { f: 'A ∩ Ø', j: '' },
        { op: '=', f: '{x : x ∈ A y x ∈ Ø}', j: 'Definición de intersección' },
        { op: '=', f: '{x : x ∈ A y F}', j: 'Definición de vacío: "x ∈ Ø" siempre es F' },
        { op: '=', f: '{x : F}', j: 'Dominación (lógica): p ∧ F ≡ F' },
        { op: '=', f: 'Ø', j: 'Definición de vacío' },
      ], cierre: 'Q.E.D.' },
    },
    {
      id: 'e17', origen: 'Tarea 3 #1 ii', pedido: 'Demuestra por comprensión (con la definición):', enunciado: 'A ∩ U = A',
      solucion: { tecnica: 'Por comprensión', pasos: [
        { f: 'A ∩ U', j: '' },
        { op: '=', f: '{x : x ∈ A y x ∈ U}', j: 'Definición de intersección' },
        { op: '=', f: '{x : x ∈ A y V}', j: 'Definición de universo: "x ∈ U" siempre es V' },
        { op: '=', f: '{x : x ∈ A}', j: 'Identidad (lógica): p ∧ V ≡ p' },
        { op: '=', f: 'A', j: '' },
      ], cierre: 'Q.E.D.' },
    },
    {
      id: 'e18', origen: 'Tarea 3 #2 ii', pedido: 'Demuestra por comprensión (con la definición):', enunciado: 'A ∪ U = U',
      solucion: { tecnica: 'Por comprensión', pasos: [
        { f: 'A ∪ U', j: '' },
        { op: '=', f: '{x : x ∈ A o x ∈ U}', j: 'Definición de unión' },
        { op: '=', f: '{x : x ∈ A o V}', j: 'Definición de universo' },
        { op: '=', f: '{x : V}', j: 'Dominación (lógica): p ∨ V ≡ V' },
        { op: '=', f: 'U', j: 'Definición de universo' },
      ], cierre: 'Q.E.D.' },
    },
    {
      id: 'e19', origen: 'Tarea 3 #2 iii', pedido: 'Demuestra por comprensión (con la definición):', enunciado: 'A ∪ Aᶜ = U',
      solucion: { tecnica: 'Por comprensión', pasos: [
        { f: 'A ∪ Aᶜ', j: '' },
        { op: '=', f: '{x : x ∈ A o x ∈ Aᶜ}', j: 'Definición de unión' },
        { op: '=', f: '{x : x ∈ A o ¬(x ∈ A)}', j: 'Definición de complemento' },
        { op: '=', f: '{x : V}', j: 'Complemento (lógica): p ∨ ¬p ≡ V' },
        { op: '=', f: 'U', j: 'Definición de universo' },
      ], cierre: 'Q.E.D.' },
    },

    // ---------- Relaciones entre conjuntos ----------
    {
      id: 'e20', origen: 'Tarea 5 #1 ii', pedido: 'Demuestra que la igualdad de conjuntos es simétrica:', enunciado: 'Si A = B, entonces B = A',
      tesis: 'A = B ⇒ B = A',
      solucion: { tecnica: 'Definición de igualdad', pasos: [
        { f: 'A = B', j: 'hipótesis' },
        { op: '⟺', f: 'A ⊆ B y B ⊆ A', j: 'Definición de igualdad' },
        { op: '⟺', f: 'B ⊆ A y A ⊆ B', j: 'Conmutatividad de "y"' },
        { op: '⟺', f: 'B = A', j: 'Definición de igualdad' },
      ], nota: 'Reflexiva (Tarea 5 #1 i): A ⊆ A porque todo elemento de A está en A; con A ⊆ A dos veces, A = A.' },
    },
    {
      id: 'e21', origen: 'Tarea 5 #1 iii', pedido: 'Demuestra que la igualdad de conjuntos es transitiva:', enunciado: 'Si A = B y B = C, entonces A = C',
      tesis: 'A = B y B = C ⇒ A = C',
      pista: 'Convierte cada igualdad en dos contenciones y usa la transitiva de ⊆ (o un elemento x ∈ A que pase por B).',
      solucion: { tecnica: 'Definición de igualdad', pasos: [
        { f: 'A = B y B = C', j: 'hipótesis' },
        { op: '⟺', f: '(A ⊆ B y B ⊆ A) y (B ⊆ C y C ⊆ B)', j: 'Definición de igualdad' },
        { op: '⇒', f: 'A ⊆ C y C ⊆ A', j: 'Transitiva de ⊆: A ⊆ B ⊆ C y C ⊆ B ⊆ A' },
        { op: '⟺', f: 'A = C', j: 'Definición de igualdad' },
      ], nota: 'En la tarea se demostró A ⊆ C con un elemento: sea x ∈ A; como A ⊆ B, x ∈ B; como B ⊆ C, x ∈ C. Y lo mismo para C ⊆ A.' },
    },

    // ---------- Producto cartesiano ----------
    {
      id: 'e22', origen: 'Tarea 4 · Teorema 15 ii', pedido: PEDIDO_EL, enunciado: 'A × (B ∪ C) = (A × B) ∪ (A × C)',
      pista: 'El elemento es una pareja (x, y). Traduce el producto y luego la unión; queda "p y (q o r)".',
      solucion: { tecnica: 'Cadena de ⟺ con parejas', pasos: [
        { f: '(x, y) ∈ A × (B ∪ C)', j: 'sea (x, y) cualquier pareja' },
        { op: '⟺', f: 'x ∈ A y y ∈ B ∪ C', j: 'Definición de producto cartesiano' },
        { op: '⟺', f: 'x ∈ A y (y ∈ B o y ∈ C)', j: 'Definición de unión' },
        { op: '⟺', f: '(x ∈ A y y ∈ B) o (x ∈ A y y ∈ C)', j: 'Distributividad (lógica)' },
        { op: '⟺', f: '(x, y) ∈ A × B o (x, y) ∈ A × C', j: 'Definición de producto cartesiano' },
        { op: '⟺', f: '(x, y) ∈ (A × B) ∪ (A × C)', j: 'Definición de unión' },
      ] },
    },
    {
      id: 'e23', origen: 'Tarea 4 · Teorema 15 iii', pedido: PEDIDO_EL, enunciado: 'A × (B \\ C) = (A × B) \\ (A × C)',
      pista: 'Empieza por el lado derecho. Después de De Morgan y distributividad aparece "x ∈ A y x ∉ A", que es F.',
      solucion: { tecnica: 'Cadena de ⟺ con parejas', pasos: [
        { f: '(x, y) ∈ (A × B) \\ (A × C)', j: 'sea (x, y) cualquier pareja' },
        { op: '⟺', f: '(x, y) ∈ A × B y (x, y) ∉ A × C', j: 'Definición de diferencia' },
        { op: '⟺', f: '(x ∈ A y y ∈ B) y ¬(x ∈ A y y ∈ C)', j: 'Definición de producto cartesiano' },
        { op: '⟺', f: '(x ∈ A y y ∈ B) y (x ∉ A o y ∉ C)', j: 'De Morgan (lógica)' },
        { op: '⟺', f: '((x ∈ A y y ∈ B) y x ∉ A) o ((x ∈ A y y ∈ B) y y ∉ C)', j: 'Distributividad (lógica)' },
        { op: '⟺', f: 'F o ((x ∈ A y y ∈ B) y y ∉ C)', j: 'Complemento: x ∈ A y x ∉ A es F (y dominación)' },
        { op: '⟺', f: '(x ∈ A y y ∈ B) y y ∉ C', j: 'Identidad (lógica): F ∨ p ≡ p' },
        { op: '⟺', f: 'x ∈ A y (y ∈ B y y ∉ C)', j: 'Asociatividad' },
        { op: '⟺', f: 'x ∈ A y y ∈ B \\ C', j: 'Definición de diferencia' },
        { op: '⟺', f: '(x, y) ∈ A × (B \\ C)', j: 'Definición de producto cartesiano' },
      ], nota: 'Es la misma idea de la tarea, pero en la tarea el "x ∉ A" se metió desde el principio; aquí aparece solo, al aplicar De Morgan.' },
    },
    {
      id: 'e24', origen: 'Tarea 4 · Teorema 16 i', pedido: PEDIDO_EL, enunciado: '(A × B) ∩ (C × D) = (A ∩ C) × (B ∩ D)',
      solucion: { tecnica: 'Cadena de ⟺ con parejas', pasos: [
        { f: '(x, y) ∈ (A × B) ∩ (C × D)', j: 'sea (x, y) cualquier pareja' },
        { op: '⟺', f: '(x, y) ∈ A × B y (x, y) ∈ C × D', j: 'Definición de intersección' },
        { op: '⟺', f: '(x ∈ A y y ∈ B) y (x ∈ C y y ∈ D)', j: 'Definición de producto cartesiano' },
        { op: '⟺', f: '(x ∈ A y x ∈ C) y (y ∈ B y y ∈ D)', j: 'Conmutatividad y asociatividad' },
        { op: '⟺', f: 'x ∈ A ∩ C y y ∈ B ∩ D', j: 'Definición de intersección' },
        { op: '⟺', f: '(x, y) ∈ (A ∩ C) × (B ∩ D)', j: 'Definición de producto cartesiano' },
      ] },
    },
    {
      id: 'e25', origen: 'Tarea 4 · Teorema 16 ii', pedido: PEDIDO_EL, enunciado: '(A × B) ∪ (C × D) ⊆ (A ∪ C) × (B ∪ D)',
      pista: 'Hay un paso que solo va hacia adelante (agregación en cada caso). Por eso solo sale ⊆.',
      solucion: { tecnica: 'Elemento arbitrario (⇒) con parejas', pasos: [
        { f: '(x, y) ∈ (A × B) ∪ (C × D)', j: 'sea (x, y) cualquier pareja del lado izquierdo' },
        { op: '⟺', f: '(x, y) ∈ A × B o (x, y) ∈ C × D', j: 'Definición de unión' },
        { op: '⟺', f: '(x ∈ A y y ∈ B) o (x ∈ C y y ∈ D)', j: 'Definición de producto cartesiano' },
        { op: '⇒', f: '(x ∈ A o x ∈ C) y (y ∈ B o y ∈ D)', j: 'Agregación en cada caso' },
        { op: '⟺', f: 'x ∈ A ∪ C y y ∈ B ∪ D', j: 'Definición de unión' },
        { op: '⟺', f: '(x, y) ∈ (A ∪ C) × (B ∪ D)', j: 'Definición de producto cartesiano' },
      ], cierre: 'Toda pareja del lado izquierdo está en el derecho. c.q.d.',
      nota: 'El regreso no se cumple: con A = {1}, B = {r}, C = {2}, D = {s}, la pareja (1, s) está a la derecha pero no a la izquierda.' },
    },
    {
      id: 'e26', origen: 'Tarea 4 · Teorema 16 iii', pedido: PEDIDO_EL, enunciado: '(X × Y) \\ (A × B) = ((X \\ A) × Y) ∪ (X × (Y \\ B))',
      pista: 'Una pareja no está en A × B si su primer elemento no está en A o su segundo no está en B (De Morgan).',
      solucion: { tecnica: 'Cadena de ⟺ con parejas', pasos: [
        { f: '(x, y) ∈ (X × Y) \\ (A × B)', j: 'sea (x, y) cualquier pareja' },
        { op: '⟺', f: '(x, y) ∈ X × Y y (x, y) ∉ A × B', j: 'Definición de diferencia' },
        { op: '⟺', f: '(x ∈ X y y ∈ Y) y ¬(x ∈ A y y ∈ B)', j: 'Definición de producto cartesiano' },
        { op: '⟺', f: '(x ∈ X y y ∈ Y) y (x ∉ A o y ∉ B)', j: 'De Morgan (lógica)' },
        { op: '⟺', f: '((x ∈ X y y ∈ Y) y x ∉ A) o ((x ∈ X y y ∈ Y) y y ∉ B)', j: 'Distributividad (lógica)' },
        { op: '⟺', f: '((x ∈ X y x ∉ A) y y ∈ Y) o (x ∈ X y (y ∈ Y y y ∉ B))', j: 'Conmutatividad y asociatividad' },
        { op: '⟺', f: '(x ∈ X \\ A y y ∈ Y) o (x ∈ X y y ∈ Y \\ B)', j: 'Definición de diferencia' },
        { op: '⟺', f: '(x, y) ∈ (X \\ A) × Y o (x, y) ∈ X × (Y \\ B)', j: 'Definición de producto cartesiano' },
        { op: '⟺', f: '(x, y) ∈ ((X \\ A) × Y) ∪ (X × (Y \\ B))', j: 'Definición de unión' },
      ] },
    },
    {
      id: 'e27', origen: 'Teorema 14', pedido: PEDIDO_EL, enunciado: 'Si A ⊆ X y B ⊆ Y, entonces A × B ⊆ X × Y',
      hipotesis: ['A ⊆ X', 'B ⊆ Y'], tesis: 'A × B ⊆ X × Y',
      solucion: { tecnica: 'Elemento arbitrario (⇒) con parejas', pasos: [
        { f: '(x, y) ∈ A × B', j: 'sea (x, y) cualquier pareja de A × B' },
        { op: '⟺', f: 'x ∈ A y y ∈ B', j: 'Definición de producto cartesiano' },
        { op: '⇒', f: 'x ∈ X y y ∈ Y', j: 'Hipótesis: A ⊆ X y B ⊆ Y' },
        { op: '⟺', f: '(x, y) ∈ X × Y', j: 'Definición de producto cartesiano' },
      ], cierre: 'Toda pareja de A × B está en X × Y. c.q.d.' },
    },
    {
      id: 'e28', origen: 'Tarea 5 #15', pedido: 'Demuestra:', enunciado: 'Si A × B ≠ Ø, entonces\nA × B ⊆ C × D ⟺ A ⊆ C y B ⊆ D',
      verificar: false,
      pista: [
        'Dos direcciones. En (⇒), para A ⊆ C toma x ∈ A y fórmale una pareja (x, b) con algún b ∈ B.',
        '¿Por qué existe ese b? Porque A × B ≠ Ø.',
      ],
      solucion: { tecnica: 'Dos direcciones (caracterización)', pasos: [
        { f: '(⇒) Supón A × B ⊆ C × D', tipo: 'titulo' },
        { f: 'existe (a, b) ∈ A × B', j: 'porque A × B ≠ Ø' },
        { op: '⇒', f: 'a ∈ A y b ∈ B', j: 'Definición de producto cartesiano' },
        { f: 'sea x ∈ A', j: 'para demostrar A ⊆ C' },
        { op: '⇒', f: '(x, b) ∈ A × B', j: 'x ∈ A y b ∈ B' },
        { op: '⇒', f: '(x, b) ∈ C × D', j: 'Hipótesis A × B ⊆ C × D' },
        { op: '⇒', f: 'x ∈ C', j: 'Definición de producto cartesiano. Así A ⊆ C' },
        { f: 'sea y ∈ B', j: 'para demostrar B ⊆ D' },
        { op: '⇒', f: '(a, y) ∈ A × B', j: 'a ∈ A y y ∈ B' },
        { op: '⇒', f: '(a, y) ∈ C × D', j: 'Hipótesis A × B ⊆ C × D' },
        { op: '⇒', f: 'y ∈ D', j: 'Definición de producto cartesiano. Así B ⊆ D' },
        { f: '(⇐) Supón A ⊆ C y B ⊆ D', tipo: 'titulo' },
        { f: '(x, y) ∈ A × B', j: 'sea (x, y) cualquier pareja de A × B' },
        { op: '⟺', f: 'x ∈ A y y ∈ B', j: 'Definición de producto cartesiano' },
        { op: '⇒', f: 'x ∈ C y y ∈ D', j: 'Hipótesis A ⊆ C y B ⊆ D' },
        { op: '⟺', f: '(x, y) ∈ C × D', j: 'Definición de producto cartesiano. Así A × B ⊆ C × D' },
      ], cierre: 'Se demostraron las dos direcciones. c.q.d.',
      nota: 'La condición A × B ≠ Ø solo se usa en (⇒). Sin ella falla: si B = Ø, entonces A × B = Ø ⊆ C × D aunque A no esté contenido en C.' },
    },
    {
      id: 'e29', origen: 'Teorema 13', pedido: 'Demuestra:', enunciado: 'A × B = Ø ⟺ A = Ø o B = Ø',
      verificar: false,
      pista: 'Es más fácil demostrar la forma equivalente: A × B ≠ Ø ⟺ A ≠ Ø y B ≠ Ø.',
      solucion: { tecnica: 'Forma equivalente + dos direcciones', pasos: [
        { f: 'Forma equivalente', tipo: 'titulo' },
        { f: 'A × B ≠ Ø ⟺ A ≠ Ø y B ≠ Ø', j: 'Contrapositiva de cada dirección y De Morgan' },
        { f: '(⇒)', tipo: 'titulo' },
        { f: 'A × B ≠ Ø', j: 'hipótesis' },
        { op: '⇒', f: 'existe (a, b) ∈ A × B', j: 'si no es vacío, tiene algún elemento' },
        { op: '⇒', f: 'a ∈ A y b ∈ B', j: 'Definición de producto cartesiano' },
        { op: '⇒', f: 'A ≠ Ø y B ≠ Ø', j: 'cada uno tiene al menos un elemento' },
        { f: '(⇐)', tipo: 'titulo' },
        { f: 'A ≠ Ø y B ≠ Ø', j: 'hipótesis' },
        { op: '⇒', f: 'existen a ∈ A y b ∈ B', j: 'no son vacíos' },
        { op: '⇒', f: '(a, b) ∈ A × B', j: 'Definición de producto cartesiano' },
        { op: '⇒', f: 'A × B ≠ Ø', j: 'tiene al menos una pareja' },
      ], cierre: 'Las dos formas dicen lo mismo, así que A × B = Ø ⟺ A = Ø o B = Ø. c.q.d.' },
    },

    // ---------- Para refutar ----------
    {
      id: 'e30', pedido: PEDIDO_EL, enunciado: 'A × B = B × A',
      solucion: { tecnica: 'Contraejemplo', contraejemplo: { A: '{1}', B: '{2}' },
        evaluacion: ['A × B = {(1, 2)}', 'B × A = {(2, 1)}', '(1, 2) ≠ (2, 1), así que A × B ≠ B × A'], cierre: CIERRE_REFUTA_EL,
        nota: 'Solo es cierto cuando A = B, A = Ø o B = Ø.' },
    },
    {
      id: 'e31', pedido: PEDIDO_EL, enunciado: '(A × B) ∪ (C × D) = (A ∪ C) × (B ∪ D)',
      pista: 'Una contención sí se cumple (Teorema 16 ii). Busca una pareja que esté en el lado derecho y no en el izquierdo.',
      solucion: { tecnica: 'Contraejemplo', contraejemplo: { A: '{1}', B: '{r}', C: '{2}', D: '{s}' },
        evaluacion: ['(A × B) ∪ (C × D) = {(1, r), (2, s)}', '(A ∪ C) × (B ∪ D) = {1, 2} × {r, s} = {(1, r), (1, s), (2, r), (2, s)}', '(1, s) está a la derecha pero no a la izquierda'],
        cierre: CIERRE_REFUTA_EL },
    },
    {
      id: 'e32', pedido: PEDIDO_EL, enunciado: 'Si A ∩ B = A ∩ C, entonces B = C', tesis: 'A ∩ B = A ∩ C ⇒ B = C',
      pista: '¿Qué pasa si A no tiene nada en común con B ni con C?',
      solucion: { tecnica: 'Contraejemplo', contraejemplo: { A: 'Ø', B: '{1}', C: '{2}' },
        evaluacion: ['A ∩ B = Ø ∩ {1} = Ø y A ∩ C = Ø ∩ {2} = Ø: se cumple la hipótesis', 'pero B = {1} ≠ {2} = C'], cierre: CIERRE_REFUTA_EL,
        nota: 'En conjuntos no se puede "cancelar" como en los números.' },
    },
  ],
});
