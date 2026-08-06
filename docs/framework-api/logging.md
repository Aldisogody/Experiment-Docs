# Logging and debugging

The runtime prefixes log output with the project name. `log()` is limited to development builds, while `debug()` works only when a user opts in.

## log()

Logs only when the bundle was built in Vite development mode.

### Signature

```ts
log(...args: unknown[]): void
```

### Example

```js
import { log } from '@sogody/experiment-framework/framework';

log('experiment mounted');
```

`pnpm start` and `pnpm dev` build in development mode. `pnpm build` uses production mode, where `log()` is silent.

### Returns

`void`

### Since

Current package

## debug()

Logs in any build mode when the user explicitly enables experiment debugging.

### Signature

```ts
debug(...args: unknown[]): void
```

### Enable with the URL

```text
https://www.samsung.com/uk/?expDebug=1
```

### Enable with local storage

```js
localStorage.setItem('expDebug', '1');
```

### Example

```js
import { debug } from '@sogody/experiment-framework/framework';

debug('mount failed', selectors);
```

### Returns

`void`

### Since

Current package

### Related pages

- [Playground](/playground)
- [Error Reference](/error-reference)
