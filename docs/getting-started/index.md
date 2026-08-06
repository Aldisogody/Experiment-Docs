# Introduction

`@sogody/experiment-framework` scaffolds Vite + Preact experiments for Adobe Target. It provides the project structure, development commands, runtime helpers, and production build.

## What the framework provides

`@sogody/experiment-framework` is a CLI scaffolder for A/B experiment projects. It creates the variation entry points, configuration, Preact button UI, linting, and build tooling needed to produce code for Adobe Target.

Start a project with:

```bash
npx @sogody/experiment-framework my-experiment
```

For a first project, choose one variation. The generated files keep selectors and button text in `src/config.js`, variation logic in `src/js/v1/index.jsx`, and reusable UI in `src/components/ExperimentButton/`.

[See the generated project structure](/getting-started/project-structure)

## The Adobe Target workflow

The development loop follows five steps:

1. Scaffold a project with `npx @sogody/experiment-framework`.
2. Set the target selectors and experiment content.
3. Start watch mode with `pnpm start 0`.
4. Paste the clipboard-ready bundle into Adobe Target custom code.
5. Save your changes and refresh the preview page.

Watch mode rebuilds the active variation after every source change and copies the latest bundle to your clipboard. When the experiment is ready to ship, `pnpm build` creates production bundles for every variation.

Use Node 20.19+ and pnpm >=10.26.0. Node 24 is recommended. See [Prerequisites](/getting-started/prerequisites) before creating your first project.

## One bundle per variation

Each variation compiles to a self-contained IIFE bundle:

```text
dist/
├── v1-index.jsx
└── v2-index.jsx
```

The bundle includes the variation code, Preact components, and imported styles. You paste one JavaScript file into Adobe Target without uploading separate CSS or runtime assets.

During development, `pnpm start 0` watches `src/js/v1` and updates `dist/v1-index.jsx`. The variation index is zero-based; with numeric folders, `pnpm start 1` watches `v2`. Named folders such as `control` are ordered after numeric `vN` folders.

[Learn how to watch, build, and ship variations](/run-and-ship)

## Runtime helpers

Generated variations import runtime helpers from `@sogody/experiment-framework/framework`. The helpers are included in the final IIFE bundle:

```jsx
import { render } from 'preact';
import {
    mountExperiment,
    runScript,
    setupTracking,
} from '@sogody/experiment-framework/framework';
import ExperimentButton from '@components/ExperimentButton';
import { buttonText, selectors } from '../../config';

runScript(async () => {
    const container = mountExperiment(
        selectors.primary,
        selectors.fallbacks,
        'afterbegin',
    );
    if (!container) return;

    render(<ExperimentButton text={buttonText} />, container);

    setupTracking(container, {
        label: 'my-experiment: v1 cta clicked',
        selector: 'button',
    });
});
```

`runScript()` waits for DOM readiness, `mountExperiment()` finds the configured selector and injects a container, and `setupTracking()` attaches Adobe Analytics tracking after the UI renders. Use `waitFor()` or `watchFor()` when target elements appear dynamically.

[Browse the Framework API reference](/framework-api/)

## Where to go next

| Goal | Start here |
|---|---|
| Create your first experiment | [Quick Start](/getting-started/quick-start) |
| Understand generated files | [Project Structure](/getting-started/project-structure) |
| Edit selectors, UI, styles, and tracking | [Build an Experiment](/build-an-experiment) |
| Use watch mode and ship bundles | [Run and Ship](/run-and-ship) |
| Add Playwright coverage | [Testing](/testing) |
| Look up helper signatures | [Framework API](/framework-api/) |
| Fix a command or build failure | [Error Reference](/error-reference) |
