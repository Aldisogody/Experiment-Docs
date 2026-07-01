# Installation

## Create a new experiment

Run the create command with your project name:

```bash
npx @sogody/experiment-framework my-experiment
```

The CLI guides you through a series of prompts, then generates a complete project, installs dependencies, and optionally runs Playwright setup and a smoke test.

## CLI prompts

| Prompt | Default | What it controls |
|---|---|---|
| **Number of variations** | `1` | Generates `src/js/v1/` through `src/js/vN/`. Pick 2 for A/B, 3 for A/B/C. |
| **Window namespace** | `sgd` | The IIFE output name on `window` (e.g. `window.sgd`). Must be a valid JS identifier. Keep the default unless it conflicts with another experiment on the same page. |
| **Include emergency brake** | `true` | Records `includeEmergencyBrake` in `experiment.config.js`. The current build/runtime does not consume this field, so verify the deployment integration before relying on it. |
| **Enable E2E testing** | `false` | Generates `e2e/`, `playwright.config.js`, and wires up `pnpm test:e2e`. Enable if you have a stable preview URL to test against. |
| **Base URL** _(E2E only)_ | `https://samsung.com` | The root URL for Playwright tests. |
| **Market** _(E2E only)_ | - | Selects which Samsung market(s) to parametrise tests against. See the [Markets reference](/reference/markets). |
| **Run smoke test** _(E2E only)_ | `false` | Runs `pnpm build` and `pnpm test:e2e` immediately after setup. |

## After scaffolding

The CLI prints the next steps. Start developing immediately:

```bash
cd my-experiment

# Watch variation 1 - rebuilds on save and copies IIFE to clipboard
pnpm start 0
```

Open Adobe Target, navigate to your experiment's custom code editor, and paste. That's the full inner loop.

### Optional: add AI project support

Generated projects do not include AI instruction files automatically.
From the project root, create the support used by your tooling:

```bash
pnpm init-claude
pnpm init-agents
```

The commands create `CLAUDE.md` and `AGENTS.md` after inferring the experiment
name and E2E setup from the scaffolded project.

See [AI Project Support](/development/ai-project-support) for generated paths,
replacement behavior, and older-project usage.

::: tip Current scaffold
The CLI now generates one generic button template. Add experiment-specific data loading or custom components in the generated project when needed.
:::

::: info Existing directories
If the destination directory already exists and is not empty, the CLI asks before continuing. It does not remove unrelated files from that directory.
:::
