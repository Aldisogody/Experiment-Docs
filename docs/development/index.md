# Development

The experiment framework is built around a fast inner loop: save a file, get a clipboard-ready bundle, paste it into Adobe Target.

## The inner loop

```
Edit source → Vite rebuilds → IIFE bundle → copied to clipboard → paste into Adobe Target → refresh preview
```

Everything in this section describes how that loop works and how to extend it.

For browser-first iteration, `pnpm live` starts the same focused watcher, opens `targetUrl`, and reinjects after bundle changes.

## Sections

- [Watch Mode & Clipboard](/development/watch-mode) - `pnpm start 0`, clipboard mechanics, Adobe Target paste workflow
- [Variations](/development/variations) - adding v2/v3, the `-eN` flag, dedup guard
- [Configuration](/development/config) - `experiment.config.js` and `src/config.js` fields
- [Templates](/development/templates) - product-card vs minimal, when to use each
- [AI Project Support](/development/ai-project-support) - opt-in instruction files and reusable project skills
- [Run and Ship](/run-and-ship) - live injection, production builds, and handoff
