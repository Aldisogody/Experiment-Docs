# Framework Feedback Entry Point — Design

## Status

Accepted on 2026-08-03. This document records the agreed design before implementation.

## Understanding summary

- Add a small, persistent feedback entry point in the bottom-right corner of every Experiment Docs page.
- Use it specifically to improve the Experiment Framework and its tooling.
- Invite developers who actively use the framework to contribute.
- Open a structured GitHub Issue Form in `Sogody/experiment-framework` when the entry point is selected.
- Require contributors to describe the problem and its impact; keep a suggested improvement optional.
- Make submitted ideas visible to everyone with repository access and assign triage to the core framework maintainers.
- Judge success by whether recurring themes inform priorities and worthwhile ideas become framework changes.

## Assumptions

- **Performance:** The entry point is a static link. It makes no API call or third-party request before selection.
- **Scale:** Initial volume is unknown. GitHub Issues is sufficient until usage data indicates otherwise.
- **Privacy and security:** GitHub provides authentication and repository access control. Contributors must not submit credentials, customer data, private analytics, or production secrets.
- **Reliability:** Documentation remains usable when GitHub or the Issue Form is unavailable.
- **Accessibility:** The entry point supports keyboard navigation, screen readers, mobile layouts, browser zoom, and reduced-motion preferences.
- **Maintenance:** Core framework maintainers manually review, label, group, and respond to submissions.
- **Future analysis:** Consistent issue fields and labels will support AI-assisted theme analysis later without adding AI to the first release.

## Non-goals

- Collect documentation feedback.
- Review individual A/B experiments or their results.
- Build a custom form, API, database, or authentication layer.
- Automatically analyze, score, or prioritize submissions with AI in the first release.
- Add analytics, dismissal state, or local storage to the documentation component.

## Architecture

### Framework repository

Add `.github/ISSUE_TEMPLATE/framework-feedback.yml` to `Sogody/experiment-framework`. The native GitHub Issue Form owns authentication, validation, submission, and confirmation.

The form contains:

- **Problem or friction:** required multiline field asking what the developer was trying to do and what got in the way.
- **Impact:** required multiline field asking how the problem affects speed, reliability, maintainability, or experiment delivery.
- **Suggested improvement:** optional multiline field that makes clear a proposed solution is not required.
- **Additional context:** optional field for versions, commands, screenshots, or links.
- **Sensitive-data acknowledgement:** required checkbox confirming prohibited sensitive information is not included.

The form uses the title prefix `[Framework feedback]` and the labels `feedback` and `needs-triage`. Those labels must exist in the target repository before launch.

### Documentation repository

Add a `FrameworkFeedback.vue` component through the VitePress theme's global layout so it appears on every page without changing individual Markdown files.

The component is a semantic external link to:

`https://github.com/Sogody/experiment-framework/issues/new?template=framework-feedback.yml`

It opens in a new tab with `target="_blank"` and `rel="noopener noreferrer"`, preserving the developer's current documentation context. It contains no state, form logic, API calls, or third-party scripts.

## Interaction and visual specification

Desktop copy:

> **Help improve the framework**  
> Share an idea or friction you encountered.

On narrow screens, the component becomes a single-line pill reading `Share framework feedback`.

- Reuse the site's existing green brand tokens, Source Sans typography, and VitePress surface colors.
- Use an opaque elevated surface, subtle border and shadow, 12px radius, and approximately 280px maximum width.
- Position it 24px from the right and bottom edges on desktop.
- Preserve at least 16px viewport spacing plus mobile safe-area insets.
- Maintain a minimum 44x44px touch target.
- Use a consistent SVG icon rather than an emoji.
- Provide high-contrast light and dark states and a visible keyboard focus ring.
- Use only stable 150–200ms color transitions; do not scale or animate the component for attention.
- Remove nonessential transitions under `prefers-reduced-motion`.
- Hide the component in print layouts.
- Keep it below navigation and sidebar overlays but above document content.
- Do not add dismissal behavior in the initial version.

## Feedback and triage flow

1. A developer opens the Issue Form from any documentation page.
2. GitHub handles sign-in and repository authorization when necessary.
3. The developer completes the required problem, impact, and privacy acknowledgement fields.
4. GitHub creates a consistently titled and labeled issue.
5. A core maintainer reviews `needs-triage` issues on the team's regular cadence.
6. The maintainer requests context, applies emerging theme labels, and links duplicates where useful.
7. Accepted work becomes a linked implementation issue or remains in the original issue if already actionable.
8. Maintainers close the loop with the decision, planned release, or reason for not proceeding.

## Failure handling and edge cases

- Signed-out users follow GitHub's normal authentication flow.
- Users without repository access receive GitHub's standard access response.
- A missing or renamed template may fall back to the issue chooser or fail, so the destination is checked during releases.
- The Issue Form must be available before the documentation link is released.
- Responsive styling must prevent horizontal scrolling, clipped text, or overlap with site controls.
- English-only copy must remain usable at 200% browser zoom.
- GitHub unavailability affects feedback submission only, not documentation use.

## Verification

Automated and structural checks:

- Run the VitePress production build.
- Validate the Issue Form against GitHub's supported YAML schema and preview it in the target repository.
- Inspect rendered output for the correct URL, accessible text, `target`, and `rel` attributes.
- Add focused component tests only if a suitable test harness already exists.

Manual checks:

- Viewports at 375, 768, 1024, and 1440px.
- Light and dark themes.
- Keyboard-only navigation and visible focus.
- Screen-reader link announcement.
- 200% browser zoom.
- Touch-target size, safe-area spacing, and absence of horizontal overflow.
- Navigation/sidebar overlap and documentation usability.
- GitHub sign-in and Issue Form submission flow.

## Delivery strategy

Use a `feat/framework-feedback` branch in each repository.

1. Add and verify the framework Issue Form first; commit it as a complete feature.
2. Add the global documentation entry point; commit the functional component and integration as a complete feature.
3. Commit a separate accessibility and responsive refinement only if it forms a meaningful independent change.
4. Build and inspect the site, then leave the documentation branch ready for manual testing.

The current workspace contains the documentation repository only. Implementation must locate or obtain a writable copy of `Sogody/experiment-framework` before the Issue Form can be completed.

## Decision log

| Decision | Alternatives considered | Rationale |
| --- | --- | --- |
| Limit scope to framework and tooling | Documentation feedback; individual experiment feedback; all categories | Keeps the prompt focused and triage actionable. |
| Target active framework developers | Whole experimentation team; pilot group | These users directly experience framework friction. |
| Use open-ended feedback with guided fields | Categories; one blank field; fully rigid form | Preserves contributor voice while producing analyzable context. |
| Require problem and impact; make solution optional | Require all fields; require only the problem | A real problem should not require the contributor to design its fix. |
| Use a GitHub Issue Form in the framework repository | Prefilled issue; custom form/backend | Provides validation, visibility, discussion, labels, and durable ownership without custom infrastructure. |
| Use a global VitePress component | Per-page section; CLI prompt; selected pages | Makes feedback consistently available with one maintainable integration. |
| Use a compact persistent card | Icon-only button; modal; dismissible card | Communicates purpose clearly while keeping interaction lightweight. |
| Open GitHub in a new tab | Same-tab navigation | Preserves the user's documentation context. |
| Reuse existing site tokens and typography | New generic blue/orange palette and Inter | Maintains design-system consistency and avoids unnecessary assets. |
| Use manual triage first | Immediate AI processing; custom automation | Fits unknown initial volume and keeps the first release simple. |
| Structure data for future AI assistance | Unstructured issues | Enables later theme summaries without committing to automation now. |
| Use feature branches and feature-level commits | One large final commit | Supports review, rollback, and manual testing across two repositories. |

## Accepted risks

- The implementation spans two repositories, but only the documentation repository is currently available in this workspace.
- Native GitHub availability, access control, template routing, and label existence remain external dependencies.
- A persistent card may feel distracting to some readers; dismissal behavior will be reconsidered only if testing or feedback supports it.
- Initial success depends on maintainers maintaining a consistent triage and response habit.
