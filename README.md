# Estudio · Matemáticas para Ciencias de la Computación

A static study site for the final exam: flashcards and practice problems, one page per unit. It has no build step and no dependencies, so it runs on GitHub Pages as is.

## Publish on GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repository, go to **Settings → Pages → Build and deployment**. Choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. After a minute the site is at `https://<your-user>.github.io/<repo-name>/`.

To try it locally, run `python3 -m http.server` in this folder and open http://localhost:8000. Opening `index.html` directly also works.

## How it is organized

```
index.html              home page: list of units
unidades.js             the unit list (set "lista: true" when a unit is ready)
assets/
  css/estilos.css       shared styles (light and dark mode)
  css/extras.css        styles for hints, proof connectors, section titles, true/false and Venn diagrams
  js/estudio.js         core: tabs, storage, helpers
  js/tarjetas.js        flashcard engine (both directions, category filter, review pile)
  js/problemas.js       problem engine (random order, no repeats, hint, step-by-step reveal, hidden solution) + "mezcla"
  js/conjuntos-expr.js  set-expression parser and evaluator (shared by venn.js and the checker)
  js/venn.js            Venn diagram engine (shade, identify, does the law hold?)
logica/
  index.html            unit page: loads the engines, then the data files (script order = tab order)
  datos/*.js            the content: each file registers one activity with ESTUDIO.actividad({...})
  mezcla.js             mixed practice that draws from other activities
conjuntos/              same structure as logica/
tools/verificar.mjs     checks the content of a unit (truth tables / Venn regions)
```

The engines don't know anything about logic or sets. A unit is just data, so new units reuse everything.

## Adding a unit

1. Copy `logica/` to a new folder and delete the files in `datos/`.
2. In the new `index.html`, change the title, `ESTUDIO.unidad({ id: '…', ... })`, and the list of data scripts.
3. Write data files in one of these shapes:

```js
// Flashcards
ESTUDIO.actividad({
  id: 'tarjetas-conjuntos', titulo: 'Tarjetas: leyes de conjuntos', corto: 'Tarjetas', tipo: 'tarjetas',
  tarjetas: [
    { cat: 'Leyes', nombre: 'De Morgan', formula: '(A ∪ B)ᶜ = Aᶜ ∩ Bᶜ', nota: 'optional' },
  ],
});

// Problems (one at a time, random, with a hidden solution)
ESTUDIO.actividad({
  id: 'tarea6', titulo: 'Tarea 6', corto: 'Tarea 6', tipo: 'problemas',
  instrucciones: ['...'], instruccionCorta: 'Shown in the mix',
  problemas: [
    { id: 't6-1', origen: 'Tarea 6 #1', pedido: 'Demuestra:', enunciado: 'A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)',
      pista: 'Shown only when the hint button is pressed',
      solucion: { tecnica: 'Cadena de ⟺', pasos: [
        { f: 'x ∈ A ∩ (B ∪ C)', j: 'sea x cualquier elemento' },
        { op: '⟺', f: 'x ∈ A y x ∈ B ∪ C', j: 'Definición de intersección' },
      ], nota: '…' } },
  ],
});

// Mixed practice drawn from other activities
ESTUDIO.actividad({ id: 'mezcla', titulo: 'Mezcla', corto: 'Mezcla', tipo: 'mezcla', fuentes: ['tarea6'], cantidad: 10 });
```

4. In `unidades.js`, set `lista: true` for the unit.

### Optional problem fields

| Field | What it does |
|---|---|
| `pedido` | Short line above the statement ("Demuestra o refuta:") |
| `origen` | Label shown instead of `#n` ("Tarea 5 #9") |
| `pista` | Text (or list of texts) behind a **Pista** button |
| `texto`, `variables` | Narrative problems (logic) |
| step `op` | Connector at the start of the row (`=`, `⊆`, `⟺`, `⇒`); shown as its own column |
| step `tipo: 'titulo'` | Full-width heading row, e.g. "(⊆) Primera contención" |
| `solucion.contraejemplo` | `{ p: false }` for logic or `{ A: '{1}', B: 'Ø' }` for sets, plus `evaluacion: [...]` |
| `solucion.respuesta` | `true`/`false` for true-or-false questions, plus `evaluacion: [...]` |
| `solucion.cierre` | Replaces the closing line ("Q.E.D.", "queda refutada") |
| `tesis`, `hipotesis`, `datos`, `verificar: false` | Only used by the checker (see below) |

Every problem with more than one solution row gets a **Un renglón más** button (key `L`) that reveals the solution one row at a time.

### Venn activities

```js
ESTUDIO.actividad({ id: 'venn', titulo: 'Diagramas de Venn', corto: 'Venn', tipo: 'venn', ejercicios: [
  { id: 's1', modo: 'sombrear', conjuntos: ['A', 'B'], expr: 'A \\ B', nota: '…' },
  { id: 'i1', modo: 'identificar', conjuntos: ['A', 'B', 'C'], expr: 'A \\ (B ∪ C)', equivalentes: ['A ∩ Bᶜ ∩ Cᶜ'] },
  { id: 'l1', modo: 'ley', conjuntos: ['A', 'B'], izq: '(A ∪ B)ᶜ', der: 'Aᶜ ∩ Bᶜ', cumple: true },
] });
```

The page must load `conjuntos-expr.js` and `venn.js`.

### Writing set expressions

`conjuntos-expr.js` reads: `A B C … U Ø`, `∩ ∪ \ ∆ × ᶜ`, `{1, 2}`, `{x : …}`, `2ᴬ`, `|A|`, and statements with `∈ ∉ ⊆ ⊂ ⊇ = ≠`, joined with `y`, `o`, `¬`, `⇒`, `⟺`, `V`, `F`. Mixing different operations (or `y` with `o`) needs parentheses: `(A ∩ B) ∪ C`. Pairs are `(x, y)`.

## Checking the content

```
node tools/verificar.mjs logica
node tools/verificar.mjs conjuntos
```

For **logica** it uses truth tables to check four things:
- every equivalence and inference card is valid
- each problem is correctly classified as provable or refutable
- every proof step follows from the lines it cites
- every proof ends at the conclusion, or at F for proof by contradiction

For **conjuntos** it uses the regions of a Venn diagram (the same idea as a truth table) to check:
- every card in Operaciones, Leyes, Contención, Diferencia and Producto is a valid law
- every Venn expression reads correctly, and each "¿se cumple la ley?" answer is right
- true/false answers and calculations, by computing them with the concrete sets in `datos`
- every counterexample really makes the statement false
- every proof row follows from the row before it with its connector (`=`, `⊆`, `⟺`, `⇒`), using `hipotesis` when given
- the sections of a proof together prove exactly the `tesis` (by default the `enunciado`): one chain of `=`/`⟺`, two containments, a chain that ends in `F` for `= Ø`, or `H ⇒ C`

Some statements can't be checked this way (they say "there exists", or use `≠` or `o` between set relations, like `A × B = Ø ⟺ A = Ø o B = Ø`). The checker lists them as "no verificables" so you can review them by hand; `verificar: false` marks a whole problem for manual review.

It does not check that the rule *name* is the right one. Those were written by hand.

Progress (current problem, flashcard settings, Venn mode) is saved in the browser's localStorage.
