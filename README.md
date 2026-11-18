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
  js/estudio.js         core: tabs, storage, helpers
  js/tarjetas.js        flashcard engine (both directions, category filter, review pile)
  js/problemas.js       problem engine (random order, no repeats, hidden solution) + "mezcla"
logica/
  index.html            unit page: loads the engines, then the data files (script order = tab order)
  datos/*.js            the content: each file registers one activity with ESTUDIO.actividad({...})
  mezcla.js             mixed practice that draws from other activities
tools/verificar.mjs     checks every logic proof step with truth tables
```

The engines don't know anything about logic. A unit is just data, so new units reuse everything.

## Adding a unit (e.g. Conjuntos)

1. Copy `logica/` to `conjuntos/` and delete the files in `datos/`.
2. In `conjuntos/index.html`, change the title, `ESTUDIO.unidad({ id: 'conjuntos', ... })`, and the list of data scripts.
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
    { id: 't6-1', enunciado: 'A ∩ (B ∪ C) = …',
      solucion: { tecnica: 'Distributividad', pasos: [ { f: 'A ∩ (B ∪ C)', j: 'dado', tipo: 'premisa' }, { f: '…', j: '…' } ], nota: '…' } },
  ],
});

// Mixed practice drawn from other activities
ESTUDIO.actividad({ id: 'mezcla', titulo: 'Mezcla', corto: 'Mezcla', tipo: 'mezcla', fuentes: ['tarea6'], cantidad: 10 });
```

4. In `unidades.js`, set `lista: true` for the unit.

Problems can also have `texto: [...]` and `variables: [{ v, s }]` (narrative problems), or a refutation in place of `pasos`: `solucion: { tecnica, contraejemplo: { p: true }, evaluacion: ['...'] }`.

If a unit needs a different kind of activity (for example, a relation-property classifier), add a new engine with `ESTUDIO.motor('tipo', (contenedor, actividad) => { ... })` and include its script in that unit's page.

## Checking the logic solutions

```
node tools/verificar.mjs logica
```

The script uses truth tables to check four things:
- every equivalence and inference card is valid
- each problem is correctly classified as provable or refutable
- every proof step follows from the lines it cites
- every proof ends at the conclusion, or at F for proof by contradiction

It does not check that the rule *name* is the right one. Those were written by hand.

Progress (current problem, flashcard settings) is saved in the browser's localStorage.
