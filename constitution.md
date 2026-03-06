# Travel Design System — Constitution

Project-wide rules for Claude Code. Read `docs/` files as needed per task.

---

## Project Overview

Multi-brand travel design system monorepo — component library, token engine, Storybook, and Next.js reference app. Four brands, light/dark modes, full RTL (Arabic) support.

## Status

- Branch: `feature/specify`
- Tests: 379+ passing in `@travel/ui` — must stay green on every commit
- Components: directory-per-component structure (`ui/[name]/index.ts`)

## Key Paths

```
packages/ui/src/components/ui/        # Base UI components
packages/ui/src/components/travel/    # Travel domain components
packages/ui/src/styles/components.css # CSS layer entry point
packages/tokens/src/definitions/      # Token source — edit here, then rebuild
packages/storybook/stories/           # Stories
apps/web/app/[locale]/                # Next.js pages
docs/                                 # Detailed rules
```

## Critical Rules

1. **Design system only** — no hardcoded hex, px, rgba, ms, or cubic-bezier. → `docs/components.md`
2. **RTL** — logical properties only (`ms-*`, `me-*`, `ps-*`, `pe-*`). Never `ml-*`/`mr-*`. → `docs/components.md`
3. **UI kit first** — check `ui/` and `travel/` before writing raw HTML. → `docs/components.md`
4. **Semantic class contracts** — no long utility chains in TSX; styling lives in CSS. → `docs/components.md`
5. **Named exports, kebab-case files, PascalCase exports, directory-per-component.**
6. **Tests must pass** — fix root cause, never skip. → `docs/tests.md`

---

## Docs Index

| Task | Read |
|---|---|
| New component | `docs/components.md`, `docs/storybook.md`, `docs/tests.md` |
| Styling / migration | `docs/components.md` |
| Writing stories | `docs/storybook.md` |
| Figma implementation | `docs/figma.md`, `docs/components.md` |
| Testing | `docs/tests.md` |
| Tooling / debug | `docs/tooling.md` |
| Architecture / stack | `docs/architecture.md` |
