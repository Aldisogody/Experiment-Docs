# runScript()

Runs an experiment entry function after the DOM is ready. It can also prevent duplicate runs or skip the DOM-ready wait.

## Signature

```ts
runScript(
    fn: () => void | Promise<void>,
    singleInstance?: boolean,
    waitDomReady?: boolean,
): void
```

## Parameters

| Parameter | Type | Description |
|---|---|---|
| `fn` | `Function` | Experiment logic. The function can be `async`. |
| `singleInstance` | `boolean` | When `true`, skips the function if this package is already registered. Defaults to `false`. |
| `waitDomReady` | `boolean` | When `true`, waits for DOM readiness. Defaults to `true`. |

## Usage

Every variation entry point wraps its logic in `runScript`:

```js
import { runScript } from '@sogody/experiment-framework/framework';

runScript(async () => {
    // DOM is guaranteed to be ready here
    const target = document.querySelector('.my-selector');
    if (!target) return;

    // ... rest of experiment logic
});
```

## Why it is needed

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

`runScript()` does not return or await the callback result. Handle rejected promises inside the experiment when failures need explicit reporting.

## Since

`v2.0.0`

## Related APIs

- [`waitFor()`](/framework-api/wait-for#waitfor) - poll until DOM selectors are present before proceeding
- [`watchFor()`](/framework-api/wait-for#watchfor) - MutationObserver-based alternative to `waitFor`
