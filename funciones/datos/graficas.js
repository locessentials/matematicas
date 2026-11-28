// Gráficas de funciones con piso y techo (Tarea #33–35 y Figura 10 de las diapositivas).
// solucion.grafica la dibuja assets/js/grafica.js: punto cerrado = la función vale eso ahí; punto abierto = no.
ESTUDIO.actividad({
  id: 'graficas',
  titulo: 'Gráficas con piso y techo',
  corto: 'Gráficas',
  tipo: 'problemas',
  descripcion: 'Dibuja la gráfica en papel y luego compárala. Fíjate sobre todo en qué extremo de cada escalón va cerrado y cuál abierto.',
  instrucciones: [
    'Encuentra dónde salta la función: donde lo de adentro del piso o techo es un entero.',
    'Entre dos saltos la función es constante: evalúa en un punto del tramo.',
    'En cada salto evalúa justo en el punto: ahí va el punto cerrado. Piso: cerrado a la izquierda del escalón. Techo: cerrado a la derecha.',
  ],
  instruccionCorta: 'Dibuja la gráfica.',
  problemas: [
    {
      id: 'g1', origen: 'Diapositivas, Fig. 10 a', pedido: 'Dibuja la gráfica de ℝ en ℝ:', enunciado: 'f(x) = ⌊x⌋',
      solucion: { tecnica: 'Escalones', evaluacion: [
        'Vale n en todo el intervalo [n, n + 1): cerrado a la izquierda, abierto a la derecha.',
      ], grafica: { f: (x) => piso(x), de: -3, a: 3 } },
    },
    {
      id: 'g2', origen: 'Diapositivas, Fig. 10 b', pedido: 'Dibuja la gráfica de ℝ en ℝ:', enunciado: 'f(x) = ⌈x⌉',
      solucion: { tecnica: 'Escalones', evaluacion: [
        'Vale n + 1 en todo el intervalo (n, n + 1]: abierto a la izquierda, cerrado a la derecha.',
      ], grafica: { f: (x) => techo(x), de: -3, a: 3 } },
    },
    {
      id: 'g3', origen: 'Tarea #33', pedido: 'Dibuja la gráfica de ℝ en ℝ:', enunciado: 'f(x) = ⌊2x⌋',
      solucion: { tecnica: 'Escalones', evaluacion: [
        'Salta donde 2x es entero: en cada múltiplo de ½.',
        'Vale k en [k/2, (k + 1)/2): escalones de ancho ½ y alto 1.',
      ], grafica: { f: (x) => piso(2 * x), de: -2, a: 2 } },
    },
    {
      id: 'g4', origen: 'Tarea #34', pedido: 'Dibuja la gráfica de ℝ en ℝ:', enunciado: 'f(x) = ⌊x⌋ + ⌊x/2⌋',
      pista: 'Separa en x ∈ [2k, 2k + 1) y x ∈ [2k + 1, 2k + 2).',
      solucion: { tecnica: 'Escalones', evaluacion: [
        'En [2k, 2k + 1): ⌊x⌋ = 2k y ⌊x/2⌋ = k, así que vale 3k.',
        'En [2k + 1, 2k + 2): ⌊x⌋ = 2k + 1 y ⌊x/2⌋ = k, así que vale 3k + 1.',
        'Los saltos alternan: sube 1 en los impares y 2 en los pares.',
      ], grafica: { f: (x) => piso(x) + piso(x / 2), de: -4, a: 4 } },
    },
    {
      id: 'g5', origen: 'Tarea #35 a', pedido: 'Dibuja la gráfica de ℝ en ℝ:', enunciado: 'f(x) = ⌊x + ½⌋',
      solucion: { tecnica: 'Escalones', evaluacion: [
        'Vale k en [k − ½, k + ½): es redondear al entero más cercano (los empates hacia arriba).',
      ], grafica: { f: (x) => piso(x + 1 / 2), de: -3, a: 3 } },
    },
    {
      id: 'g6', origen: 'Tarea #35 b', pedido: 'Dibuja la gráfica de ℝ en ℝ:', enunciado: 'f(x) = ⌊2x + 1⌋',
      solucion: { tecnica: 'Escalones', evaluacion: [
        '⌊2x + 1⌋ = ⌊2x⌋ + 1 (propiedad 4a): la de ⌊2x⌋ subida 1.',
        'Vale k en [(k − 1)/2, k/2).',
      ], grafica: { f: (x) => piso(2 * x + 1), de: -2, a: 2 } },
    },
    {
      id: 'g7', origen: 'Tarea #35 c', pedido: 'Dibuja la gráfica de ℝ en ℝ:', enunciado: 'f(x) = ⌈x/3⌉',
      solucion: { tecnica: 'Escalones', evaluacion: [
        'Salta en los múltiplos de 3.',
        'Vale k en (3(k − 1), 3k]: escalones de ancho 3, cerrados a la derecha.',
      ], grafica: { f: (x) => techo(x / 3), de: -6, a: 6 } },
    },
    {
      id: 'g8', origen: 'Tarea #35 d', pedido: 'Dibuja la gráfica de ℝ \\ {0} en ℝ:', enunciado: 'f(x) = ⌈1/x⌉',
      pista: 'Separa x > 0 y x < 0. ⌈1/x⌉ = k quiere decir k − 1 < 1/x ≤ k.',
      solucion: { tecnica: 'Escalones cada vez más angostos cerca del 0', evaluacion: [
        'No está definida en x = 0.',
        'x ≥ 1: 0 < 1/x ≤ 1, vale 1.',
        'x > 0: vale k (k ≥ 2) en [1/k, 1/(k − 1)): por ejemplo 2 en [½, 1), 3 en [⅓, ½).',
        'x < −1: −1 < 1/x < 0, vale 0. En x = −1 vale −1.',
        '−1 < x < 0: vale −k en [−1/k, −1/(k + 1)): por ejemplo −1 en [−1, −½), −2 en [−½, −⅓).',
      ], grafica: { f: (x) => techo(1 / x), de: -3, a: 3, y: [-6, 6] } },
    },
    {
      id: 'g9', origen: 'Tarea #35 e', pedido: 'Dibuja la gráfica de ℝ en ℝ:', enunciado: 'f(x) = ⌈x − 2⌉ + ⌊x + 2⌋',
      pista: 'Saca los enteros (propiedad 4): queda ⌈x⌉ + ⌊x⌋.',
      solucion: { tecnica: 'Simplificar primero', evaluacion: [
        '⌈x − 2⌉ + ⌊x + 2⌋ = (⌈x⌉ − 2) + (⌊x⌋ + 2) = ⌈x⌉ + ⌊x⌋.',
        'En un entero n vale n + n = 2n.',
        'En (n, n + 1) vale (n + 1) + n = 2n + 1.',
        'Son tramos abiertos con un punto suelto en cada entero.',
      ], grafica: { f: (x) => techo(x - 2) + piso(x + 2), de: -3, a: 3 } },
    },
    {
      id: 'g10', origen: 'Tarea #35 f', pedido: 'Dibuja la gráfica de ℝ en ℝ:', enunciado: 'f(x) = ⌊2x⌋ · ⌈x/2⌉',
      pista: '⌊2x⌋ cambia en cada múltiplo de ½ y ⌈x/2⌉ en cada múltiplo de 2.',
      solucion: { tecnica: 'Producto de escalones', evaluacion: [
        'En (0, 2]: ⌈x/2⌉ = 1, así que es ⌊2x⌋: 0, 1, 2, 3 y en x = 2 vale 4.',
        'En (−2, 0]: ⌈x/2⌉ = 0, así que vale 0.',
        'En (2, 4]: ⌈x/2⌉ = 2, así que vale 2⌊2x⌋: 8, 10, 12, 14 y en x = 4 vale 16.',
        'En (−4, −2]: ⌈x/2⌉ = −1, así que vale −⌊2x⌋.',
      ], grafica: { f: (x) => piso(2 * x) * techo(x / 2), de: -3, a: 3 } },
    },
    {
      id: 'g11', origen: 'Tarea #35 g', pedido: 'Dibuja la gráfica de ℝ en ℝ:', enunciado: 'f(x) = ⌈⌊x − ½⌋ + ½⌉',
      pista: 'Lo de adentro, ⌊x − ½⌋, es un entero m. ¿Cuánto es ⌈m + ½⌉?',
      solucion: { tecnica: 'Simplificar primero', evaluacion: [
        'Sea m = ⌊x − ½⌋, un entero: ⌈m + ½⌉ = m + 1.',
        'Así f(x) = ⌊x − ½⌋ + 1 = ⌊x + ½⌋: la misma gráfica del inciso a.',
        'Vale k en [k − ½, k + ½).',
      ], grafica: { f: (x) => techo(piso(x - 1 / 2) + 1 / 2), de: -3, a: 3 } },
    },
  ],
});
