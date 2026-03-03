# Quickstart: Multi-Brand Design Token Platform

**Feature**: `001-multibrand-tokens`
**Date**: 2026-03-02

This guide validates the platform end-to-end: schema init → brand registration → token authoring
→ resolution → Shoelace integration.

---

## Prerequisites

```bash
npm install           # install dependencies
npx wrangler login    # authenticate (first time only)
npm run dev           # start local Worker at http://localhost:8787
```

---

## Step 1 — Initialise the Database Schema

```bash
curl http://localhost:8787/db/test
# Expected: { "status": "ok", "tables": ["brands", "semantic_tokens", "component_tokens", ...] }
```

This creates all 5 tables idempotently. Safe to call multiple times.

---

## Step 2 — Author Semantic Tokens

Semantic tokens are platform-level (shared across all brands). Create the core set first.

```bash
# Color semantic tokens
curl -X POST http://localhost:8787/tokens/semantic \
  -H "Content-Type: application/json" \
  -d '{
    "name": "color.action.primary",
    "tier1RefLight": "500",
    "tier1RefDark": "400",
    "description": "Primary interactive element color"
  }'

curl -X POST http://localhost:8787/tokens/semantic \
  -H "Content-Type: application/json" \
  -d '{
    "name": "color.surface.default",
    "tier1RefLight": "50",
    "tier1RefDark": "950",
    "description": "Default page/panel background"
  }'

curl -X POST http://localhost:8787/tokens/semantic \
  -H "Content-Type: application/json" \
  -d '{
    "name": "color.text.primary",
    "tier1RefLight": "900",
    "tier1RefDark": "100",
    "description": "Primary body text"
  }'

# Non-color semantic token
curl -X POST http://localhost:8787/tokens/semantic \
  -H "Content-Type: application/json" \
  -d '{
    "name": "spacing.content.gap",
    "primitiveRef": "spacing.base",
    "description": "Standard gap between content blocks"
  }'
```

---

## Step 3 — Author Component Tokens

Component tokens are also platform-level. They map Shoelace's CSS variable surface to semantic
tokens.

```bash
curl -X POST http://localhost:8787/tokens/components \
  -H "Content-Type: application/json" \
  -d '{
    "name": "button.background.default",
    "semanticToken": "color.action.primary"
  }'

curl -X POST http://localhost:8787/tokens/components \
  -H "Content-Type: application/json" \
  -d '{
    "name": "input.border.focus",
    "semanticToken": "color.action.primary"
  }'

curl -X POST http://localhost:8787/tokens/components \
  -H "Content-Type: application/json" \
  -d '{
    "name": "surface.background",
    "semanticToken": "color.surface.default"
  }'
```

---

## Step 4 — Register a Brand

```bash
curl -X POST http://localhost:8787/brands \
  -H "Content-Type: application/json" \
  -d '{
    "id": "acme",
    "displayName": "Acme Corp",
    "seedColor": { "l": 0.62, "c": 0.18, "h": 240 },
    "fonts": {
      "display": "Cal Sans",
      "heading": "Inter",
      "body": "Inter"
    },
    "primitives": {
      "borderRadius": { "md": "6px" },
      "motion": { "durationBase": "200ms" }
    }
  }'

# Expected: 201 Created, validStatus: "pending"
```

Wait ~1–2 seconds for async validation to complete, then check:

```bash
curl http://localhost:8787/brands/acme/validate
# Expected: { "status": "valid", "errors": [] }
```

---

## Step 5 — Resolve Tokens

```bash
# CSS output (light mode)
curl http://localhost:8787/brands/acme/tokens.css?scheme=light
# Expected: text/css with --palette-brand-light-* and --sl-* variables

# CSS output (dark mode)
curl http://localhost:8787/brands/acme/tokens.css?scheme=dark

# JSON output
curl http://localhost:8787/brands/acme/tokens.json?scheme=light
```

---

## Step 6 — Add a Per-Brand Override

```bash
# Acme wants its button background to use a different semantic token
curl -X POST http://localhost:8787/brands/acme/overrides \
  -H "Content-Type: application/json" \
  -d '{
    "componentToken": "button.background.default",
    "semanticTokenOverride": "color.surface.default"
  }'

# Verify override took effect
curl http://localhost:8787/brands/acme/tokens.json?scheme=light | \
  jq '.component["button.background.default"]'
# Should return the surface.default value, not the action.primary value
```

---

## Step 7 — Register a Second Brand

Verify brand isolation:

```bash
curl -X POST http://localhost:8787/brands \
  -H "Content-Type: application/json" \
  -d '{
    "id": "globex",
    "displayName": "Globex",
    "seedColor": { "l": 0.55, "c": 0.22, "h": 30 },
    "fonts": {
      "display": "Playfair Display",
      "heading": "Playfair Display",
      "body": "Source Sans 3"
    }
  }'

# Verify different color scales
curl http://localhost:8787/brands/acme/tokens.css?scheme=light | grep "500"
curl http://localhost:8787/brands/globex/tokens.css?scheme=light | grep "500"
# The oklch() values must differ
```

---

## Step 8 — Integrate with Shoelace

In an HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- 1. Load brand tokens FIRST -->
  <link rel="stylesheet" href="http://localhost:8787/brands/acme/tokens.css?scheme=light">

  <!-- 2. Load Shoelace (uses the CSS variables defined above) -->
  <link rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.x/dist/themes/light.css">
  <script type="module"
    src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.x/dist/shoelace.js">
  </script>
</head>
<body>
  <sl-button variant="primary">Acme Branded Button</sl-button>
  <sl-input label="Name" placeholder="Enter your name"></sl-input>
</body>
</html>
```

Change `acme` to `globex` in the `<link>` href — the entire visual identity switches without
touching the component markup.

---

## Validation Checklist

- [ ] `GET /db/test` returns `{ "status": "ok" }` with all 5 table names
- [ ] `POST /brands` with valid OKLCH + 3 fonts → 201 Created
- [ ] `POST /brands` with out-of-range `seed_l` → 422 with field error
- [ ] `POST /brands` with missing `fonts.body` → 422 with field error
- [ ] `POST /brands` with duplicate `id` → 409 Conflict
- [ ] `GET /brands/acme/validate` after 2s → `{ "status": "valid" }`
- [ ] `GET /brands/acme/tokens.css?scheme=light` → `text/css`, contains `--palette-brand-light-500`
- [ ] `GET /brands/acme/tokens.css?scheme=dark` → different `--palette-brand-*` values
- [ ] `GET /brands/globex/tokens.css?scheme=light` → different values from Acme
- [ ] Second request to same token URL → served from KV (verify via response time < 10ms)
- [ ] `PUT /brands/acme` with new seed color → subsequent token resolution reflects new palette
- [ ] `DELETE /brands/acme` → 204, subsequent resolution returns 404
