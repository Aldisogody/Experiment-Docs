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
Use your browser's DevTools to inspect the page and pick a stable, unique CSS class or attribute selector near where the experiment should inject. Avoid selectors that change across page loads.
:::

Add locale, translations, model codes, or API-specific values only when the experiment needs them.
