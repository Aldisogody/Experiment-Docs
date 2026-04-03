# Framework API

`lib/framework.js` is the experiment runtime. It is copied verbatim into every generated project and imported via the `@lib/framework` alias.

```js
import { runScript, trackAAEvent, waitFor, watchFor, setupTracking } from '@lib/framework';
```

## Exports

| Function | Purpose | Since |
|---|---|---|
| [`runScript(fn)`](/framework-api/run-script) | Wraps experiment entry point — ensures DOM is ready | `v2.0.0` |
| [`waitFor(selectors, callback)`](/framework-api/wait-for) | Polls until CSS selectors match, then fires callback | `v2.0.0` |
| [`watchFor(selector, callback, options?)`](/framework-api/wait-for) | MutationObserver-based alternative to `waitFor` | `v2.0.0` |
| [`trackAAEvent(evar, event, data)`](/framework-api/tracking) | Fires an Adobe Analytics event via the global `s` object | `v2.0.0` |
| [`setupTracking(container, options)`](/framework-api/tracking) | Attaches click tracking to a rendered element | `v2.0.0` |

## Import alias

The alias `@lib/framework` is configured in `vite.config.js`:

```js
resolve: {
    alias: {
        '@lib/framework': './lib/framework.js',
        '@components': './src/components/',
    },
},
```

You can import any of the five exports directly without a relative path.
