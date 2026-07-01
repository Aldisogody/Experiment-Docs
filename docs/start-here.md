# Start Here

Use this page when you are creating an experiment for the first time. It gives you the shortest path from setup to a bundle you can paste into Adobe Target.

## What the framework creates

`@sogody/experiment-framework` scaffolds a Vite + Preact project for Adobe Target. Each variation builds to a self-contained IIFE bundle in `dist/vN-index.jsx`.

The generated project includes:

- `src/config.js` for selectors and experiment content.
- `src/js/v1/index.jsx` as the first variation entry point.
- `src/components/ExperimentButton/` for the scaffolded Preact button UI.
- `experiment.config.js` for package-level tooling config.
- `vite.config.js` for IIFE bundling, CSS Modules, aliases, and Sass setup.
- `biome.json` for JavaScript, JSX, and JSON linting and formatting.
- Optional `e2e/` Playwright tests when E2E is enabled during scaffolding.

## Requirements

Use Node and pnpm from the generated project:

```bash
nvm use
pnpm --version
```

Generated projects include `.nvmrc` and require pnpm 10+. Run `nvm use` before installing or building.

## Create a project

Run the scaffold command with a project name:

```bash
npx @sogody/experiment-framework my-experiment
cd my-experiment
nvm use
```

For a first project, use these prompt choices:

| Prompt | First-project choice | Why |
|---|---|---|
| Variations | `1` | Keeps the first build focused on `v1`. |
| Window namespace | `sgd` | Default global namespace. |
| Emergency brake | `Yes` | Preserves the scaffolded setting. Confirm your deployment integration consumes it. |
| E2E testing | `No` | Add Playwright after the core loop is working. |

The current scaffold uses a single generic button template. Add product data, custom components, or API helpers only when the experiment needs them.

## First bundle

Start the watcher for variation 1:

```bash
pnpm start 0
```

The command index maps to the variation folder:

| Command | Folder | Bundle |
|---|---|---|
| `pnpm start 0` | `src/js/v1` | `dist/v1-index.jsx` |
| `pnpm start 1` | `src/js/v2` | `dist/v2-index.jsx` |

When the watcher builds, it copies the IIFE bundle to your clipboard. Paste it into Adobe Target custom code for the matching variation.

## First edit

Open `src/config.js` and replace the placeholder selector with the target element on the page:

```js
export const selectors = {
    primary: '.target-selector',
    fallbacks: ['.alternate-selector', 'body'],
};
```

Keep selectors ordered from most specific to broadest. Save the file, let the watcher rebuild, then paste the updated clipboard bundle into Adobe Target.

## First production build

Run:

```bash
pnpm build
```

The production build runs the Biome lint gate first. If lint passes, every variation builds to `dist/vN-index.jsx`.

## Next

- [Build an Experiment](/build-an-experiment) explains the files you edit.
- [Run and Ship](/run-and-ship) explains watch mode, live injection, builds, and variations.
- [Testing](/testing) explains optional Playwright setup.
