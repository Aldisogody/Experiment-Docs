# mountExperiment()

Creates a container `div` and injects it adjacent to a target element. Returns the container so you can render into it immediately.

## Signature

```ts
mountExperiment(
    selector: string,
    fallback?: string | string[],
    position?: InsertPosition
): HTMLElement | null
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `selector` | `string` | - | CSS selector for the DOM element to inject adjacent to. |
| `fallback` | `string \| string[]` | `undefined` | One fallback selector or an ordered list. No implicit `body` fallback is added. |
| `position` | `InsertPosition` | `'afterbegin'` | Where to insert the container relative to the target. See [InsertPosition values](#insertposition-values) below. |

## Returns

`HTMLElement` - the created container `div`, ready to render into.

`null` - if neither `selector` nor `fallback` match any element.

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

Always guard on `null` - if the target page changes structure or the selector is wrong, `mountExperiment` returns `null` and the guard prevents a runtime error.

## InsertPosition values

| Value | Where the container is inserted |
|---|---|
| `'afterbegin'` | Inside the target, before its first child *(default)* |
| `'beforeend'` | Inside the target, after its last child |
| `'beforebegin'` | Before the target element itself |
| `'afterend'` | After the target element itself |

Both current boilerplates pass `'afterbegin'`.

When you do not need a fallback, the second argument can be a position:

```js
const container = mountExperiment('.target', 'afterend');
```

## How it works

```js
export const mountExperiment = (selector, fallback, position = 'afterbegin') => {
    let target = document.querySelector(selector);

    if (!target && fallback !== undefined) {
        const fallbackSelectors = Array.isArray(fallback) ? fallback : [fallback];
        for (const fallbackSelector of fallbackSelectors) {
            target = document.querySelector(fallbackSelector);
            if (target) break;
        }
    }

    if (!target) return null;
    const container = document.createElement('div');
    target.insertAdjacentElement(position, container);
    return container;
};
```

The function checks the primary selector, then each supplied fallback in order. If none match, it returns `null`.

## Since

`v2.0.0`. Ordered fallbacks and position shorthand are available on the current `main` branch.

## See Also

- [`runScript()`](/framework-api/run-script) - always wrap `mountExperiment` inside `runScript`
- [`setupTracking()`](/framework-api/tracking#setuptracking) - attach click tracking after rendering into the container
