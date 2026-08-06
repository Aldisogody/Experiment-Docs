---
title: Playground
aside: false
---

# Playground

The editor runs a sample project in a browser sandbox. It installs dependencies,
builds the bundle, starts watch mode, and lets you copy the result without writing
to your computer.

The sandbox uses npm without a lockfile to keep the initial download small. It may
create a temporary `package-lock.json` during the session. Projects created on your
computer use pnpm and include a lockfile.

Button styles live in `src/components/ExperimentButton/styles.module.scss`.
`src/js/v1/styles.module.scss` styles the mount wrapper. Its default `.root`
class uses `display: contents`, so the wrapper does not disturb the host layout.

For the watch-and-paste workflow, see [Watch Mode & Clipboard](/development/watch-mode).
For the full workflow, see [Run and Ship](/run-and-ship) and
[Generated Project Commands](/reference/generated-commands).

<ClientOnly>
  <PlaygroundApp />
  <template #fallback>
    <p>Loading playground...</p>
  </template>
</ClientOnly>
