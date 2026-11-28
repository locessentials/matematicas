// ¿Es función? Dominio y rango, inyectiva, sobre, biyectiva, inversas, funciones parciales (Tarea #1–4, 7–12, 15, 20, 36, 40
// y ejemplos de las diapositivas).
// Campos que solo usa tools/verificar.mjs:
//   muestra: { dominio: [...], f, inyectiva?, sobre?: { en: [...] } | false, falta? }
//     inyectiva: true → sin repetidos en la muestra; false → tiene que aparecer un repetido.
//     sobre: { en } → cada valor de "en" se alcanza; sobre: false → el valor "falta" no se alcanza en la muestra.
//   prueba: { vars: { x: 'real' }, f } → se revisa con muchos valores (ver tools/verificar.mjs).
const PEDIDO_SOBRE_ZZ = '¿Es sobre esta función de ℤ en ℤ?';
const PEDIDO_SOBRE_Z2 = '¿Es sobre esta función f : ℤ × ℤ → ℤ?';
const PEDIDO_DOMINIO = 'Encuentra el dominio y el rango:';

ESTUDIO.actividad({
  id: 'propiedades',
  titulo: 'Propiedades de funciones',
  corto: 'Propiedades',
  tipo: 'problemas',
  descripcion: '¿Es función? ¿Cuál es su rango? ¿Es inyectiva, sobre, biyectiva? ¿Cuál es su inversa? Las preguntas cortas de la tarea, una por una.',
  instrucciones: [
    'Para decir que NO es función, inyectiva o sobre, basta un ejemplo concreto: un x sin valor (o con dos), dos x con el mismo valor, un y al que no llega nadie.',
    'Para decir que SÍ es sobre: toma y cualquiera, despeja x de f(x) = y y revisa que esa x esté en el dominio.',
    'Para decir que SÍ es inyectiva: supón f(x) = f(y) y llega a x = y.',
    'Para la inversa: despeja x en y = f(x).',
  ],
  instruccionCorta: 'Contesta y justifica con un ejemplo o despejando.',
  problemas: [
    // ---------- ¿Es función? (Tarea #1, #2) ----------
    { id: 'p1', origen: 'Tarea #1 a', pedido: '¿Por qué no es una función de ℝ en ℝ?', enunciado: 'f(x) = 1/x',
      solucion: { respuesta: 'No es función de ℝ en ℝ', tono: 'no', evaluacion: [
        'f(0) = 1/0 no está definido.',
        'Una función de ℝ en ℝ le tiene que dar un valor a cada número real, incluido el 0.',
      ], nota: 'Sí es función de ℝ \\ {0} en ℝ.' } },
    { id: 'p2', origen: 'Tarea #1 b', pedido: '¿Por qué no es una función de ℝ en ℝ?', enunciado: 'f(x) = √x',
      solucion: { respuesta: 'No es función de ℝ en ℝ', tono: 'no', evaluacion: [
        'f(−1) = √(−1) no es un número real.',
      ], nota: 'Sí es función de [0, ∞) en ℝ.' } },
    { id: 'p3', origen: 'Tarea #1 c', pedido: '¿Por qué no es una función de ℝ en ℝ?', enunciado: 'f(x) = ±√(x² + 1)',
      solucion: { respuesta: 'No es función de ℝ en ℝ', tono: 'no', evaluacion: [
        'A cada x le da dos valores: por ejemplo, f(0) = 1 y f(0) = −1.',
        'Una función da exactamente un valor por elemento.',
      ] } },
    { id: 'p4', origen: 'Tarea #2 a', pedido: '¿Es función del conjunto de cadenas de bits en ℤ?', enunciado: 'f(S) = la posición de un bit 0 en S',
      solucion: { respuesta: 'No es función', tono: 'no', evaluacion: [
        '"111" no tiene ningún 0: no tiene imagen.',
        '"0101" tiene ceros en las posiciones 1 y 3: tendría dos imágenes.',
      ] } },
    { id: 'p5', origen: 'Tarea #2 b', pedido: '¿Es función del conjunto de cadenas de bits en ℤ?', enunciado: 'f(S) = el número de bits 1 en S',
      solucion: { respuesta: 'Sí es función', tono: 'si', evaluacion: [
        'Toda cadena tiene una cantidad bien definida de unos, que es un entero (la cadena vacía tiene 0).',
      ] } },
    { id: 'p6', origen: 'Tarea #2 c', pedido: '¿Es función del conjunto de cadenas de bits en ℤ?',
      enunciado: 'f(S) = el menor i tal que el i-ésimo bit de S es 1,\ny f(S) = 0 si S es la cadena vacía',
      solucion: { respuesta: 'No es función', tono: 'no', evaluacion: [
        '"000" no es la cadena vacía y no tiene ningún 1: no hay ningún i que sirva, así que no tiene imagen.',
        'La regla del 0 solo cubre la cadena vacía.',
      ] } },

    // ---------- Dominio y rango (Tarea #3, #4) ----------
    { id: 'p7', origen: 'Tarea #3 a', pedido: PEDIDO_DOMINIO, enunciado: 'A cada cadena de bits, (número de unos) − (número de ceros)',
      solucion: { respuesta: 'Dominio: todas las cadenas de bits.  Rango: ℤ', evaluacion: [
        'Una cadena de k unos da k; una de k ceros da −k; la cadena vacía da 0.',
        'Así se alcanza cualquier entero.',
      ] } },
    { id: 'p8', origen: 'Tarea #3 b', pedido: PEDIDO_DOMINIO, enunciado: 'A cada cadena de bits, el doble del número de ceros',
      solucion: { respuesta: 'Dominio: todas las cadenas de bits.  Rango: {0, 2, 4, 6, …}', evaluacion: [
        'Con k ceros da 2k, y una cadena de k ceros existe para cualquier k ≥ 0.',
      ] } },
    { id: 'p9', origen: 'Tarea #3 c', pedido: PEDIDO_DOMINIO, enunciado: 'A cada cadena de bits, los bits que sobran al partirla en bytes (bloques de 8)',
      solucion: { respuesta: 'Dominio: todas las cadenas de bits.  Rango: {0, 1, 2, 3, 4, 5, 6, 7}', evaluacion: [
        'Si la cadena tiene n bits, sobran n − 8⌊n/8⌋ (el residuo de n entre 8).',
        'Con longitudes 0, 1, …, 7 se obtiene cada valor, y nunca sobran 8 o más.',
      ] } },
    { id: 'p10', origen: 'Tarea #3 d', pedido: PEDIDO_DOMINIO, enunciado: 'A cada entero, el mayor cuadrado perfecto que es ≤ que él',
      solucion: { respuesta: 'Dominio: los enteros no negativos.  Rango: {0, 1, 4, 9, 16, …}', evaluacion: [
        'Para n negativo no hay ningún cuadrado perfecto ≤ n (todos son ≥ 0): "a cada entero" no puede ser. El dominio tiene que ser {0, 1, 2, …}.',
        'Cada cuadrado k² es su propia imagen, y la imagen siempre es un cuadrado.',
      ], nota: 'Seguramente el enunciado quería decir "a cada entero positivo"; entonces el rango es {1, 4, 9, 16, …}.' } },
    { id: 'p11', origen: 'Tarea #4 a', pedido: PEDIDO_DOMINIO, enunciado: 'A cada pareja de enteros positivos, el mayor de los dos',
      solucion: { respuesta: 'Dominio: ℤ⁺ × ℤ⁺.  Rango: ℤ⁺', evaluacion: [
        'Cada n ∈ ℤ⁺ es el máximo de (n, n), y el máximo de dos positivos es positivo.',
      ] } },
    { id: 'p12', origen: 'Tarea #4 b', pedido: PEDIDO_DOMINIO, enunciado: 'A cada entero positivo, cuántas de las cifras 0, 1, …, 9 no aparecen en él',
      solucion: { respuesta: 'Dominio: ℤ⁺.  Rango: {0, 1, 2, …, 9}', evaluacion: [
        'Todo entero positivo usa al menos una cifra, así que faltan a lo más 9 (1 deja fuera 9 cifras).',
        '1023456789 usa las diez: faltan 0.',
        '12, 123, …, 123456789 dejan fuera 8, 7, …, 1 cifras: se alcanza cada valor de 0 a 9.',
      ] } },
    { id: 'p13', origen: 'Tarea #4 c', pedido: PEDIDO_DOMINIO, enunciado: 'A cada cadena de bits, cuántas veces aparece el bloque 11',
      solucion: { respuesta: 'Dominio: todas las cadenas de bits.  Rango: ℕ = {0, 1, 2, …}', evaluacion: [
        '"0" tiene 0 bloques 11. "11" repetido k veces (o k + 1 unos seguidos, si se cuentan encimados) tiene k.',
      ] } },
    { id: 'p14', origen: 'Tarea #4 d', pedido: PEDIDO_DOMINIO, enunciado: 'A cada cadena de bits, la posición del primer 1\n(y 0 si la cadena no tiene unos)',
      solucion: { respuesta: 'Dominio: todas las cadenas de bits.  Rango: ℕ = {0, 1, 2, …}', evaluacion: [
        'Las cadenas sin unos (incluida la vacía) van al 0; la cadena 0…01 con k − 1 ceros va a k.',
      ] } },

    // ---------- ¿Es sobre? (Tarea #7, #8) ----------
    { id: 'p15', origen: 'Tarea #7 a', pedido: PEDIDO_SOBRE_ZZ, enunciado: 'f(n) = n − 1',
      muestra: { dominio: enteros(-60, 60), f: (n) => n - 1, sobre: { en: enteros(-20, 20) } },
      solucion: { respuesta: 'Sí es sobre', tono: 'si', evaluacion: [
        'Sea y ∈ ℤ. Despejando, n − 1 = y da n = y + 1, que es entero.',
        'f(y + 1) = y.',
      ] } },
    { id: 'p16', origen: 'Tarea #7 b', pedido: PEDIDO_SOBRE_ZZ, enunciado: 'f(n) = n² − 1',
      muestra: { dominio: enteros(-60, 60), f: (n) => n * n - 1, sobre: false, falta: -2 },
      solucion: { respuesta: 'No es sobre', tono: 'no', evaluacion: [
        'n² − 1 = −2 obligaría a n² = −1, y ningún entero cumple eso.',
        'Así, −2 no es imagen de nadie.',
      ] } },
    { id: 'p17', origen: 'Tarea #7 c', pedido: PEDIDO_SOBRE_ZZ, enunciado: 'f(n) = n³',
      muestra: { dominio: enteros(-60, 60), f: (n) => n ** 3, sobre: false, falta: 2 },
      solucion: { respuesta: 'No es sobre', tono: 'no', evaluacion: [
        '1³ = 1 y 2³ = 8: ningún entero al cubo da 2.',
      ] } },
    { id: 'p18', origen: 'Tarea #7 d', pedido: PEDIDO_SOBRE_ZZ, enunciado: 'f(n) = ⌈n/2⌉',
      muestra: { dominio: enteros(-60, 60), f: (n) => techo(n / 2), sobre: { en: enteros(-20, 20) } },
      solucion: { respuesta: 'Sí es sobre', tono: 'si', evaluacion: [
        'Sea y ∈ ℤ. Con n = 2y: f(2y) = ⌈2y/2⌉ = ⌈y⌉ = y.',
      ], nota: 'No es inyectiva: f(1) = f(2) = 1.' } },
    { id: 'p19', origen: 'Tarea #8 a', pedido: PEDIDO_SOBRE_Z2, enunciado: 'f(m, n) = m + n',
      muestra: { dominio: parejas(enteros(-25, 25)), f: (m, n) => m + n, sobre: { en: enteros(-20, 20) } },
      solucion: { respuesta: 'Sí es sobre', tono: 'si', evaluacion: ['Sea y ∈ ℤ: f(y, 0) = y.'] } },
    { id: 'p20', origen: 'Tarea #8 b', pedido: PEDIDO_SOBRE_Z2, enunciado: 'f(m, n) = m² + n²',
      muestra: { dominio: parejas(enteros(-25, 25)), f: (m, n) => m * m + n * n, sobre: false, falta: -1 },
      solucion: { respuesta: 'No es sobre', tono: 'no', evaluacion: ['m² + n² ≥ 0 siempre, así que −1 no es imagen de nadie.'],
        nota: 'Tampoco alcanza el 3, que no es suma de dos cuadrados.' } },
    { id: 'p21', origen: 'Tarea #8 c', pedido: PEDIDO_SOBRE_Z2, enunciado: 'f(m, n) = m',
      muestra: { dominio: parejas(enteros(-25, 25)), f: (m) => m, sobre: { en: enteros(-20, 20) } },
      solucion: { respuesta: 'Sí es sobre', tono: 'si', evaluacion: ['Sea y ∈ ℤ: f(y, 0) = y (o cualquier n en lugar de 0).'] } },
    { id: 'p22', origen: 'Tarea #8 d', pedido: PEDIDO_SOBRE_Z2, enunciado: 'f(m, n) = |n|',
      muestra: { dominio: parejas(enteros(-25, 25)), f: (m, n) => Math.abs(n), sobre: false, falta: -1 },
      solucion: { respuesta: 'No es sobre', tono: 'no', evaluacion: ['|n| ≥ 0, así que ningún negativo es imagen: por ejemplo −1.'] } },
    { id: 'p23', origen: 'Tarea #8 e', pedido: PEDIDO_SOBRE_Z2, enunciado: 'f(m, n) = m − n',
      muestra: { dominio: parejas(enteros(-25, 25)), f: (m, n) => m - n, sobre: { en: enteros(-20, 20) } },
      solucion: { respuesta: 'Sí es sobre', tono: 'si', evaluacion: ['Sea y ∈ ℤ: f(y, 0) = y.'] } },

    // ---------- Maestros (Tarea #9, #10) ----------
    { id: 'p24', origen: 'Tarea #9 y #10 a', pedido: 'A cada maestro de una escuela se le asigna su oficina.',
      enunciado: '¿Cuándo es inyectiva? ¿Cuál es el codominio? ¿Cuándo es sobre?',
      solucion: { respuesta: 'Inyectiva si no hay dos maestros en la misma oficina', evaluacion: [
        'Codominio: las oficinas de la escuela.',
        'Sobre si cada oficina tiene al menos un maestro.',
      ] } },
    { id: 'p25', origen: 'Tarea #9 y #10 b', pedido: 'A cada maestro se le asigna el autobús que acompaña en una excursión.',
      enunciado: '¿Cuándo es inyectiva? ¿Cuál es el codominio? ¿Cuándo es sobre?',
      solucion: { respuesta: 'Inyectiva si cada autobús lleva a lo más un maestro', evaluacion: [
        'Codominio: los autobuses de la excursión.',
        'Sobre si cada autobús lleva al menos un maestro.',
        'Para que esto sea función, cada maestro debe ir exactamente en un autobús.',
      ] } },
    { id: 'p26', origen: 'Tarea #9 y #10 c', pedido: 'A cada maestro se le asigna su salario.',
      enunciado: '¿Cuándo es inyectiva? ¿Cuál es el codominio? ¿Cuándo es sobre?',
      solucion: { respuesta: 'Inyectiva si no hay dos maestros que ganen lo mismo', evaluacion: [
        'Codominio: por ejemplo, los números reales positivos (las cantidades de dinero posibles).',
        'Con ese codominio nunca es sobre: hay una cantidad finita de maestros y una infinita de salarios posibles.',
        'Sería sobre solo si el codominio fuera exactamente el conjunto de salarios que de verdad se pagan.',
      ] } },
    { id: 'p27', origen: 'Tarea #9 y #10 d', pedido: 'A cada maestro se le asigna su número de seguridad social.',
      enunciado: '¿Cuándo es inyectiva? ¿Cuál es el codominio? ¿Cuándo es sobre?',
      solucion: { respuesta: 'Siempre es inyectiva', tono: 'si', evaluacion: [
        'Cada persona tiene un número distinto.',
        'Codominio: todos los números de seguridad social posibles (cadenas de cierta cantidad de dígitos).',
        'No es sobre: hay muchísimos más números posibles que maestros.',
      ] } },

    // ---------- Dar una función de ℤ en ℤ⁺ (Tarea #11) ----------
    { id: 'p28', origen: 'Tarea #11 a', pedido: 'Da una función de ℤ en ℤ⁺ que sea', enunciado: 'inyectiva, pero no sobre',
      pista: 'Manda los n ≥ 0 a los pares y los negativos a los impares, pero deja algún positivo sin usar.',
      muestra: { dominio: enteros(-60, 60), f: (n) => (n >= 0 ? 2 * n + 2 : -2 * n + 1), inyectiva: true, sobre: false, falta: 1 },
      solucion: { respuesta: 'f(n) = 2n + 2 si n ≥ 0;  f(n) = −2n + 1 si n < 0', evaluacion: [
        'Los n ≥ 0 van a 2, 4, 6, …; los n < 0 van a 3, 5, 7, … Todo es positivo.',
        'Inyectiva: dentro de cada parte es una recta (inyectiva), y una parte da pares y la otra impares, así que no chocan.',
        'No es sobre: nadie va al 1 (2n + 2 = 1 y −2n + 1 = 1 dan n = −½ y n = 0, y ninguno está en su parte).',
      ], nota: 'Hay muchas respuestas. El enunciado de la tarea dice "desde el conjunto de enteros a enteros positivos"; así se resolvió.' } },
    { id: 'p29', origen: 'Tarea #11 b', pedido: 'Da una función de ℤ en ℤ⁺ que sea', enunciado: 'sobre, pero no inyectiva',
      muestra: { dominio: enteros(-60, 60), f: (n) => Math.abs(n) + 1, inyectiva: false, sobre: { en: enteros(1, 40) } },
      solucion: { respuesta: 'f(n) = |n| + 1', evaluacion: [
        'Sobre: para y ∈ ℤ⁺, n = y − 1 ≥ 0 da f(n) = y.',
        'No inyectiva: f(1) = f(−1) = 2.',
      ] } },
    { id: 'p30', origen: 'Tarea #11 c', pedido: 'Da una función de ℤ en ℤ⁺ que sea', enunciado: 'inyectiva y sobre',
      pista: 'Lista los enteros 0, 1, −1, 2, −2, … y numéralos 1, 2, 3, 4, 5, …',
      muestra: { dominio: enteros(-60, 60), f: (n) => (n > 0 ? 2 * n : -2 * n + 1), inyectiva: true, sobre: { en: enteros(1, 100) } },
      solucion: { respuesta: 'f(n) = 2n si n > 0;  f(n) = −2n + 1 si n ≤ 0', evaluacion: [
        'Los positivos van a los pares 2, 4, 6, …; el 0 y los negativos van a los impares 1, 3, 5, …',
        'Inyectiva: cada parte es inyectiva y una da pares y la otra impares.',
        'Sobre: un par 2k viene de k > 0; un impar 2k + 1 viene de −k ≤ 0.',
      ] } },
    { id: 'p31', origen: 'Tarea #11 d', pedido: 'Da una función de ℤ en ℤ⁺ que sea', enunciado: 'ni inyectiva ni sobre',
      muestra: { dominio: enteros(-60, 60), f: (n) => n * n + 1, inyectiva: false, sobre: false, falta: 3 },
      solucion: { respuesta: 'f(n) = n² + 1', evaluacion: [
        'No inyectiva: f(1) = f(−1) = 2.',
        'No sobre: n² + 1 = 3 pide n² = 2, y ningún entero cumple eso.',
      ] } },

    // ---------- Biyecciones de ℝ en ℝ (Tarea #12) ----------
    { id: 'p32', origen: 'Tarea #12 a', pedido: '¿Es una biyección de ℝ en ℝ?', enunciado: 'f(x) = 2x + 1',
      prueba: { vars: { x: 'real' }, f: ({ x }) => casi(2 * ((x - 1) / 2) + 1, x) && casi((2 * x + 1 - 1) / 2, x) },
      solucion: { respuesta: 'Sí es biyección', tono: 'si', evaluacion: [
        'Inyectiva: 2x + 1 = 2y + 1 ⟹ x = y.',
        'Sobre: para y ∈ ℝ, x = (y − 1)/2 da f(x) = y.',
        'Inversa: f⁻¹(y) = (y − 1)/2.',
      ] } },
    { id: 'p33', origen: 'Tarea #12 b', pedido: '¿Es una biyección de ℝ en ℝ?', enunciado: 'f(x) = x² + 1',
      solucion: { respuesta: 'No es biyección', tono: 'no', evaluacion: [
        'No es inyectiva: f(1) = f(−1) = 2.',
        'Tampoco es sobre: x² + 1 ≥ 1, así que 0 no es imagen de nadie.',
      ] } },
    { id: 'p34', origen: 'Tarea #12 c', pedido: '¿Es una biyección de ℝ en ℝ?', enunciado: 'f(x) = x³',
      prueba: { vars: { x: 'real' }, f: ({ x }) => casi(Math.cbrt(x) ** 3, x) && casi(Math.cbrt(x ** 3), x) },
      solucion: { respuesta: 'Sí es biyección', tono: 'si', evaluacion: [
        'Es estrictamente creciente (x < y ⟹ x³ < y³), así que es inyectiva.',
        'Sobre: para y ∈ ℝ, x = ∛y da x³ = y.',
        'Inversa: f⁻¹(y) = ∛y.',
      ] } },
    { id: 'p35', origen: 'Tarea #12 d', pedido: '¿Es una biyección de ℝ en ℝ?', enunciado: 'f(x) = (x² + 1)/(x² + 2)',
      prueba: { vars: { x: 'real' }, f: ({ x }) => { const v = (x * x + 1) / (x * x + 2); return v >= 0.5 && v < 1; } },
      solucion: { respuesta: 'No es biyección', tono: 'no', evaluacion: [
        'No es inyectiva: f(1) = f(−1) = 2/3.',
        'No es sobre: f(x) = 1 − 1/(x² + 2), y como x² + 2 ≥ 2, los valores están en [½, 1). Por ejemplo, 5 no es imagen de nadie.',
      ] } },

    // ---------- Inversas ----------
    { id: 'p36', origen: 'Tarea #15', pedido: 'Demuestra que no es invertible, pero que sí lo es si se restringe el dominio a [0, ∞):',
      enunciado: 'f(x) = |x|, de ℝ en los reales no negativos',
      solucion: { respuesta: 'De ℝ no es invertible; de [0, ∞) sí', evaluacion: [
        'De ℝ en [0, ∞): f(1) = f(−1) = 1, no es inyectiva, así que no tiene inversa.',
        'De [0, ∞) en [0, ∞): |x| = x, que es la identidad: inyectiva (x = y) y sobre (cada y ≥ 0 es |y|).',
        'Su inversa es f⁻¹(y) = y.',
      ], nota: 'La tarea dice "al conjunto de los números reales positivos", pero |0| = 0 no es positivo: el codominio tiene que ser los no negativos.' } },
    { id: 'p37', origen: 'Tarea #36', pedido: 'Encuentra la inversa:', enunciado: 'f(x) = x³ + 1',
      prueba: { vars: { x: 'real' }, f: ({ x }) => casi(Math.cbrt(x - 1) ** 3 + 1, x) && casi(Math.cbrt(x ** 3 + 1 - 1), x) },
      solucion: { tecnica: 'Despejar', pasos: [
        { f: 'y = x³ + 1', j: '' },
        { f: 'y − 1 = x³', j: 'restar 1' },
        { f: 'x = ∛(y − 1)', j: 'raíz cúbica (existe para todo real)' },
      ], cierre: 'f⁻¹(y) = ∛(y − 1). Existe porque x³ + 1 es estrictamente creciente y toma todos los valores reales.' } },
    { id: 'p38', origen: 'Diapositivas, Ej. 21 y 22', pedido: '¿Es invertible? Si lo es, ¿cuál es la inversa?', enunciado: 'f : ℤ → ℤ,  f(x) = x + 1',
      muestra: { dominio: enteros(-60, 60), f: (x) => x + 1, inyectiva: true, sobre: { en: enteros(-20, 20) } },
      solucion: { respuesta: 'Sí: f⁻¹(y) = y − 1', tono: 'si', evaluacion: [
        'Es biyectiva: x + 1 = y + 1 ⟹ x = y, y para cada y, x = y − 1 es entero.',
        'Despejando y = x + 1: x = y − 1.',
      ], nota: 'La diapositiva pregunta "¿cuál es la imagen?"; quería decir la inversa.' } },
    { id: 'p39', origen: 'Diapositivas, Ej. 21 y 22', pedido: '¿Es invertible?', enunciado: 'f(x) = x²  de ℝ en ℝ,\ny de [0, ∞) en [0, ∞)',
      solucion: { respuesta: 'De ℝ en ℝ no; de [0, ∞) en [0, ∞) sí', evaluacion: [
        'De ℝ en ℝ: f(−2) = f(2) = 4, no es inyectiva.',
        'De [0, ∞) en [0, ∞): x² = y² ⟹ (x − y)(x + y) = 0 ⟹ x = y (porque x + y = 0 con x, y ≥ 0 solo si ambos son 0). Y cada y ≥ 0 es (√y)².',
        'Inversa: f⁻¹(y) = √y.',
      ], nota: 'La diapositiva escribe ℝ⁺ para los no negativos; normalmente ℝ⁺ son los positivos (sin el 0).' } },

    // ---------- Operaciones con funciones ----------
    { id: 'p40', origen: 'Tarea #20', pedido: 'Con f(x) = x² + 1 y g(x) = x + 2, de ℝ en ℝ, encuentra:', enunciado: 'f ∘ g,  g ∘ f,  f + g,  f · g',
      prueba: { vars: { x: 'real' }, f: ({ x }) => {
        const f = (t) => t * t + 1, g = (t) => t + 2;
        return casi(f(g(x)), x * x + 4 * x + 5) && casi(g(f(x)), x * x + 3) && casi(f(x) + g(x), x * x + x + 3) && casi(f(x) * g(x), x ** 3 + 2 * x * x + x + 2);
      } },
      solucion: { tecnica: 'Sustituir', pasos: [
        { f: '(f ∘ g)(x) = f(x + 2) = (x + 2)² + 1 = x² + 4x + 5', j: 'primero g, luego f' },
        { f: '(g ∘ f)(x) = g(x² + 1) = x² + 3', j: 'primero f, luego g' },
        { f: '(f + g)(x) = x² + 1 + x + 2 = x² + x + 3', j: '' },
        { f: '(f · g)(x) = (x² + 1)(x + 2) = x³ + 2x² + x + 2', j: '' },
      ], cierre: false, nota: 'f ∘ g ≠ g ∘ f: la composición no conmuta.' } },
    { id: 'p41', origen: 'Diapositivas, Ej. 24', pedido: 'Con f(x) = 2x + 3 y g(x) = 3x + 2, de ℤ en ℤ, encuentra:', enunciado: 'f ∘ g  y  g ∘ f',
      prueba: { vars: { x: 'real' }, f: ({ x }) => casi(2 * (3 * x + 2) + 3, 6 * x + 7) && casi(3 * (2 * x + 3) + 2, 6 * x + 11) },
      solucion: { tecnica: 'Sustituir', pasos: [
        { f: '(f ∘ g)(x) = f(3x + 2) = 2(3x + 2) + 3 = 6x + 7', j: '' },
        { f: '(g ∘ f)(x) = g(2x + 3) = 3(2x + 3) + 2 = 6x + 11', j: '' },
      ], cierre: false } },
    { id: 'p42', origen: 'Diapositivas, Ej. 6', pedido: 'Con f₁(x) = x² y f₂(x) = x − x², de ℝ en ℝ, encuentra:', enunciado: 'f₁ + f₂  y  f₁ · f₂',
      prueba: { vars: { x: 'real' }, f: ({ x }) => casi(x * x + (x - x * x), x) && casi(x * x * (x - x * x), x ** 3 - x ** 4) },
      solucion: { tecnica: 'Definición de suma y producto', pasos: [
        { f: '(f₁ + f₂)(x) = x² + (x − x²) = x', j: '' },
        { f: '(f₁ · f₂)(x) = x²(x − x²) = x³ − x⁴', j: '' },
      ], cierre: false } },
    { id: 'p43', origen: 'Diapositivas, Ej. 25', pedido: 'Con f : ℝ → [0, ∞), f(x) = x², y g : [0, ∞) → ℝ, g(x) = √x, encuentra:', enunciado: 'f ∘ g',
      solucion: { tecnica: 'Sustituir', pasos: [
        { f: 'dominio de f ∘ g = dominio de g = [0, ∞)', j: '' },
        { f: '(f ∘ g)(x) = f(√x) = (√x)² = x', j: 'para x ≥ 0' },
      ], cierre: 'f ∘ g : [0, ∞) → [0, ∞) es la identidad. (La diapositiva lo resume como "f : …"; es f ∘ g.)',
        nota: 'En cambio g ∘ f(x) = √(x²) = |x|, que no es la identidad en ℝ.' } },

    // ---------- Funciones parciales (Tarea #40) ----------
    { id: 'p44', origen: 'Tarea #40 a', pedido: 'Dominio, codominio, dominio de definición, dónde no está definida, ¿es total?', enunciado: 'f : ℤ → ℝ,  f(n) = 1/n',
      solucion: { respuesta: 'No es total', tono: 'no', evaluacion: [
        'Dominio: ℤ.  Codominio: ℝ.',
        'Dominio de definición: ℤ \\ {0}.  No está definida en: {0}.',
      ] } },
    { id: 'p45', origen: 'Tarea #40 b', pedido: 'Dominio, codominio, dominio de definición, dónde no está definida, ¿es total?', enunciado: 'f : ℤ → ℤ,  f(n) = ⌈n/2⌉',
      solucion: { respuesta: 'Es total', tono: 'si', evaluacion: [
        'Dominio: ℤ.  Codominio: ℤ.',
        'Dominio de definición: ℤ (⌈n/2⌉ es entero para todo n).  No está definida en: Ø.',
      ] } },
    { id: 'p46', origen: 'Tarea #40 c', pedido: 'Dominio, codominio, dominio de definición, dónde no está definida, ¿es total?', enunciado: 'f : ℤ × ℤ → ℚ,  f(m, n) = m/n',
      solucion: { respuesta: 'No es total', tono: 'no', evaluacion: [
        'Dominio: ℤ × ℤ.  Codominio: ℚ.',
        'Dominio de definición: {(m, n) | n ≠ 0}.  No está definida en: {(m, 0) | m ∈ ℤ}.',
      ] } },
    { id: 'p47', origen: 'Tarea #40 d', pedido: 'Dominio, codominio, dominio de definición, dónde no está definida, ¿es total?', enunciado: 'f : ℤ × ℤ → ℤ,  f(m, n) = mn',
      solucion: { respuesta: 'Es total', tono: 'si', evaluacion: [
        'Dominio: ℤ × ℤ.  Codominio: ℤ.',
        'Dominio de definición: ℤ × ℤ.  No está definida en: Ø.',
      ], nota: 'En la tarea dice "ℤ × X"; es ℤ × ℤ.' } },
    { id: 'p48', origen: 'Tarea #40 e', pedido: 'Dominio, codominio, dominio de definición, dónde no está definida, ¿es total?', enunciado: 'f : ℤ × ℤ → ℤ,  f(m, n) = m − n si m > n',
      solucion: { respuesta: 'No es total', tono: 'no', evaluacion: [
        'Dominio: ℤ × ℤ.  Codominio: ℤ.',
        'Dominio de definición: {(m, n) | m > n}.  No está definida en: {(m, n) | m ≤ n}.',
      ] } },
    { id: 'p49', origen: 'Diapositivas, Ej. 34', pedido: '¿Dónde está definida?', enunciado: 'f : ℤ → ℝ,  f(n) = √n',
      solucion: { respuesta: 'En los enteros no negativos: {0, 1, 2, …}', evaluacion: [
        'Para n < 0, √n no es real. Para n = 0, √0 = 0 sí existe.',
      ], nota: 'La diapositiva dice "enteros positivos", lo que deja fuera al 0.' } },

    // ---------- Inyectiva y sobre en ℤ (diapositivas) ----------
    { id: 'p50', origen: 'Diapositivas, Ej. 9 y 14', pedido: '¿Es inyectiva? ¿Es sobre?', enunciado: 'f : ℤ → ℤ,  f(x) = x²',
      muestra: { dominio: enteros(-60, 60), f: (x) => x * x, inyectiva: false, sobre: false, falta: -1 },
      solucion: { respuesta: 'Ni inyectiva ni sobre', tono: 'no', evaluacion: [
        'No inyectiva: f(1) = f(−1) = 1, con 1 ≠ −1.',
        'No sobre: ningún entero al cuadrado da −1.',
      ], nota: 'La diapositiva del Ej. 9 dice que "es uno a uno debido a que f(1) = f(−1)": es al revés, ese ejemplo muestra que NO lo es. Con dominio ℤ⁺ sí es inyectiva.' } },
    { id: 'p51', origen: 'Diapositivas, Ej. 12', pedido: 'Demuestra que es estrictamente creciente:', enunciado: 'f(x) = x²  de los reales positivos en los reales positivos',
      solucion: { tecnica: 'Directa', pasos: [
        { f: '0 < x < y', j: 'sean x, y positivos cualesquiera con x < y' },
        { f: 'x · x < x · y', j: 'multiplicar x < y por x > 0' },
        { f: 'x · y < y · y', j: 'multiplicar x < y por y > 0' },
        { f: 'x² < y²', j: 'juntar las dos desigualdades' },
      ], nota: 'La diapositiva escribe "x · y = y²"; es x · y < y². Con dominio ℝ no es estrictamente creciente: −1 < 0 pero (−1)² = 1 > 0 = 0².' } },
  ],
});
