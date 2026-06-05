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
│   ├── config.js                      # testName, targetSelector, fallbackSelector, translations, MODEL_CODE_MAP
│   └── helpers.js                     # Samsung API fetch, price formatting (product-card only)
│
├── lib/
│   └── framework.js                   # Runtime: runScript, mountExperiment, trackAAEvent, waitFor, watchFor, setupTracking
│
├── scripts/
│   ├── build.js                       # Vite IIFE builds — one bundle per variation
│   └── start.js                       # Watch wrapper: pnpm start 0 → -e0 flag
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
├── .stylelintrc                       # SCSS linting rules
├── tsconfig.json                      # JSX support for editors
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
    includeEmergencyBrake: true,  // Adobe Target kill-switch — disable to remove it
};
```

See [Configuration](/development/config) for details.

### `src/config.js`

Experiment-specific values. Edit this file first when setting up a new experiment.

```js
export const testName = 'my-experiment';
export const targetSelector = '.target-selector';   // CSS selector for DOM injection

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

The `minimal` boilerplate generates an empty `helpers.js` — no Samsung API integration needed.

### `lib/framework.js`

The experiment runtime. Imported in every variation entry point. Provides:

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
import { render, h } from 'preact';
import { mountExperiment, runScript, setupTracking } from '@lib/framework';
import ExperimentCard from '@components/ExperimentCard';
import { fetchProductCard } from '../../helpers';
import { translationByMarket, targetSelector, fallbackSelector } from '../../config';

runScript(async () => {
    // 1. Mount container — falls back to body if targetSelector misses
    const container = mountExperiment(targetSelector, fallbackSelector);
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

Vite resolves two aliases in generated projects:

| Alias | Resolves to |
|---|---|
| `@lib/framework` | `lib/framework.js` |
| `@components` | `src/components/` |
