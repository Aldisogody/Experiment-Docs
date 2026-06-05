# Configuration

Experiment projects have two configuration files with distinct responsibilities.

## `experiment.config.js`

Top-level runtime configuration. Located at the project root.

```js
export default {
    globalObject: 'sgd',
    includeEmergencyBrake: true,
};
```

| Field | Type | Description |
|---|---|---|
| `globalObject` | `string` | The IIFE window namespace. The bundle registers as `window[globalObject]`. Set at scaffold time — change only if it conflicts with another experiment. |
| `includeEmergencyBrake` | `boolean` | When `true`, wraps the experiment in an Adobe Target kill-switch. Set to `false` to remove the kill-switch entirely (not recommended for live experiments). |

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

export const translations = {
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
| `translations` | `object` | Locale-keyed copy strings. |
| `translationByMarket` | `object` | `translations[locale]` with a `translations.uk` fallback. Import this directly in your component. |
| `buttonText` | `string` | Minimal boilerplate button copy. |

::: tip Finding the right primary selector
Use your browser's DevTools to inspect the page and pick a stable, unique CSS class or attribute selector near where the experiment should inject. Avoid selectors that change across page loads.
:::
