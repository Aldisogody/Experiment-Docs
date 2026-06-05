# Framework API

`create-experiment/framework` is the experiment runtime export used by generated variation entry points.

```js
import { runScript, mountExperiment, trackAAEvent, waitFor, watchFor, setupTracking } from 'create-experiment/framework';
```

## Exports

| Function | Purpose | Since |
|---|---|---|
| [`runScript(fn)`](/framework-api/run-script) | Wraps experiment entry point — ensures DOM is ready | `v2.0.0` |
| [`mountExperiment(selector, fallback?, position?)`](/framework-api/mount-experiment) | Creates and injects the experiment container into the DOM | `v2.1.0` |
| [`waitFor(selectors, callback)`](/framework-api/wait-for) | Polls until CSS selectors match, then fires callback | `v2.0.0` |
| [`watchFor(selector, callback, options?)`](/framework-api/wait-for) | MutationObserver-based alternative to `waitFor` | `v2.0.0` |
| [`trackAAEvent(evar, event, data)`](/framework-api/tracking) | Fires an Adobe Analytics event via the global `s` object | `v2.0.0` |
| [`setupTracking(container, options)`](/framework-api/tracking) | Attaches click tracking to a rendered element | `v2.0.0` |

The runtime lives in the installed `create-experiment` package, not in generated project source.
