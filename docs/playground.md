---
title: Playground
aside: false
---

# Playground

The editor below runs a sandboxed sample project directly in the browser. The
sandbox installs dependencies, builds the experiment bundle, starts watch mode,
and lets you copy the generated bundle without writing to your local filesystem.

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
