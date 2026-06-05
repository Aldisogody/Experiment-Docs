# mountExperiment()

Creates a container `div` and injects it adjacent to a target element. Returns the container so you can render into it immediately.

## Signature

```ts
mountExperiment(
    selector: string,
    fallback?: string,
    position?: InsertPosition
): HTMLElement | null
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `selector` | `string` | — | CSS selector for the DOM element to inject adjacent to. |
| `fallback` | `string` | `'body'` | Fallback selector if `selector` yields no match. |
| `position` | `InsertPosition` | `'afterbegin'` | Where to insert the container relative to the target. See [InsertPosition values](#insertposition-values) below. |

## Returns

`HTMLElement` — the created container `div`, ready to render into.

`null` — if neither `selector` nor `fallback` match any element.

## Usage

```js
import { mountExperiment, runScript, setupTracking } from 'create-experiment/framework';
import { selectors } from '../../config';

runScript(async () => {
    const container = mountExperiment(selectors.primary, selectors.fallbacks);
    if (!container) return;

    render(<MyComponent />, container);
    setupTracking(container, { label: 'my-experiment: v1 cta clicked' });
});
```

Always guard on `null` — if the target page changes structure or the selector is wrong, `mountExperiment` returns `null` and the guard prevents a runtime error.

## InsertPosition values

| Value | Where the container is inserted |
|---|---|
| `'afterbegin'` | Inside the target, before its first child *(default)* |
| `'beforeend'` | Inside the target, after its last child |
| `'beforebegin'` | Before the target element itself |
| `'afterend'` | After the target element itself |

The `minimal` boilerplate uses `'beforeend'` (appending inside the target). The `product-card` boilerplate uses the default `'afterbegin'` (prepending inside the target).

## How it works

```js
export const mountExperiment = (selector, fallback = 'body', position = 'afterbegin') => {
    const target = document.querySelector(selector) ?? document.querySelector(fallback);
    if (!target) return null;
    const container = document.createElement('div');
    target.insertAdjacentElement(position, container);
    return container;
};
```

The function resolves the target with `??` — it tries `selector` first, then falls back to `fallback` only if `selector` returns `null`. If both fail, it returns `null`.

## Since

`v2.1.0`

## See Also

- [`runScript()`](/framework-api/run-script) — always wrap `mountExperiment` inside `runScript`
- [`setupTracking()`](/framework-api/tracking#setuptracking) — attach click tracking after rendering into the container
