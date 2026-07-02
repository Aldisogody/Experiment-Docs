# Quick Start

Create a Vite + Preact experiment, start watch mode, and paste the generated IIFE bundle into Adobe Target.

**Time to complete:** ~10 minutes

::: tip Prerequisites
Use Node 24 and pnpm 10+. If you have not set them up yet, complete [Installation](/getting-started/installation) first.
:::

## Choose your path

| Goal | Use this path |
|---|---|
| First experiment | Follow this page end to end. |
| Existing Target activity | Scaffold, start watch mode, then paste into the matching variation. |
| Just exploring | Open [Playground](/playground). |
| Preparing release | Skip to [Run and Ship](/run-and-ship). |

## Step 1: Scaffold the project

```bash
npx @sogody/experiment-framework my-first-experiment
cd my-first-experiment
nvm use
```

When prompted:

| Prompt | Choose | Why |
|---|---|---|
| Number of variations | `1` | Keeps the first bundle focused. |
| Window namespace | `sgd` | Uses the team default. |
| Include emergency brake | `Yes` | Keeps the safety hook available. |
| Enable E2E testing | `No` | Add Playwright after the core loop works. |

If you are unsure, keep the default answer.

## Step 2: Start watch mode

```bash
pnpm start 0
```

You should see:

```text
v1-index.jsx copied to clipboard
```

::: tip
Every save rebuilds the bundle and copies the latest output to your clipboard.
:::

## Step 3: Paste into Adobe Target

1. Open your Adobe Target activity.
2. Open the **Custom Code** editor for variation 1.
3. Paste the clipboard contents.
4. Save and refresh the preview page.

::: warning
Paste the bundle into the matching Target variation. `pnpm start 0` builds `v1-index.jsx`.
:::

## Step 4: Make the first edit

Open `src/config.js` and replace the selector:

```js
export const selectors = {
    primary: '.target-selector',
    fallbacks: ['.alternate-selector', 'body'],
};
```

Save the file, wait for the clipboard message, paste again in Target, and refresh.

## Step 5: Build for shipping

```bash
pnpm build
```

The production bundle is written to:

```text
dist/v1-index.jsx
```

Optional AI support is available after the core workflow works. See [AI Project Support](/development/ai-project-support) when you need local agent instructions or reusable skills.

## Next steps

- [Project Structure](/getting-started/project-structure)
- [Run and Ship](/run-and-ship)
- [Testing](/testing)
