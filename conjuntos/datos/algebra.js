// Álgebra de conjuntos: demostrar igualdades y reducir expresiones con leyes ya demostradas (sin elementos).
// Cada paso: { op: '=', f: conjunto, j: ley }. tools/verificar.mjs revisa que cada renglón sea igual al anterior
// y que la cadena vaya de un lado de la tesis al otro. Los "Reduce" llevan la tesis completa en "tesis".
const PEDIDO_ALG = 'Demuestra o refuta con álgebra de conjuntos:';
const PEDIDO_RED = 'Reduce a su mínima expresión:';
const CIERRE_REFUTA = 'La igualdad no se cumple siempre: queda refutada.';

ESTUDIO.actividad({
  id: 'algebra',
  titulo: 'Álgebra de conjuntos',
  corto: 'Álgebra',
  tipo: 'problemas',
  descripcion:
    'Igualdades y reducciones usando leyes ya demostradas, sin elementos. Es lo mismo que una cadena de equivalencias en lógica: ' +
    'cada renglón empieza con = y lleva el nombre de la ley que usaste.',
  instrucciones: [
    'Parte del lado más complicado y llega al otro, un renglón a la vez. Cada renglón empieza con = y nombra la ley.',
    'Primero quita \\ y ∆: A \\ B = A ∩ Bᶜ y A ∆ B = (A \\ B) ∪ (B \\ A).',
    'Luego mete los complementos hasta las letras con De Morgan y doble complemento.',
    'Después usa distributividad, conmutatividad y asociatividad para juntar una letra con su complemento (da Ø o U), y termina con identidad, dominación o absorción.',
    'Si no llegas al otro lado, haz el diagrama de Venn de los dos: si no coinciden, refuta con un contraejemplo.',
  ],
  instruccionCorta: 'Demuestra o refuta con álgebra de conjuntos, nombrando la ley de cada renglón.',
  problemas: [
    {
      id: 'a1', origen: 'Tarea 5 #3', pedido: PEDIDO_ALG, enunciado: '(A ∪ B) ∩ (A ∪ Bᶜ) = A',
      pista: 'A aparece en los dos paréntesis: sácala como factor común (distributividad al revés).',
      solucion: { tecnica: 'Álgebra de conjuntos', pasos: [
        { f: '(A ∪ B) ∩ (A ∪ Bᶜ)', j: 'lado izquierdo' },
        { op: '=', f: 'A ∪ (B ∩ Bᶜ)', j: 'Distributividad (∪ respecto a ∩), al revés' },
        { op: '=', f: 'A ∪ Ø', j: 'Complemento' },
        { op: '=', f: 'A', j: 'Identidad' },
      ] },
    },
    {
      id: 'a2', origen: 'Tarea 5 #7', pedido: PEDIDO_ALG, enunciado: 'A ∆ B = B ∆ A',
      pista: 'Escribe A ∆ B con su definición y fíjate qué operación une las dos partes.',
      solucion: { tecnica: 'Álgebra de conjuntos', pasos: [
        { f: 'A ∆ B', j: 'lado izquierdo' },
        { op: '=', f: '(A \\ B) ∪ (B \\ A)', j: 'Definición de diferencia simétrica' },
        { op: '=', f: '(B \\ A) ∪ (A \\ B)', j: 'Conmutatividad de ∪' },
        { op: '=', f: 'B ∆ A', j: 'Definición de diferencia simétrica' },
      ], nota: 'La diferencia NO es conmutativa, pero aquí no se voltea ninguna diferencia: solo se cambia el orden de la unión.' },
    },
    {
      id: 'a3', origen: 'Tarea 5 #8 i', pedido: PEDIDO_ALG, enunciado: 'A ∆ Ø = A',
      solucion: { tecnica: 'Álgebra de conjuntos', pasos: [
        { f: 'A ∆ Ø', j: 'lado izquierdo' },
        { op: '=', f: '(A \\ Ø) ∪ (Ø \\ A)', j: 'Definición de diferencia simétrica' },
        { op: '=', f: 'A ∪ Ø', j: 'Casos especiales de la diferencia: A \\ Ø = A, Ø \\ A = Ø' },
        { op: '=', f: 'A', j: 'Identidad' },
      ] },
    },
    {
      id: 'a4', origen: 'Tarea 5 #8 ii', pedido: PEDIDO_ALG, enunciado: 'A ∆ A = Ø',
      solucion: { tecnica: 'Álgebra de conjuntos', pasos: [
        { f: 'A ∆ A', j: 'lado izquierdo' },
        { op: '=', f: '(A \\ A) ∪ (A \\ A)', j: 'Definición de diferencia simétrica' },
        { op: '=', f: 'Ø ∪ Ø', j: 'Casos especiales de la diferencia: A \\ A = Ø' },
        { op: '=', f: 'Ø', j: 'Idempotencia (también sirve identidad)' },
      ] },
    },
    {
      id: 'a5', origen: 'Tarea 5 #9 i', pedido: PEDIDO_ALG, enunciado: '(A \\ C) ∪ (B \\ C) = (A ∪ B) \\ C',
      pista: 'Después de quitar las diferencias, Cᶜ aparece en las dos partes.',
      solucion: { tecnica: 'Álgebra de conjuntos', pasos: [
        { f: '(A \\ C) ∪ (B \\ C)', j: 'lado izquierdo' },
        { op: '=', f: '(A ∩ Cᶜ) ∪ (B ∩ Cᶜ)', j: 'Diferencia como intersección' },
        { op: '=', f: '(A ∪ B) ∩ Cᶜ', j: 'Distributividad (∩ respecto a ∪), al revés: se factoriza Cᶜ' },
        { op: '=', f: '(A ∪ B) \\ C', j: 'Diferencia como intersección' },
      ] },
    },
    {
      id: 'a6', origen: 'Tarea 5 #9 ii', pedido: PEDIDO_ALG, enunciado: '(A \\ B) ∪ (B \\ A) = (A ∪ B) \\ (A ∩ B)',
      pista: 'Empieza por el lado derecho. Después de De Morgan, distribuye y usa absorción parcial en cada parte.',
      solucion: { tecnica: 'Álgebra de conjuntos', pasos: [
        { f: '(A ∪ B) \\ (A ∩ B)', j: 'lado derecho' },
        { op: '=', f: '(A ∪ B) ∩ (A ∩ B)ᶜ', j: 'Diferencia como intersección' },
        { op: '=', f: '(A ∪ B) ∩ (Aᶜ ∪ Bᶜ)', j: 'De Morgan' },
        { op: '=', f: '(A ∩ (Aᶜ ∪ Bᶜ)) ∪ (B ∩ (Aᶜ ∪ Bᶜ))', j: 'Distributividad (por la derecha)' },
        { op: '=', f: '(A ∩ Bᶜ) ∪ (B ∩ (Bᶜ ∪ Aᶜ))', j: 'Absorción parcial en la primera parte; conmutatividad en la segunda' },
        { op: '=', f: '(A ∩ Bᶜ) ∪ (B ∩ Aᶜ)', j: 'Absorción parcial' },
        { op: '=', f: '(A \\ B) ∪ (B \\ A)', j: 'Diferencia como intersección' },
      ], nota: 'En la tarea se citó directamente el Teorema 11 (A ∆ B = (A ∪ B) ∩ (A ∩ B)ᶜ). Si te dejan usar teoremas ya demostrados, es válido; aquí está la cuenta completa por si no.' },
    },
    {
      id: 'a7', origen: 'Tarea 5 #9 iii', pedido: PEDIDO_ALG, enunciado: 'A ∪ (B \\ A) = A ∪ B',
      solucion: { tecnica: 'Álgebra de conjuntos', pasos: [
        { f: 'A ∪ (B \\ A)', j: 'lado izquierdo' },
        { op: '=', f: 'A ∪ (B ∩ Aᶜ)', j: 'Diferencia como intersección' },
        { op: '=', f: '(A ∪ B) ∩ (A ∪ Aᶜ)', j: 'Distributividad (∪ respecto a ∩)' },
        { op: '=', f: '(A ∪ B) ∩ U', j: 'Complemento' },
        { op: '=', f: 'A ∪ B', j: 'Identidad' },
      ], nota: 'Más corto: A ∪ (Aᶜ ∩ B) = A ∪ B es absorción parcial (después de conmutar B ∩ Aᶜ).' },
    },
    {
      id: 'a8', origen: 'Tarea 5 #9 iv', pedido: PEDIDO_ALG, enunciado: 'A ∩ (B \\ A) = Ø',
      pista: 'Junta A con Aᶜ usando conmutatividad y asociatividad.',
      solucion: { tecnica: 'Álgebra de conjuntos', pasos: [
        { f: 'A ∩ (B \\ A)', j: 'lado izquierdo' },
        { op: '=', f: 'A ∩ (B ∩ Aᶜ)', j: 'Diferencia como intersección' },
        { op: '=', f: 'A ∩ (Aᶜ ∩ B)', j: 'Conmutatividad' },
        { op: '=', f: '(A ∩ Aᶜ) ∩ B', j: 'Asociatividad' },
        { op: '=', f: 'Ø ∩ B', j: 'Complemento' },
        { op: '=', f: 'Ø', j: 'Dominación' },
      ] },
    },
    {
      id: 'a9', origen: 'Tarea 5 #10 i', pedido: PEDIDO_RED, enunciado: '((B ∪ B) ∩ (A ∩ B)) ∩ (A ∩ (B ∩ A))',
      tesis: '((B ∪ B) ∩ (A ∩ B)) ∩ (A ∩ (B ∩ A)) = A ∩ B',
      pista: 'Solo hay ∩ (después de quitar B ∪ B): reordena para juntar letras iguales e idempotencia.',
      solucion: { tecnica: 'Álgebra de conjuntos', pasos: [
        { f: '((B ∪ B) ∩ (A ∩ B)) ∩ (A ∩ (B ∩ A))', j: 'expresión dada' },
        { op: '=', f: '(B ∩ (A ∩ B)) ∩ (A ∩ (B ∩ A))', j: 'Idempotencia' },
        { op: '=', f: '(B ∩ (B ∩ A)) ∩ (A ∩ (A ∩ B))', j: 'Conmutatividad' },
        { op: '=', f: '((B ∩ B) ∩ A) ∩ ((A ∩ A) ∩ B)', j: 'Asociatividad' },
        { op: '=', f: '(B ∩ A) ∩ (A ∩ B)', j: 'Idempotencia' },
        { op: '=', f: '(A ∩ B) ∩ (A ∩ B)', j: 'Conmutatividad' },
        { op: '=', f: 'A ∩ B', j: 'Idempotencia' },
      ] },
    },
    {
      id: 'a10', origen: 'Tarea 5 #10 ii', pedido: PEDIDO_RED, enunciado: '((A ∩ (B ∪ C)) ∩ (A \\ B)) ∩ (B ∪ Cᶜ)',
      tesis: '((A ∩ (B ∪ C)) ∩ (A \\ B)) ∩ (B ∪ Cᶜ) = Ø',
      pista: 'Fíjate en Bᶜ ∩ C y en B ∪ Cᶜ: uno es el complemento del otro.',
      solucion: { tecnica: 'Álgebra de conjuntos', pasos: [
        { f: '((A ∩ (B ∪ C)) ∩ (A \\ B)) ∩ (B ∪ Cᶜ)', j: 'expresión dada' },
        { op: '=', f: '((A ∩ (B ∪ C)) ∩ (A ∩ Bᶜ)) ∩ (B ∪ Cᶜ)', j: 'Diferencia como intersección' },
        { op: '=', f: '((A ∩ A) ∩ (Bᶜ ∩ (B ∪ C))) ∩ (B ∪ Cᶜ)', j: 'Conmutatividad y asociatividad' },
        { op: '=', f: '(A ∩ (Bᶜ ∩ (B ∪ C))) ∩ (B ∪ Cᶜ)', j: 'Idempotencia' },
        { op: '=', f: '(A ∩ ((Bᶜ ∩ B) ∪ (Bᶜ ∩ C))) ∩ (B ∪ Cᶜ)', j: 'Distributividad' },
        { op: '=', f: '(A ∩ (Ø ∪ (Bᶜ ∩ C))) ∩ (B ∪ Cᶜ)', j: 'Complemento' },
        { op: '=', f: '(A ∩ (Bᶜ ∩ C)) ∩ (B ∪ Cᶜ)', j: 'Identidad' },
        { op: '=', f: '(A ∩ (Bᶜ ∩ C)) ∩ (Bᶜ ∩ C)ᶜ', j: 'De Morgan y doble complemento: (Bᶜ ∩ C)ᶜ = B ∪ Cᶜ' },
        { op: '=', f: 'A ∩ ((Bᶜ ∩ C) ∩ (Bᶜ ∩ C)ᶜ)', j: 'Asociatividad' },
        { op: '=', f: 'A ∩ Ø', j: 'Complemento' },
        { op: '=', f: 'Ø', j: 'Dominación' },
      ], nota: 'En la tarea el paso de B ∪ Cᶜ a (Bᶜ ∩ C)ᶜ decía solo "De Morgan"; también usa doble complemento ((Bᶜ)ᶜ = B).' },
    },
    {
      id: 'a11', origen: 'Tarea 5 #10 iii', pedido: PEDIDO_RED, enunciado: '(A ∩ B) ∩ (A \\ B)', tesis: '(A ∩ B) ∩ (A \\ B) = Ø',
      solucion: { tecnica: 'Álgebra de conjuntos', pasos: [
        { f: '(A ∩ B) ∩ (A \\ B)', j: 'expresión dada' },
        { op: '=', f: '(A ∩ B) ∩ (A ∩ Bᶜ)', j: 'Diferencia como intersección' },
        { op: '=', f: '(A ∩ A) ∩ (B ∩ Bᶜ)', j: 'Conmutatividad y asociatividad' },
        { op: '=', f: 'A ∩ Ø', j: 'Idempotencia y complemento' },
        { op: '=', f: 'Ø', j: 'Dominación' },
      ] },
    },
    {
      id: 'a12', origen: 'Tarea 5 #10 iv', pedido: PEDIDO_RED, enunciado: '((Aᶜ ∪ B) ∩ A) ∪ (Bᶜ ∪ (A ∩ B))',
      tesis: '((Aᶜ ∪ B) ∩ A) ∪ (Bᶜ ∪ (A ∩ B)) = A ∪ Bᶜ',
      pista: 'Simplifica primero (Aᶜ ∪ B) ∩ A. Te debe quedar algo que ya aparece en la otra mitad.',
      solucion: { tecnica: 'Álgebra de conjuntos', pasos: [
        { f: '((Aᶜ ∪ B) ∩ A) ∪ (Bᶜ ∪ (A ∩ B))', j: 'expresión dada' },
        { op: '=', f: '((Aᶜ ∩ A) ∪ (B ∩ A)) ∪ (Bᶜ ∪ (A ∩ B))', j: 'Distributividad (por la derecha)' },
        { op: '=', f: '(Ø ∪ (A ∩ B)) ∪ (Bᶜ ∪ (A ∩ B))', j: 'Complemento y conmutatividad' },
        { op: '=', f: '(A ∩ B) ∪ (Bᶜ ∪ (A ∩ B))', j: 'Identidad' },
        { op: '=', f: '((A ∩ B) ∪ (A ∩ B)) ∪ Bᶜ', j: 'Conmutatividad y asociatividad' },
        { op: '=', f: '(A ∩ B) ∪ Bᶜ', j: 'Idempotencia' },
        { op: '=', f: '(A ∪ Bᶜ) ∩ (B ∪ Bᶜ)', j: 'Distributividad (por la derecha)' },
        { op: '=', f: '(A ∪ Bᶜ) ∩ U', j: 'Complemento' },
        { op: '=', f: 'A ∪ Bᶜ', j: 'Identidad' },
      ] },
    },
    {
      id: 'a13', origen: 'Teorema 12 i', pedido: PEDIDO_ALG, enunciado: 'A \\ (A \\ B) = A ∩ B',
      pista: 'Quita las dos diferencias (de afuera hacia adentro) y luego aplica De Morgan.',
      solucion: { tecnica: 'Álgebra de conjuntos', pasos: [
        { f: 'A \\ (A \\ B)', j: 'lado izquierdo' },
        { op: '=', f: 'A ∩ (A \\ B)ᶜ', j: 'Diferencia como intersección' },
        { op: '=', f: 'A ∩ (A ∩ Bᶜ)ᶜ', j: 'Diferencia como intersección' },
        { op: '=', f: 'A ∩ (Aᶜ ∪ (Bᶜ)ᶜ)', j: 'De Morgan' },
        { op: '=', f: 'A ∩ (Aᶜ ∪ B)', j: 'Doble complemento' },
        { op: '=', f: '(A ∩ Aᶜ) ∪ (A ∩ B)', j: 'Distributividad' },
        { op: '=', f: 'Ø ∪ (A ∩ B)', j: 'Complemento' },
        { op: '=', f: 'A ∩ B', j: 'Identidad' },
      ], nota: 'Desde A ∩ (Aᶜ ∪ B) también se puede ir directo a A ∩ B por absorción parcial.' },
    },
    {
      id: 'a14', origen: 'Teorema 12 ii', pedido: PEDIDO_ALG, enunciado: 'A ∩ (B \\ C) = (A ∩ B) \\ (A ∩ C)',
      pista: 'Empieza por el lado derecho, que es el más largo.',
      solucion: { tecnica: 'Álgebra de conjuntos', pasos: [
        { f: '(A ∩ B) \\ (A ∩ C)', j: 'lado derecho' },
        { op: '=', f: '(A ∩ B) ∩ (A ∩ C)ᶜ', j: 'Diferencia como intersección' },
        { op: '=', f: '(A ∩ B) ∩ (Aᶜ ∪ Cᶜ)', j: 'De Morgan' },
        { op: '=', f: '((A ∩ B) ∩ Aᶜ) ∪ ((A ∩ B) ∩ Cᶜ)', j: 'Distributividad' },
        { op: '=', f: '(B ∩ (A ∩ Aᶜ)) ∪ ((A ∩ B) ∩ Cᶜ)', j: 'Conmutatividad y asociatividad' },
        { op: '=', f: '(B ∩ Ø) ∪ ((A ∩ B) ∩ Cᶜ)', j: 'Complemento' },
        { op: '=', f: 'Ø ∪ ((A ∩ B) ∩ Cᶜ)', j: 'Dominación' },
        { op: '=', f: '(A ∩ B) ∩ Cᶜ', j: 'Identidad' },
        { op: '=', f: 'A ∩ (B ∩ Cᶜ)', j: 'Asociatividad' },
        { op: '=', f: 'A ∩ (B \\ C)', j: 'Diferencia como intersección' },
      ] },
    },
    {
      id: 'a15', origen: 'Teorema 12 iii', pedido: PEDIDO_ALG, enunciado: '(A \\ B) ∪ (A \\ C) = A \\ (B ∩ C)',
      solucion: { tecnica: 'Álgebra de conjuntos', pasos: [
        { f: '(A \\ B) ∪ (A \\ C)', j: 'lado izquierdo' },
        { op: '=', f: '(A ∩ Bᶜ) ∪ (A ∩ Cᶜ)', j: 'Diferencia como intersección' },
        { op: '=', f: 'A ∩ (Bᶜ ∪ Cᶜ)', j: 'Distributividad, al revés: se factoriza A' },
        { op: '=', f: 'A ∩ (B ∩ C)ᶜ', j: 'De Morgan' },
        { op: '=', f: 'A \\ (B ∩ C)', j: 'Diferencia como intersección' },
      ] },
    },
    {
      id: 'a16', pedido: PEDIDO_ALG, enunciado: '(A ∩ B) ∪ (A ∩ Bᶜ) = A',
      solucion: { tecnica: 'Álgebra de conjuntos', pasos: [
        { f: '(A ∩ B) ∪ (A ∩ Bᶜ)', j: 'lado izquierdo' },
        { op: '=', f: 'A ∩ (B ∪ Bᶜ)', j: 'Distributividad, al revés: se factoriza A' },
        { op: '=', f: 'A ∩ U', j: 'Complemento' },
        { op: '=', f: 'A', j: 'Identidad' },
      ], nota: 'Es el "gemelo" de la Tarea 5 #3, con ∩ y ∪ intercambiados.' },
    },
    {
      id: 'a17', pedido: PEDIDO_ALG, enunciado: 'A \\ (B ∪ C) = (A \\ B) ∩ (A \\ C)',
      pista: 'Truco: A = A ∩ A (idempotencia al revés) te deja repartir una A a cada lado.',
      solucion: { tecnica: 'Álgebra de conjuntos', pasos: [
        { f: 'A \\ (B ∪ C)', j: 'lado izquierdo' },
        { op: '=', f: 'A ∩ (B ∪ C)ᶜ', j: 'Diferencia como intersección' },
        { op: '=', f: 'A ∩ (Bᶜ ∩ Cᶜ)', j: 'De Morgan' },
        { op: '=', f: '(A ∩ A) ∩ (Bᶜ ∩ Cᶜ)', j: 'Idempotencia (al revés)' },
        { op: '=', f: '(A ∩ Bᶜ) ∩ (A ∩ Cᶜ)', j: 'Conmutatividad y asociatividad' },
        { op: '=', f: '(A \\ B) ∩ (A \\ C)', j: 'Diferencia como intersección' },
      ] },
    },
    {
      id: 'a18', pedido: PEDIDO_ALG, enunciado: '(A ∪ B) \\ B = A \\ B',
      solucion: { tecnica: 'Álgebra de conjuntos', pasos: [
        { f: '(A ∪ B) \\ B', j: 'lado izquierdo' },
        { op: '=', f: '(A ∪ B) ∩ Bᶜ', j: 'Diferencia como intersección' },
        { op: '=', f: '(A ∩ Bᶜ) ∪ (B ∩ Bᶜ)', j: 'Distributividad (por la derecha)' },
        { op: '=', f: '(A ∩ Bᶜ) ∪ Ø', j: 'Complemento' },
        { op: '=', f: 'A ∩ Bᶜ', j: 'Identidad' },
        { op: '=', f: 'A \\ B', j: 'Diferencia como intersección' },
      ] },
    },
    {
      id: 'a19', pedido: PEDIDO_RED, enunciado: '(A ∩ Bᶜ)ᶜ ∩ A', tesis: '(A ∩ Bᶜ)ᶜ ∩ A = A ∩ B',
      solucion: { tecnica: 'Álgebra de conjuntos', pasos: [
        { f: '(A ∩ Bᶜ)ᶜ ∩ A', j: 'expresión dada' },
        { op: '=', f: '(Aᶜ ∪ (Bᶜ)ᶜ) ∩ A', j: 'De Morgan' },
        { op: '=', f: '(Aᶜ ∪ B) ∩ A', j: 'Doble complemento' },
        { op: '=', f: 'A ∩ (Aᶜ ∪ B)', j: 'Conmutatividad' },
        { op: '=', f: 'A ∩ B', j: 'Absorción (parcial con complemento)' },
      ] },
    },
    {
      id: 'a20', pedido: PEDIDO_RED, enunciado: '(Aᶜ ∪ B)ᶜ ∪ (A ∩ B)', tesis: '(Aᶜ ∪ B)ᶜ ∪ (A ∩ B) = A',
      pista: 'Después de De Morgan, A aparece en las dos partes.',
      solucion: { tecnica: 'Álgebra de conjuntos', pasos: [
        { f: '(Aᶜ ∪ B)ᶜ ∪ (A ∩ B)', j: 'expresión dada' },
        { op: '=', f: '((Aᶜ)ᶜ ∩ Bᶜ) ∪ (A ∩ B)', j: 'De Morgan' },
        { op: '=', f: '(A ∩ Bᶜ) ∪ (A ∩ B)', j: 'Doble complemento' },
        { op: '=', f: 'A ∩ (Bᶜ ∪ B)', j: 'Distributividad, al revés: se factoriza A' },
        { op: '=', f: 'A ∩ U', j: 'Complemento (con conmutatividad)' },
        { op: '=', f: 'A', j: 'Identidad' },
      ] },
    },
    {
      id: 'a21', pedido: PEDIDO_ALG, enunciado: 'A ∩ (A ∪ B)ᶜ = Ø',
      solucion: { tecnica: 'Álgebra de conjuntos', pasos: [
        { f: 'A ∩ (A ∪ B)ᶜ', j: 'lado izquierdo' },
        { op: '=', f: 'A ∩ (Aᶜ ∩ Bᶜ)', j: 'De Morgan' },
        { op: '=', f: '(A ∩ Aᶜ) ∩ Bᶜ', j: 'Asociatividad' },
        { op: '=', f: 'Ø ∩ Bᶜ', j: 'Complemento' },
        { op: '=', f: 'Ø', j: 'Dominación' },
      ] },
    },
    // ---------- Para refutar ----------
    {
      id: 'a22', pedido: PEDIDO_ALG, enunciado: '(A ∪ B) \\ B = A',
      pista: 'Haz el diagrama de Venn de los dos lados. ¿Qué pasa con la parte de A que está dentro de B?',
      solucion: { tecnica: 'Contraejemplo', contraejemplo: { A: '{1}', B: '{1}' },
        evaluacion: ['(A ∪ B) \\ B = {1} \\ {1} = Ø', 'A = {1}', 'Ø ≠ {1}'], cierre: CIERRE_REFUTA,
        nota: 'Al quitar B también se quita la parte de A que está en B. Lo que sí se cumple es (A ∪ B) \\ B = A \\ B.' },
    },
    {
      id: 'a23', pedido: PEDIDO_ALG, enunciado: 'A \\ (B ∩ C) = (A \\ B) ∩ (A \\ C)',
      pista: 'Compáralo con De Morgan para la diferencia. ¿Es ∩ o ∪ del lado derecho?',
      solucion: { tecnica: 'Contraejemplo', contraejemplo: { A: '{1, 2}', B: '{1}', C: '{2}' },
        evaluacion: ['A \\ (B ∩ C) = {1, 2} \\ Ø = {1, 2}', '(A \\ B) ∩ (A \\ C) = {2} ∩ {1} = Ø', '{1, 2} ≠ Ø'], cierre: CIERRE_REFUTA,
        nota: 'Lo correcto es A \\ (B ∩ C) = (A \\ B) ∪ (A \\ C): la ∩ se vuelve ∪, como en De Morgan.' },
    },
    {
      id: 'a24', pedido: PEDIDO_ALG, enunciado: 'A ∪ (B ∩ C) = (A ∪ B) ∩ C',
      pista: 'Prueba con A con un elemento y B, C vacíos.',
      solucion: { tecnica: 'Contraejemplo', contraejemplo: { A: '{1}', B: 'Ø', C: 'Ø' },
        evaluacion: ['A ∪ (B ∩ C) = {1} ∪ Ø = {1}', '(A ∪ B) ∩ C = {1} ∩ Ø = Ø', '{1} ≠ Ø'], cierre: CIERRE_REFUTA,
        nota: 'Al distribuir hay que repartir A a los dos lados: A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C).' },
    },
    {
      id: 'a25', pedido: PEDIDO_ALG, enunciado: '(A ∩ B)ᶜ = Aᶜ ∩ Bᶜ',
      solucion: { tecnica: 'Contraejemplo', contraejemplo: { U: '{1, 2}', A: '{1}', B: '{2}' },
        evaluacion: ['(A ∩ B)ᶜ = Øᶜ = {1, 2}', 'Aᶜ ∩ Bᶜ = {2} ∩ {1} = Ø', '{1, 2} ≠ Ø'], cierre: CIERRE_REFUTA,
        nota: 'Error común de De Morgan: al sacar el complemento la ∩ se cambia por ∪. Lo correcto es (A ∩ B)ᶜ = Aᶜ ∪ Bᶜ.' },
    },
  ],
});
