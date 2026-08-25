# Documentation visual system

## Status

Accepted for implementation on August 25, 2026.

## Understanding summary

- Fix the three Mermaid blocks that currently render as source code.
- Add visuals only where they make everyday development instructions faster to understand.
- Keep the current green identity, typography, layout, and navigation.
- Bundle every visual dependency with the documentation site.
- Support light and dark themes, mobile widths, and WCAG 2.2 AA.
- Keep API references, release tables, file trees, and migration steps in their current formats.

## Assumptions

- Diagrams supplement the surrounding prose; they do not replace required instructions or commands.
- Documentation maintainers own the renderer, the shared styles, and one custom mount-position component.
- Static documentation does not need an animation framework or visual-regression test suite.
- Mermaid must load only on pages that contain a diagram.
- The first pass contains seven visuals: three repaired release diagrams and four focused workflow diagrams.

## Decision log

| Decision | Alternatives | Reason |
|---|---|---|
| Use a Mermaid-first hybrid | Mermaid only; custom Vue only | Markdown remains practical for ordinary flows, while one spatial diagram can use semantic HTML. |
| Build a local Mermaid integration | `vitepress-plugin-mermaid` | The local renderer can lazy-load Mermaid, use strict sanitization, and react to the VitePress theme without a document-wide observer. |
| Preserve the current visual identity | Broader visual refresh | The problem is diagram comprehension, not site branding or navigation. |
| Use a focused audit | Full visual sweep | Seven high-value visuals improve common workflows without adding decorative or repetitive diagrams. |
| Keep visuals static | Animated transitions | Motion does not help readers understand these flows and would add maintenance and accessibility work. |

## Final design

### Rendering

A Markdown fence hook converts `mermaid` code blocks into a client-safe `MermaidDiagram` component. The component dynamically imports Mermaid, uses strict sanitization, assigns a unique render ID, and rerenders when VitePress changes between light and dark themes. A generation guard prevents stale async renders from replacing newer ones. Invalid syntax produces an inline notice without breaking page navigation.

The initial application bundle must not include Mermaid. Pages without diagrams must not request the Mermaid chunk.

### Visual language

Diagrams use the site's Source Sans 3 typeface, green accent, quiet neutral connectors, soft surfaces, restrained borders, and 12px corners. Flows read from top to bottom in the narrow article column. Every Mermaid source includes `accTitle` and `accDescr`. Horizontal overflow is a fallback for unusually narrow content, not the intended layout.

### Custom spatial visual

`MountPositionDiagram` is server-rendered semantic HTML. It shows the four `InsertPosition` values around one target element and includes a screen-reader description with the same mapping. It has no public props.

### Content set

1. Agent discovery and version-matched documentation.
2. Parallel control and variant exposure tracking.
3. Multi-market expansion and resolution.
4. Framework lifecycle on Getting Started.
5. Watch, paste, preview, build, and handoff on Run and Ship.
6. Generated E2E smoke-test sequence on Testing.
7. Mount positions in Quick Start.

## Acceptance criteria

- All seven visuals render in light and dark themes at 320px through desktop widths.
- Labels do not clip or overlap, and pages do not gain horizontal overflow.
- Theme changes and client-side navigation leave exactly one current SVG per Mermaid container.
- Titles, descriptions, reading order, fallbacks, and contrast are accessible.
- Mermaid is emitted as an async chunk and is not requested by a page without diagrams.
- The documentation build, playground seed validation, and feedback tests pass.
