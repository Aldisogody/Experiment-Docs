# Spec: v2-framework Documentation Improvements

> Guided by `/docs-guidelines.md` — the internal standard for developer tool documentation.

## Objective

Bring the Create Experiment VitePress site into alignment with the documentation standards guide. The audience is the Samsung/Sogody experimentation team: frontend developers who are familiar with JavaScript but may be new to this specific scaffolder.

**Success looks like:**
- A new developer can go from zero → first clipboard-ready bundle in under 10 minutes by following the Quick Start tutorial
- Every Framework API page follows the complete 7-field API template (Name, Description, Parameters, Returns, Example, Since, See Also)
- All six top-level sections are reachable from the top navigation bar
- A dedicated Migration page exists (separate from the Changelog)
- A Contributing page exists for internal team onboarding

---

## Current State Audit

### What exists

| Section | Pages | Status |
|---|---|---|
| Home | `index.md` | Good — hero, features, how-it-works |
| Getting Started | overview, prerequisites, installation, project-structure | Good content, missing tutorial |
| Development | index, watch-mode, variations, config, templates | Complete |
| Framework API | index, run-script, wait-for, tracking | Incomplete — missing Returns/Since/See Also |
| Linting | index, biome-rules, stylelint, editor-setup | Complete |
| E2E Testing | index, setup, writing-tests, markets | Complete |
| Reference | cli-prompts, generated-commands, markets, changelog | Complete |

### Gaps against docs-guidelines.md

1. **Nav bar incomplete** — Only 4 items: Home, Getting Started, Framework API, Reference. Development, Linting, and E2E Testing sections are unreachable from the top nav.

2. **No Tutorial layer** — The four-layer model (Tutorial / How-To / Explanation / Reference) requires a hand-holding, end-to-end Tutorial. Current Getting Started is a How-To Guide. A `getting-started/quick-start.md` tutorial is missing.

3. **API Reference incomplete** — Per Section 3.3, every API entry needs: Name/Signature, Description, Parameters, **Returns**, Example, **Since**, **See Also**. All five framework functions are missing Returns, Since, and See Also.

4. **No Migration page** — Migration notes are buried in `reference/changelog.md`. They should be a standalone `reference/migration.md`.

5. **No Contributing page** — No documentation for how to onboard, file issues, or contribute to the scaffolder or docs.

6. **VitePress config gaps** — No `editLink`, no `lastUpdated`. These are standard UX for docs sites.

---

## Tech Stack

- VitePress (current version in `v2-framework/`)
- Markdown content only — no custom Vue components, no new plugins
- All changes are `.md` file edits and one `config.mts` edit

## Commands

```bash
# from v2-framework/ after nvm use 24
pnpm docs:dev      # local dev server (verify changes)
pnpm docs:build    # static site build (verify no broken links)
pnpm docs:preview  # preview the build
```

## Project Structure

```
docs/
├── index.md                        # Home — no changes needed
├── getting-started/
│   ├── index.md                    # Overview — minor: add link to quick-start
│   ├── quick-start.md              # NEW — tutorial page
│   ├── prerequisites.md            # No changes
│   ├── installation.md             # No changes
│   └── project-structure.md       # No changes
├── development/                    # No content changes
├── framework-api/
│   ├── index.md                    # Add "Since" column to exports table
│   ├── run-script.md               # Add Returns, Since, See Also sections
│   ├── wait-for.md                 # Add Returns, Since, See Also sections
│   └── tracking.md                 # Add Returns, Since, See Also sections
├── linting/                        # No content changes
├── e2e-testing/                    # No content changes
└── reference/
    ├── cli-prompts.md              # No changes
    ├── generated-commands.md       # No changes
    ├── markets.md                  # No changes
    ├── migration.md                # NEW — extracted from changelog
    ├── changelog.md                # Link to migration.md; keep summary
    └── contributing.md             # NEW
.vitepress/
└── config.mts                      # Nav bar fix, editLink, lastUpdated
```

## Content Style

Following docs-guidelines.md Section 3.1:
- Second person ("you"), active voice, present tense
- No filler words ("simply", "just", "obviously")
- Code examples are complete and runnable

API reference format for each function:

```markdown
## functionName()

One-line summary.

### Signature
\`\`\`ts
functionName(param: Type): ReturnType
\`\`\`

### Parameters
| Parameter | Type | Required | Default | Description |

### Returns
Description of return value and type.

### Example
Minimal runnable code.

### Since
v2.0.0

### See Also
- Link to related API
```

## Boundaries

- **Always:** Keep all code examples complete and runnable; follow existing page structure patterns; link between related pages
- **Ask first:** Adding new VitePress plugins or custom theme components; changing section names in the sidebar
- **Never:** Modify generated experiment code in `new-experiment/`; edit `old-experiment/`; add open-source community content (this is an internal tool)

---

## Success Criteria

- [ ] `pnpm docs:build` completes with zero errors after all changes
- [ ] Top nav has 6 items: Home, Getting Started, Development, Framework API, Linting, E2E Testing, Reference
- [ ] `getting-started/quick-start.md` exists and walks a new user from scaffold to first paste in numbered steps with code blocks
- [ ] All five framework API functions have Returns, Since (`v2.0.0`), and See Also sections
- [ ] `reference/migration.md` exists and contains the v1→v2 migration steps
- [ ] `reference/contributing.md` exists with internal contribution guidance
- [ ] `config.mts` has `editLink` and `lastUpdated` configured

---

## Task Breakdown

### Task 1: Fix VitePress nav bar and config
- **Files:** `docs/.vitepress/config.mts`
- **Changes:** Add Development, Linting, E2E Testing to `nav[]`; add `editLink`; add `lastUpdated: true`
- **Verify:** `pnpm docs:build` passes; nav shows all sections in browser

### Task 2: Create Quick Start tutorial
- **Files:** `docs/getting-started/quick-start.md` (new), `docs/getting-started/index.md` (add link)
- **Content:** End-to-end numbered tutorial — scaffold → install → start watch → paste into Adobe Target → production build. Uses product-card boilerplate. Target: 10 minutes.
- **Verify:** Page renders, all code blocks are syntactically correct

### Task 3: Add sidebar entry for Quick Start
- **Files:** `docs/.vitepress/config.mts`
- **Changes:** Insert `{ text: 'Quick Start', link: '/getting-started/quick-start' }` as first item under Getting Started sidebar
- **Verify:** Quick Start appears in Getting Started sidebar

### Task 4: Complete Framework API entries — Returns/Since/See Also
- **Files:** `docs/framework-api/run-script.md`, `docs/framework-api/wait-for.md`, `docs/framework-api/tracking.md`, `docs/framework-api/index.md`
- **Changes:**
  - `runScript()` → Returns: `void`; Since: `v2.0.0`; See Also: waitFor, watchFor
  - `waitFor()` → Returns: `void`; Since: `v2.0.0`; See Also: watchFor, runScript
  - `watchFor()` → Returns: `void`; Since: `v2.0.0`; See Also: waitFor, runScript
  - `trackAAEvent()` → Returns: `void`; Since: `v2.0.0`; See Also: setupTracking
  - `setupTracking()` → Returns: `void`; Since: `v2.0.0`; See Also: trackAAEvent
  - `index.md` → Add `Since` column to exports table
- **Verify:** All five functions have complete API entries

### Task 5: Create Migration page
- **Files:** `docs/reference/migration.md` (new), `docs/reference/changelog.md` (add link)
- **Content:** Move and expand v1→v2 migration steps into a dedicated page with before/after code examples
- **Verify:** Page renders; changelog links to it; sidebar includes it

### Task 6: Create Contributing page
- **Files:** `docs/reference/contributing.md` (new)
- **Content:** Internal contribution guide — how to run docs locally, how to add a doc page, PR review process, how to report bugs
- **Verify:** Page renders; sidebar includes it

---

## Open Questions

1. Should the nav bar order be: `Getting Started → Development → Framework API → Linting → E2E Testing → Reference`? Or a different order?
2. Is there a GitHub repo URL to use for `editLink`? The config currently references `https://github.com/sogody/experiment-framework-v2` — is that the correct docs repo or the scaffolder repo?
3. For the Quick Start tutorial — should it use the `product-card` boilerplate or `minimal`? (Assuming `product-card` as it's the recommended default, but `minimal` would produce a shorter tutorial.)
