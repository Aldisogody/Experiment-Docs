# Quick Start

This tutorial walks you through creating your first A/B experiment from scratch. By the end you will have a running Vite + Preact project with a clipboard-ready IIFE bundle ready to paste into Adobe Target.

**Time to complete:** ~10 minutes

**Prerequisites:** Node 24 and pnpm 10.30.1 installed. If not, complete [Prerequisites](/getting-started/prerequisites) first.

---

## Step 1: Scaffold the project

Run the create command and follow the prompts:

```bash
pnpm create @sogody/experiment my-first-experiment
```

When prompted, answer:

| Prompt | Recommended answer |
|---|---|
| Select boilerplate | `product-card` |
| Number of variations | `2` (creates v1 and v2) |
| Window namespace | `sgd` (default) |
| Include emergency brake | `Yes` (default) |
| Enable E2E testing | `No` (default — add later if needed) |

The CLI generates the project, installs dependencies, and prints next steps.

## Step 2: Switch to the correct Node version

```bash
cd my-first-experiment
nvm use   # reads .nvmrc — switches to Node 24
```

::: warning Always run nvm use first
The `package.json` `packageManager` field locks pnpm to `10.30.1`. Running `pnpm` commands on a different Node version can cause lockfile errors.
:::

## Step 3: Start watch mode for variation 1

```bash
pnpm start 0
```

You will see Vite build output followed by:

```
✓ built in 312ms
📋 v1 bundle copied to clipboard
```

Every time you save a source file, Vite rebuilds and copies the latest bundle to your clipboard automatically.

## Step 4: Paste into Adobe Target

1. Open your Adobe Target activity.
2. Navigate to the **Custom Code** editor for the variation you are developing.
3. Select all existing content in the editor and paste (`Cmd+V` / `Ctrl+V`).
4. Click **Save** and refresh your preview page.

The experiment renders on the page. No manual bundle copying needed — the clipboard is always up to date on save.

## Step 5: Edit the experiment

Open `src/config.js` and set the selector for your target page:

```js
export const testName = 'my-first-experiment';
export const targetSelector = '.your-page-selector';  // ← update this
```

Save the file. Vite rebuilds instantly and copies the new bundle to your clipboard. Paste into Adobe Target and refresh.

## Step 6: Run a production build

When your experiment is ready:

```bash
pnpm build
```

Output:

```
dist/
├── v1/
│   └── v1.js
└── v2/
    └── v2.js
```

Each file is a self-contained IIFE bundle. Upload or paste these into Adobe Target for your production activity.

---

## What's next

- [Project Structure](/getting-started/project-structure) — understand every generated file
- [Variations](/development/variations) — add a third variation or rename existing ones
- [Framework API](/framework-api/) — `runScript`, `waitFor`, `watchFor`, and tracking helpers
- [Configuration](/development/config) — `experiment.config.js` and `src/config.js` field reference
