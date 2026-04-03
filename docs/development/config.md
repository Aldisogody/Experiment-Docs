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

```js
export const testName = 'my-experiment';
export const targetSelector = '.some-page-element';

export const locale = window.location.pathname.split('/')[1];

export const MODEL_CODE_MAP = {
    default: 'SM-XXXXXXX',
    uk: 'SM-A556BZKAEUB',
    de: 'SM-A556BZKADBT',
};

export const translationByMarket = {
    uk: {
        title: 'Upgrade today',
        from: 'From',
        ctaText: 'Shop now',
    },
    de: {
        title: 'Jetzt upgraden',
        from: 'Ab',
        ctaText: 'Jetzt kaufen',
    },
};
```

| Export | Type | Description |
|---|---|---|
| `testName` | `string` | Used in `uniqueBuild()` to generate dedup IDs and in tracking labels. Match your Adobe Target activity name. |
| `targetSelector` | `string` | CSS selector for the DOM element the experiment injects adjacent to. Must be unique and stable on the target page. |
| `locale` | `string` | First path segment of the current URL (e.g. `uk`, `de`, `fr`). Resolved at runtime. |
| `MODEL_CODE_MAP` | `object` | Maps locale codes to Samsung model codes. Used by `modelCode()` in helpers. Include a `default` fallback. |
| `translationByMarket` | `object` | Locale-keyed copy strings. `translationByMarket[locale]` is used in the component. Falls back to `uk` if the locale is not found. |

::: tip Finding the right targetSelector
Use your browser's DevTools to inspect the page and pick a stable, unique CSS class or attribute selector near where the experiment should inject. Avoid selectors that change across page loads.
:::
