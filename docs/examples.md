---
title: Examples
---

# Examples

These recipes use the generated runtime and file structure.

## Mount with ordered fallbacks

```js
const container = mountExperiment(
    '.preferred-target',
    ['.alternate-layout-target', 'main'],
    'beforeend',
);
if (!container) return;
```

## Mount without fallbacks

```js
const container = mountExperiment('.preferred-target');
if (!container) return;
```

Use the position shorthand when the second argument is an insert position:

```js
const container = mountExperiment('.preferred-target', 'afterend');
```

## Prevent duplicate SPA mounts

```js
runScript(() => {
    const marker = 'product-upsell-v1';
    if (document.querySelector(`[data-experiment="${marker}"]`)) return;

    const container = mountExperiment(selectors.primary, selectors.fallbacks);
    if (!container) return;

    container.dataset.experiment = marker;
    render(<ExperimentButton text={buttonText} />, container);
});
```

## Wait for multiple elements

```js
waitFor(['.product-card', '.product-price'], () => {
    const card = document.querySelector('.product-card');
    const price = document.querySelector('.product-price');
    // Start logic that needs both elements.
});
```

## Observe a late SPA target

```js
watchFor(
    '.late-loading-target',
    (target) => {
        target.classList.add('experiment-ready');
    },
    { subtree: true, timeout: 8000 },
);
```

## Resolve the current market

```js
import { getMarket } from 'create-experiment/framework';

const market = getMarket(); // "uk" for /uk/...
```

## Enable opt-in diagnostics

```js
import { debug } from 'create-experiment/framework';

debug('primary selector did not match', selectors.primary);
```

Diagnostics print when the URL contains `?expDebug=1` or local storage contains `expDebug=1`.

See the [Framework API](/framework-api/) for signatures and edge cases.
