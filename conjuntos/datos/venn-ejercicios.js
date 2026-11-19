// Diagramas de Venn: sombrear una expresión, reconocer una expresión y decidir si una ley se cumple.
// Las expresiones las lee assets/js/conjuntos-expr.js; tools/verificar.mjs revisa que "cumple" sea correcto.
ESTUDIO.actividad({
  id: 'venn',
  titulo: 'Diagramas de Venn',
  corto: 'Venn',
  tipo: 'venn',
  descripcion:
    'Para "ver" cada expresión antes de demostrar con ella. Toca las regiones para sombrearlas. ' +
    'En "¿Se cumple la ley?", si los lados no coinciden, la región distinta es tu contraejemplo.',
  ejercicios: [
    // ---------- Sombrear: dos conjuntos ----------
    { id: 's1', modo: 'sombrear', conjuntos: ['A', 'B'], expr: 'A ∩ B', nota: 'Lo que está en A y en B a la vez.' },
    { id: 's2', modo: 'sombrear', conjuntos: ['A', 'B'], expr: 'A ∪ B', nota: 'Todo lo que está en A, en B o en los dos.' },
    { id: 's3', modo: 'sombrear', conjuntos: ['A', 'B'], expr: 'Aᶜ', nota: 'Todo lo de U que no está en A, incluida la parte de B fuera de A.' },
    { id: 's4', modo: 'sombrear', conjuntos: ['A', 'B'], expr: 'A \\ B', nota: 'La parte de A que no toca a B. Es lo mismo que A ∩ Bᶜ.' },
    { id: 's5', modo: 'sombrear', conjuntos: ['A', 'B'], expr: 'B \\ A', nota: 'Compárala con A \\ B: son regiones distintas, por eso la diferencia no es conmutativa.' },
    { id: 's6', modo: 'sombrear', conjuntos: ['A', 'B'], expr: 'A ∆ B', nota: 'En uno o en otro, pero no en los dos: (A \\ B) ∪ (B \\ A).' },
    { id: 's7', modo: 'sombrear', conjuntos: ['A', 'B'], expr: '(A ∪ B)ᶜ', nota: 'Solo lo de afuera de los dos círculos. Es igual a Aᶜ ∩ Bᶜ (De Morgan).' },
    { id: 's8', modo: 'sombrear', conjuntos: ['A', 'B'], expr: '(A ∩ B)ᶜ', nota: 'Todo menos el centro. Es igual a Aᶜ ∪ Bᶜ (De Morgan).' },
    { id: 's9', modo: 'sombrear', conjuntos: ['A', 'B'], expr: 'A ∩ Bᶜ', nota: 'Es la misma región que A \\ B.' },
    { id: 's10', modo: 'sombrear', conjuntos: ['A', 'B'], expr: 'Aᶜ ∪ B', nota: 'Todo menos la parte de A que está fuera de B. (En lógica: ¬p ∨ q, es decir, p → q.)' },
    // ---------- Sombrear: tres conjuntos ----------
    { id: 's11', modo: 'sombrear', conjuntos: ['A', 'B', 'C'], expr: 'A ∩ B ∩ C', nota: 'Solo el centro, donde se tocan los tres.' },
    { id: 's12', modo: 'sombrear', conjuntos: ['A', 'B', 'C'], expr: '(A ∪ B) ∩ C', nota: 'Primero A ∪ B; luego quédate solo con lo que también está en C.' },
    { id: 's13', modo: 'sombrear', conjuntos: ['A', 'B', 'C'], expr: 'A ∪ (B ∩ C)', nota: 'Todo A, más la parte común de B y C.' },
    { id: 's14', modo: 'sombrear', conjuntos: ['A', 'B', 'C'], expr: '(A \\ B) ∪ C', nota: 'La parte de A sin B, más todo C.' },
    { id: 's15', modo: 'sombrear', conjuntos: ['A', 'B', 'C'], expr: 'A \\ (B ∪ C)', nota: 'Solo lo que está en A y en ninguno de los otros dos.' },
    { id: 's16', modo: 'sombrear', conjuntos: ['A', 'B', 'C'], expr: '(A ∩ B) \\ C', nota: 'El pedazo común de A y B, sin la parte que también está en C.' },
    { id: 's17', modo: 'sombrear', conjuntos: ['A', 'B', 'C'], expr: 'A ∩ (B ∆ C)', nota: 'Dentro de A, lo que está en B o en C pero no en los dos.' },
    { id: 's18', modo: 'sombrear', conjuntos: ['A', 'B', 'C'], expr: '(A ∪ B ∪ C)ᶜ', nota: 'Solo lo de afuera de los tres círculos.' },
    { id: 's19', modo: 'sombrear', conjuntos: ['A', 'B', 'C'], expr: 'Aᶜ ∩ (B ∪ C)', nota: 'Lo de B o C que queda fuera de A. Es lo mismo que (B ∪ C) \\ A.' },
    { id: 's20', modo: 'sombrear', conjuntos: ['A', 'B', 'C'], expr: '(A ∩ B) ∪ (A ∩ C)', nota: 'Es igual a A ∩ (B ∪ C): distributividad.' },

    // ---------- Identificar ----------
    { id: 'i1', modo: 'identificar', conjuntos: ['A', 'B'], expr: 'A \\ B', equivalentes: ['A ∩ Bᶜ'] },
    { id: 'i2', modo: 'identificar', conjuntos: ['A', 'B'], expr: 'A ∆ B', equivalentes: ['(A \\ B) ∪ (B \\ A)', '(A ∪ B) \\ (A ∩ B)'] },
    { id: 'i3', modo: 'identificar', conjuntos: ['A', 'B'], expr: '(A ∪ B)ᶜ', equivalentes: ['Aᶜ ∩ Bᶜ'] },
    { id: 'i4', modo: 'identificar', conjuntos: ['A', 'B'], expr: 'Aᶜ ∪ Bᶜ', equivalentes: ['(A ∩ B)ᶜ'] },
    { id: 'i5', modo: 'identificar', conjuntos: ['A', 'B'], expr: 'Bᶜ', equivalentes: ['U \\ B'] },
    { id: 'i6', modo: 'identificar', conjuntos: ['A', 'B', 'C'], expr: 'A \\ (B ∪ C)', equivalentes: ['(A \\ B) ∩ (A \\ C)', 'A ∩ Bᶜ ∩ Cᶜ'] },
    { id: 'i7', modo: 'identificar', conjuntos: ['A', 'B', 'C'], expr: '(A ∩ B) ∪ (B ∩ C) ∪ (A ∩ C)',
      nota: 'Los elementos que están en al menos dos de los tres conjuntos.' },
    { id: 'i8', modo: 'identificar', conjuntos: ['A', 'B', 'C'], expr: '(A ∩ B ∩ C)ᶜ', equivalentes: ['Aᶜ ∪ Bᶜ ∪ Cᶜ'] },
    { id: 'i9', modo: 'identificar', conjuntos: ['A', 'B', 'C'], expr: '(A ∩ B) \\ C', equivalentes: ['A ∩ B ∩ Cᶜ'] },
    { id: 'i10', modo: 'identificar', conjuntos: ['A', 'B', 'C'], expr: 'C \\ (A ∩ B)', equivalentes: ['(C \\ A) ∪ (C \\ B)'],
      nota: 'Todo C menos el centro. La segunda forma es De Morgan para la diferencia.' },

    // ---------- ¿Se cumple la ley? ----------
    { id: 'l1', modo: 'ley', conjuntos: ['A', 'B'], izq: '(A ∪ B)ᶜ', der: 'Aᶜ ∩ Bᶜ', cumple: true, nota: 'De Morgan.' },
    { id: 'l2', modo: 'ley', conjuntos: ['A', 'B'], izq: '(A ∩ B)ᶜ', der: 'Aᶜ ∩ Bᶜ', cumple: false,
      nota: 'Error común: al sacar el complemento, ∩ se cambia por ∪. Lo correcto es (A ∩ B)ᶜ = Aᶜ ∪ Bᶜ.' },
    { id: 'l3', modo: 'ley', conjuntos: ['A', 'B'], izq: 'A \\ B', der: 'B \\ A', cumple: false, nota: 'La diferencia no es conmutativa.' },
    { id: 'l4', modo: 'ley', conjuntos: ['A', 'B'], izq: 'A ∆ B', der: 'B ∆ A', cumple: true, nota: 'La diferencia simétrica sí es conmutativa (Tarea 5 #7).' },
    { id: 'l5', modo: 'ley', conjuntos: ['A', 'B'], izq: 'A \\ (A \\ B)', der: 'A ∩ B', cumple: true, nota: 'Teorema 12 i.' },
    { id: 'l6', modo: 'ley', conjuntos: ['A', 'B'], izq: '(A ∪ B) \\ B', der: 'A', cumple: false,
      nota: 'Quitar B también le quita a A su parte común con B. Lo correcto es (A ∪ B) \\ B = A \\ B.' },
    { id: 'l7', modo: 'ley', conjuntos: ['A', 'B'], izq: 'A ∪ (B \\ A)', der: 'A ∪ B', cumple: true, nota: 'Tarea 5 #9 iii.' },
    { id: 'l8', modo: 'ley', conjuntos: ['A', 'B', 'C'], izq: 'A ∩ (B ∪ C)', der: '(A ∩ B) ∪ (A ∩ C)', cumple: true, nota: 'Distributividad.' },
    { id: 'l9', modo: 'ley', conjuntos: ['A', 'B', 'C'], izq: 'A ∪ (B ∩ C)', der: '(A ∪ B) ∩ C', cumple: false,
      nota: 'Falta repartir la A: lo correcto es (A ∪ B) ∩ (A ∪ C).' },
    { id: 'l10', modo: 'ley', conjuntos: ['A', 'B', 'C'], izq: 'A \\ (B ∪ C)', der: '(A \\ B) ∪ (A \\ C)', cumple: false,
      nota: 'Es De Morgan dentro de A: la ∪ se vuelve ∩. Lo correcto es (A \\ B) ∩ (A \\ C).' },
    { id: 'l11', modo: 'ley', conjuntos: ['A', 'B', 'C'], izq: 'A \\ (B ∩ C)', der: '(A \\ B) ∪ (A \\ C)', cumple: true, nota: 'Teorema 12 iii.' },
    { id: 'l12', modo: 'ley', conjuntos: ['A', 'B', 'C'], izq: '(A \\ C) ∪ (B \\ C)', der: '(A ∪ B) \\ C', cumple: true, nota: 'Tarea 5 #9 i.' },
  ],
});
