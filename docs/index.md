---
layout: home

---

## Install

Scaffold a new project in one command:

<div class="home-install-strip">

```bash
npx create-experiment my-experiment
```

</div>

## Documentation map

<p class="home-doc-map-intro">Follow the learning path first. Use reference pages only when you need exact commands, API signatures, or market tables.</p>

<div class="home-doc-map">
  <section class="home-doc-section" aria-labelledby="home-doc-getting-started">
    <h3 id="home-doc-getting-started">Start Here</h3>
    <ul>
      <li><a href="/start-here">Start Here</a> - setup, scaffold prompts, first watcher, first Adobe Target paste</li>
      <li><a href="/getting-started/quick-start">Quick Start</a> - minimal scaffold in about ten minutes</li>
      <li><a href="/getting-started/prerequisites">Prerequisites</a> - Node, pnpm, optional Playwright</li>
    </ul>
  </section>
  <section class="home-doc-section" aria-labelledby="home-doc-development">
    <h3 id="home-doc-development">Build an Experiment</h3>
    <ul>
      <li><a href="/build-an-experiment">Build an Experiment</a> - editable files, selectors, components, styling, tracking</li>
      <li><a href="/development/config">Configuration</a> - <code>experiment.config.js</code> and <code>src/config.js</code></li>
      <li><a href="/development/templates">Templates</a> - minimal vs product-card</li>
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

::: details How it works - scaffold → develop → ship

The tooling follows a three-step workflow from scaffold to production.

**1. Scaffold** - Run the create command and answer a handful of prompts. The CLI generates a complete Vite + Preact project with your chosen boilerplate, variation count, and market configuration.

```bash
npx create-experiment my-experiment
```

**2. Develop** - Start the watcher for your active variation. On every save, Vite rebuilds the IIFE bundle and copies it to your clipboard automatically.

```bash
cd my-experiment
pnpm start 0   # watches v1, copies to clipboard on save
```

Paste the clipboard contents into Adobe Target's custom code editor and refresh your preview.

**3. Ship** - Run a production build. Every variation compiles to a self-contained IIFE bundle ready to deploy.

```bash
pnpm build
# dist/v1/v1.js
# dist/v2/v2.js
```

:::

Ready to set up your environment? Start with [Start Here](/start-here).
