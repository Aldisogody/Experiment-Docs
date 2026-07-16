# Framework API

`@sogody/experiment-framework/framework` is the experiment runtime export used by generated variation entry points.

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
| [`runScript(fn)`](/framework-api/run-script) | Wraps experiment entry point - ensures DOM is ready | `v2.0.0` |
| [`mountExperiment(selector, fallback?, position?, options?)`](/framework-api/mount-experiment) | Creates and injects the experiment container into the DOM | `v2.0.0` |
| [`waitFor(selectors, callback)`](/framework-api/wait-for) | Polls until CSS selectors match, then fires callback | `v2.0.0` |
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
`Current package` means the helper exists in the current `@sogody/experiment-framework`
package line documented by this site.
:::
