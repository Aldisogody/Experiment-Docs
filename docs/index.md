---
layout: home

hero:
  name: Create Experiment
  text: Adobe Target A/B experiments with Vite + Preact
  tagline: Scaffold IIFE bundles, iterate with watch + clipboard, ship production-ready variations.
  actions:
    - theme: brand
      text: Quick Start
      link: /getting-started/quick-start
    - theme: alt
      text: GitHub
      link: https://github.com/andi-sogody/experiment-framework-v2
      target: _blank
      rel: noreferrer

features:
  - icon: 🚀
    title: Getting Started
    details: From zero to a clipboard-ready bundle — install, prerequisites, and project layout.
    link: /getting-started/
    linkText: Browse
  - icon: ⚡
    title: Development
    details: Watch mode, variations, config, and templates for the inner dev loop.
    link: /development/
    linkText: Browse
  - icon: 🧩
    title: Framework API
    details: runScript, waitFor, watchFor, and tracking helpers for Target activities.
    link: /framework-api/
    linkText: Browse
  - icon: 🛠️
    title: Tooling
    details: Biome, Stylelint, editor setup, and optional Playwright E2E.
    link: /linting/
    linkText: Browse
  - icon: 📚
    title: Reference
    details: CLI prompts, generated commands, markets, migration, changelog, contributing.
    link: /reference/
    linkText: Browse
---

## Install

Scaffold a new project in one command:

<div class="home-install-strip">

```bash
pnpm create @sogody/experiment my-experiment
```

</div>

## Documentation map

<p class="home-doc-map-intro">Same sections as the top navigation — jump straight to a page.</p>

<div class="home-doc-map">
  <section class="home-doc-section" aria-labelledby="home-doc-getting-started">
    <h3 id="home-doc-getting-started">Getting Started</h3>
    <ul>
      <li><a href="/getting-started/">Overview</a> — what the CLI generates and project layout</li>
      <li><a href="/getting-started/quick-start">Quick Start</a> — zero to clipboard-ready bundle (~10 minutes)</li>
      <li><a href="/getting-started/prerequisites">Prerequisites</a> — Node, pnpm, optional Playwright</li>
      <li><a href="/getting-started/installation">Installation</a> — global CLI and workspace usage</li>
      <li><a href="/getting-started/project-structure">Project structure</a> — folders and entry points</li>
    </ul>
  </section>
  <section class="home-doc-section" aria-labelledby="home-doc-development">
    <h3 id="home-doc-development">Development</h3>
    <ul>
      <li><a href="/development/">Dev loop overview</a></li>
      <li><a href="/development/watch-mode">Watch mode & clipboard</a></li>
      <li><a href="/development/variations">Variations</a></li>
      <li><a href="/development/config">Configuration</a> — <code>experiment.config.js</code>, kill-switch</li>
      <li><a href="/development/templates">Templates</a></li>
    </ul>
  </section>
  <section class="home-doc-section" aria-labelledby="home-doc-framework-api">
    <h3 id="home-doc-framework-api">Framework API</h3>
    <ul>
      <li><a href="/framework-api/">Overview</a></li>
      <li><a href="/framework-api/run-script"><code>runScript()</code></a></li>
      <li><a href="/framework-api/wait-for"><code>waitFor()</code> & <code>watchFor()</code></a></li>
      <li><a href="/framework-api/tracking">Tracking</a></li>
    </ul>
  </section>
  <section class="home-doc-section" aria-labelledby="home-doc-tooling">
    <h3 id="home-doc-tooling">Tooling</h3>
    <ul>
      <li><a href="/linting/">Linting & formatting</a> — Biome, Stylelint, editor setup</li>
      <li><a href="/e2e-testing/">E2E testing (optional)</a> — Playwright setup, writing tests, <a href="/e2e-testing/markets">markets</a></li>
    </ul>
  </section>
  <section class="home-doc-section" aria-labelledby="home-doc-reference">
    <h3 id="home-doc-reference">Reference</h3>
    <ul>
      <li><a href="/reference/">Reference hub</a> — CLI prompts, commands, markets, migration, changelog, contributing</li>
    </ul>
  </section>
</div>

---

::: details How it works — scaffold → develop → ship

The framework follows a three-step workflow from scaffold to production.

**1. Scaffold** — Run the create command and answer a handful of prompts. The CLI generates a complete Vite + Preact project with your chosen boilerplate, variation count, and market configuration.

```bash
pnpm create @sogody/experiment my-experiment
```

**2. Develop** — Start the watcher for your active variation. On every save, Vite rebuilds the IIFE bundle and copies it to your clipboard automatically.

```bash
cd my-experiment
pnpm start 0   # watches v1, copies to clipboard on save
```

Paste the clipboard contents into Adobe Target's custom code editor and refresh your preview.

**3. Ship** — Run a production build. Every variation compiles to a self-contained IIFE bundle ready to deploy.

```bash
pnpm build
# dist/v1/v1.js
# dist/v2/v2.js
```

:::

Ready to set up your environment? Start with [Prerequisites](/getting-started/prerequisites).
