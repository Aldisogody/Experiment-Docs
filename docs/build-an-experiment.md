# Build an Experiment

Use this page when you have a generated project and need to know which files to edit.

## Editing map

| File or folder | What you edit there |
|---|---|
| `experiment.config.js` | Tooling settings such as `globalObject`, `targetUrl`, and emergency brake behavior. |
| `src/config.js` | Selectors, labels, translations, model codes, and boilerplate-specific content. |
| `src/helpers.js` | Product-card API fetch and formatting helpers. Present in product-card projects. |
| `src/js/v1/index.jsx` | Variation entry point: mount, fetch, render, track. |
| `src/components/*` | Preact components and local styles. |

Start with `src/config.js` and `src/js/v1/index.jsx`. Most experiments only need those files plus the component styles.

## Selectors

Generated config stores selectors as a primary selector plus fallbacks:

```js
export const selectors = {
    primary: '.target-selector',
    fallbacks: ['.alternate-selector', 'body'],
};
```

Keep the primary selector specific to the intended page region. Add fallbacks only when the page structure differs across markets or page templates.

`mountExperiment()` tries the primary selector first, then each fallback. If no selector matches, it returns `null`.

## Variation entry point

The variation entry point follows the same order in both boilerplates:

```jsx
import { render } from 'preact';
import { mountExperiment, runScript, setupTracking } from 'create-experiment/framework';

runScript(async () => {
    const container = mountExperiment(selectors.primary, selectors.fallbacks, 'afterbegin');
    if (!container) return;

    render(<ExperimentComponent />, container);

    setupTracking(container, {
        label: 'my-experiment: v1 cta clicked',
    });
});
```

The important order is:

1. `runScript()` waits for DOM readiness.
2. `mountExperiment()` creates the injected container.
3. Your experiment renders into that container.
4. `setupTracking()` runs after render so the tracked element exists.

## Boilerplate differences

### Minimal

Use `minimal` for copy, CTA, layout, or simple UI experiments. It generates:

- `ExperimentButton`.
- `buttonText` in `src/config.js`.
- One variation entry point.
- No product API helper.

The runtime tracking selector defaults to `'a'`. The minimal entry point explicitly sets `selector: 'button'`.

### Product-card

Use `product-card` when the experiment needs Samsung product data. It generates:

- `ExperimentCard`.
- `MODEL_CODE_MAP`, `MULTI_MODEL_CODES_MAP`, locale, and translations in `src/config.js`.
- `fetchProductCard()` and `formatPrice()` in `src/helpers.js`.
- Product image, price, CTA, and title props in the entry point.

## Styling

Generated UI styles use Sass CSS Modules:

```jsx
import style from './styles.module.scss';

export default function ExperimentButton({ text }) {
    return <button class={style.button}>{text}</button>;
}
```

Vite config sets CSS Modules to camelCase class names and prefixes generated classes with a project-derived prefix. Keep styles local to the component or variation that uses them.

Shared Sass helpers are loaded from `create-experiment/runtime/scss`, so component SCSS can use `mq()` and `fluid-property()` without local imports.

```scss
.button {
    @include fluid-property(sm, 'padding', 12px, 24px);

    @include mq($from: md) {
        font-size: 16px;
    }
}
```

Available named breakpoints are `xs`, `sm`, `md`, `lg`, and `xl`.

## Runtime helpers

Import runtime helpers from the package export:

```js
import {
    mountExperiment,
    runScript,
    setupTracking,
    trackAAEvent,
    getMarket,
    debug,
    waitFor,
    watchFor,
} from 'create-experiment/framework';
```

Use the API reference when you need exact parameters:

- [`mountExperiment()`](/framework-api/mount-experiment)
- [`runScript()`](/framework-api/run-script)
- [`waitFor()` and `watchFor()`](/framework-api/wait-for)
- [Tracking helpers](/framework-api/tracking)
- [Path and market helpers](/framework-api/path-and-market)
- [Logging and debugging](/framework-api/logging)

## Next

- [Run and Ship](/run-and-ship) explains watch mode, live injection, builds, and variations.
- [Testing](/testing) explains optional Playwright tests.
