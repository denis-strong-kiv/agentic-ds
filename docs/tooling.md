# Tooling & Shell

---

## Package Manager

**npm only** — never yarn, never bun.

---

## Common Commands

```bash
# Development
npm run dev                              # Start all packages in watch mode
npm run dev --filter=@travel/web        # Start only the Next.js app

# Testing
npm test                                # Run all tests across all packages
npm test --filter=@travel/ui            # Run UI component tests only

# Storybook
npm run storybook                       # Start Storybook on :6006
lsof -ti :6006 | xargs kill -9         # Kill stale Storybook process

# Building
npm run build                           # Build all packages
ANALYZE=true npm run build --filter=@travel/web  # Build + open bundle analyzer

# Type checking
npm run typecheck                       # TypeScript check across all packages

# Token pipeline
cd packages/tokens && npm run build     # Rebuild CSS custom property output

# Cloudflare Worker (legacy, root src/index.ts)
npm run deploy                          # Deploy worker
npm run cf-typegen                      # Regenerate types from wrangler.toml
```

---

## ESLint Enforcement

- `no-restricted-syntax` rules block long inline class token chains in migrated scopes
- As additional repo areas are migrated, expand ESLint scope to cover them
- PRs that introduce new long inline utility chains in component/page/story files should be rejected
