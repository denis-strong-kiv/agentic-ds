# Testing

→ See `constitution.md` for the passing test baseline.

---

## Stack

- **Vitest** + **React Testing Library** + `@testing-library/user-event`
- Environment: `jsdom`
- Config: `vitest.config.ts` per package

---

## What to Test

- **Class contracts** — assert semantic classes for variant correctness
  ```ts
  expect(el).toHaveClass('ui-button--primary')
  ```
- **Accessibility attributes** — `aria-label`, `aria-busy`, `role`, `aria-expanded`, etc.
- **Count capping and edge cases** for numeric components (e.g. NotificationBadge)
- **State transitions** — disabled, loading, error states

---

## File Location

- Base UI: `packages/ui/src/components/ui/__tests__/[name].test.tsx`
- Travel: `packages/ui/src/components/travel/__tests__/[name].test.tsx`

---

## Commands

```bash
pnpm test --filter @travel/ui       # Run UI component tests
pnpm test                           # Run all tests across all packages
```

---

## Baseline

All 379+ tests in `@travel/ui` must pass on every commit. Do not skip or comment out failing tests — fix the root cause.
