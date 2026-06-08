# Introduction

`create-experiment` helps you scaffold, develop, and ship Vite + Preact experiments for Adobe Target. This page explains the core workflow and points you to the right guide when you are ready to build.

## What is create-experiment?

`create-experiment` is a CLI scaffolder for A/B experiment projects. It creates the variation entry points, configuration, optional Preact UI, linting, and build tooling needed to produce code for Adobe Target.

Start a project with:

```bash
npx create-experiment my-experiment
```

For the smallest first project, choose the `minimal` boilerplate and one variation. The generated files keep selectors and content in `src/config.js`, variation logic in `src/js/v1/index.jsx`, and reusable UI in `src/components/`.

[See the generated project structure](/getting-started/project-structure)

## The Adobe Target Experiment Workflow

The development loop follows five steps:

1. Scaffold a project with `npx create-experiment`.
2. Set the target selectors and experiment content.
3. Start watch mode with `pnpm start 0`.
4. Paste the clipboard-ready bundle into Adobe Target custom code.
5. Save your changes and refresh the preview page.

Watch mode rebuilds the active variation after every source change and copies the latest bundle to your clipboard. When the experiment is ready to ship, `pnpm build` creates production bundles for every variation.

Use Node 18+ and pnpm 10+. Node 24 is recommended. See [Prerequisites](/getting-started/prerequisites) before creating your first project.

## Single-File Bundles

Each variation compiles to a self-contained IIFE bundle:

```text
dist/
├── v1/
│   └── v1.js
└── v2/
    └── v2.js
```

The bundle includes the variation code, Preact components, and imported styles. You paste one JavaScript file into Adobe Target without uploading separate CSS or runtime assets.

During development, `pnpm start 0` watches `src/js/v1` and updates `dist/v1/v1.js`. The variation index is zero-based, so `pnpm start 1` watches `v2`.

[Learn how to watch, build, and ship variations](/run-and-ship)

## Framework API Style

Generated variations import runtime helpers from `create-experiment/framework`. These helpers are bundled into the final IIFE and provide a consistent lifecycle:

```jsx
import { render } from 'preact';
import {
    mountExperiment,
    runScript,
    setupTracking,
} from 'create-experiment/framework';
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

## Still Got Questions?

Use the focused reference pages when you need an exact answer:

| Question | Reference |
|---|---|
| Which files should I edit? | [Build an Experiment](/build-an-experiment) |
| How do selectors and package settings work? | [Configuration](/development/config) |
| Which starter template should I choose? | [Templates](/development/templates) |
| What does a framework helper return? | [Framework API](/framework-api/) |
| Why is a command or build failing? | [Error Reference](/error-reference) |
| Where are common team questions answered? | [FAQ](/faq) |

## Pick Your Learning Path

Choose the page that matches what you need to do next:

| Goal | Start here |
|---|---|
| Create your first experiment | [Start Here](/start-here) |
| Follow a complete walkthrough | [Quick Start](/getting-started/quick-start) |
| Edit selectors, UI, styles, and tracking | [Build an Experiment](/build-an-experiment) |
| Use watch mode and ship bundles | [Run and Ship](/run-and-ship) |
| Add Playwright coverage | [Testing](/testing) |
| Look up helper signatures | [Framework API](/framework-api/) |
