# Project Structure

A generated project with two variations looks like this:

```
my-experiment/
│
├── src/
│   ├── components/
│   │   └── ExperimentButton/
│   │       ├── index.jsx              # Preact button component
│   │       └── styles.module.scss     # Scoped component styles
│   │
│   ├── js/
│   │   ├── v1/
│   │   │   ├── index.jsx              # Variation 1 entry point
│   │   │   └── styles.module.scss     # Mount-wrapper styles
│   │   └── v2/
│   │       ├── index.jsx              # Variation 2 entry point
│   │       └── styles.module.scss     # Mount-wrapper styles
│   │
│   └── config.js                      # selectors and button text
│
├── e2e/                               # Only present when E2E is enabled
│   ├── smoke.spec.js
│   ├── config.js                      # Market URLs
│   └── helpers.js
│
├── experiment.config.js               # targetUrl, globalObject, live options
├── vite.config.js                     # IIFE lib mode, Preact plugin, CSS Modules, aliases
├── playwright.config.js               # Only present when E2E is enabled
├── biome.json                         # Biome linter + formatter
├── jsconfig.json                      # JSX support and aliases for editors
├── .nvmrc                             # Node 24
├── .editorconfig
├── .gitignore
├── CLAUDE.md                           # Optional local AI instructions; created by pnpm init-claude
├── AGENTS.md                           # Optional local AI instructions; created by pnpm init-agents
├── .claude/skills/<skill-name>/        # Optional Claude Code project skill; same generated content
├── .cursor/skills/<skill-name>/        # Optional Cursor project skill; same generated content
└── package.json
```

The instruction files and skill directories are opt-in and are not present
immediately after scaffolding. The generated `.gitignore` excludes
`CLAUDE.md`, `AGENTS.md`, `.agents`, `.claude`, and `.cursor`, so
project-specific AI support remains local by default. See
[AI Project Support](/development/ai-project-support) for the complete skill
tree.

## Key files explained

### `experiment.config.js`

Top-level runtime configuration. Keep this at the root - it's imported by the build script.

```js
export default {
    targetUrl: 'https://www.samsung.com/uk/smartphones/all-smartphones/',
    globalObject: 'sgd',
    includeEmergencyBrake: true,
    live: {
        variation: 0,
        overlay: 'visible',
        profile: 'ephemeral',
    },
};
```

See [Configuration](/development/config) for details.

### `src/config.js`

Experiment-specific values. Edit this file first when setting up a new experiment.

```js
export const selectors = {
    primary: '.target-selector',
    fallbacks: ['.alternate-selector', 'body'],
};

export const buttonText = 'Click Me';
```

### Runtime helpers

The experiment runtime is imported from `@sogody/experiment-framework/framework`. Every variation entry point can use:

- `runScript(fn)` - ensures DOM is ready before executing
- `mountExperiment(selector, fallback?, position?, options?)` — creates and injects the container `div`; pass `className: style.root` from `src/js/vN/styles.module.scss` for mount-wrapper styling
- `trackAAEvent(evar, event, data)` - fires Adobe Analytics events
- `waitFor(selectors, callback)` - polls until elements are present
- `watchFor(selector, callback, options?)` - waits via MutationObserver
- `setupTracking(container, options)` - attaches click tracking to a rendered element
- `getPath()`, `getPathSegments()`, `getMarket()` - resolve browser path and market context
- `log()`, `debug()` - development and opt-in diagnostic logging

See the [Framework API](/framework-api/) for full documentation.

### `src/js/v1/index.jsx`

The variation entry point. Every variation follows the same four-step pattern:

```jsx
import { render } from 'preact';
import { mountExperiment, runScript, setupTracking } from '@sogody/experiment-framework/framework';
import ExperimentButton from '@components/ExperimentButton';
import { buttonText, selectors } from '../../config';
import style from './styles.module.scss';

runScript(async () => {
    // 1. Mount container
    const container = mountExperiment(selectors.primary, selectors.fallbacks, 'afterbegin', {
        className: style.root,
        dataset: { experiment: 'my-experiment' },
    });
    if (!container) return;

    // 2. Render component
    render(<ExperimentButton text={buttonText} />, container);

    // 3. Set up tracking - MUST come after render
    setupTracking(container, {
        label: 'my-experiment: v1 button clicked',
        selector: 'button',
    });
});
```

::: warning Tracking must come after render
`setupTracking` queries the DOM for the element to attach to. Calling it before `render()` will silently fail because the element doesn't exist yet.
:::

### Import aliases

Vite resolves these aliases in generated projects:

| Alias | Resolves to |
|---|---|
| `@src` | `src/` |
| `@js` | `src/js/` |
| `@components` | `src/components/` |
| `@services` | `src/services/` |
| `@helpers` | `src/helpers/` |

Every generated variation includes `styles.module.scss` for mount-wrapper styling. Keep component styles under `src/components/*/styles.module.scss`.
