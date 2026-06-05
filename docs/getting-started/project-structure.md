# Project Structure

A generated `product-card` project with two variations looks like this:

```
my-experiment/
│
├── src/
│   ├── components/
│   │   └── ExperimentCard/
│   │       ├── index.jsx              # Preact component — image, title, price, CTA
│   │       └── styles.module.scss     # Scoped component styles
│   │
│   ├── js/
│   │   ├── v1/
│   │   │   ├── index.jsx              # Variation 1 entry point
│   │   │   └── styles.module.scss     # Per-variation style overrides
│   │   └── v2/
│   │       ├── index.jsx              # Variation 2 entry point
│   │       └── styles.module.scss
│   │
│   ├── config.js                      # selectors, translations, MODEL_CODE_MAP
│   └── helpers.js                     # Samsung API fetch, price formatting (product-card only)
│
├── e2e/                               # Only present when E2E is enabled
│   ├── smoke.spec.js
│   ├── config.js                      # Market URLs
│   └── helpers.js
│
├── experiment.config.js               # globalObject, includeEmergencyBrake
├── vite.config.js                     # IIFE lib mode, Preact plugin, CSS Modules, aliases
├── playwright.config.js               # Only present when E2E is enabled
├── biome.json                         # Biome linter + formatter
├── jsconfig.json                      # JSX support and aliases for editors
├── .nvmrc                             # Node 24
├── .editorconfig
├── .gitignore
└── package.json
```

## Key files explained

### `experiment.config.js`

Top-level runtime configuration. Keep this at the root — it's imported by the build script.

```js
export default {
    globalObject: 'sgd',          // Window namespace for the IIFE bundle
    includeEmergencyBrake: true,  // Adobe Target kill-switch
};
```

See [Configuration](/development/config) for details.

### `src/config.js`

Experiment-specific values. Edit this file first when setting up a new experiment.

```js
export const selectors = {
    primary: '.target-selector',
    fallbacks: ['.alternate-selector', 'body'],
};

export const locale = window.location.pathname.split('/')[1];

export const MODEL_CODE_MAP = {
    default: 'SM-XXXXXXX',   // Samsung model code per locale
    uk: 'SM-XXXXXXX',
};

export const translationByMarket = {
    uk: { title: 'Upgrade today', from: 'From', ctaText: 'Shop now' },
    // Add more locales as needed
};
```

### `src/helpers.js`

Samsung-specific utilities included in the `product-card` boilerplate. The key exports are:

- `fetchProductCard()` — fetches Samsung product data from the search API
- `formatPrice(price)` — formats a price using `Intl.NumberFormat` for the current locale
- `modelCode()` — resolves the model code from `MODEL_CODE_MAP` based on locale

The `minimal` boilerplate does not need Samsung API integration.

### Runtime helpers

The experiment runtime is imported from `create-experiment/framework`. Every variation entry point can use:

- `runScript(fn)` — ensures DOM is ready before executing
- `mountExperiment(selector, fallback?, position?)` — creates and injects the container `div`
- `trackAAEvent(evar, event, data)` — fires Adobe Analytics events
- `waitFor(selectors, callback)` — polls until elements are present
- `watchFor(selector, callback, options?)` — waits via MutationObserver
- `setupTracking(container, options)` — attaches click tracking to a rendered element

See the [Framework API](/framework-api/) for full documentation.

### `src/js/v1/index.jsx`

The variation entry point. Every variation follows the same four-step pattern:

```jsx
import { render } from 'preact';
import { mountExperiment, runScript, setupTracking } from 'create-experiment/framework';
import ExperimentCard from '@components/ExperimentCard';
import { fetchProductCard } from '../../helpers';
import { selectors, translationByMarket } from '../../config';

runScript(async () => {
    // 1. Mount container
    const container = mountExperiment(selectors.primary, selectors.fallbacks);
    if (!container) return;

    // 2. Fetch data
    const { data } = await fetchProductCard();
    if (!data) return;

    // 3. Render component
    render(<ExperimentCard ... />, container);

    // 4. Set up tracking — MUST come after render
    setupTracking(container, { label: 'my-experiment: v1 cta clicked' });
});
```

::: warning Tracking must come after render
`setupTracking` queries the DOM for the element to attach to. Calling it before `render()` will silently fail because the element doesn't exist yet.
:::

### Import aliases

Vite resolves this alias in generated projects:

| Alias | Resolves to |
|---|---|
| `@components` | `src/components/` |
