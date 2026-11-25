// Relaciones de equivalencia, clases y particiones (Ejercicios 3.18–3.21 y ejemplos 3.4.x del libro).
// tools/verificar.mjs revisa que cada ejercicio de "clases" sea de equivalencia y que cada "ejemplo" cumpla lo que pide.
const PARTICION_TXT = (bloques) => RELACIONES.texto(RELACIONES.desdeParticion(bloques));
const ESTADO_DE = {
  Montemorelos: 'Nuevo León', Monterrey: 'Nuevo León',
  Veracruz: 'Veracruz', Xalapa: 'Veracruz', Orizaba: 'Veracruz', 'Córdoba': 'Veracruz',
  Guadalajara: 'Jalisco',
};

ESTUDIO.actividad({
  id: 'equivalencia',
  titulo: 'Equivalencia y particiones',
  corto: 'Equivalencia',
  tipo: 'matriz',
  descripcion:
    'Decide si una relación es de equivalencia, encuentra sus clases y el conjunto cociente, pasa de una partición a su relación, ' +
    'y construye relaciones de equivalencia con un número dado de clases.',
  instrucciones: [
    'Equivalencia = reflexiva, simétrica y transitiva.',
    'Clase de a: [a] = {x ∈ X : xRa}, todos los que están relacionados con a. En la matriz es la columna de a (o su renglón, que es igual por la simetría).',
    'Dos clases son iguales o ajenas. El conjunto cociente X/R lista cada clase una sola vez, y siempre es una partición de X.',
    'De partición a relación: xRy si x y y están en el mismo bloque. En la matriz, cada bloque es un cuadrado lleno de 1 (si ordenas los elementos por bloque).',
  ],
  ejercicios: [
    // ---------- ¿Es de equivalencia? (3.18) ----------
    { id: 'q1', modo: 'propiedades', origen: 'Ej. 3.18 a', X: '{1, 2, 3, 4, 5}', enunciado: 'X = {1, 2, 3, 4, 5}\nR = {(1, 1), (2, 2), (3, 3), (4, 4), (1, 3), (3, 1), (3, 4), (4, 3)}',
      pares: '{(1, 1), (2, 2), (3, 3), (4, 4), (1, 3), (3, 1), (3, 4), (4, 3)}',
      nota: 'Fallan dos cosas: falta (5, 5) y, aunque se agregara, 1 → 3 → 4 pide (1, 4). No es de equivalencia, así que no tiene clases.' },
    { id: 'q2', modo: 'propiedades', origen: 'Ej. 3.18 b', X: '{1, 2, 3, 4, 5}', enunciado: 'X = {1, 2, 3, 4, 5}\nR = {(x, y) | 1 ≤ x ≤ 5, 1 ≤ y ≤ 5}', regla: () => true,
      nota: 'Es X × X: todos con todos. Una sola clase, X/R = {X}. Recuerda que {X} también es una partición.' },
    { id: 'q3', modo: 'propiedades', origen: 'Ej. 3.18 c', X: '{1, 2, 3, 4, 5}', enunciado: 'X = {1, 2, 3, 4, 5}\nR = {(x, y) | 4 divide a x − y}', regla: (x, y) => (x - y) % 4 === 0,
      nota: 'Es la congruencia módulo 4 restringida a {1, …, 5}: solo 1 y 5 tienen el mismo residuo. X/R = {{1, 5}, {2}, {3}, {4}}.' },
    { id: 'q4', modo: 'propiedades', origen: 'Ej. 3.18 d', X: '{1, 2, 3, 4, 5}', enunciado: 'X = {1, 2, 3, 4, 5}\nR = {(x, y) | 3 divide a x + y}', regla: (x, y) => (x + y) % 3 === 0,
      nota: 'No es reflexiva: 1 + 1 = 2 no es múltiplo de 3. Con eso ya no es de equivalencia (con suma no funciona; con resta sí).' },

    // ---------- Clases y conjunto cociente ----------
    { id: 'k1', modo: 'clases', origen: 'Ej. 3.18 c', X: '{1, 2, 3, 4, 5}', enunciado: 'X = {1, 2, 3, 4, 5}\nR = {(x, y) | 4 divide a x − y}', regla: (x, y) => (x - y) % 4 === 0,
      nota: 'Para mostrar que X/R es partición: ningún bloque es vacío, son ajenos de dos en dos, y {1, 5} ∪ {2} ∪ {3} ∪ {4} = X.' },
    { id: 'k2', modo: 'clases', origen: 'Ejemplo 3.4.10', X: '{1, 2, 3, 4, 5}',
      enunciado: 'X = {1, 2, 3, 4, 5}\nR = {(1, 1), (1, 3), (1, 5), (2, 2), (2, 4), (3, 1), (3, 3), (3, 5), (4, 2), (4, 4), (5, 1), (5, 3), (5, 5)}',
      pares: '{(1, 1), (1, 3), (1, 5), (2, 2), (2, 4), (3, 1), (3, 3), (3, 5), (4, 2), (4, 4), (5, 1), (5, 3), (5, 5)}',
      nota: '[1] = [3] = [5] = {1, 3, 5} y [2] = [4] = {2, 4}. En X/R cada clase se escribe una vez: X/R = {{1, 3, 5}, {2, 4}}.' },
    { id: 'k3', modo: 'clases', origen: 'Ejemplo 3.4.11', X: '{-4, -3, -2, -1, 0, 1, 2, 3, 4}',
      enunciado: 'A = {−4, −3, …, 3, 4}\nR = {(x, y) | x(x + 1) = y(y + 1)}', regla: (x, y) => x * (x + 1) === y * (y + 1),
      nota: 'x(x + 1) toma el mismo valor en x y en −x − 1: 0 y −1 dan 0; 1 y −2 dan 2; etc. El 4 se queda solo porque −5 no está en A. ' +
        '(La lista de R en el libro tiene parejas de menos, por ejemplo falta (−1, 0); las clases sí están bien.)' },
    { id: 'k4', modo: 'clases', X: '{1, 2, 3, 4, 5, 6, 7, 8, 9}', enunciado: 'X = {1, 2, …, 9}\nR = {(x, y) | 3 ∣ x − y}', regla: (x, y) => (x - y) % 3 === 0,
      dibujo: false,
      nota: 'Las clases son los residuos al dividir entre 3: {3, 6, 9} (residuo 0), {1, 4, 7} (residuo 1) y {2, 5, 8} (residuo 2).' },
    { id: 'k5', modo: 'clases', X: '{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}', enunciado: 'X = {0, 1, …, 9}\nx R y ⟺ x ≡ y (mod 4)', regla: (x, y) => (x - y) % 4 === 0,
      dibujo: false,
      nota: 'Cuatro clases, una por residuo: [0] = {0, 4, 8}, [1] = {1, 5, 9}, [2] = {2, 6}, [3] = {3, 7}. Sobre todo ℤ serían [0] = {4k}, [1] = {4k + 1}, [2] = {4k + 2}, [3] = {4k + 3}.' },
    { id: 'k6', modo: 'clases', origen: 'Ej. 3.20 c', X: '{Montemorelos, Monterrey, Veracruz, Xalapa, Orizaba, Córdoba, Guadalajara}',
      enunciado: 'X = {Montemorelos, Monterrey, Veracruz, Xalapa, Orizaba, Córdoba, Guadalajara}\nxRy si x y y están en el mismo estado',
      regla: (x, y) => ESTADO_DE[x] === ESTADO_DE[y], verMatriz: false,
      nota: 'Una clase por estado: Nuevo León {Montemorelos, Monterrey}, Veracruz {Veracruz, Xalapa, Orizaba, Córdoba}, Jalisco {Guadalajara}. ' +
        'La demostración de que es de equivalencia (inciso b) está en la pestaña Demostraciones.' },
    { id: 'k7', modo: 'clases', X: '{1, 2, 3, 4, 5, 6}', enunciado: 'X = {1, 2, 3, 4, 5, 6}\nR = {(x, y) | x + y es par}', regla: (x, y) => (x + y) % 2 === 0,
      nota: 'x + y es par cuando los dos son pares o los dos son impares: dos clases, pares e impares (Ej. 3.17 a, restringido a {1, …, 6}).' },
    { id: 'k8', modo: 'clases', origen: 'Ej. 3.17 d', X: '{1, 2, 3, 4, 5, 6}', enunciado: 'X = {1, 2, 3, 4, 5, 6}\nR = {(x, y) | 3 divide a x² − y²}', regla: (x, y) => (x * x - y * y) % 3 === 0,
      nota: 'x² deja residuo 0 al dividir entre 3 si 3 ∣ x, y residuo 1 si no. Por eso hay solo dos clases: los múltiplos de 3 y los demás.' },

    // ---------- De partición a relación (3.19) ----------
    { id: 'c1', modo: 'construir', origen: 'Ej. 3.19 a', particion: [[1, 2], [3, 4]], enunciado: 'X = {1, 2, 3, 4}\nPartición: {{1, 2}, {3, 4}}\nxRy si x y y están en el mismo bloque',
      dominio: false, nota: 'Cada bloque de k elementos da k² parejas: aquí 4 + 4 = 8. (En el libro a este inciso le falta la llave final.)' },
    { id: 'c2', modo: 'construir', origen: 'Ej. 3.19 b', particion: [[1], [2], [3, 4]], enunciado: 'X = {1, 2, 3, 4}\nPartición: {{1}, {2}, {3, 4}}\nxRy si x y y están en el mismo bloque',
      dominio: false, nota: 'Los bloques de un elemento solo dan su lazo. Clases: [1] = {1}, [2] = {2}, [3] = [4] = {3, 4}.' },
    { id: 'c3', modo: 'construir', origen: 'Ej. 3.19 c', particion: [[1], [2, 4], [3]], enunciado: 'X = {1, 2, 3, 4}\nPartición: {{1}, {2, 4}, {3}}\nxRy si x y y están en el mismo bloque',
      dominio: false, nota: 'Aunque 2 y 4 no son vecinos en la matriz, el bloque {2, 4} da (2, 2), (2, 4), (4, 2), (4, 4).' },
    { id: 'c4', modo: 'construir', origen: 'Ejemplo de la hoja', particion: [[1, 3], [5], [7, 9]], enunciado: 'X = {1, 3, 5, 7, 9}\nPartición: {{1, 3}, {5}, {7, 9}}\nxRy si x y y están en el mismo bloque',
      dominio: false, nota: 'R = {(1, 1), (1, 3), (3, 1), (3, 3), (5, 5), (7, 7), (7, 9), (9, 7), (9, 9)}. Por el teorema 3.4.1, siempre sale de equivalencia.' },

    // ---------- Dar un ejemplo (3.21) ----------
    { id: 'j1', modo: 'ejemplo', origen: 'Ej. 3.21', X: '{1, 2, 3, 4, 5, 6, 7}', pide: { equivalencia: true, clases: 4 },
      ejemplo: PARTICION_TXT([[1, 2], [3, 4], [5, 6], [7]]),
      nota: 'Lo más fácil es pensar primero en una partición con 4 bloques, por ejemplo {{1, 2}, {3, 4}, {5, 6}, {7}}, y luego escribir su relación.' },
    { id: 'j2', modo: 'ejemplo', X: '{1, 2, 3, 4, 5}', pide: { equivalencia: true, clases: 2 },
      ejemplo: PARTICION_TXT([[1, 2, 3], [4, 5]]),
      nota: 'Cualquier partición en dos bloques sirve: {{1, 2, 3}, {4, 5}}, {{1}, {2, 3, 4, 5}}, …' },
    { id: 'j3', modo: 'ejemplo', X: '{1, 2, 3, 4}', pide: { equivalencia: true, clases: 4 },
      ejemplo: '{(1, 1), (2, 2), (3, 3), (4, 4)}',
      nota: 'Con tantas clases como elementos, cada uno va solo: la única opción es la identidad I.' },
    { id: 'j4', modo: 'ejemplo', X: '{1, 2, 3}', pide: { equivalencia: true, clases: 1 },
      ejemplo: '{(1, 1), (1, 2), (1, 3), (2, 1), (2, 2), (2, 3), (3, 1), (3, 2), (3, 3)}',
      nota: 'Con una sola clase, todos están relacionados con todos: la única opción es X × X.' },
    { id: 'j5', modo: 'ejemplo', X: '{1, 2, 3}', pide: { reflexiva: true, simetrica: true, equivalencia: false },
      ejemplo: '{(1, 1), (2, 2), (3, 3), (1, 2), (2, 1), (2, 3), (3, 2)}',
      nota: 'Si es reflexiva y simétrica, lo único que puede fallar es la transitiva: 1 ~ 2 ~ 3 sin 1 ~ 3.' },
  ],
});
