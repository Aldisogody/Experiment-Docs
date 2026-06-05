# Run and Ship

Use this page for the daily Adobe Target workflow: watch, paste, preview, build, and add variations.

## Command map

| Command | Use it for |
|---|---|
| `pnpm start` | Watch all variations. |
| `pnpm start 0` | Watch `v1` and copy its bundle to the clipboard. |
| `pnpm start 1` | Watch `v2` and copy its bundle to the clipboard. |
| `pnpm dev` | Run package watch mode for all variations. |
| `pnpm live` | Open the configured target URL and inject the watched bundle. |
| `pnpm build` | Run the production lint gate and build all bundles. |
| `pnpm new-variation 3` | Create `src/js/v3` from `v1`. |
| `pnpm lint` | Run `biome check src`. |
| `pnpm format` | Run `biome check --write src`. |
| `pnpm test:e2e` | Build and run Playwright tests when E2E is enabled. |

## Watch and paste

Run watch mode for the variation you are editing:

```bash
pnpm start 0
```

The command index is zero-based, but folders are one-based:

| Command index | Variation folder | Output bundle |
|---|---|---|
| `0` | `src/js/v1` | `dist/v1/v1.js` |
| `1` | `src/js/v2` | `dist/v2/v2.js` |
| `2` | `src/js/v3` | `dist/v3/v3.js` |

On each successful rebuild, the generated IIFE is copied to your clipboard. Paste it into Adobe Target custom code and refresh the preview page.

## Live injection

Use live injection when you want the tooling to open the target page and inject the watched bundle:

```bash
pnpm live
```

`pnpm live` reads `experiment.config.js`, opens `targetUrl`, watches the bundle, injects it into the page, and shows an overlay with status information.

To reuse one browser cache profile across experiments:

```bash
pnpm live -- --profile shared
```

Use the shared profile when login, consent, or cached market state would otherwise slow down repeated checks.

## Production build

Run:

```bash
pnpm build
```

The production build:

1. Runs `biome check src`.
2. Builds each `src/js/vN/index.jsx` entry as an IIFE.
3. Writes bundles to `dist/vN/vN.js`.
4. Prints raw and gzip bundle sizes.

If Biome reports errors, the build aborts before bundling.

## Add a variation

Create a new variation from `v1`:

```bash
pnpm new-variation 3
pnpm start 2
```

`pnpm new-variation 3` creates `src/js/v3/index.jsx`. Product-card projects also copy `src/js/v1/styles.module.scss` when it exists.

After creation:

- Update labels in `src/js/v3/index.jsx`.
- Change selector, props, or component logic for the variation.
- Run `pnpm start 2` while editing `v3`.
- Run `pnpm build` before shipping.

## Lint and format

Use:

```bash
pnpm lint
pnpm format
```

`pnpm lint` is read-only. `pnpm format` writes Biome fixes to `src`.

The active generated templates use Biome for JavaScript, JSX, and JSON. They do not generate a `.stylelintrc` file.

## Next

- [Testing](/testing) explains optional Playwright smoke tests.
- [Generated Commands](/reference/generated-commands) is the terse command reference.
