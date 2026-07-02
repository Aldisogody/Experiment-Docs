# sample

A/B testing experiment built with Preact, bundled as a self-contained IIFE for Adobe Target.

## Dev workflow

```bash
pnpm start 0          # watch v1; copy a production-mode bundle without sourcemaps
pnpm dev              # watch all variations with development sourcemaps
pnpm build            # lint, then build production IIFE bundles into dist/vN-index.jsx
pnpm new-variation 2  # create src/js/v2 from the scaffolded variation
pnpm init-claude      # create CLAUDE.md on demand
pnpm init-agents      # create AGENTS.md on demand
pnpm lint             # Biome check without writing files
pnpm lint:fix         # Biome format, import sorting, and safe fixes
pnpm format           # Biome formatting only
pnpm ci:lint          # read-only CI lint gate
pnpm live             # watch v1 and inject it into the configured targetUrl
pnpm live -- --profile shared      # reuse one OS cache profile across experiments
```

## Structure

```
src/
  components/       # Shared Preact components
  js/v1/            # Variation 1 entry point
  config.js         # selectors and scaffold-specific values
dist/               # generated bundles, e.g. v1-index.jsx
```

Framework utilities and build/start/new-variation/init commands come from the
`@sogody/experiment-framework` package dependency.

## AI documentation

AI documentation is opt-in and is not created during scaffolding:

```bash
pnpm init-claude
pnpm init-agents
```

Each command refuses to replace an existing file. Add `-- --force` to regenerate it,
for example `pnpm init-claude -- --force`.

## Live Injection

`pnpm live` runs the package-owned `exp-live` command. It opens `targetUrl` from
`experiment.config.js` or legacy `config.json`, watches the selected variation
bundle, injects it into the page, and treats `window[globalObject][packageName]`
registration as the loaded state.

Use `pnpm live -- --variation v2` or `pnpm live -- --variation 1` to preview
another variation. Use `pnpm live -- --profile shared` when you need cookies or
login state to persist across runs.

## Config

All experiment-specific values live in `src/config.js`:

- `selectors.primary` — CSS selector for the primary injection point
- `selectors.fallbacks` — ordered fallback selectors for alternate injection points
- `buttonText` — text rendered by the scaffolded button component

Project-level runtime config lives in `experiment.config.js`. Legacy `config.json`
is also supported by package-owned build and live commands when present.

Vite aliases are available for legacy imports:

- `@src` -> `src`
- `@js` -> `src/js`
- `@components` -> `src/components`
- `@services` -> `src/services`
- `@helpers` -> `src/helpers`

CSS Modules class naming is configured in `vite.config.js` and uses the scaffolded class prefix:

- Format: `sample--[local]`
- Example output: `sample--button`

Sass helpers are injected at build time from `@sogody/experiment-framework`, so SCSS modules can use
`@include mq()` without local imports. The default breakpoints are `$xs: 360px`, `$sm: 425px`, `$md: 768px`, `$lg: 1200px`, and `$xl: 1440px`.
Vite compiles Sass CSS Modules and uses esbuild to minify production CSS; generated projects do not include Stylelint or cssnano dependencies.

Runtime helpers from `@sogody/experiment-framework/framework` include legacy-compatible exports such as
`runScript`, `withPreact`, `waitForJquery`, `domReady`, `createElementFromHTML`,
`setCookie`, `getCookie`, `emergencyBrakeEnabled`, and `classes`. `withPreact`
is a compatibility shim because Preact is bundled by default.

## Adding a variation

```bash
pnpm new-variation 2
pnpm start 1
```

The `start` command uses zero-based indexes, so `pnpm start 1` watches `v2`.
For manual copies, keep each variation under `src/js/vN/index.jsx`.

## Mounting Pattern

Use `mountExperiment` to create an isolated mount container and insert it relative to the target element.
Mount-root styles live in `src/js/vN/styles.module.scss` and are passed as a CSS Modules class:

```js
import { selectors } from '../../config';
import style from './styles.module.scss';

const container = mountExperiment(selectors.primary, selectors.fallbacks, 'afterbegin', {
    className: style.root,
    dataset: { experiment: 'sample' },
});
if (!container) return;
```

The scaffolded `.root` class uses `display: contents` so the wrapper does not affect flex/grid layout.
Override or extend rules in `src/js/vN/styles.module.scss` when the mount container needs layout styling.
E2E tests can also target `[data-experiment="sample"]`.

## Tracking

`setupTracking` defaults to `eVar26` and `event26`; set `selector` to match the rendered control:

```js
setupTracking(container, {
    label: 'sample: v1 button clicked',
    selector: 'button',
});
```
