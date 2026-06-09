# Configuration

Experiment projects have two configuration files with distinct responsibilities.

## `experiment.config.js`

Top-level runtime configuration. Located at the project root.

```js
export default {
    targetUrl: 'https://www.samsung.com/uk/smartphones/all-smartphones/',
    globalObject: 'sgd',
    includeEmergencyBrake: true,
    live: {
        variation: 0,
        overlay: 'visible',
        profile: 'ephemeral',
    },
};
```

| Field | Type | Description |
|---|---|---|
| `targetUrl` | `string` | Page opened by `pnpm live`. The scaffold derives it from E2E market answers when available. |
| `globalObject` | `string` | The IIFE window namespace. The bundle registers as `window[globalObject]`. Set at scaffold time - change only if it conflicts with another experiment. |
| `includeEmergencyBrake` | `boolean` | Scaffolded compatibility setting. The current build and runtime do not read it; verify the deployment layer before relying on it. |
| `live.variation` | `number \| string` | Variation used by `pnpm live`. Accepts a zero-based index or folder name such as `v2`. |
| `live.overlay` | `'visible' \| 'hidden'` | Shows or hides the live-injection status overlay. |
| `live.profile` | `'ephemeral' \| 'shared'` | Uses a temporary browser profile or a persistent OS-cache profile. |

## `src/config.js`

Experiment-specific values. This is the first file you edit when setting up an experiment.

### `product-card` boilerplate

```js
export const selectors = {
    primary: '.some-page-element',
    fallbacks: ['.alternate-selector', 'body'],
};

export const locale =
    (typeof window !== 'undefined' ? window.location.pathname : '').split('/').filter(Boolean)[0] || '';

export const MODEL_CODE_MAP = {
    default: 'SM-XXXXXXX',
    uk: 'SM-A556BZKAEUB',
    de: 'SM-A556BZKADBT',
};

export const MULTI_MODEL_CODES_MAP = {
    default: ['SM-XXXXXXX'],
};

const translations = {
    uk: { title: 'Upgrade today', from: 'From', ctaText: 'Shop now' },
    de: { title: 'Jetzt upgraden', from: 'Ab', ctaText: 'Jetzt kaufen' },
};
export const translationByMarket = translations[locale] || translations.uk;
```

### `minimal` boilerplate

```js
export const selectors = {
    primary: '.some-page-element',
    fallbacks: ['.alternate-selector', 'body'],
};

export const buttonText = 'Click Me';
```

| Export | Type | Description |
|---|---|---|
| `selectors.primary` | `string` | CSS selector for the DOM element the experiment injects adjacent to. Must be unique and stable on the target page. |
| `selectors.fallbacks` | `string[]` | Fallback selectors used by `mountExperiment` if `selectors.primary` yields no match. Keep them ordered from most specific to broadest. |
| `locale` | `string` | First path segment of the current URL (e.g. `uk`, `de`, `fr`). Resolved at runtime. |
| `MODEL_CODE_MAP` | `object` | *(product-card only)* Maps locale codes to Samsung model codes. Used by `modelCode()` in helpers. Include a `default` fallback. |
| `MULTI_MODEL_CODES_MAP` | `object` | *(product-card only)* Maps locales to arrays used by `fetchProductCards()`. |
| `translations` | `object` | Locale-keyed copy strings. |
| `translationByMarket` | `object` | `translations[locale]` with a `translations.uk` fallback. Import this directly in your component. |
| `buttonText` | `string` | Minimal boilerplate button copy. |

::: tip Finding the right primary selector
Use your browser's DevTools to inspect the page and pick a stable, unique CSS class or attribute selector near where the experiment should inject. Avoid selectors that change across page loads.
:::

`translations` is private in the generated module. Import `translationByMarket` from variation code.
