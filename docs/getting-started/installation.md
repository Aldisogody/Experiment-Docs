# Installation

## Create a new experiment

Run the create command with your project name:

```bash
npx @sogody/experiment-framework my-experiment
```

The CLI asks a few setup questions, creates the project, and installs its dependencies. It can also configure Playwright and run an initial smoke test.

## CLI prompts

| Prompt | Default | What it controls |
|---|---|---|
| **Number of variations** | `1` | Generates `src/js/v1/` through `src/js/vN/`. Pick 2 for A/B, 3 for A/B/C. |
| **Window namespace** | `sgd` | The IIFE output name on `window`, such as `window.sgd`. It must be a valid JavaScript identifier. Change it only if another experiment on the page uses the same name. |
| **Include emergency brake** | `true` | Sets `runtime.includeEmergencyBrake` in `experiment.config.js`. When enabled, `runScript()` checks the Adobe Target emergency-brake configuration before running the experiment. |
| **Enable E2E testing** | `false` | Generates `e2e/`, `playwright.config.js`, and wires up `pnpm test:e2e`. Enable if you have a stable preview URL to test against. |
| **Base URL** _(E2E only)_ | `https://samsung.com` | The root URL for Playwright tests. |
| **Market** _(E2E only)_ | - | Selects which Samsung market(s) to parametrise tests against. See the [Markets reference](/reference/markets). |
| **Run smoke test** _(E2E only)_ | `false` | Runs `pnpm build` and `pnpm test:e2e` immediately after setup. |

## After scaffolding

After scaffolding, start the watcher for the first variation:

```bash
cd my-experiment

# Watch variation 1 - rebuilds on save and copies IIFE to clipboard
pnpm start 0
```

Paste the copied bundle into the matching Adobe Target variation, save, and refresh the preview.

### Agent guidance

The scaffold creates tracked `AGENTS.md` and `CLAUDE.md` files. They direct coding tools to the version-matched guides installed with `@sogody/experiment-framework`, starting at `node_modules/@sogody/experiment-framework/llms.txt`.

See [AI Project Support](/development/ai-project-support) for the discovery flow and the safe refresh command for older projects.

::: tip Current scaffold
The CLI now generates one generic button template. Add experiment-specific data loading or custom components in the generated project when needed.
:::

::: info Existing directories
If the destination directory already exists and is not empty, the CLI asks before continuing. It does not remove unrelated files from that directory.
:::
