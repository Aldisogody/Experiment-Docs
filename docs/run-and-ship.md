# Run and Ship

Use this page when an experiment has moved from scaffolding into the daily Adobe Target workflow: watch, paste, preview, build, and hand off.

## Release checklist

- Run the watcher for the variation you are editing.
- Paste the matching clipboard bundle into Adobe Target.
- Refresh the Target preview after every meaningful change.
- Run `pnpm lint:fix` before review or handoff.
- Run `pnpm build` before shipping.
- Copy the production bundle from `dist/vN-index.jsx` into the matching Target variation.

## Watch build or production build

| Goal | Command | Use it when |
|---|---|---|
| Edit one variation | `pnpm start 0` | You are working on `v1` and want the bundle copied to the clipboard after every save. |
| Edit all variations | `pnpm start` | You want watch output for every generated variation. |
| Preview with injection | `pnpm live` | You want the tool to open `targetUrl` and inject the watched bundle. |
| Prepare for shipping | `pnpm build` | You need final IIFE files in `dist/` after the lint gate passes. |

## Command map

| Command | Use it for |
|---|---|
| `pnpm start` | Watch all variations. |
| `pnpm start 0` | Watch `v1` and copy its bundle to the clipboard. |
| `pnpm start 1` | Watch `v2` and copy its bundle to the clipboard. |
| `pnpm dev` | Run package watch mode for all variations. |
| `pnpm live` | Open `targetUrl`, watch a variation, and inject its bundle. |
| `pnpm build` | Run the production lint gate and build all bundles. |
| `pnpm new-variation 3` | Create `src/js/v3` from `v1`. |
| `pnpm lint` | Run the read-only Biome check. |
| `pnpm lint:fix` | Format files, sort imports, and apply safe Biome fixes. |
| `pnpm format` | Run formatting only. |
| `pnpm ci:lint` | Run the read-only Biome CI check. |
| `pnpm test:e2e` | Build and run Playwright tests when E2E is enabled. |

## Watch and paste

Run watch mode for the variation you are editing:

```bash
pnpm start 0
```

The command index is zero-based, but folders are one-based:

| Command index | Variation folder | Output bundle |
|---|---|---|
| `0` | `src/js/v1` | `dist/v1-index.jsx` |
| `1` | `src/js/v2` | `dist/v2-index.jsx` |
| `2` | `src/js/v3` | `dist/v3-index.jsx` |

On each successful rebuild, the generated IIFE is copied to your clipboard. Paste it into Adobe Target custom code and refresh the preview page.

::: warning
Paste the bundle into the matching Target variation. `pnpm start 1` builds `v2`, not `v1`.
:::

## Live injection

Use live injection when you want the tooling to open the target page and inject the watched bundle:

```bash
pnpm live
```

`pnpm live` reads `experiment.config.js`, opens `targetUrl`, watches the bundle, injects it into the page, and shows an overlay with status information.

Injection succeeds when the bundle registers on `window[globalObject][packageName]`. The overlay may also show which selector from `src/config.js` matched, but a missing selector does not block injection. Experiments that only change text, styles, or tracking still preview correctly as long as `runScript` registers the package name.

To reuse one browser cache profile across experiments:

```bash
pnpm live -- --profile shared
```

Use the shared profile when login, consent, or cached market state would otherwise slow down repeated checks.

You can override live options without editing config:

```bash
pnpm live -- --variation v2
pnpm live -- --url https://www.samsung.com/de/
pnpm live -- --overlay hidden
pnpm live -- --profile shared
```

`variation` accepts a zero-based index (`1` means `v2`) or a folder name (`v2`).

## Production build

Run:

```bash
pnpm build
```

The production build:

1. Runs the Biome lint gate.
2. Builds each `src/js/vN/index.jsx` entry as an IIFE.
3. Writes bundles to `dist/vN-index.jsx`.
4. Prints raw and gzip bundle sizes.

If Biome reports errors, the build aborts before bundling. Run `pnpm lint:fix` first, then manually fix any diagnostics that remain.

## Add a variation

Create a new variation from `v1`:

```bash
pnpm new-variation 3
pnpm start 2
```

`pnpm new-variation 3` creates `src/js/v3/index.jsx` from `v1`. If you manually added `src/js/v1/styles.module.scss`, the command copies it too; the current scaffold does not generate that file.

After creation:

- Update labels in `src/js/v3/index.jsx`.
- Change selector, props, or component logic for the variation.
- Run `pnpm start 2` while editing `v3`.
- Run `pnpm build` before shipping.

## Failure modes

| Symptom | Check |
|---|---|
| Clipboard bundle appears in the wrong variation | Confirm the command index and Target variation match. |
| Build stops before bundling | Run `pnpm lint:fix`, then fix remaining Biome diagnostics manually. |
| Live preview opens but does not inject | Check `targetUrl`, `globalObject`, and the selected live variation in `experiment.config.js`. |
| Target preview does not change | Save the Target custom code editor, refresh the preview page, and paste the latest clipboard bundle. |

## Related pages

- [Generated Commands](/reference/generated-commands)
- [Linting & Formatting](/linting/)
- [Testing](/testing)
