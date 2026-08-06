---
layout: home

---

## Install

Scaffold a new project in one command:

<div class="home-install-strip">

```bash
npx @sogody/experiment-framework my-experiment
```

</div>

## Find the right page

<p class="home-doc-map-intro">Start with the learning path. Use the reference pages when you need an exact command, API signature, or market code.</p>

<div class="home-doc-map">
  <section class="home-doc-section" aria-labelledby="home-doc-getting-started">
    <h3 id="home-doc-getting-started">Getting Started</h3>
    <ul>
      <li><a href="/getting-started/quick-start">Quick Start</a> - scaffold, watch mode, first Adobe Target paste</li>
      <li><a href="/getting-started/prerequisites">Prerequisites</a> - Node, pnpm, optional Playwright</li>
      <li><a href="/getting-started/project-structure">Project Structure</a> - generated files and bundle anatomy</li>
    </ul>
  </section>
  <section class="home-doc-section" aria-labelledby="home-doc-development">
    <h3 id="home-doc-development">Build an Experiment</h3>
    <ul>
      <li><a href="/build-an-experiment">Build an Experiment</a> - editable files, selectors, components, styling, tracking</li>
      <li><a href="/development/config">Configuration</a> - <code>experiment.config.js</code> and <code>src/config.js</code></li>
      <li><a href="/development/templates">Scaffold Template</a> - current generated project shape</li>
    </ul>
  </section>
  <section class="home-doc-section" aria-labelledby="home-doc-run-ship">
    <h3 id="home-doc-run-ship">Run and Ship</h3>
    <ul>
      <li><a href="/run-and-ship">Run and Ship</a> - watch mode, clipboard, live injection, builds, variations</li>
      <li><a href="/reference/generated-commands">Generated commands</a> - terse command reference</li>
    </ul>
  </section>
  <section class="home-doc-section" aria-labelledby="home-doc-tooling">
    <h3 id="home-doc-tooling">Testing</h3>
    <ul>
      <li><a href="/testing">Testing</a> - optional Playwright setup, generated files, smoke flow, markets</li>
      <li><a href="/reference/markets">Markets</a> - complete market group reference</li>
    </ul>
  </section>
  <section class="home-doc-section" aria-labelledby="home-doc-reference">
    <h3 id="home-doc-reference">Reference</h3>
    <ul>
      <li><a href="/framework-api/">Framework API</a> - runtime helper signatures and examples</li>
      <li><a href="/reference/">Reference hub</a> - CLI prompts, commands, markets, migration, changelog, contributing</li>
    </ul>
  </section>
</div>

---

::: details The workflow: scaffold → develop → ship

1. Scaffold the project. The CLI creates a Vite + Preact button experiment from your answers.

```bash
npx @sogody/experiment-framework my-experiment
```

2. Develop the variation. Every save rebuilds the IIFE bundle and copies it to your clipboard.

```bash
cd my-experiment
pnpm start 0   # watches v1, copies to clipboard on save
```

Paste the clipboard contents into Adobe Target's custom code editor and refresh your preview.

3. Ship the experiment. The production build creates one self-contained IIFE bundle per variation.

```bash
pnpm build
# dist/v1-index.jsx
# dist/v2-index.jsx
```

:::

Ready to create your first experiment? Start with [Quick Start](/getting-started/quick-start).
