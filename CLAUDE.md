# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start local development server (wrangler dev)
npm run deploy       # Deploy to Cloudflare Workers
npm run cf-typegen   # Regenerate Cloudflare TypeScript types from wrangler.toml
```

First-time setup requires `npx wrangler login` to authenticate with Cloudflare.

There is no test runner configured. The `GET /db/test` endpoint initializes the database schema (creates the `items` table if it doesn't exist) and can be used as a smoke test during local dev.

## Architecture

Single-file Cloudflare Worker (`src/index.ts`) with no external runtime dependencies. All logic lives in one file organized into five feature sections.

**Environment bindings** (defined in `wrangler.toml`, typed via the `Env` interface):
- `env.DB` — Cloudflare D1 (SQLite): primary data store for `items`
- `env.KV` — Cloudflare KV: caching layer with 60s TTL, key `items:list`
- `env.BUCKET` — Cloudflare R2: file/object storage

**Routing** is manual URL pattern matching in the `fetch` handler — no router library. The `/items/cached` route must be matched before the `/items/:id` regex; this ordering is intentional and must be preserved.

**Cache invalidation**: `createItem`, `updateItem`, and `deleteItem` all delete the `items:list` KV key. Any new mutation endpoints must do the same.

**Database schema** (created by `GET /db/test`):
```sql
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  data TEXT,
  created_at TEXT NOT NULL
)
```

## TypeScript

`tsconfig.json` enforces `noUnusedLocals` and `noUnusedParameters`. Module resolution is set to `bundler` (Wrangler bundles for the Workers runtime). The `@cloudflare/workers-types` package provides types for `D1Database`, `KVNamespace`, `R2Bucket`, etc. Run `npm run cf-typegen` after changing bindings in `wrangler.toml`.

## Active Technologies
- TypeScript — Cloudflare Workers runtime (V8 isolate, Workers SDK 4.x) + Zero external runtime npm deps. Shoelace (Web Awesome) is the consumer-side UIKit — not bundled into the Worker. (001-multibrand-tokens)
- D1 (`env.DB`) — brands + tokens + validation log; KV (`env.KV`) — resolved token cache (300s TTL); R2 (`env.BUCKET`) — brand assets (out of scope for this feature) (001-multibrand-tokens)

## Recent Changes
- 001-multibrand-tokens: Added TypeScript — Cloudflare Workers runtime (V8 isolate, Workers SDK 4.x) + Zero external runtime npm deps. Shoelace (Web Awesome) is the consumer-side UIKit — not bundled into the Worker.
