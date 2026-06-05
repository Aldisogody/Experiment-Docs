# Prerequisites

Before creating your first experiment, make sure your environment meets the following requirements.

## Node version {#node-version}

::: warning Node 18 is the minimum. Node 24 is recommended.
The generated project's `.nvmrc` is set to `24`. Running an older Node version will cause compatibility issues with pnpm 10.
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
The system default Node on some machines is 16. pnpm 10.x requires Node 18 at minimum. Always run `nvm use` before any `pnpm` or `node` commands in a generated project.
:::

## pnpm {#pnpm}

::: warning pnpm 10.x required
The generated project's `pnpm-lock.yaml` uses lockfile format v9, which is only compatible with pnpm 10.x. Using pnpm 9.x or earlier will fail `--frozen-lockfile` installs.
:::

**Install via Corepack (recommended):**

```bash
corepack enable
corepack prepare pnpm@latest --activate
pnpm --version   # 10.x.x
```

**Install via npm (alternative):**

```bash
npm install -g pnpm
pnpm --version   # 10.x.x
```

Why pnpm 10? The lockfile format changes between major versions. Projects committed with a v9 lockfile (`pnpm-lock.yaml` from pnpm 10.x) will fail on pnpm 9.x or below.

## Playwright {#playwright}

Playwright is only needed if you enable E2E testing during scaffolding (the CLI prompts you).

If you answered **Yes** to E2E at scaffold time, the CLI installs browsers automatically after generating your project. You do not need to do anything extra.

To install browsers manually (e.g. after cloning an existing E2E-enabled project):

```bash
cd my-experiment
pnpm playwright install
```

This downloads Chromium, Firefox, and WebKit to `~/.cache/ms-playwright`. Plan for approximately 300 MB of disk space.

::: tip Default browser
The generated `playwright.config.js` uses `Desktop Chrome` only. You do not need all three browsers for smoke testing.
:::

## Verification

Run these commands to confirm your environment is ready:

```bash
node --version   # v18.x.x or newer
pnpm --version   # 10.x.x
```

Once both pass, continue to [Installation](/getting-started/installation).
