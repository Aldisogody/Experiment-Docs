# Quick Start

This tutorial walks you through creating a minimal experiment. By the end you will have a Vite + Preact project and a clipboard-ready IIFE bundle for Adobe Target.

**Time to complete:** ~10 minutes

**Prerequisites:** Node 20.19+ and pnpm 10+ installed. Node 24 is recommended. If not, complete [Prerequisites](/getting-started/prerequisites) first.

---

## Step 1: Scaffold the project

Run the create command and follow the prompts:

```bash
npx create-experiment my-first-experiment
```

When prompted, answer:

| Prompt | Recommended answer |
|---|---|
| Select boilerplate | `minimal` (default) |
| Number of variations | `1` (default) |
| Window namespace | `sgd` (default) |
| Include emergency brake | `Yes` (default) |
| Enable E2E testing | `No` (default - add later if needed) |

The CLI generates the project, installs dependencies, and prints next steps.

## Step 2: Switch to the correct Node version

```bash
cd my-first-experiment
nvm use   # reads .nvmrc - switches to Node 24
```

::: warning Always run nvm use first
The generated project includes `.nvmrc`. Running `nvm use` keeps Node aligned before you run `pnpm` commands.
:::

## Optional: add AI project support

AI instruction files are not generated automatically. Create the relevant local
support from the project root:

```bash
pnpm init-claude
pnpm init-agents
```

The commands infer the experiment name, boilerplate type, and E2E setup from
existing project files. See
[AI Project Support](/development/ai-project-support) for tool destinations,
generated resources, and safe replacement.

## Step 3: Start watch mode for variation 1

```bash
pnpm start 0
```

You will see Vite build output followed by:

```text
built in 312ms
v1-index.jsx copied to clipboard
```

Every time you save a source file, Vite rebuilds and copies the latest bundle to your clipboard automatically.

## Step 4: Paste into Adobe Target

1. Open your Adobe Target activity.
2. Navigate to the **Custom Code** editor for the variation you are developing.
3. Select all existing content in the editor and paste (`Cmd+V` / `Ctrl+V`).
4. Click **Save** and refresh your preview page.

The experiment renders on the page. No manual bundle copying needed - the clipboard is always up to date on save.

## Step 5: Edit the experiment

Open `src/config.js` and set the selector for your target page:

```js
export const selectors = {
    primary: '.your-page-selector',
    fallbacks: ['.alternate-selector', 'body'],
};
```

Save the file. Vite rebuilds instantly and copies the new bundle to your clipboard. Paste into Adobe Target and refresh.

## Step 6: Run a production build

When your experiment is ready:

```bash
pnpm build
```

Output:

```text
dist/
└── v1-index.jsx
```

Each file is a self-contained IIFE bundle. Upload or paste these into Adobe Target for your production activity.

---

## What's next

- [Project Structure](/getting-started/project-structure) - understand every generated file
- [Variations](/development/variations) - add another variation
- [AI Project Support](/development/ai-project-support) - install local instructions and reusable skills
- [Framework API](/framework-api/) - `runScript`, `waitFor`, `watchFor`, and tracking helpers
- [Configuration](/development/config) - `experiment.config.js` and `src/config.js` field reference
