# mountExperiment()

Creates a container `div` and injects it adjacent to a target element. Returns the container so you can render into it immediately.

The mount wrapper sits **outside** the Preact component tree. Component CSS Modules (for example on `ExperimentCard` or `ExperimentButton`) do not apply to it automatically. Pass a scoped class from `src/js/vN/styles.module.scss` via the optional fourth argument.

## Signature

```ts
mountExperiment(
    selector: string,
    fallback?: string | string[] | InsertPosition,
    position?: InsertPosition,
    options?: {
        className?: string;
        id?: string;
        dataset?: Record<string, string>;
        attributes?: Record<string, string>;
    }
): HTMLElement | null
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `selector` | `string` | - | CSS selector for the DOM element to inject adjacent to. |
| `fallback` | `string \| string[]` | `undefined` | One fallback selector or an ordered list. No implicit `body` fallback is added. |
| `position` | `InsertPosition` | `'afterbegin'` | Where to insert the container relative to the target. See [InsertPosition values](#insertposition-values) below. |
| `options` | `object` | `{}` | Optional attributes for the mount container. See [Mount options](#mount-options). |

When you do not need a fallback, the second argument can be a position:

```js
const container = mountExperiment('.target', 'afterend');
```

## Mount options

| Option | Type | Description |
|---|---|---|
| `className` | `string` | Class for the mount container. Primary use case: a CSS Modules export such as `style.root`. For multiple classes, build the string at the call site (see below). |
| `id` | `string` | Sets the mount container `id`. |
| `dataset` | `Record<string, string>` | Sets `data-*` attributes via `element.dataset`. |
| `attributes` | `Record<string, string>` | Sets arbitrary attributes via `setAttribute` (for example `role`, `aria-label`). |

Options are applied **after** `createElement('div')` and **before** `insertAdjacentElement`.

## How styles are passed and injected

The runtime package (`create-experiment/framework`) is plain ESM. It is **not** processed by Vite and **cannot** import `.scss`.

| Layer | Responsibility |
|---|---|
| Variation entry (`src/js/vN/index.jsx`) | `import style from './styles.module.scss'` — pulls SCSS into the IIFE build graph |
| Vite (`vite.config.js`) | Compiles SCSS to scoped class names (`{{ classPrefix }}--root`) and injects `<style>` at bundle runtime |
| `mountExperiment` | Applies the resolved class string to `container.className` |

```js
import style from './styles.module.scss';

const container = mountExperiment(selectors.primary, selectors.fallbacks, 'afterbegin', {
    className: style.root,
});
```

Vite turns `.root` in `styles.module.scss` into something like `my-experiment--root` in the bundle and includes the CSS rules.

::: warning Do not pass raw class strings without importing SCSS
This adds a class to the DOM but **does not** bundle the styles unless the same class is defined elsewhere in the import graph:

```js
// Avoid — no CSS in bundle
mountExperiment(selectors.primary, selectors.fallbacks, 'afterbegin', {
    className: 'my-experiment--root',
});
```
:::

## Usage

### Scaffold default (recommended)

Both boilerplates generate `src/js/v1/styles.module.scss` with a `.root` class using `display: contents` so the wrapper does not affect flex/grid layout:

```scss
// src/js/v1/styles.module.scss
.root {
    display: contents;
}
```

```js
import { render } from 'preact';
import { mountExperiment, runScript, setupTracking } from 'create-experiment/framework';
import { selectors } from '../../config';
import style from './styles.module.scss';

runScript(async () => {
    const container = mountExperiment(selectors.primary, selectors.fallbacks, 'afterbegin', {
        className: style.root,
        dataset: { experiment: 'my-experiment' },
    });
    if (!container) return;

    render(<MyComponent />, container);
    setupTracking(container, { label: 'my-experiment: v1 cta clicked' });
});
```

Always guard on `null` — if the target page changes structure or the selector is wrong, `mountExperiment` returns `null` and the guard prevents a runtime error.

### Full-width mount wrapper

Override `.root` when the injection should span the host container:

```scss
// src/js/v1/styles.module.scss
.root {
    width: 100%;
    box-sizing: border-box;
}
```

```js
const container = mountExperiment(selectors.primary, selectors.fallbacks, 'afterbegin', {
    className: style.root,
});
```

### Multiple classes

Combine a CSS Module class with conditional or host-page classes at the call site. Use the exported `classes()` helper from `create-experiment/framework` or a plain string:

```js
import { classes, mountExperiment, runScript } from 'create-experiment/framework';
import style from './styles.module.scss';

const isPromo = true;

const container = mountExperiment(selectors.primary, selectors.fallbacks, 'afterbegin', {
    className: classes(style.root, isPromo && 'is-promo'),
});
```

Or pass a pre-built string:

```js
mountExperiment(selectors.primary, selectors.fallbacks, 'afterbegin', {
    className: `${style.root} sg-campaign-slot`,
});
```

`mountExperiment` assigns `className` as-is; it does not split or join values.

### E2E-friendly `data-experiment` hook

The scaffold sets `dataset.experiment` to the project name. Playwright can target a stable attribute:

```js
const container = mountExperiment(selectors.primary, selectors.fallbacks, 'afterbegin', {
    className: style.root,
    dataset: { experiment: 'coe-602-banner-upsell' },
});
```

Renders as:

```html
<div class="coe-602-banner-upsell--root" data-experiment="coe-602-banner-upsell"></div>
```

```js
page.locator('[data-experiment="coe-602-banner-upsell"]');
```

Generated E2E helpers also use `${primarySelector} > div:first-child`, which still works when the mount node is a `div`.

### Accessibility and semantics

```js
const container = mountExperiment(selectors.primary, selectors.fallbacks, 'afterbegin', {
    className: style.root,
    id: 'exp-banner-root',
    attributes: {
        role: 'region',
        'aria-label': 'Promotional offer',
    },
});
```

### Insert position with styling

No fallbacks — pass options as the third argument when the second argument is a position:

```js
const container = mountExperiment(selectors.primary, 'afterend', {
    className: style.root,
});
```

With fallbacks:

```js
const container = mountExperiment(
    selectors.primary,
    selectors.fallbacks,
    'beforeend',
    { className: style.root },
);
```

### Per-variation mount styles

Each variation can have its own mount styles. `pnpm new-variation 2` copies `v1/styles.module.scss` into `v2/` when present:

```js
// src/js/v2/index.jsx
import style from './styles.module.scss';

const container = mountExperiment(selectors.primary, selectors.fallbacks, 'afterbegin', {
    className: style.root,
});
```

```scss
// src/js/v2/styles.module.scss
.root {
    width: 100%;
    margin-top: 16px;
}
```

### SPA dedup guard

On Samsung SPA pages, Adobe Target may re-execute custom code on route changes. Check for an existing mount before injecting:

```js
runScript(async () => {
    const marker = 'my-experiment-v1';
    if (document.querySelector(`[data-experiment="${marker}"]`)) return;

    const container = mountExperiment(selectors.primary, selectors.fallbacks, 'afterbegin', {
        className: style.root,
        dataset: { experiment: marker },
    });
    if (!container) return;

    render(<MyComponent />, container);
    setupTracking(container, { label: 'my-experiment: v1 cta clicked' });
});
```

### Manual post-mount (legacy)

Works, but prefer passing options in the call:

```js
import style from './styles.module.scss';

const container = mountExperiment(selectors.primary, selectors.fallbacks, 'afterbegin');
if (!container) return;

container.className = style.root;
container.dataset.experiment = 'my-experiment';
```

## InsertPosition values

| Value | Where the container is inserted |
|---|---|
| `'afterbegin'` | Inside the target, before its first child *(default)* |
| `'beforeend'` | Inside the target, after its last child |
| `'beforebegin'` | Before the target element itself |
| `'afterend'` | After the target element itself |

Both current boilerplates pass `'afterbegin'`.

## Why the wrapper div exists

Preact `render()` replaces all children of its parent element. Rendering directly into a populated Samsung host node can wipe existing page content. The mount wrapper:

1. Isolates experiment UI from host siblings.
2. Provides a bounded subtree for `setupTracking(container, …)`.
3. Gives a stable injection point for `insertAdjacentElement`.

Removing the wrapper is only safe when the target is an empty placeholder element.

## Returns

`HTMLElement` — the created container `div`, ready to render into.

`null` — if neither `selector` nor `fallback` match any element.

## Since

- `v2.0.0` — initial helper, ordered fallbacks, position shorthand.
- Unreleased on `main` — optional fourth `options` argument; scaffolded `src/js/vN/styles.module.scss` for mount-root styling.

## See Also

- [`runScript()`](/framework-api/run-script) — always wrap `mountExperiment` inside `runScript`
- [`setupTracking()`](/framework-api/tracking#setuptracking) — attach click tracking after rendering into the container
- [Styling (SCSS Modules)](/linting/stylelint) — CSS Modules conventions and mount-root vs component styles
- [Variations](/development/variations) — copying mount styles when adding `v2`, `v3`, …
