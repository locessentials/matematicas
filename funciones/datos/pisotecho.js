// Demostraciones con piso y techo (Tarea #25–30, 38, 39; diapositivas: propiedades 3a y 4a, ejemplos 31 y 32).
// prueba: { vars: { x: 'real', n: 'entero' }, f } → tools/verificar.mjs la evalúa con muchos valores:
//   si se demuestra, tiene que salir verdadera siempre; si se refuta, el contraejemplo tiene que hacerla falsa.
const PEDIDO_PT = 'Demuestra o refuta (x, y reales; n entero):';
const CIERRE_REFUTA_PT = 'No se cumple siempre: queda refutada.';

ESTUDIO.actividad({
  id: 'pisotecho',
  titulo: 'Demostraciones con piso y techo',
  corto: 'Piso y techo',
  tipo: 'problemas',
  descripcion: 'Identidades con piso y techo: demostrarlas con la definición o con x = n + ε, o refutarlas con un contraejemplo.',
  instrucciones: [
    'Traduce con la definición: ⌊x⌋ = n ⟺ n ≤ x < n + 1, y ⌈x⌉ = n ⟺ n − 1 < x ≤ n (n entero).',
    'O escribe x = n + ε con n = ⌊x⌋ y 0 ≤ ε < 1, y separa en casos según ε.',
    'Si sospechas que es falsa, prueba con x = ½, x = 1.5 o números parecidos.',
  ],
  instruccionCorta: 'Demuestra o refuta con piso y techo.',
  problemas: [
    {
      id: 'q1', origen: 'Diapositivas, propiedad 4a', pedido: PEDIDO_PT, enunciado: '⌊x + n⌋ = ⌊x⌋ + n',
      prueba: { vars: { x: 'real', n: 'entero' }, f: ({ x, n }) => piso(x + n) === piso(x) + n },
      solucion: { tecnica: 'Definición (1a)', pasos: [
        { f: '⌊x⌋ = m', j: 'sea m = ⌊x⌋ (un entero)' },
        { op: '⟺', f: 'm ≤ x < m + 1', j: '(1a)' },
        { op: '⟺', f: 'm + n ≤ x + n < m + n + 1', j: 'sumar n a todo' },
        { op: '⟺', f: '⌊x + n⌋ = m + n', j: '(1a), porque m + n es entero' },
      ], cierre: 'Así ⌊x + n⌋ = m + n = ⌊x⌋ + n. Q.E.D.',
      nota: 'La diapositiva escribe "m ≤ x ≤ m + 1"; tiene que ser < m + 1, si no, (1a) no se puede usar. También dice "m entero positivo": m es cualquier entero.' },
    },
    {
      id: 'q2', origen: 'Diapositivas, propiedad 3a', pedido: PEDIDO_PT, enunciado: '⌊−x⌋ = −⌈x⌉',
      prueba: { vars: { x: 'real' }, f: ({ x }) => piso(-x) === -techo(x) },
      solucion: { tecnica: 'Definición (1a, 1b)', pasos: [
        { f: '⌈x⌉ = n', j: 'sea n = ⌈x⌉' },
        { op: '⟺', f: 'n − 1 < x ≤ n', j: '(1b)' },
        { op: '⟺', f: '−n ≤ −x < −n + 1', j: 'multiplicar por −1 voltea las desigualdades' },
        { op: '⟺', f: '⌊−x⌋ = −n', j: '(1a), con el entero −n' },
      ], cierre: 'Así ⌊−x⌋ = −n = −⌈x⌉. Q.E.D.' },
    },
    {
      id: 'q3', origen: 'Diapositivas, Ej. 31', pedido: PEDIDO_PT, enunciado: '⌊2x⌋ = ⌊x⌋ + ⌊x + ½⌋',
      pista: 'Escribe x = n + ε y separa en dos casos: ε < ½ y ε ≥ ½.',
      prueba: { vars: { x: 'real' }, f: ({ x }) => piso(2 * x) === piso(x) + piso(x + 1 / 2) },
      solucion: { tecnica: 'Por casos con x = n + ε', pasos: [
        { f: 'x = n + ε,  n = ⌊x⌋,  0 ≤ ε < 1', j: '' },
        { f: 'Caso 0 ≤ ε < ½', tipo: 'titulo' },
        { f: '⌊2x⌋ = ⌊2n + 2ε⌋ = 2n', j: '0 ≤ 2ε < 1' },
        { f: '⌊x + ½⌋ = ⌊n + (ε + ½)⌋ = n', j: '½ ≤ ε + ½ < 1' },
        { f: '⌊x⌋ + ⌊x + ½⌋ = n + n = 2n', j: 'coincide' },
        { f: 'Caso ½ ≤ ε < 1', tipo: 'titulo' },
        { f: '⌊2x⌋ = ⌊(2n + 1) + (2ε − 1)⌋ = 2n + 1', j: '0 ≤ 2ε − 1 < 1' },
        { f: '⌊x + ½⌋ = ⌊(n + 1) + (ε − ½)⌋ = n + 1', j: '0 ≤ ε − ½ < ½' },
        { f: '⌊x⌋ + ⌊x + ½⌋ = n + (n + 1) = 2n + 1', j: 'coincide' },
      ], cierre: 'En los dos casos los lados son iguales. Q.E.D.',
      nota: 'Al final de la diapositiva dice "⌊x⌋ = ⌊x⌋ + ⌊x + ½⌋"; quería decir ⌊x⌋ + ⌊x + ½⌋ = n + (n + 1).' },
    },
    {
      id: 'q4', origen: 'Diapositivas, Ej. 32', pedido: PEDIDO_PT, enunciado: '⌈x + y⌉ = ⌈x⌉ + ⌈y⌉',
      prueba: { vars: { x: 'real', y: 'real' }, f: ({ x, y }) => techo(x + y) === techo(x) + techo(y) },
      solucion: { tecnica: 'Contraejemplo', contraejemplo: { x: '1/2', y: '1/2' }, evaluacion: [
        '⌈x + y⌉ = ⌈1⌉ = 1',
        '⌈x⌉ + ⌈y⌉ = 1 + 1 = 2',
        '1 ≠ 2',
      ], cierre: CIERRE_REFUTA_PT,
      nota: 'La diapositiva calcula "⌈½ + ½⌉ = 1 + 1 = 2", que mezcla los dos lados. Lo que sí se cumple: ⌈x⌉ + ⌈y⌉ − ⌈x + y⌉ es 0 o 1 (Tarea #38 c).' },
    },
    {
      id: 'q5', origen: 'Tarea #25', pedido: 'Demuestra:',
      enunciado: '⌈x − ½⌉ es el entero más cercano a x;\nsi x está justo a la mitad entre dos enteros, es el menor de los dos',
      pista: '¿Para qué valores de x el entero más cercano (con esa regla de desempate) es n?',
      prueba: { vars: { x: 'real' }, f: ({ x }) => { const c = piso(x), cercano = x - c <= 1 / 2 ? c : c + 1; return techo(x - 1 / 2) === cercano; } },
      solucion: { tecnica: 'Cadena de ⟺', pasos: [
        { f: 'n es el entero más cercano a x (el menor si hay empate)', j: '' },
        { op: '⟺', f: 'n − ½ < x ≤ n + ½', j: 'a distancia ≤ ½ de n; en x = n + ½ gana n (el menor), en x = n − ½ gana n − 1' },
        { op: '⟺', f: 'n − 1 < x − ½ ≤ n', j: 'restar ½' },
        { op: '⟺', f: '⌈x − ½⌉ = n', j: '(1b)' },
      ], cierre: 'Q.E.D.' },
    },
    {
      id: 'q6', origen: 'Tarea #26', pedido: 'Demuestra:', enunciado: 'x − 1 < ⌊x⌋ ≤ x ≤ ⌈x⌉ < x + 1',
      prueba: { vars: { x: 'real' }, f: ({ x }) => x - 1 < piso(x) && piso(x) <= x && x <= techo(x) && techo(x) < x + 1 },
      solucion: { tecnica: 'Definición (1a, 1b)', pasos: [
        { f: 'n = ⌊x⌋ ⟹ n ≤ x < n + 1', j: '(1a)' },
        { f: 'x < n + 1 ⟹ x − 1 < n', j: 'así: x − 1 < ⌊x⌋ ≤ x' },
        { f: 'm = ⌈x⌉ ⟹ m − 1 < x ≤ m', j: '(1b)' },
        { f: 'm − 1 < x ⟹ m < x + 1', j: 'así: x ≤ ⌈x⌉ < x + 1' },
      ], cierre: 'Juntando: x − 1 < ⌊x⌋ ≤ x ≤ ⌈x⌉ < x + 1. Q.E.D.',
      nota: 'La tarea termina con "≤ ⌈x⌉ + 1"; es la propiedad (2) de la tabla, que termina en "< x + 1".' },
    },
    {
      id: 'q7', origen: 'Tarea #27 a', pedido: 'Demuestra (x real, n entero):', enunciado: 'x < n ⟺ ⌊x⌋ < n',
      prueba: { vars: { x: 'real', n: 'entero' }, f: ({ x, n }) => (x < n) === (piso(x) < n) },
      solucion: { tecnica: 'Dos direcciones', pasos: [
        { f: '(⟹)', tipo: 'titulo' },
        { f: '⌊x⌋ ≤ x < n', j: '⌊x⌋ ≤ x siempre' },
        { f: '(⟸)', tipo: 'titulo' },
        { f: '⌊x⌋ < n ⟹ ⌊x⌋ + 1 ≤ n', j: 'los dos son enteros' },
        { f: 'x < ⌊x⌋ + 1 ≤ n', j: '(1a): x < ⌊x⌋ + 1' },
      ], cierre: 'Q.E.D.' },
    },
    {
      id: 'q8', origen: 'Tarea #27 b (como viene)', pedido: 'Demuestra o refuta (x real, n entero):', enunciado: 'n ≤ x ⟺ n ≤ ⌈x⌉',
      pista: 'Una dirección sí se cumple. Para la otra, prueba con x entre dos enteros.',
      prueba: { vars: { x: 'real', n: 'entero' }, f: ({ x, n }) => (n <= x) === (n <= techo(x)) },
      solucion: { tecnica: 'Contraejemplo', contraejemplo: { x: '1/2', n: '1' }, evaluacion: [
        'n ≤ ⌈x⌉: 1 ≤ ⌈½⌉ = 1, se cumple.',
        'n ≤ x: 1 ≤ ½, no se cumple.',
        'Falla la dirección (⟸). La (⟹) sí vale: n ≤ x ≤ ⌈x⌉.',
      ], cierre: CIERRE_REFUTA_PT,
      nota: 'Así como viene en la tarea es falsa. Las versiones correctas son n < x ⟺ n < ⌈x⌉, y n ≤ x ⟺ n ≤ ⌊x⌋ (las dos están en esta sección).' },
    },
    {
      id: 'q9', origen: 'Tarea #27 b (corregida)', pedido: 'Demuestra (x real, n entero):', enunciado: 'n < x ⟺ n < ⌈x⌉',
      prueba: { vars: { x: 'real', n: 'entero' }, f: ({ x, n }) => (n < x) === (n < techo(x)) },
      solucion: { tecnica: 'Dos direcciones', pasos: [
        { f: '(⟹)', tipo: 'titulo' },
        { f: 'n < x ≤ ⌈x⌉', j: 'x ≤ ⌈x⌉ siempre' },
        { f: '(⟸)', tipo: 'titulo' },
        { f: 'n < ⌈x⌉ ⟹ n ≤ ⌈x⌉ − 1', j: 'los dos son enteros' },
        { f: 'n ≤ ⌈x⌉ − 1 < x', j: '(1b): ⌈x⌉ − 1 < x' },
      ], cierre: 'Q.E.D.' },
    },
    {
      id: 'q10', origen: 'Tarea #27 b (otra corrección)', pedido: 'Demuestra (x real, n entero):', enunciado: 'n ≤ x ⟺ n ≤ ⌊x⌋',
      prueba: { vars: { x: 'real', n: 'entero' }, f: ({ x, n }) => (n <= x) === (n <= piso(x)) },
      solucion: { tecnica: 'Dos direcciones', pasos: [
        { f: '(⟹)', tipo: 'titulo' },
        { f: 'n ≤ x', j: 'n es un entero ≤ x, y ⌊x⌋ es el más grande de esos' },
        { op: '⟹', f: 'n ≤ ⌊x⌋', j: 'definición de piso' },
        { f: '(⟸)', tipo: 'titulo' },
        { f: 'n ≤ ⌊x⌋ ≤ x', j: '⌊x⌋ ≤ x siempre' },
      ], cierre: 'Q.E.D.' },
    },
    {
      id: 'q11', origen: 'Tarea #28', pedido: 'Demuestra (n entero):', enunciado: '⌊n/2⌋ = n/2 si n es par,\n⌊n/2⌋ = (n − 1)/2 si n es impar',
      prueba: { vars: { n: 'entero' }, f: ({ n }) => piso(n / 2) === (n % 2 === 0 ? n / 2 : (n - 1) / 2) },
      solucion: { tecnica: 'Por casos', pasos: [
        { f: 'n par', tipo: 'titulo' },
        { f: 'n = 2k ⟹ ⌊n/2⌋ = ⌊k⌋ = k = n/2', j: 'k es entero' },
        { f: 'n impar', tipo: 'titulo' },
        { f: 'n = 2k + 1 ⟹ ⌊n/2⌋ = ⌊k + ½⌋', j: '' },
        { op: '=', f: 'k + ⌊½⌋ = k', j: 'propiedad (4a): se saca el entero k' },
        { op: '=', f: '(n − 1)/2', j: 'k = (n − 1)/2' },
      ], cierre: 'Q.E.D.' },
    },
    {
      id: 'q12', origen: 'Tarea #29', pedido: 'INT(x) = ⌊x⌋ si x ≥ 0, e INT(x) = ⌈x⌉ si x < 0. Demuestra:', enunciado: 'INT(−x) = −INT(x)',
      prueba: { vars: { x: 'real' }, f: ({ x }) => { const INT = (t) => (t >= 0 ? piso(t) : techo(t)); return INT(-x) === -INT(x); } },
      solucion: { tecnica: 'Por casos', pasos: [
        { f: 'x > 0', tipo: 'titulo' },
        { f: '−x < 0 ⟹ INT(−x) = ⌈−x⌉ = −⌊x⌋ = −INT(x)', j: 'propiedad (3b)' },
        { f: 'x < 0', tipo: 'titulo' },
        { f: '−x > 0 ⟹ INT(−x) = ⌊−x⌋ = −⌈x⌉ = −INT(x)', j: 'propiedad (3a)' },
        { f: 'x = 0', tipo: 'titulo' },
        { f: 'INT(0) = ⌊0⌋ = 0 = −INT(0)', j: '' },
      ], cierre: 'Q.E.D.', nota: 'INT es "truncar": quitar los decimales, que siempre acerca al 0.' },
    },
    {
      id: 'q13', origen: 'Tarea #30', pedido: 'Sean a < b reales. Con piso y/o techo, ¿cuántos enteros n cumplen', enunciado: 'a < n < b ?',
      pista: 'Usa a < n ⟺ ⌊a⌋ < n y n < b ⟺ n < ⌈b⌉ para encontrar el menor y el mayor de esos enteros.',
      prueba: { vars: { a: 'real', b: 'real' }, f: ({ a, b }) => {
        if (a >= b) return true;
        let c = 0; for (let n = Math.ceil(a) - 1; n <= Math.floor(b) + 1; n++) if (a < n && n < b) c++;
        return c === techo(b) - piso(a) - 1;
      } },
      solucion: { tecnica: 'Contar de un extremo al otro', pasos: [
        { f: 'a < n ⟺ ⌊a⌋ < n ⟺ n ≥ ⌊a⌋ + 1', j: 'Tarea #27 a (con x = a)' },
        { f: 'n < b ⟺ n < ⌈b⌉ ⟺ n ≤ ⌈b⌉ − 1', j: 'Tarea #27 b corregida (con x = b)' },
        { f: 'los enteros van de ⌊a⌋ + 1 a ⌈b⌉ − 1', j: '' },
        { f: '(⌈b⌉ − 1) − (⌊a⌋ + 1) + 1 = ⌈b⌉ − ⌊a⌋ − 1', j: 'cuántos enteros hay de p a q: q − p + 1' },
      ], cierre: 'Hay ⌈b⌉ − ⌊a⌋ − 1 enteros con a < n < b.',
      nota: 'Comprueba: a = 0.5, b = 2.5 da 3 − 0 − 1 = 2 (el 1 y el 2); a = 1, b = 3 da 3 − 1 − 1 = 1 (solo el 2).' },
    },
    {
      id: 'q14', origen: 'Tarea #38 a', pedido: PEDIDO_PT, enunciado: '⌈⌊x⌋⌉ = ⌊x⌋',
      prueba: { vars: { x: 'real' }, f: ({ x }) => techo(piso(x)) === piso(x) },
      solucion: { respuesta: true, evaluacion: ['⌊x⌋ es un entero, y el techo de un entero es él mismo.'] },
    },
    {
      id: 'q15', origen: 'Tarea #38 b', pedido: PEDIDO_PT, enunciado: '⌊2x⌋ = 2⌊x⌋',
      prueba: { vars: { x: 'real' }, f: ({ x }) => piso(2 * x) === 2 * piso(x) },
      solucion: { tecnica: 'Contraejemplo', contraejemplo: { x: '1/2' }, evaluacion: [
        '⌊2x⌋ = ⌊1⌋ = 1',
        '2⌊x⌋ = 2 · 0 = 0',
      ], cierre: CIERRE_REFUTA_PT, nota: 'Lo correcto es ⌊2x⌋ = ⌊x⌋ + ⌊x + ½⌋ (Ej. 31 de las diapositivas).' },
    },
    {
      id: 'q16', origen: 'Tarea #38 c', pedido: PEDIDO_PT, enunciado: '⌈x⌉ + ⌈y⌉ − ⌈x + y⌉ es 0 o 1',
      pista: 'Escribe x = m − ε y y = k − δ con m = ⌈x⌉, k = ⌈y⌉ y 0 ≤ ε, δ < 1.',
      prueba: { vars: { x: 'real', y: 'real' }, f: ({ x, y }) => { const d = techo(x) + techo(y) - techo(x + y); return d === 0 || d === 1; } },
      solucion: { tecnica: 'Por casos con x = m − ε', pasos: [
        { f: 'x = m − ε,  y = k − δ,  0 ≤ ε, δ < 1', j: 'con m = ⌈x⌉ y k = ⌈y⌉' },
        { f: 'x + y = (m + k) − (ε + δ),  0 ≤ ε + δ < 2', j: '' },
        { f: 'Caso ε + δ < 1', tipo: 'titulo' },
        { f: '⌈x + y⌉ = m + k', j: '(1b): m + k − 1 < x + y ≤ m + k' },
        { f: '⌈x⌉ + ⌈y⌉ − ⌈x + y⌉ = 0', j: '' },
        { f: 'Caso 1 ≤ ε + δ < 2', tipo: 'titulo' },
        { f: 'x + y = (m + k − 1) − (ε + δ − 1),  0 ≤ ε + δ − 1 < 1', j: '' },
        { f: '⌈x + y⌉ = m + k − 1', j: '(1b)' },
        { f: '⌈x⌉ + ⌈y⌉ − ⌈x + y⌉ = 1', j: '' },
      ], cierre: 'En los dos casos da 0 o 1. Q.E.D.' },
    },
    {
      id: 'q17', origen: 'Tarea #38 d', pedido: PEDIDO_PT, enunciado: '⌈xy⌉ = ⌈x⌉⌈y⌉',
      pista: 'Con x = y = ½ sí se cumple. Prueba con números un poco más grandes.',
      prueba: { vars: { x: 'real', y: 'real' }, f: ({ x, y }) => techo(x * y) === techo(x) * techo(y) },
      solucion: { tecnica: 'Contraejemplo', contraejemplo: { x: '3/2', y: '3/2' }, evaluacion: [
        '⌈xy⌉ = ⌈2.25⌉ = 3',
        '⌈x⌉⌈y⌉ = 2 · 2 = 4',
      ], cierre: CIERRE_REFUTA_PT },
    },
    {
      id: 'q18', origen: 'Tarea #38 e', pedido: PEDIDO_PT, enunciado: '⌈x/2⌉ = ⌈(x + 1)/2⌉',
      prueba: { vars: { x: 'real' }, f: ({ x }) => techo(x / 2) === techo((x + 1) / 2) },
      solucion: { tecnica: 'Contraejemplo', contraejemplo: { x: '2' }, evaluacion: [
        '⌈x/2⌉ = ⌈1⌉ = 1',
        '⌈(x + 1)/2⌉ = ⌈1.5⌉ = 2',
      ], cierre: CIERRE_REFUTA_PT, nota: 'Con x = 1 sí coinciden (los dos dan 1); por eso conviene probar varios valores.' },
    },
    {
      id: 'q19', origen: 'Tarea #39 a', pedido: 'Demuestra (x real positivo):', enunciado: '⌊√⌊x⌋⌋ = ⌊√x⌋',
      pista: 'Sea m = ⌊√x⌋. Traduce a m² ≤ x < (m + 1)² y usa que m² es entero.',
      prueba: { vars: { x: 'positivo' }, f: ({ x }) => piso(Math.sqrt(piso(x))) === piso(Math.sqrt(x)) },
      solucion: { tecnica: 'Definición (1a)', pasos: [
        { f: 'm = ⌊√x⌋', j: 'sea m este entero (m ≥ 0)' },
        { op: '⟹', f: 'm ≤ √x < m + 1', j: '(1a)' },
        { op: '⟹', f: 'm² ≤ x < (m + 1)²', j: 'elevar al cuadrado (todo es ≥ 0)' },
        { op: '⟹', f: 'm² ≤ ⌊x⌋ < (m + 1)²', j: 'm² es un entero ≤ x, así que m² ≤ ⌊x⌋; y ⌊x⌋ ≤ x' },
        { op: '⟹', f: 'm ≤ √⌊x⌋ < m + 1', j: 'sacar raíz' },
        { op: '⟹', f: '⌊√⌊x⌋⌋ = m', j: '(1a)' },
      ], cierre: 'Así ⌊√⌊x⌋⌋ = m = ⌊√x⌋. Q.E.D.' },
    },
    {
      id: 'q20', origen: 'Tarea #39 b', pedido: 'Demuestra (x real positivo):', enunciado: '⌈√⌈x⌉⌉ = ⌈√x⌉',
      prueba: { vars: { x: 'positivo' }, f: ({ x }) => techo(Math.sqrt(techo(x))) === techo(Math.sqrt(x)) },
      solucion: { tecnica: 'Definición (1b)', pasos: [
        { f: 'm = ⌈√x⌉', j: 'sea m este entero; como x > 0, m ≥ 1' },
        { op: '⟹', f: 'm − 1 < √x ≤ m', j: '(1b)' },
        { op: '⟹', f: '(m − 1)² < x ≤ m²', j: 'elevar al cuadrado (m − 1 ≥ 0)' },
        { op: '⟹', f: '(m − 1)² < ⌈x⌉ ≤ m²', j: 'm² es un entero ≥ x, así que ⌈x⌉ ≤ m²; y x ≤ ⌈x⌉' },
        { op: '⟹', f: 'm − 1 < √⌈x⌉ ≤ m', j: 'sacar raíz' },
        { op: '⟹', f: '⌈√⌈x⌉⌉ = m', j: '(1b)' },
      ], cierre: 'Así ⌈√⌈x⌉⌉ = m = ⌈√x⌉. Q.E.D.' },
    },
  ],
});
