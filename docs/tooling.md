# Tooling & Shell

---

## Package Manager

**pnpm only** — never npm, never yarn, never bun.

---

## Common Commands

```bash
# Development
pnpm dev                                 # Start all packages in watch mode
pnpm dev --filter @travel/web           # Start only the Next.js app

# Testing
pnpm test                                # Run all tests across all packages
pnpm test --filter @travel/ui           # Run UI component tests only

# Storybook
pnpm storybook                           # Start Storybook on :6006
lsof -ti :6006 | xargs kill -9          # Kill stale Storybook process

# Building
pnpm build                               # Build all packages
ANALYZE=true pnpm build --filter @travel/web  # Build + open bundle analyzer

# Type checking
pnpm typecheck                           # TypeScript check across all packages

# Token pipeline
cd packages/tokens && pnpm build        # Rebuild CSS custom property output

# Cloudflare Worker (legacy, root src/index.ts)
pnpm deploy                              # Deploy worker
pnpm cf-typegen                          # Regenerate types from wrangler.toml
```

---

## ESLint Enforcement

- `no-restricted-syntax` rules block long inline class token chains in migrated scopes
- As additional repo areas are migrated, expand ESLint scope to cover them
- PRs that introduce new long inline utility chains in component/page/story files should be rejected
