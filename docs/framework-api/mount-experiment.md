# mountExperiment()

Creates a container `div`, inserts it relative to a target element, and returns it for rendering.

The mount wrapper sits **outside** the Preact component tree. Component CSS Modules, such as `ExperimentButton` styles, do not apply to it automatically. Pass a scoped class from `src/js/vN/styles.module.scss` via the optional fourth argument.

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

## How wrapper styles reach the bundle

The runtime package is plain ESM, so it cannot import `.scss`. Import the wrapper stylesheet from the variation entry point instead.

| Layer | Responsibility |
|---|---|
| Variation entry (`src/js/vN/index.jsx`) | `import style from './styles.module.scss'` pulls SCSS into the IIFE build graph |
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
// Avoid: no CSS in bundle
mountExperiment(selectors.primary, selectors.fallbacks, 'afterbegin', {
    className: 'my-experiment--root',
});
```
:::

## Usage

### Scaffold default

The scaffold generates `src/js/v1/styles.module.scss` with a `.root` class using `display: contents` so the wrapper does not affect flex/grid layout:

```scss
// src/js/v1/styles.module.scss
.root {
    display: contents;
}
```

```js
import { render } from 'preact';
import { mountExperiment, runScript, setupTracking } from '@sogody/experiment-framework/framework';
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

Always handle `null`. It means neither the primary selector nor a fallback matched.

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

Combine a CSS Module class with conditional or host-page classes at the call site. Use the exported `classes()` helper from `@sogody/experiment-framework/framework` or a plain string:

```js
import { classes, mountExperiment, runScript } from '@sogody/experiment-framework/framework';
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

### Stable E2E selector

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

### Styled insert positions

Without fallbacks, pass the position second and the options third:

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

## Insert positions

| Value | Where the container is inserted |
|---|---|
| `'afterbegin'` | Inside the target, before its first child *(default)* |
| `'beforeend'` | Inside the target, after its last child |
| `'beforebegin'` | Before the target element itself |
| `'afterend'` | After the target element itself |

The current scaffold passes `'afterbegin'`.

## Why the wrapper exists

Preact `render()` replaces all children of its parent element. Rendering directly into a populated Samsung host node can wipe existing page content. The mount wrapper:

1. Isolates experiment UI from host siblings.
2. Provides a bounded subtree for `setupTracking(container, …)`.
3. Gives a stable injection point for `insertAdjacentElement`.

Removing the wrapper is only safe when the target is an empty placeholder element.

## Returns

`HTMLElement` if the container was created and inserted.

`null` if neither `selector` nor a fallback matches an element.

## Since

- `v2.0.0`: initial helper, ordered fallbacks, and position shorthand.
- Current package: optional fourth `options` argument and scaffolded `src/js/vN/styles.module.scss` for mount-root styling.

## Related pages

- [`runScript()`](/framework-api/run-script) explains how to start the experiment after DOM readiness.
- [`setupTracking()`](/framework-api/tracking#setuptracking) attaches click tracking after rendering.
- [Styling with SCSS Modules](/linting/stylelint) covers component and mount-wrapper styles.
- [Variations](/development/variations) covers copying mount styles to another variation.
