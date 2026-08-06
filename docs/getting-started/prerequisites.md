# Prerequisites

You need Node 20.19 or newer and pnpm 10.26 or newer. Node 24 with pnpm 10.30.1 is the recommended setup.

## Node version {#node-version}

::: warning Node 20.19 is the minimum. Node 24 is recommended.
The generated `.nvmrc` selects Node 24. Older Node versions are not compatible with current pnpm releases.
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

### Install with Corepack

```bash
corepack enable
corepack prepare pnpm@10.30.1 --activate
pnpm --version   # 10.30.1
```

### Install with npm

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

You only need Playwright for E2E testing.

If you enable E2E while scaffolding, the CLI installs the browsers for you.

After cloning an E2E-enabled project, install the browsers manually:

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
