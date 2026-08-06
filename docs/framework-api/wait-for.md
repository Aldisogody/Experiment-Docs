# waitFor() & watchFor()

Both functions wait for DOM elements before running a callback. `waitFor` polls; `watchFor` uses a `MutationObserver`.

## waitFor()

Polls until all given CSS selectors match at least one element, then fires a callback.

### Signature

```ts
waitFor(selectors: string[], callback: () => void): void
```

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `selectors` | `string[]` | Array of CSS selector strings. All must match before the callback fires. |
| `callback` | `Function` | Invoked once every selector matches. |

### Usage

```js
import { waitFor } from '@sogody/experiment-framework/framework';

waitFor(['.target-selector', '.price-wrapper'], () => {
    // All elements exist - safe to proceed
    const target = document.querySelector('.target-selector');
});
```

### Returns

`void`

### Since

`v2.0.0`

### Related APIs

- [`watchFor()`](#watchfor) - event-driven alternative with timeout support
- [`runScript()`](/framework-api/run-script) - wraps the experiment entry point and ensures DOM readiness

### Polling interval

Checks every 50 ms. There is no timeout - if a selector never matches, the callback never fires. Use `watchFor` if you need a timeout.

---

## watchFor()

Waits for a single CSS selector with a `MutationObserver` instead of polling.

### Signature

```ts
watchFor(
    selector: string,
    callback: (element: Element) => void,
    options?: { subtree?: boolean; timeout?: number }
): void
```

### Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `selector` | `string` | - | CSS selector to watch for. |
| `callback` | `Function` | - | Called with the matched element once it appears. |
| `options.subtree` | `boolean` | `false` | Observe all descendants of `document.body`, not only direct children. Use this only when necessary. |
| `options.timeout` | `number` | `6000` | Auto-disconnects the observer after this many milliseconds to prevent memory leaks. |

### Usage

```js
import { watchFor } from '@sogody/experiment-framework/framework';

watchFor('.late-loading-element', (element) => {
    // element is the matched DOM node
    element.insertAdjacentHTML('afterend', '<div>Experiment</div>');
});
```

With options:

```js
watchFor('.deep-nested-element', (element) => {
    // ...
}, { subtree: true, timeout: 8000 });
```

### Returns

`void`

### Since

`v2.0.0`

### Related APIs

- [`waitFor()`](#waitfor) - polling-based alternative that supports multiple selectors
- [`runScript()`](/framework-api/run-script) - wraps the experiment entry point and ensures DOM readiness

### Observer cleanup

The observer disconnects after `timeout` milliseconds if the element never appears.

---

## waitFor vs watchFor

| | `waitFor` | `watchFor` |
|---|---|---|
| Mechanism | Recursive `setTimeout` (50 ms) | MutationObserver |
| Multiple selectors | Yes | No (single selector) |
| Callback receives element | No | Yes |
| Timeout support | No | Yes (default 6000ms) |
| Best for | Simple cases, stable pages | SPA navigations, deep DOM trees |

::: tip Choosing a helper
Use `waitFor` when several elements should appear soon after page load. Use `watchFor` for one element that appears after an interaction, route change, or lazy render.
:::
