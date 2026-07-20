---
title: Playground
aside: false
---

# Playground

The editor below runs a sandboxed sample project directly in the browser. The
sandbox installs dependencies, builds the experiment bundle, starts watch mode,
and lets you copy the generated bundle without writing to your local filesystem.
The browser sandbox uses npm and does not ship a lockfile, keeping the initial
download small. npm resolves the declared dependency ranges when the sandbox
boots and may create a temporary `package-lock.json` inside that browser session.
Generated projects used locally continue to use pnpm and their checked-in lockfile.

Visual button styles live in
`src/components/ExperimentButton/styles.module.scss`. The default
`src/js/v1/styles.module.scss` file styles the mount wrapper; its `.root` class
uses `display: contents`, so wrapper-only visual changes may be bundled without
changing the rendered button.

For the watch-and-paste workflow, see [Watch Mode & Clipboard](/development/watch-mode).
For the full workflow, see [Run and Ship](/run-and-ship) and
[Generated Project Commands](/reference/generated-commands).

<ClientOnly>
  <PlaygroundApp />
  <template #fallback>
    <p>Loading playground...</p>
  </template>
</ClientOnly>
