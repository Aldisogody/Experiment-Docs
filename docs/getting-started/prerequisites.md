# Prerequisites

Before creating your first experiment, make sure your environment meets the following requirements.

## Node version {#node-version}

::: warning Node 20.19 is the minimum. Node 24 is recommended.
The generated project's `.nvmrc` is set to `24`. Running an older Node version will cause compatibility issues with current pnpm releases.
:::

Install and manage Node versions with [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install 24
nvm use 24
node --version   # v24.x.x
```

Every generated project ships with a `.nvmrc` file. Running `nvm use` inside the project root will switch to the correct version automatically.

::: tip Windows users
Use [nvm-windows](https://github.com/coreybutler/nvm-windows) instead of nvm.
:::

::: danger Node 16 is incompatible
The system default Node on some machines is 16. Generated projects require Node 20.19 or newer. Always run `nvm use` before any `pnpm` or `node` commands in a generated project.
:::

## pnpm {#pnpm}

::: warning pnpm >=10.26.0 required
Generated projects support pnpm >=10.26.0. Node 20.19 users must stay on pnpm 10.26-10.x; pnpm 11 requires Node 22 or newer.
:::

**Install via Corepack (recommended):**

```bash
corepack enable
corepack prepare pnpm@10.30.1 --activate
pnpm --version   # 10.30.1
```

**Install via npm (alternative):**

```bash
npm install -g pnpm
pnpm --version   # 10.26.0 or newer
```

Generated projects also use workspace-level dependency build approvals in `pnpm-workspace.yaml`:

```yaml
allowBuilds:
  '@biomejs/biome': true
  '@parcel/watcher': true
  esbuild: true
strictDepBuilds: true
```

This format is compatible with pnpm 10.26+ and pnpm 11.

## Playwright {#playwright}

Playwright is only needed if you enable E2E testing during scaffolding (the CLI prompts you).

If you answered **Yes** to E2E at scaffold time, the CLI installs browsers automatically after generating your project. You do not need to do anything extra.

To install browsers manually (e.g. after cloning an existing E2E-enabled project):

```bash
cd my-experiment
pnpm playwright install
```

This downloads Chromium, Firefox, and WebKit. Install only Chromium when you want the browser used by the generated config:

```bash
pnpm playwright install chromium
```

::: tip Default browser
The generated `playwright.config.js` uses `Desktop Chrome` only. You do not need all three browsers for smoke testing.
:::

## Verification

Run these commands to confirm your environment is ready:

```bash
node --version   # v20.19.x or newer
pnpm --version   # 10.26.0 or newer
```

Once both pass, continue to [Installation](/getting-started/installation).
