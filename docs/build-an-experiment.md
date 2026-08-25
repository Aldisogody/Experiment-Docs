# Build an experiment

Most experiment work happens in the config, variation entry point, component, and local styles.

## Editing map

| File or folder | What you edit there |
|---|---|
| `experiment.config.js` | Tooling settings such as `globalObject`, `targetUrl`, and emergency brake behavior. |
| `src/config.js` | Selectors and scaffolded button text. |
| `src/helpers.js` | Shared tracking label format and reusable page-aware logic. |
| `src/js/v1/index.jsx` | Variation entry point: mount, render, track. |
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

The variation entry point follows the same order in every generated variation:

```jsx
import { render } from 'preact';
import { mountExperiment, runScript, setupTracking, trackInView } from '@sogody/experiment-framework/framework';
import ExperimentButton from '@components/ExperimentButton';
import { buttonText, selectors } from '../../config';
import { getTrackingLabel } from '../../helpers';
import style from './styles.module.scss';

runScript(async () => {
    const container = mountExperiment(selectors.primary, selectors.fallbacks, 'afterbegin', {
        className: style.root,
        dataset: { experiment: 'my-experiment' },
    });
    if (!container) return;

    render(<ExperimentButton text={buttonText} />, container);

    trackInView(container.querySelector('button'), {
        label: getTrackingLabel('v', 'scrolled into view'),
        onceKey: 'my-experiment:v1:button-impression',
    });

    setupTracking(container, {
        label: getTrackingLabel('v', 'cta clicked'),
        selector: 'button',
    });
});
```

The important order is:

1. `runScript()` waits for DOM readiness.
2. `mountExperiment()` creates the injected container.
3. Your experiment renders into that container.
4. `trackInView()` observes the rendered element for an impression.
5. `setupTracking()` attaches the click listener after render.

## What the scaffold includes

The scaffold starts with a locale-neutral button:

- `ExperimentButton`.
- `buttonText` in `src/config.js`.
- One or more variation entry points under `src/js/vN/`.
- No product API helper or Samsung product-card assumptions.

The runtime tracking selector defaults to `'a'`. The generated entry point explicitly sets `selector: 'button'`.

## Styling

Generated UI styles use Sass CSS Modules:

```jsx
import style from './styles.module.scss';

export default function ExperimentButton({ text }) {
    return <button class={style.button}>{text}</button>;
}
```

Vite config sets CSS Modules to camelCase class names and prefixes generated classes with a project-derived prefix. Keep styles local to the component or variation that uses them.

Shared Sass helpers are loaded from `@sogody/experiment-framework/runtime/scss`, so component SCSS can use `mq()` and `fluid-property()` without local imports.

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
    trackInView,
    getMarket,
    debug,
    waitFor,
    watchFor,
} from '@sogody/experiment-framework/framework';
```

Use the API reference when you need exact parameters:

- [`mountExperiment()`](/framework-api/mount-experiment)
- [`runScript()`](/framework-api/run-script)
- [`waitFor()` and `watchFor()`](/framework-api/wait-for)
- [Tracking helpers](/framework-api/tracking)
- [Path and market helpers](/framework-api/path-and-market)
- [Logging and debugging](/framework-api/logging)

## Continue

- [Run and Ship](/run-and-ship) explains watch mode, live injection, builds, and variations.
- [Testing](/testing) explains optional Playwright tests.
