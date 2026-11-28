// Demostraciones con funciones (Tarea #13, 14, 17–19, 21, 22, 24, 37, 41).
// La mayoría las revisa uno a mano (tools/verificar.mjs las lista); las de la función característica se revisan con "prueba".
const PEDIDO_DEM = 'Demuestra:';

ESTUDIO.actividad({
  id: 'demostraciones',
  titulo: 'Demostraciones con funciones',
  corto: 'Demostraciones',
  tipo: 'problemas',
  descripcion: 'Inyectiva, sobre, composición, imagen e imagen inversa de conjuntos, función característica.',
  instrucciones: [
    'Inyectiva: "sean x, y con f(x) = f(y)" … "por lo tanto x = y".',
    'Sobre: "sea z cualquier elemento del codominio" … "entonces x = … cumple f(x) = z".',
    'Igualdad de conjuntos (f(S ∪ T) = …): toma un elemento y cualquiera y traduce con las definiciones, como en la unidad de conjuntos.',
    'Para un "si y solo si": demuestra las dos direcciones por separado.',
  ],
  instruccionCorta: 'Demuestra (o da un contraejemplo).',
  problemas: [
    {
      id: 'd1', origen: 'Tarea #14', pedido: PEDIDO_DEM, enunciado: 'Si f : ℝ → ℝ es estrictamente creciente, entonces f es inyectiva',
      pista: 'Con x ≠ y, uno de los dos es menor. ¿Qué dice estrictamente creciente?',
      solucion: { tecnica: 'Contrapositiva de la definición de inyectiva', pasos: [
        { f: 'x ≠ y', j: 'sean x, y reales distintos' },
        { op: '⟹', f: 'x < y  o  y < x', j: 'dos reales distintos: uno es menor' },
        { op: '⟹', f: 'f(x) < f(y)  o  f(y) < f(x)', j: 'f es estrictamente creciente (en cada caso)' },
        { op: '⟹', f: 'f(x) ≠ f(y)', j: '' },
      ], cierre: 'A elementos distintos, imágenes distintas: f es inyectiva. Q.E.D.' },
    },
    {
      id: 'd2', origen: 'Tarea #13', pedido: 'Sea f : ℝ → ℝ con f(x) > 0 para toda x. Demuestra:',
      enunciado: 'f es estrictamente decreciente ⟺ g(x) = 1/f(x) es estrictamente creciente',
      pista: 'Para números positivos a y b: a > b ⟺ 1/a < 1/b.',
      solucion: { tecnica: 'Dos direcciones', pasos: [
        { f: '(⟹)', tipo: 'titulo' },
        { f: 'x < y', j: 'sean x, y reales cualesquiera con x < y' },
        { op: '⟹', f: 'f(x) > f(y) > 0', j: 'f es estrictamente decreciente, y f es positiva' },
        { op: '⟹', f: '1/f(x) < 1/f(y)', j: 'para a > b > 0, dividir entre ab > 0 da 1/b > 1/a' },
        { op: '⟹', f: 'g(x) < g(y)', j: 'definición de g. Así, g es estrictamente creciente' },
        { f: '(⟸)', tipo: 'titulo' },
        { f: 'x < y', j: 'sean x, y reales cualesquiera con x < y' },
        { op: '⟹', f: '1/f(x) < 1/f(y)', j: 'g es estrictamente creciente' },
        { op: '⟹', f: 'f(y) < f(x)', j: 'multiplicar por f(x) f(y) > 0' },
        { op: '⟹', f: 'f(x) > f(y)', j: 'así, f es estrictamente decreciente' },
      ], cierre: 'Se demostraron las dos direcciones. Q.E.D.',
      nota: 'La tarea dice "Sea R → R"; es f : ℝ → ℝ. La condición f(x) > 0 es necesaria para que 1/f(x) exista y para no voltear las desigualdades.' },
    },
    {
      id: 'd3', origen: 'Tarea #17 a', pedido: 'Sean g : A → B y f : B → C. Demuestra:', enunciado: 'Si f y g son inyectivas, f ∘ g es inyectiva',
      pista: 'Supón f(g(x)) = f(g(y)) y usa primero que f es inyectiva.',
      solucion: { tecnica: 'Definición de inyectiva', pasos: [
        { f: '(f ∘ g)(x) = (f ∘ g)(y)', j: 'sean x, y ∈ A con la misma imagen' },
        { op: '⟹', f: 'f(g(x)) = f(g(y))', j: 'definición de composición' },
        { op: '⟹', f: 'g(x) = g(y)', j: 'f es inyectiva' },
        { op: '⟹', f: 'x = y', j: 'g es inyectiva' },
      ], cierre: 'f ∘ g es inyectiva. Q.E.D.' },
    },
    {
      id: 'd4', origen: 'Tarea #17 b', pedido: 'Sean g : A → B y f : B → C. Demuestra:', enunciado: 'Si f y g son sobre, f ∘ g es sobre',
      pista: 'Empieza con un z ∈ C y ve hacia atrás: primero por f, luego por g.',
      solucion: { tecnica: 'Definición de sobre', pasos: [
        { f: 'z ∈ C', j: 'sea z cualquier elemento de C' },
        { op: '⟹', f: 'existe y ∈ B con f(y) = z', j: 'f es sobre' },
        { op: '⟹', f: 'existe x ∈ A con g(x) = y', j: 'g es sobre' },
        { op: '⟹', f: '(f ∘ g)(x) = f(g(x)) = f(y) = z', j: 'definición de composición' },
      ], cierre: 'Todo z ∈ C es imagen de alguien bajo f ∘ g: es sobre. Q.E.D.' },
    },
    {
      id: 'd5', origen: 'Tarea #18', pedido: 'Da un ejemplo de funciones f y g tales que', enunciado: 'f ∘ g es biyectiva, pero g no es sobre y f no es inyectiva',
      pista: 'Que g "use" solo una parte de B, y que f junte la parte que g no usa con algo que sí.',
      solucion: { respuesta: 'g : {1, 2} → {a, b, c} y f : {a, b, c} → {1, 2}', evaluacion: [
        'g(1) = a, g(2) = b: no es sobre (nadie va a c).',
        'f(a) = 1, f(b) = 2, f(c) = 2: no es inyectiva (f(b) = f(c)).',
        'f ∘ g: 1 ↦ f(a) = 1, 2 ↦ f(b) = 2. Es la identidad de {1, 2}: biyectiva.',
        'Con enteros: g(n) = 2n y f(n) = ⌊n/2⌋ de ℤ en ℤ. g no es sobre (no da impares), f no es inyectiva (f(0) = f(1)), y f(g(n)) = ⌊2n/2⌋ = n.',
      ], nota: 'Puedes practicar este ejemplo en "Funciones finitas" (Componer e invertir).' },
    },
    {
      id: 'd6', origen: 'Tarea #19', pedido: 'Justifica:', enunciado: 'Si f y f ∘ g son sobre, g no necesariamente es sobre',
      solucion: { respuesta: 'Contraejemplo: el mismo de la Tarea #18', evaluacion: [
        'g : {1, 2} → {a, b, c} con g(1) = a, g(2) = b, y f : {a, b, c} → {1, 2} con f(a) = 1, f(b) = f(c) = 2.',
        'f es sobre (le llega algo a 1 y a 2) y f ∘ g es la identidad de {1, 2}, que es sobre.',
        'Pero g no es sobre: a c no le llega nada.',
      ], nota: 'Lo que sí es cierto: si f ∘ g es sobre, entonces f es sobre.' } },
    {
      id: 'd7', origen: 'Tarea #21', pedido: 'Sean a, b constantes con a ≠ 0. Demuestra que es invertible y encuentra la inversa:',
      enunciado: 'f : ℝ → ℝ,  f(x) = ax + b',
      solucion: { tecnica: 'Inyectiva y sobre', pasos: [
        { f: 'Inyectiva', tipo: 'titulo' },
        { f: 'ax + b = ay + b', j: 'sean x, y con f(x) = f(y)' },
        { op: '⟹', f: 'ax = ay', j: 'restar b' },
        { op: '⟹', f: 'x = y', j: 'dividir entre a ≠ 0' },
        { f: 'Sobre', tipo: 'titulo' },
        { f: 'y ∈ ℝ', j: 'sea y cualquier real' },
        { op: '⟹', f: 'x = (y − b)/a', j: 'despejar y = ax + b (se puede porque a ≠ 0)' },
        { op: '⟹', f: 'f(x) = a(y − b)/a + b = y', j: 'comprobar' },
      ], cierre: 'f es biyectiva, así que es invertible, y f⁻¹(y) = (y − b)/a. Q.E.D.' },
    },
    {
      id: 'd8', origen: 'Tarea #22 a', pedido: 'Sea f : A → B y S, T ⊆ A. Demuestra:', enunciado: 'f(S ∪ T) = f(S) ∪ f(T)',
      pista: 'y ∈ f(S) quiere decir "existe x ∈ S con f(x) = y". El "existe" se reparte sobre el "o".',
      solucion: { tecnica: 'Cadena de ⟺', pasos: [
        { f: 'y ∈ f(S ∪ T)', j: 'sea y cualquier elemento de B' },
        { op: '⟺', f: 'existe x ∈ S ∪ T con f(x) = y', j: 'definición de imagen de un conjunto' },
        { op: '⟺', f: 'existe x con (x ∈ S o x ∈ T) y f(x) = y', j: 'definición de unión' },
        { op: '⟺', f: 'existe x ∈ S con f(x) = y, o existe x ∈ T con f(x) = y', j: 'distributividad, y el "existe" se reparte sobre el "o"' },
        { op: '⟺', f: 'y ∈ f(S) o y ∈ f(T)', j: 'definición de imagen' },
        { op: '⟺', f: 'y ∈ f(S) ∪ f(T)', j: 'definición de unión' },
      ], nota: 'La tarea escribe "f(S)f(T)"; falta el ∪.' },
    },
    {
      id: 'd9', origen: 'Tarea #22 b', pedido: 'Sea f : A → B y S, T ⊆ A. Demuestra:', enunciado: 'f(S ∩ T) ⊆ f(S) ∩ f(T)',
      pista: 'Aquí el "existe" NO se reparte sobre el "y" en los dos sentidos: por eso solo sale ⊆.',
      solucion: { tecnica: 'Elemento arbitrario (⟹)', pasos: [
        { f: 'y ∈ f(S ∩ T)', j: 'sea y cualquier elemento de f(S ∩ T)' },
        { op: '⟺', f: 'existe x ∈ S ∩ T con f(x) = y', j: 'definición de imagen' },
        { op: '⟹', f: 'existe x ∈ S con f(x) = y, y existe x ∈ T con f(x) = y', j: 'el mismo x sirve para las dos' },
        { op: '⟺', f: 'y ∈ f(S) y y ∈ f(T)', j: 'definición de imagen' },
        { op: '⟺', f: 'y ∈ f(S) ∩ f(T)', j: 'definición de intersección' },
      ], cierre: 'f(S ∩ T) ⊆ f(S) ∩ f(T). Q.E.D.',
      nota: 'La tarea escribe "f(S) ∩ T(S)"; es f(S) ∩ f(T). El regreso del paso 3 falla: los dos x pueden ser distintos.' },
    },
    {
      id: 'd10', origen: 'Tarea #22 b', pedido: 'Demuestra que la contención puede ser propia:', enunciado: 'f(S ∩ T) ⊊ f(S) ∩ f(T)  para alguna f, S, T',
      solucion: { tecnica: 'Ejemplo', contraejemplo: { A: '{1, 2}', B: '{p}', S: '{1}', T: '{2}' },
        evaluacion: [
          'f : {1, 2} → {p}, f(1) = f(2) = p (no es inyectiva).',
          'S ∩ T = Ø, así que f(S ∩ T) = Ø.',
          'f(S) ∩ f(T) = {p} ∩ {p} = {p}.',
          'Ø ⊊ {p}: la contención es propia.',
        ], cierre: 'Con f no inyectiva puede no haber igualdad.' },
    },
    {
      id: 'd11', origen: 'Tarea #22 b', pedido: 'Sea f : A → B inyectiva y S, T ⊆ A. Demuestra:', enunciado: 'f(S ∩ T) = f(S) ∩ f(T)',
      pista: 'Ya está ⊆. Para ⊇: si y = f(s) = f(t) con s ∈ S y t ∈ T, ¿qué dice inyectiva?',
      solucion: { tecnica: 'Falta la contención ⊇', pasos: [
        { f: '(⊆) Ya demostrada (sin usar que f es inyectiva)', tipo: 'titulo' },
        { f: '(⊇)', tipo: 'titulo' },
        { f: 'y ∈ f(S) ∩ f(T)', j: 'sea y cualquier elemento de la derecha' },
        { op: '⟹', f: 'y = f(s) con s ∈ S, y y = f(t) con t ∈ T', j: 'definición de intersección y de imagen' },
        { op: '⟹', f: 'f(s) = f(t)', j: '' },
        { op: '⟹', f: 's = t', j: 'f es inyectiva' },
        { op: '⟹', f: 's ∈ S ∩ T', j: 's ∈ S y s = t ∈ T' },
        { op: '⟹', f: 'y = f(s) ∈ f(S ∩ T)', j: 'definición de imagen' },
      ], cierre: 'Las dos contenciones dan f(S ∩ T) = f(S) ∩ f(T). Q.E.D.' },
    },
    {
      id: 'd12', origen: 'Tarea #24', pedido: 'Sea f : A → B y S ⊆ B. Demuestra:', enunciado: 'f⁻¹(Sᶜ) = (f⁻¹(S))ᶜ',
      pista: 'x ∈ f⁻¹(S) quiere decir f(x) ∈ S. Aquí sí todo va en los dos sentidos.',
      solucion: { tecnica: 'Cadena de ⟺', pasos: [
        { f: 'x ∈ f⁻¹(Sᶜ)', j: 'sea x cualquier elemento de A' },
        { op: '⟺', f: 'f(x) ∈ Sᶜ', j: 'definición de imagen inversa' },
        { op: '⟺', f: 'f(x) ∉ S', j: 'definición de complemento (en B)' },
        { op: '⟺', f: 'x ∉ f⁻¹(S)', j: 'definición de imagen inversa' },
        { op: '⟺', f: 'x ∈ (f⁻¹(S))ᶜ', j: 'definición de complemento (en A)' },
      ], nota: 'En la tarea el complemento se escribe con una barra arriba. El complemento de la izquierda es en B y el de la derecha en A.' },
    },
    {
      id: 'd13', origen: 'Tarea #37 a', pedido: 'Demuestra, para toda x ∈ U (f_S es la función característica de S):', enunciado: 'f_{A∩B}(x) = f_A(x) · f_B(x)',
      prueba: { vars: { a: 'bit', b: 'bit' }, f: ({ a, b }) => (a && b ? 1 : 0) === a * b },
      solucion: { tecnica: 'Por casos', pasos: [
        { f: 'x ∈ A y x ∈ B', j: 'f_A(x) · f_B(x) = 1 · 1 = 1, y x ∈ A ∩ B: f_{A∩B}(x) = 1' },
        { f: 'x ∉ A o x ∉ B', j: 'algún factor es 0, el producto es 0, y x ∉ A ∩ B: f_{A∩B}(x) = 0' },
      ], cierre: 'En todos los casos los dos lados valen lo mismo. Q.E.D.' },
    },
    {
      id: 'd14', origen: 'Tarea #37 b', pedido: 'Demuestra, para toda x ∈ U:', enunciado: 'f_{A∪B}(x) = f_A(x) + f_B(x) − f_A(x) · f_B(x)',
      prueba: { vars: { a: 'bit', b: 'bit' }, f: ({ a, b }) => (a || b ? 1 : 0) === a + b - a * b },
      solucion: { tecnica: 'Por casos (los cuatro)', pasos: [
        { f: 'x ∈ A, x ∈ B', j: '1 + 1 − 1 = 1, y x ∈ A ∪ B' },
        { f: 'x ∈ A, x ∉ B', j: '1 + 0 − 0 = 1, y x ∈ A ∪ B' },
        { f: 'x ∉ A, x ∈ B', j: '0 + 1 − 0 = 1, y x ∈ A ∪ B' },
        { f: 'x ∉ A, x ∉ B', j: '0 + 0 − 0 = 0, y x ∉ A ∪ B' },
      ], cierre: 'En los cuatro casos coinciden. Q.E.D.', nota: 'Es como |A ∪ B| = |A| + |B| − |A ∩ B|: el producto quita lo que se contó dos veces.' },
    },
    {
      id: 'd15', origen: 'Tarea #37 c', pedido: 'Demuestra, para toda x ∈ U:', enunciado: 'f_{Aᶜ}(x) = 1 − f_A(x)',
      prueba: { vars: { a: 'bit' }, f: ({ a }) => (a ? 0 : 1) === 1 - a },
      solucion: { tecnica: 'Por casos', pasos: [
        { f: 'x ∈ A', j: '1 − 1 = 0, y x ∉ Aᶜ: f_{Aᶜ}(x) = 0' },
        { f: 'x ∉ A', j: '1 − 0 = 1, y x ∈ Aᶜ: f_{Aᶜ}(x) = 1' },
      ], cierre: 'Q.E.D.', nota: 'En la tarea el complemento se escribe con una barra arriba.' },
    },
    {
      id: 'd16', origen: 'Tarea #37 d', pedido: 'Demuestra, para toda x ∈ U:', enunciado: 'f_{A⊕B}(x) = f_A(x) + f_B(x) − 2 f_A(x) f_B(x)',
      prueba: { vars: { a: 'bit', b: 'bit' }, f: ({ a, b }) => (a !== b ? 1 : 0) === a + b - 2 * a * b },
      solucion: { tecnica: 'Por casos (los cuatro)', pasos: [
        { f: 'x ∈ A, x ∈ B', j: '1 + 1 − 2 = 0, y x ∉ A ⊕ B (está en los dos)' },
        { f: 'x ∈ A, x ∉ B', j: '1 + 0 − 0 = 1, y x ∈ A ⊕ B' },
        { f: 'x ∉ A, x ∈ B', j: '0 + 1 − 0 = 1, y x ∈ A ⊕ B' },
        { f: 'x ∉ A, x ∉ B', j: '0 + 0 − 0 = 0, y x ∉ A ⊕ B' },
      ], cierre: 'Q.E.D.', nota: 'A ⊕ B es la diferencia simétrica (lo que está en exactamente uno de los dos; en la unidad de conjuntos, A ∆ B).' },
    },
    {
      id: 'd17', origen: 'Tarea #41 a', pedido: 'Demuestra:', enunciado: 'Si |S| = m, con m entero positivo,\nhay una biyección entre S y {1, 2, …, m}',
      solucion: { tecnica: 'Construir la biyección', pasos: [
        { f: 'S = {s₁, s₂, …, s_m}', j: 'S tiene exactamente m elementos distintos: se pueden numerar' },
        { f: 'f(i) = sᵢ', j: 'define f : {1, …, m} → S' },
        { f: 'f(i) = f(j) ⟹ sᵢ = sⱼ ⟹ i = j', j: 'inyectiva: los sᵢ son distintos' },
        { f: 'cada s ∈ S es algún sᵢ = f(i)', j: 'sobre: la lista tiene a todos' },
      ], cierre: 'f es biyectiva. Q.E.D.' },
    },
    {
      id: 'd18', origen: 'Tarea #41 b', pedido: 'Demuestra:', enunciado: 'Si |S| = |T| = m, hay una biyección entre S y T',
      pista: 'Usa el inciso a) dos veces y compón.',
      solucion: { tecnica: 'Componer biyecciones', pasos: [
        { f: 'f : {1, …, m} → S y g : {1, …, m} → T biyectivas', j: 'inciso a)' },
        { f: 'f⁻¹ : S → {1, …, m} es biyectiva', j: 'la inversa de una biyección es biyección' },
        { f: 'g ∘ f⁻¹ : S → T es biyectiva', j: 'la composición de biyecciones es biyección (Tarea #17)' },
      ], cierre: 'Q.E.D.' },
    },
  ],
});
