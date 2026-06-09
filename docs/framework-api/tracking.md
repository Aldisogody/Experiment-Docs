# Tracking

The framework provides two tracking functions: `trackAAEvent` fires a raw Adobe Analytics event, and `setupTracking` attaches a click listener that calls `trackAAEvent` automatically.

## trackAAEvent()

Fires an Adobe Analytics event via the global `s` object (Adobe Analytics AppMeasurement).

### Signature

```ts
trackAAEvent(evar: string, event: string, data: string): void
```

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `evar` | `string` | eVar variable name (e.g. `'eVar26'`). |
| `event` | `string` | Event variable name (e.g. `'event26'`). |
| `data` | `string` | Descriptive label. Appears in Adobe Analytics reporting. |

### Usage

```js
import { trackAAEvent } from 'create-experiment/framework';

trackAAEvent('eVar26', 'event26', 'my-experiment: v1 cta clicked');
```

### Data label convention

The `data` string should follow this format:

```
{experimentName}: {variation} {action}
```

Examples:
- `'samsung-upsell: v1 cta clicked'`
- `'homepage-banner: v2 cta clicked'`
- `'product-page: v3 image clicked'`

This format makes it easy to filter by experiment in Adobe Analytics.

### How it works

`trackAAEvent` sets the required AppMeasurement properties and calls `s.tl()`:

```js
s.linkTrackVars = `${evar}, events`;
s.linkTrackEvents = `${event}`;
s.events = `${event}`;
s[evar] = data;
s.tl(true, 'o', data);
```

The `s` object is a browser global provided by Adobe Analytics. It is declared in `biome.json` globals so Biome does not flag it as an undeclared variable.

### Returns

`void`

### Since

`v2.0.0`

### See Also

- [`setupTracking()`](#setuptracking) - attaches a click listener that calls `trackAAEvent` automatically

---

## setupTracking()

Attaches a click event listener to an element inside the injected container. Calls `trackAAEvent` when clicked.

::: danger Call after render()
`setupTracking` queries the DOM for the target element. If you call it before `render()`, the element does not exist yet and `setupTracking` will exit silently without attaching any listener.
:::

### Signature

```ts
setupTracking(
    container: HTMLElement,
    options: {
        label: string;
        selector?: string;
        evar?: string;
        event?: string;
    }
): void
```

### Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `container` | `HTMLElement` | - | The container returned by `mountExperiment()`. |
| `options.label` | `string` | - | Tracking label. Required. Follow the `{name}: {variation} {action}` convention. |
| `options.selector` | `string` | `'a'` | CSS selector relative to `container` for the element to track. |
| `options.evar` | `string` | `'eVar26'` | eVar variable name. |
| `options.event` | `string` | `'event26'` | Event variable name. |

### Usage with defaults

```js
// Tracks clicks on the first <a> inside container
setupTracking(container, { label: 'my-experiment: v1 cta clicked' });
```

### Usage with overrides

```js
// Track a button instead of a link, using eVar30/event30
setupTracking(container, {
    label: 'my-experiment: v1 button clicked',
    selector: 'button',
    evar: 'eVar30',
    event: 'event30',
});
```

### Correct order in a variation entry point

```js
runScript(async () => {
    // ... setup and fetch ...

    // 4. Render first
    render(<ExperimentCard ... />, container);

    // 5. Track after - element guaranteed to exist now
    setupTracking(container, { label: 'my-experiment: v1 cta clicked' });
});
```

### Returns

`void`

### Since

`v2.0.0`

### See Also

- [`trackAAEvent()`](#trackaaevent) - fire a raw Adobe Analytics event directly
- [`runScript()`](/framework-api/run-script) - entry point wrapper; `setupTracking` must be called inside it, after `render()`
