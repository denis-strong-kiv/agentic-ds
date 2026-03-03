# Multi-Brand Design Token Platform

A Cloudflare Workers API that generates and serves design tokens for multi-brand products.
A single seed color (OKLCH L/C/H) produces a complete 11-step perceptually-uniform color scale
for both light and dark modes. Tokens are served as CSS custom properties that Shoelace
(Web Awesome) reads directly — no build step, no JavaScript.

## Documentation

| Guide | Description |
|---|---|
| [Designer Guide](docs/designer-guide.md) | How the token system works, what controls what, and how to observe output |
| [Color System](docs/color-system.md) | OKLCH color space, scale generation, seed value selection |
| [API Reference](docs/api-reference.md) | All endpoints with request/response schemas |
| [Quickstart](specs/001-multibrand-tokens/quickstart.md) | Step-by-step walkthrough with curl commands |
| [Design System Inventory](.specify/memory/design-system.md) | Token scopes, component mappings, what is implemented vs planned |

## Quick Start

```bash
npm install
npx wrangler login        # first time only
npm run dev               # local Worker at http://localhost:8787
```

Initialise the database schema:

```bash
curl http://localhost:8787/db/test
```

Register a brand:

```bash
curl -X POST http://localhost:8787/brands \
  -H "Content-Type: application/json" \
  -d '{
    "id": "acme",
    "displayName": "Acme Corp",
    "seedColor": { "l": 0.62, "c": 0.18, "h": 240 },
    "fonts": { "display": "Cal Sans", "heading": "Inter", "body": "Inter" }
  }'
```

Get the CSS:

```bash
curl "http://localhost:8787/brands/acme/tokens.css?scheme=light"
```

Apply to a page — Shoelace reads `--sl-*` variables automatically:

```html
<link rel="stylesheet" href="https://your-worker.example.com/brands/acme/tokens.css?scheme=light">
```

## Architecture

```
Seed color (OKLCH)
      │
      ▼
11-step color scale
      │
      ▼
Semantic tokens  ──  Component tokens  ──  Per-brand overrides
      │
      ▼
Resolved CSS / JSON  (KV-cached, 300s TTL)
      │
      ▼
Shoelace --sl-* CSS custom properties
```

**Cloudflare bindings**:
- `DB` — D1 (SQLite): brands, semantic/component tokens, overrides, validation log
- `KV` — KV store: resolved token cache (300s TTL), brand list cache
- `BUCKET` — R2: reserved for brand assets

## Commands

```bash
npm run dev          # Start local dev server
npm run deploy       # Deploy to Cloudflare Workers
npm run cf-typegen   # Regenerate TypeScript types from wrangler.toml
```

## Prerequisites

- Node.js 18+
- npm
- Cloudflare account
- Wrangler CLI (included in dev dependencies)
