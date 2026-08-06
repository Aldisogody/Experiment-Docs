# Configuration

Experiment projects have two configuration files with distinct responsibilities.

## `experiment.config.js`

This file sits at the project root and configures the build and live-preview tools.

```js
export default {
    targetUrl: 'https://www.samsung.com/uk/smartphones/all-smartphones/',
    runtime: {
        globalObject: 'sgd',
        includeEmergencyBrake: true,
    },
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
| `runtime.globalObject` | `string` | The IIFE window namespace. The bundle registers as `window[globalObject]`. Change the scaffolded value only if it conflicts with another experiment. |
| `runtime.includeEmergencyBrake` | `boolean` | Enables the runtime emergency-brake check in `runScript()`. |
| `live.variation` | `number \| string` | Variation used by `pnpm live`. Accepts a zero-based index or discovered folder name such as `v2` or `control`. |
| `live.overlay` | `'visible' \| 'hidden'` | Shows or hides the live-injection status overlay. |
| `live.profile` | `'ephemeral' \| 'shared'` | Uses a temporary browser profile or a persistent OS-cache profile. |

## `src/config.js`

Keep experiment-specific selectors and copy here. This is usually the first file you edit.

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
| `buttonText` | `string` | Scaffolded button copy. |

::: tip Finding the right primary selector
Inspect the page in DevTools and choose a stable, unique class or attribute near the injection point. Avoid session-specific IDs, generated class names, and long `nth-child` chains.
:::

Add locale, translations, model codes, or API-specific values only when the experiment needs them.
