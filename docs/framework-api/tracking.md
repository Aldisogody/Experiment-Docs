# Tracking

Use `trackAAEvent` for a direct Adobe Analytics event, `setupTracking` for rendered interactions, and `trackInView` for viewport impressions.

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
import { trackAAEvent } from '@sogody/experiment-framework/framework';

trackAAEvent('eVar26', 'event26', 'my-experiment: v1 cta clicked');
```

### Data label convention

The 2.2.0 scaffold builds labels in `src/helpers.js` with this format:

```
{experience}: {product}: {page type}: {project}: {description}: {action}
```

Use `c` for control and `v` for a variant. Replace the generated `TRACKING_PROJECT` and `TRACKING_DESCRIPTION` placeholders before shipping:

```js
const TRACKING_PROJECT = 'campaign-id';
const TRACKING_DESCRIPTION = 'short experiment description';

getTrackingLabel('v', 'cta clicked');
// v: product-slug: buy page: campaign-id: short experiment description: cta clicked
```

Using one label format makes experiments easier to filter in Adobe Analytics.

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

### Related APIs

- [`setupTracking()`](#setuptracking) - attaches a click listener that calls `trackAAEvent` automatically
- [`trackInView()`](#trackinview) - fires when an element reaches the configured viewport threshold

---

## trackInView()

Observes an element and fires when at least 25% of it enters the viewport. By default it fires once, sends `eVar26` and `event26` when `label` is present, and disconnects its observer.

### Signature

```ts
trackInView(
  element: Element | null | undefined,
  options?: {
    label?: string;
    onView?: () => void;
    threshold?: number;
    once?: boolean;
    onceKey?: string;
    root?: Element | Document | null;
    rootMargin?: string;
    evar?: string;
    event?: string;
    fallback?: 'fire' | 'skip';
  },
): { disconnect(): void }
```

### Options

| Option | Default | What it controls |
|---|---|---|
| `label` | - | Adobe Analytics label sent through `trackAAEvent()`. |
| `onView` | - | Callback invoked when the element reaches the threshold. |
| `threshold` | `0.25` | Required visible ratio, from `0` to `1`. |
| `once` | `true` | Disconnect after the first qualifying intersection. |
| `onceKey` | - | Suppresses another event with the same key, even if the element is remounted. |
| `root` | viewport | Custom `IntersectionObserver` root. |
| `rootMargin` | browser default | Margin passed to `IntersectionObserver`. |
| `evar` | `'eVar26'` | Adobe Analytics eVar. |
| `event` | `'event26'` | Adobe Analytics event. |
| `fallback` | `'fire'` | Fire immediately or skip when `IntersectionObserver` is unavailable. |

### Track an impression once

```js
import { trackInView } from '@sogody/experiment-framework/framework';

const handle = trackInView(container.querySelector('button'), {
  label: getTrackingLabel('v', 'scrolled into view'),
  onceKey: 'my-experiment:v1:button-impression',
});
```

`onceKey` is useful on pages that remount the same experiment after navigation or host-page updates. The runtime keeps fired keys for the lifetime of the page.

### Run custom impression logic

`label` and `onView` are independent. Pass either one or both:

```js
trackInView(element, {
  onView: () => markExperimentAsSeen(),
  threshold: 0.5,
  fallback: 'skip',
});
```

### Clean up manually

Every call returns an idempotent cleanup handle, including calls with a missing element or a previously used `onceKey`:

```js
const tracking = trackInView(element, { label, once: false });

// Later, before the element is removed:
tracking.disconnect();
```

### Browser fallback

When `IntersectionObserver` is unavailable, the default `fallback: 'fire'` runs the callback and analytics event immediately. Set `fallback: 'skip'` when an unverified impression is worse than a missing one.

### Compatibility wrapper

`trackOnceInView(element, label, { onceKey })` remains available for older experiments. It calls `trackInView(element, { label, onceKey })`. New code should use `trackInView()` directly.

### Returns

`{ disconnect(): void }`

### Since

`v2.2.0`

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

### Call order

```js
runScript(async () => {
    // ... setup and fetch ...

    // 4. Render first
    render(<ExperimentCard ... />, container);

    // Track after render so the element exists.
    setupTracking(container, { label: 'my-experiment: v1 cta clicked' });
});
```

### Returns

`void`

### Since

`v2.0.0`

### Related APIs

- [`trackAAEvent()`](#trackaaevent) - fire a raw Adobe Analytics event directly
- [`trackInView()`](#trackinview) - observe an element for an impression event
- [`runScript()`](/framework-api/run-script) - entry point wrapper; `setupTracking` must be called inside it, after `render()`
