# runScript()

Wraps your experiment's entry function and guarantees the DOM is ready before execution.

## Signature

```ts
runScript(fn: () => void | Promise<void>): void
```

## Parameters

| Parameter | Type | Description |
|---|---|---|
| `fn` | `Function` | The experiment logic to execute. Can be `async`. |

## Usage

Every variation entry point wraps its logic in `runScript`:

```js
import { runScript } from 'create-experiment/framework';

runScript(async () => {
    // DOM is guaranteed to be ready here
    const target = document.querySelector('.my-selector');
    if (!target) return;

    // ... rest of experiment logic
});
```

## Why it's needed

Adobe Target executes custom code as soon as it loads, which can happen before `DOMContentLoaded`. Without `runScript`, a `document.querySelector` call at the top level may return `null` even if the element exists later in the HTML.

`runScript` checks `document.readyState` and either runs the function immediately (if the DOM is already ready) or defers it to `DOMContentLoaded`:

```js
const domReady = (callback) => {
    if (document.readyState !== 'loading') {
        callback();
    } else {
        document.addEventListener('DOMContentLoaded', callback);
    }
};

export const runScript = (fn) => {
    domReady(fn);
};
```

## Async support

The `fn` argument can be an `async` function. This is the standard pattern when fetching product data:

```js
runScript(async () => {
    const { data } = await fetchProductCard();
    if (!data) return;
    render(<ExperimentCard ... />, container);
});
```

## Returns

`void`

## Since

`v2.0.0`

## See Also

- [`waitFor()`](/framework-api/wait-for#waitfor) — poll until DOM selectors are present before proceeding
- [`watchFor()`](/framework-api/wait-for#watchfor) — MutationObserver-based alternative to `waitFor`
