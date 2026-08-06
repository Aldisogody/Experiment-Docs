# Framework API

Generated variation entry points import their runtime helpers from `@sogody/experiment-framework/framework`.

```js
import {
    debug,
    getMarket,
    getPath,
    getPathSegments,
    log,
    mountExperiment,
    runScript,
    setupTracking,
    trackAAEvent,
    waitFor,
    watchFor,
} from '@sogody/experiment-framework/framework';
```

## Exports

| Function | Purpose | Since |
|---|---|---|
| [`runScript(fn)`](/framework-api/run-script) | Runs an experiment after the DOM is ready | `v2.0.0` |
| [`mountExperiment(selector, fallback?, position?, options?)`](/framework-api/mount-experiment) | Creates and injects the experiment container into the DOM | `v2.0.0` |
| [`waitFor(selectors, callback)`](/framework-api/wait-for) | Polls until all CSS selectors match, then runs the callback | `v2.0.0` |
| [`watchFor(selector, callback, options?)`](/framework-api/wait-for) | MutationObserver-based alternative to `waitFor` | `v2.0.0` |
| [`trackAAEvent(evar, event, data)`](/framework-api/tracking) | Fires an Adobe Analytics event via the global `s` object | `v2.0.0` |
| [`setupTracking(container, options)`](/framework-api/tracking) | Attaches click tracking to a rendered element | `v2.0.0` |
| [`getPath()`](/framework-api/path-and-market#getpath) | Returns the current path, query string, and hash | Current package |
| [`getPathSegments(path?)`](/framework-api/path-and-market#getpathsegments) | Splits a path into non-empty pathname segments | Current package |
| [`getMarket(path?)`](/framework-api/path-and-market#getmarket) | Returns the lowercase first path segment | Current package |
| [`log(...args)`](/framework-api/logging#log) | Logs only in development bundles | Current package |
| [`debug(...args)`](/framework-api/logging#debug) | Logs when opt-in debug mode is enabled | Current package |

The runtime lives in the installed `@sogody/experiment-framework` package, not in generated project source.

::: info Version labels
`Current package` means the helper exists in the package version documented by this site but was not part of the original v2.0.0 API.
:::
