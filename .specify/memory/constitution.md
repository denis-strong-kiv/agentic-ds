# Agentic-DS Constitution

## Core Principles

### I. Token-First Styling
All visual styling MUST come from design tokens and theme primitives.
- Use `var(--color-*)`, `var(--shape-*)`, `var(--duration-*)`, and existing Tailwind token mappings.
- Hard-coded hex/rgb/hsl colors are forbidden in component code.
- New visual decisions must be added to tokens first, then consumed by components.

### II. No Inline Styles by Default
Component styles MUST be expressed through class utilities and shared style constants.
- Avoid `style={{ ... }}` in production components.
- Allowed exception: runtime-computed values that cannot be represented via tokens/utilities.
- If exception is used, document why in PR notes and keep it minimal.

### III. Reusable UI Primitives Over One-Off Markup
Prefer existing UI-kit primitives and shared class constants over repeated ad-hoc class strings.
- Build from `packages/ui/src/components/ui/*` primitives.
- Extract repeated patterns into local constants/utilities before duplicating.
- Public APIs should stay stable unless a breaking change is explicitly approved.

### IV. Accessibility and RTL Are Non-Negotiable
Every shipped UI change must preserve accessibility and internationalization constraints.
- Keyboard access, semantic roles, and visible focus states are required.
- Respect reduced motion and existing ARIA patterns.
- Use logical properties/utilities for directionality and RTL safety.

### V. Test and Verify Before Merge
Behavioral changes must be covered and validated.
- Update/add tests for changed behavior and labels.
- Run relevant package tests before merge.
- Avoid unrelated refactors in the same changeset.

## Implementation Guardrails
- Keep components focused and minimal: no speculative features.
- Prefer composition over deeply nested conditional styling.
- Keep Storybook examples aligned with production component behavior.
- Maintain strict TypeScript and existing linting conventions.

## Governance
This constitution supersedes local stylistic preferences for UI implementation.
- Any deviation requires explicit approval and rationale.
- Reviews must verify token usage, no-inline-style compliance, and accessibility.
- Amendments must include migration guidance when rules change.

**Version**: 1.0.0 | **Ratified**: 2026-03-05 | **Last Amended**: 2026-03-05
