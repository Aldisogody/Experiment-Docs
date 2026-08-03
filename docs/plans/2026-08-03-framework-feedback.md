# Framework Feedback Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. This sub-skill is unavailable in the current environment, so Codex will execute the accepted plan directly in the current session.

**Goal:** Add an accessible, site-wide documentation prompt that opens a structured feedback Issue Form in the Experiment Framework repository.

**Architecture:** A native GitHub Issue Form in `Sogody/experiment-framework` collects validated, consistently structured feedback. A stateless Vue anchor component is mounted through the VitePress default theme's `layout-bottom` slot and styled with existing documentation design tokens.

**Tech Stack:** GitHub Issue Forms YAML, VitePress 1.6, Vue 3, CSS, pnpm.

---

### Task 1: Add the framework feedback Issue Form

**Files:**
- Create: `../experiment-framework/.github/ISSUE_TEMPLATE/framework-feedback.yml`

**Step 1: Create the feature branch**

Run: `git -C ../experiment-framework switch -c feat/framework-feedback`

Expected: the framework repository switches from clean `master` to `feat/framework-feedback`.

**Step 2: Add the Issue Form**

Create the following form:

```yaml
name: Framework feedback
description: Share friction or an idea that could improve the Experiment Framework.
title: "[Framework feedback] "
labels:
  - feedback
  - needs-triage
body:
  - type: markdown
    attributes:
      value: |
        Thanks for helping us improve the Experiment Framework. Describe the problem and its impact; you do not need to design the solution.
  - type: textarea
    id: problem
    attributes:
      label: Problem or friction
      description: What were you trying to do, and what got in the way?
      placeholder: Tell us what happened and include enough context to understand the problem.
    validations:
      required: true
  - type: textarea
    id: impact
    attributes:
      label: Impact
      description: How does this affect speed, reliability, maintainability, or experiment delivery?
      placeholder: Explain who is affected and why this matters.
    validations:
      required: true
  - type: textarea
    id: improvement
    attributes:
      label: Suggested improvement
      description: Optional. Share an idea if you have one; proposing a solution is not required.
      placeholder: What might make this experience better?
  - type: textarea
    id: context
    attributes:
      label: Additional context
      description: Optional. Include relevant framework versions, commands, screenshots, or links.
  - type: checkboxes
    id: sensitive-data
    attributes:
      label: Sensitive data
      options:
        - label: I confirm this issue contains no credentials, customer data, private analytics, or production secrets.
          required: true
```

**Step 3: Validate the file**

Run a YAML syntax check and inspect the parsed top-level keys and body IDs.

Expected: valid YAML with `name`, `description`, `title`, `labels`, and `body`; unique body IDs; required validations on `problem`, `impact`, and the acknowledgement option.

**Step 4: Confirm labels**

Run: `gh label list --repo Sogody/experiment-framework`

Expected: `feedback` and `needs-triage` exist. If either is absent, report it as a repository prerequisite rather than silently changing repository metadata.

**Step 5: Commit**

```bash
git -C ../experiment-framework add .github/ISSUE_TEMPLATE/framework-feedback.yml
git -C ../experiment-framework commit -m "feat: add framework feedback issue form"
```

### Task 2: Add the global documentation feedback component

**Files:**
- Create: `docs/.vitepress/theme/FrameworkFeedback.vue`
- Create: `docs/.vitepress/theme/feedback.css`
- Modify: `docs/.vitepress/theme/index.ts`

**Step 1: Add the semantic component**

Create a stateless Vue single-file component containing one external anchor. Use this destination:

```text
https://github.com/Sogody/experiment-framework/issues/new?template=framework-feedback.yml
```

The anchor must include `target="_blank"`, `rel="noopener noreferrer"`, visible desktop and mobile labels, a decorative SVG external-link icon, and visually hidden text announcing that it opens in a new tab.

**Step 2: Add responsive theme styles**

Implement the accepted specification in `feedback.css`:

- existing VitePress and documentation design tokens only;
- fixed bottom-right placement with safe-area insets;
- 44px minimum touch target;
- desktop card with title and supporting copy;
- single-line mobile pill below 640px;
- visible focus ring and stable color-only hover treatment;
- reduced-motion and print rules;
- layer below navigation/sidebar overlays and above document content;
- no horizontal overflow at 320px and wider.

**Step 3: Mount the component globally**

Import Vue's `h`, the component, and `feedback.css` in `docs/.vitepress/theme/index.ts`. Override the theme `Layout` with `DefaultTheme.Layout` and render `FrameworkFeedback` in the `layout-bottom` slot. Preserve existing global component registration.

**Step 4: Build to verify implementation**

Run: `pnpm docs:build`

Expected: VitePress completes without Vue, TypeScript, SSR, or CSS errors.

**Step 5: Inspect generated output**

Check a generated page for the feedback URL, visible label, new-tab target, and safe relationship attributes.

Expected: the component renders globally and the link attributes match the specification.

**Step 6: Commit**

```bash
git add docs/.vitepress/theme/FrameworkFeedback.vue docs/.vitepress/theme/feedback.css docs/.vitepress/theme/index.ts
git commit -m "feat: add framework feedback entry point"
```

### Task 3: Validate the rendered experience

**Files:**
- Modify only if validation finds a defect: `docs/.vitepress/theme/FrameworkFeedback.vue`
- Modify only if validation finds a defect: `docs/.vitepress/theme/feedback.css`

**Step 1: Start the documentation server**

Run: `pnpm docs:dev`

Expected: the VitePress site becomes available locally without console errors.

**Step 2: Check responsive layouts**

Inspect at 320, 375, 768, 1024, and 1440px in both light and dark themes.

Expected: no horizontal scrolling, clipped copy, or overlap with navigation controls; desktop card and mobile pill switch at 640px.

**Step 3: Check interaction and accessibility**

Verify keyboard focus, semantic link exposure, 44px touch size, 200% zoom behavior, print hiding, visible external-link cue, and absence of attention-seeking motion.

Expected: all checks satisfy the accepted design and WCAG-oriented component requirements.

**Step 4: Verify the cross-repository flow**

Open the link and confirm GitHub selects `framework-feedback.yml` and presents the required fields.

Expected: the Issue Form is reachable when GitHub can see the branch/template. Before it is pushed or merged, verify the URL shape and local form instead and flag remote end-to-end testing as pending.

**Step 5: Fix and recommit only if needed**

If visual or accessibility defects are found, make the smallest correction, rerun the build and checks, then commit:

```bash
git add docs/.vitepress/theme/FrameworkFeedback.vue docs/.vitepress/theme/feedback.css docs/.vitepress/theme/index.ts
git commit -m "fix: refine framework feedback accessibility"
```

### Task 4: Final handoff

**Files:**
- No planned changes.

**Step 1: Confirm repository state**

Run `git status --short --branch` in both repositories and inspect their feature-branch logs.

Expected: both worktrees are clean on `feat/framework-feedback`, with feature-level commits present.

**Step 2: Provide manual test instructions**

Give the user exact commands to start the documentation site, pages and viewport/theme states to inspect, the expected link destination, and any remote-only prerequisite such as pushing the Issue Form branch or creating missing labels.
