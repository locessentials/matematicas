// Cálculos con piso y techo (Tarea #5, #16, #31, #32 y ejemplos de las diapositivas).
// numerico: true → tools/verificar.mjs evalúa cada renglón: las partes separadas por " = " deben dar lo mismo,
// y un renglón con op '=' debe empezar con lo que valía el renglón anterior. f: la función que se usa como f(…).
// Los renglones de texto llevan libre: true.
ESTUDIO.actividad({
  id: 'calculo',
  titulo: 'Piso y techo: cálculos',
  corto: 'Cálculos',
  tipo: 'problemas',
  descripcion: 'Calcular valores de piso y techo, imágenes de conjuntos, y problemas de bytes y bloques.',
  instrucciones: [
    '⌊x⌋: el entero más grande que es ≤ x (redondear hacia abajo, también con negativos: ⌊−0.875⌋ = −1).',
    '⌈x⌉: el entero más chico que es ≥ x (redondear hacia arriba: ⌈−0.75⌉ = 0).',
    'Con expresiones anidadas, calcula de adentro hacia afuera.',
    'Para "cuántos bloques hacen falta" se usa techo; para "cuántos bloques completos caben", piso.',
  ],
  instruccionCorta: 'Calcula con piso y techo.',
  problemas: [
    {
      id: 'c1', origen: 'Tarea #5 a–f', pedido: 'Calcula:', numerico: true,
      enunciado: 'a) ⌈3/4⌉   b) ⌊7/8⌋   c) ⌈−3/4⌉\nd) ⌊−7/8⌋   e) ⌈3⌉   f) ⌊−1⌋',
      solucion: { tecnica: 'Redondear', pasos: [
        { f: 'a)', tipo: 'titulo' },
        { f: '⌈3/4⌉ = ⌈0.75⌉ = 1', j: 'el entero más chico ≥ 0.75' },
        { f: 'b)', tipo: 'titulo' },
        { f: '⌊7/8⌋ = ⌊0.875⌋ = 0', j: 'el entero más grande ≤ 0.875' },
        { f: 'c)', tipo: 'titulo' },
        { f: '⌈−3/4⌉ = ⌈−0.75⌉ = 0', j: 'hacia arriba desde −0.75 se llega a 0' },
        { f: 'd)', tipo: 'titulo' },
        { f: '⌊−7/8⌋ = ⌊−0.875⌋ = −1', j: 'hacia abajo desde −0.875 se llega a −1, no a 0' },
        { f: 'e)', tipo: 'titulo' },
        { f: '⌈3⌉ = 3', j: 'un entero se queda igual' },
        { f: 'f)', tipo: 'titulo' },
        { f: '⌊−1⌋ = −1', j: 'un entero se queda igual' },
      ], cierre: false },
    },
    {
      id: 'c2', origen: 'Tarea #5 g', pedido: 'Calcula:', numerico: true, enunciado: '⌊1/2 + ⌈3/2⌉⌋',
      solucion: { tecnica: 'De adentro hacia afuera', pasos: [
        { f: '⌊1/2 + ⌈3/2⌉⌋', j: '' },
        { op: '=', f: '⌊1/2 + 2⌋', j: '⌈1.5⌉ = 2' },
        { op: '=', f: '⌊5/2⌋', j: '' },
        { op: '=', f: '2', j: '⌊2.5⌋ = 2' },
      ], cierre: false },
    },
    {
      id: 'c3', origen: 'Tarea #5 h', pedido: 'Calcula:', numerico: true, enunciado: '⌊1/2 · ⌈5/2⌉⌋',
      solucion: { tecnica: 'De adentro hacia afuera', pasos: [
        { f: '⌊1/2 · ⌈5/2⌉⌋', j: '' },
        { op: '=', f: '⌊1/2 · 3⌋', j: '⌈2.5⌉ = 3' },
        { op: '=', f: '⌊3/2⌋', j: '' },
        { op: '=', f: '1', j: '⌊1.5⌋ = 1' },
      ], cierre: false },
    },
    {
      id: 'c4', origen: 'Diapositivas, Ej. 28', pedido: 'Calcula:', numerico: true,
      enunciado: '⌊1/2⌋   ⌈1/2⌉   ⌊−1/2⌋   ⌈−1/2⌉\n⌊3.1⌋   ⌈3.1⌉   ⌊7⌋   ⌈7⌉',
      solucion: { tecnica: 'Redondear', pasos: [
        { f: '⌊1/2⌋ = 0', j: '' },
        { f: '⌈1/2⌉ = 1', j: '' },
        { f: '⌊−1/2⌋ = −1', j: 'la diapositiva dice 1; es −1' },
        { f: '⌈−1/2⌉ = 0', j: '' },
        { f: '⌊3.1⌋ = 3', j: '' },
        { f: '⌈3.1⌉ = 4', j: '' },
        { f: '⌊7⌋ = 7', j: '' },
        { f: '⌈7⌉ = 7', j: '' },
      ], cierre: false },
    },
    {
      id: 'c5', origen: 'Tarea #16 a', pedido: 'Sea f(x) = ⌊x²/3⌋. Encuentra f(S) si', numerico: true, f: (x) => piso((x * x) / 3),
      enunciado: 'S = {−2, −1, 0, 1, 2, 3}',
      solucion: { tecnica: 'Calcular cada imagen', pasos: [
        { f: 'f(−2) = ⌊4/3⌋ = 1', j: '' },
        { f: 'f(−1) = ⌊1/3⌋ = 0', j: '' },
        { f: 'f(0) = ⌊0/3⌋ = 0', j: '' },
        { f: 'f(1) = ⌊1/3⌋ = 0', j: '' },
        { f: 'f(2) = ⌊4/3⌋ = 1', j: '' },
        { f: 'f(3) = ⌊9/3⌋ = 3', j: '' },
        { f: 'f(S) = {0, 1, 3}', j: 'sin repetir', libre: true },
      ], cierre: false },
    },
    {
      id: 'c6', origen: 'Tarea #16 b', pedido: 'Sea f(x) = ⌊x²/3⌋. Encuentra f(S) si', numerico: true, f: (x) => piso((x * x) / 3),
      enunciado: 'S = {0, 1, 2, 3, 4, 5}',
      solucion: { tecnica: 'Calcular cada imagen', pasos: [
        { f: 'f(0) = ⌊0/3⌋ = 0', j: '' },
        { f: 'f(1) = ⌊1/3⌋ = 0', j: '' },
        { f: 'f(2) = ⌊4/3⌋ = 1', j: '' },
        { f: 'f(3) = ⌊9/3⌋ = 3', j: '' },
        { f: 'f(4) = ⌊16/3⌋ = 5', j: '16/3 = 5.33…' },
        { f: 'f(5) = ⌊25/3⌋ = 8', j: '25/3 = 8.33…' },
        { f: 'f(S) = {0, 1, 3, 5, 8}', j: '', libre: true },
      ], cierre: false },
    },
    {
      id: 'c7', origen: 'Tarea #16 c', pedido: 'Sea f(x) = ⌊x²/3⌋. Encuentra f(S) si', numerico: true, f: (x) => piso((x * x) / 3),
      enunciado: 'S = {1, 5, 7, 11}',
      solucion: { tecnica: 'Calcular cada imagen', pasos: [
        { f: 'f(1) = ⌊1/3⌋ = 0', j: '' },
        { f: 'f(5) = ⌊25/3⌋ = 8', j: '' },
        { f: 'f(7) = ⌊49/3⌋ = 16', j: '49/3 = 16.33…' },
        { f: 'f(11) = ⌊121/3⌋ = 40', j: '121/3 = 40.33…' },
        { f: 'f(S) = {0, 8, 16, 40}', j: '', libre: true },
      ], cierre: false },
    },
    {
      id: 'c8', origen: 'Tarea #16 d', pedido: 'Sea f(x) = ⌊x²/3⌋. Encuentra f(S) si', numerico: true, f: (x) => piso((x * x) / 3),
      enunciado: 'S = {2, 6, 10, 14}',
      solucion: { tecnica: 'Calcular cada imagen', pasos: [
        { f: 'f(2) = ⌊4/3⌋ = 1', j: '' },
        { f: 'f(6) = ⌊36/3⌋ = 12', j: '' },
        { f: 'f(10) = ⌊100/3⌋ = 33', j: '100/3 = 33.33…' },
        { f: 'f(14) = ⌊196/3⌋ = 65', j: '196/3 = 65.33…' },
        { f: 'f(S) = {1, 12, 33, 65}', j: '', libre: true },
      ], cierre: false },
    },
    {
      id: 'c9', origen: 'Diapositivas, Ej. 29', pedido: '¿Cuántos bytes se necesitan para codificar', numerico: true, enunciado: '100 bits?',
      pista: 'Un byte son 8 bits, y el último byte puede quedar a medias.',
      solucion: { tecnica: 'Techo', pasos: [
        { f: '⌈100/8⌉ = ⌈12.5⌉ = 13', j: 'con 12 bytes no alcanza; el byte 13 queda a medias' },
      ], cierre: 'Se necesitan 13 bytes. (La diapositiva dice "13 bits".)' },
    },
    {
      id: 'c10', origen: 'Tarea #31', pedido: '¿Cuántos bytes se necesitan para codificar n bits, si n es', numerico: true,
      enunciado: 'a) 7   b) 17   c) 1001   d) 28 800',
      solucion: { tecnica: 'Techo de n/8', pasos: [
        { f: 'a)', tipo: 'titulo' }, { f: '⌈7/8⌉ = 1', j: '' },
        { f: 'b)', tipo: 'titulo' }, { f: '⌈17/8⌉ = ⌈2.125⌉ = 3', j: '' },
        { f: 'c)', tipo: 'titulo' }, { f: '⌈1001/8⌉ = ⌈125.125⌉ = 126', j: '' },
        { f: 'd)', tipo: 'titulo' }, { f: '⌈28800/8⌉ = 3600', j: 'cabe exacto' },
      ], cierre: false },
    },
    {
      id: 'c11', origen: 'Tarea #32', pedido: 'Ethernet transmite en bloques de 1500 bytes (1 kB = 1000 bytes, 1 MB = 1 000 000 bytes). ¿Cuántos bloques hacen falta para',
      numerico: true, enunciado: 'a) 150 kB   b) 384 kB   c) 1.544 MB   d) 45.3 MB',
      solucion: { tecnica: 'Techo de bytes/1500', pasos: [
        { f: 'a)', tipo: 'titulo' }, { f: '⌈150000/1500⌉ = 100', j: 'exacto' },
        { f: 'b)', tipo: 'titulo' }, { f: '⌈384000/1500⌉ = 256', j: 'exacto' },
        { f: 'c)', tipo: 'titulo' }, { f: '⌈1544000/1500⌉ = 1030', j: '1 544 000 / 1500 = 1029.33…: el último bloque va a medias' },
        { f: 'd)', tipo: 'titulo' }, { f: '⌈45300000/1500⌉ = 30200', j: 'exacto' },
      ], cierre: false },
    },
    {
      id: 'c12', origen: 'Diapositivas, Ej. 30', numerico: true,
      pedido: 'Los datos van en celdas de 53 bytes. ¿Cuántas celdas completas se transmiten en 1 minuto',
      enunciado: 'a 500 kilobits por segundo?',
      pista: 'Pasa todo a bits. Aquí solo cuentan las celdas completas.',
      solucion: { tecnica: 'Piso', pasos: [
        { f: '500000 · 60 = 30000000', j: 'bits en un minuto' },
        { f: '53 · 8 = 424', j: 'bits por celda' },
        { f: '⌊30000000/424⌋ = 70754', j: '30 000 000 / 424 = 70 754.7…; la celda 70 755 no alcanza a salir completa' },
      ], cierre: 'Se transmiten 70 754 celdas.' },
    },
    {
      id: 'c13', origen: 'Diapositivas, Ej. 33', pedido: 'Calcula:', numerico: true, f: (n) => { let r = 1; for (let k = 2; k <= n; k++) r *= k; return r; },
      enunciado: '1!   2!   6!   0!',
      solucion: { tecnica: 'Definición de factorial', pasos: [
        { f: 'f(1) = 1', j: '1! = 1' },
        { f: 'f(2) = 1 · 2 = 2', j: '2!' },
        { f: 'f(6) = 1 · 2 · 3 · 4 · 5 · 6 = 720', j: '6!' },
        { f: 'f(0) = 1', j: '0! = 1 por definición' },
      ], cierre: false, nota: 'Aquí f(n) = n!.' },
    },
  ],
});
