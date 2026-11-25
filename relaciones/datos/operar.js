// Representar y operar: de la condición a la matriz y al dígrafo (Ejercicios 3.1–3.6) y operaciones con relaciones (3.15).
// Las respuestas las calcula assets/js/relaciones.js a partir de "regla", "pares" o "expr"; tools/verificar.mjs revisa que se puedan leer.
const X4 = '{1, 2, 3, 4}';
const X5 = '{1, 2, 3, 4, 5}';
const R_315 = '{(1, 2), (1, 3), (2, 2), (2, 1), (4, 4)}';
const S_315 = '{(1, 1), (1, 3), (2, 3), (3, 1)}';
const DATOS_315 = { R: R_315, S: S_315 };

ESTUDIO.actividad({
  id: 'operar',
  titulo: 'Representar y operar',
  corto: 'Representar y operar',
  tipo: 'matriz',
  descripcion:
    'Toca las casillas de la matriz para marcar las parejas; el dígrafo y la lista R = {…} se dibujan solos. ' +
    'En "Construir" pasas de la condición a la relación; en "Operar" calculas inversas, complementos, composiciones y potencias.',
  instrucciones: [
    'Renglón = primer elemento (x), columna = segundo elemento (y). Un 1 en el renglón x y la columna y significa (x, y) ∈ R.',
    'Ve renglón por renglón: fija x y pregúntate para qué valores de y se cumple la condición.',
    'Dominio: los renglones que tienen algún 1. Imagen: las columnas que tienen algún 1.',
    'S ∘ R se lee de derecha a izquierda: primero R, después S. (x, z) ∈ S ∘ R si hay un y con (x, y) ∈ R y (y, z) ∈ S.',
    'R⁻¹ voltea las parejas (la matriz se refleja en la diagonal). Rᶜ cambia los 1 por 0 y los 0 por 1.',
  ],
  ejercicios: [
    // ---------- Construir ----------
    { id: 'c1', modo: 'construir', origen: 'Ej. 3.1 a', X: X4, enunciado: 'X = {1, 2, 3, 4}\nR₁ = {(x, y) | x = y}', regla: (x, y) => x === y,
      nota: 'Es la relación identidad I: solo la diagonal.' },
    { id: 'c2', modo: 'construir', origen: 'Ej. 3.1 b', X: X4, enunciado: 'X = {1, 2, 3, 4}\nR₂ = {(x, y) | 3x = y}', regla: (x, y) => 3 * x === y,
      nota: 'Solo x = 1 sirve: 3 · 2 = 6 ya no está en X. D_R = {1} y I_R = {3}.' },
    { id: 'c3', modo: 'construir', origen: 'Ej. 3.1 c', X: X4, enunciado: 'X = {1, 2, 3, 4}\nR₉ = {(x, y) | x es divisible por y}', regla: (x, y) => x % y === 0,
      nota: '"x es divisible por y" es lo mismo que "y divide a x": y ∣ x. Por eso la primera columna (y = 1) está llena: 1 divide a todo.' },
    { id: 'c4', modo: 'construir', origen: 'Ej. 3.1 d y 3.3 c', X: X4, enunciado: 'X = {1, 2, 3, 4}\nR₁₀ = {(x, y) | x² ≥ y}', regla: (x, y) => x * x >= y,
      nota: 'Para x = 1 solo sirve y = 1; para x ≥ 2, x² ≥ 4 y sirven todos.' },
    { id: 'c5', modo: 'construir', origen: 'Ej. 3.2', X: '{-3, -2, -1, 0, 1, 2, 3}', Y: '{1, 2, 3}',
      enunciado: 'R = {(x, y) | x ∈ ℤ, y ∈ ℕ, x² + y² < 10}\n(solo pueden servir x ∈ {−3, …, 3} y y ∈ {1, 2, 3})',
      regla: (x, y) => x * x + y * y < 10,
      nota: 'Con ℕ = {1, 2, 3, …}, como en la hoja de conjuntos: y² < 10 deja y ∈ {1, 2, 3}, y x² < 10 deja x ∈ {−3, …, 3}. ' +
        'Si tu profesor cuenta el 0 como natural, hay que agregar las parejas (−3, 0), (−2, 0), …, (3, 0).' },
    { id: 'c6', modo: 'construir', origen: 'Ej. 3.3 a', X: '{1, 2, 3}', enunciado: 'X = {1, 2, 3}\nR = {(1, 2), (2, 1), (3, 3), (1, 1), (2, 2)}',
      pedido: 'Marca las parejas en la matriz y mira el dígrafo:', pares: '{(1, 2), (2, 1), (3, 3), (1, 1), (2, 2)}',
      nota: 'Cada pareja (x, x) es un lazo. (1, 2) y (2, 1) son una flecha de ida y una de regreso.' },
    { id: 'c7', modo: 'construir', origen: 'Ej. 3.3 b', X: X4, enunciado: 'X = {1, 2, 3, 4}\nR = {(x, y) | x ≥ y}', regla: (x, y) => x >= y,
      nota: 'Es el triángulo de abajo con la diagonal: cada número se relaciona con él mismo y con los más chicos.' },
    { id: 'c8', modo: 'construir', origen: 'Ej. 3.4', X: X5, enunciado: 'X = {1, 2, 3, 4, 5}\nR = {(x, y) | 3 divide a x − y}', regla: (x, y) => (x - y) % 3 === 0,
      nota: 'x − y tiene que ser 0, 3 o −3 (en X no hay diferencias de 6). D_R = I_R = X porque cada x se relaciona al menos consigo mismo.' },
    { id: 'c9', modo: 'construir', origen: 'Ej. 3.5', X: X5, enunciado: 'X = {1, 2, 3, 4, 5}\nR = {(x, y) | x + y ≤ 6}', regla: (x, y) => x + y <= 6,
      nota: 'Para x = 5 solo sirve y = 1, así que 5 sí está en el dominio. Es simétrica: x + y = y + x.' },
    { id: 'c10', modo: 'construir', origen: 'Ej. 3.6', X: X5, enunciado: 'X = {1, 2, 3, 4, 5}\nR = {(x, y) | x = y − 1}', regla: (x, y) => x === y - 1,
      nota: 'Es "y es el siguiente de x". El 5 no tiene siguiente en X (no está en el dominio) y el 1 no es siguiente de nadie (no está en la imagen).' },
    { id: 'c11', modo: 'construir', X: '{1, 2, 3, 4, 5, 6}', enunciado: 'X = {1, 2, 3, 4, 5, 6}\nR = {(x, y) | x ∣ y}', regla: (x, y) => y % x === 0,
      nota: 'x ∣ y: "x divide a y". Ahora el primer renglón (x = 1) está lleno. Compárala con R₉ de 3.1 c: es su inversa.' },
    { id: 'c12', modo: 'construir', X: '{1, 2, 3, 4}', Y: '{1, 2, 3}', enunciado: 'R de X = {1, 2, 3, 4} en Y = {1, 2, 3}\nR = {(x, y) | x + y = 4}',
      regla: (x, y) => x + y === 4,
      nota: 'Cuando X ≠ Y la matriz no es cuadrada y el dígrafo tiene dos columnas. El 4 no está en el dominio: necesitaría y = 0.' },
    { id: 'c13', modo: 'construir', X: X4, enunciado: 'X = {1, 2, 3, 4}\nR = {(x, y) | x < y}', regla: (x, y) => x < y,
      nota: 'El ejemplo de la hoja: el triángulo de arriba, sin la diagonal.' },

    // ---------- Operar ----------
    { id: 'o1', modo: 'operar', origen: 'Ej. 3.15 a', X: X4, datos: DATOS_315, expr: 'R ∘ S',
      nota: 'Primero S, después R. Por ejemplo (3, 1) ∈ S y (1, 2) ∈ R dan (3, 2) ∈ R ∘ S.' },
    { id: 'o2', modo: 'operar', origen: 'Ej. 3.15 b', X: X4, datos: DATOS_315, expr: 'S ∘ R',
      nota: 'Compáralo con R ∘ S: son distintos, la composición no es conmutativa.' },
    { id: 'o3', modo: 'operar', origen: 'Ej. 3.15 c', X: X4, datos: DATOS_315, expr: 'R ∘ (S ∘ R)',
      nota: 'Usa el resultado de S ∘ R y después aplica R. Da lo mismo que (R ∘ S) ∘ R: la composición es asociativa.' },
    { id: 'o4', modo: 'operar', origen: 'Ej. 3.15 d', X: X4, datos: DATOS_315, expr: '(R ∘ S) ∘ R',
      nota: 'Da lo mismo que R ∘ (S ∘ R): la composición es asociativa.' },
    { id: 'o5', modo: 'operar', origen: 'Ej. 3.15 e', X: X4, datos: DATOS_315, expr: 'R ∘ R',
      nota: 'R ∘ R = R². Sigue caminos de dos flechas en el dígrafo de R.' },
    { id: 'o6', modo: 'operar', origen: 'Ej. 3.15 f', X: X4, datos: DATOS_315, expr: 'S ∘ S' },
    { id: 'o7', modo: 'operar', origen: 'Ej. 3.15 g', X: X4, datos: DATOS_315, expr: 'R ∘ R ∘ R',
      nota: 'R³ = R² ∘ R: caminos de tres flechas. Aparece (1, 1) por el camino 1 → 2 → 2 → 1.' },
    { id: 'o8', modo: 'operar', X: X5, datos: { R: { regla: (x, y) => x === y - 1 } }, expr: 'R⁻¹',
      nota: 'R es "y es el siguiente de x"; R⁻¹ es "y es el anterior de x": {(x, y) | x = y + 1}.' },
    { id: 'o9', modo: 'operar', X: '{1, 2, 3}', datos: { R: { regla: (x, y) => x < y } }, expr: 'Rᶜ',
      nota: 'El complemento de < es ≥: las parejas de X × X que no cumplen x < y.' },
    { id: 'o10', modo: 'operar', X: '{a, b, c}', datos: { R: '{(a, b), (b, c), (c, a)}' }, expr: 'R²',
      nota: 'El ejemplo de la hoja: a → b → c da (a, c), y así con las otras.' },
    { id: 'o11', modo: 'operar', X: '{a, b, c}', datos: { R: '{(a, b), (b, c), (c, a)}' }, expr: 'R³',
      nota: 'Dar la vuelta completa al triángulo regresa al inicio: R³ = I.' },
    { id: 'o12', modo: 'operar', X: X4, datos: { R: '{(1, 2), (2, 3), (3, 4)}' }, expr: 'R⁺',
      nota: 'R⁺ = R ∪ R² ∪ R³ (con |X| = 4 basta hasta R⁴, que aquí es Ø). Es la relación transitiva más pequeña que contiene a R: aquí resulta ser <.' },
    { id: 'o13', modo: 'operar', X: '{1, 2, 3}', datos: { R: { regla: (x, y) => x <= y } }, expr: 'R ∩ R⁻¹',
      nota: '≤ ∩ ≥ es =, la identidad. Que R ∩ R⁻¹ ⊆ I es justo lo que dice que R es antisimétrica (teorema 3.2.1 f).' },
    { id: 'o14', modo: 'operar', X: '{1, 2, 3}', datos: { R: '{(1, 2), (2, 3)}' }, expr: 'R ∪ R⁻¹',
      nota: 'Agregar las parejas volteadas da la relación simétrica más pequeña que contiene a R.' },
    { id: 'o15', modo: 'operar', X: X4, datos: DATOS_315, expr: '(R ∪ S)⁻¹',
      nota: 'Es igual a R⁻¹ ∪ S⁻¹ (teorema 3.1.1 d): voltear todo es lo mismo que voltear cada parte.' },
    { id: 'o16', modo: 'operar',
      datos: { R: { X: '{1, 2, 3}', Y: '{a, b}', pares: '{(1, a), (2, a), (3, b)}' }, S: { X: '{a, b}', Y: '{u, v}', pares: '{(a, u), (b, u), (b, v)}' } },
      expr: 'S ∘ R',
      nota: 'R va de X en Y y S va de Y en Z, así que S ∘ R va de X en Z. Aquí R ∘ S ni siquiera tiene sentido: S termina en {u, v} y R empieza en {1, 2, 3}.' },
  ],
});
