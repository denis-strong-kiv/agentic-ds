# API Reference

Base URL (local dev): `http://localhost:8787`

All request bodies are JSON (`Content-Type: application/json`).
All responses are JSON unless noted (token CSS endpoint returns `text/css`).

---

## Brands

### POST /brands — Register a brand

Creates a new brand. Generates the 11-step color scale immediately. Runs token validation
asynchronously (check `/brands/{id}/validate` after ~1–2 seconds).

**Request**

```json
{
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
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `id` | string | yes | `[a-z0-9-]+`, max 64 chars |
| `displayName` | string | yes | Non-empty |
| `seedColor.l` | number | yes | 0–1 |
| `seedColor.c` | number | yes | 0–0.4 |
| `seedColor.h` | number | yes | 0–360 |
| `fonts.display` | string | yes | Non-empty |
| `fonts.heading` | string | yes | Non-empty |
| `fonts.body` | string | yes | Non-empty |
| `primitives` | object | no | See [Primitives](#primitives) |

**Response — 201 Created**

```json
{
  "id": "acme",
  "displayName": "Acme Corp",
  "validStatus": "pending",
  "createdAt": "2026-03-03T10:00:00.000Z"
}
```

`Location` header: `/brands/acme`

**Errors**

| Status | Error code | Cause |
|---|---|---|
| 400 | — | Malformed JSON |
| 409 | `CONFLICT` | Brand with this `id` already exists |
| 422 | `VALIDATION_ERROR` | Field constraint violated |

---

### GET /brands — List all brands

Returns paginated list of brands, newest first.

**Query parameters**

| Param | Default | Description |
|---|---|---|
| `limit` | `50` | Results per page (max 200) |
| `cursor` | — | Pagination cursor from previous response |

**Response — 200 OK**

```json
{
  "brands": [
    { "id": "acme", "displayName": "Acme Corp", "validStatus": "valid", "createdAt": "..." },
    { "id": "globex", "displayName": "Globex", "validStatus": "valid", "createdAt": "..." }
  ],
  "nextCursor": null,
  "total": 2
}
```

`validStatus` values: `"pending"` | `"valid"` | `"invalid"`

---

### GET /brands/{id} — Get brand details

Returns full brand record including seed color, fonts, primitives, and current validation status.

**Response — 200 OK**

```json
{
  "id": "acme",
  "displayName": "Acme Corp",
  "seedColor": { "l": 0.62, "c": 0.18, "h": 240 },
  "fonts": { "display": "Cal Sans", "heading": "Inter", "body": "Inter" },
  "primitives": { "borderRadius": { "md": "6px" }, "motion": { "durationBase": "200ms" } },
  "validStatus": "valid",
  "createdAt": "2026-03-03T10:00:00.000Z",
  "updatedAt": "2026-03-03T10:00:00.000Z"
}
```

**Errors**: 404 if brand not found.

---

### PUT /brands/{id} — Update a brand

Partial update — only include fields you want to change. If `seedColor` is included, the entire
11-step palette is regenerated and `validStatus` resets to `"pending"`.

**Request** (all fields optional)

```json
{
  "displayName": "Acme Corporation",
  "seedColor": { "l": 0.55, "c": 0.22, "h": 120 },
  "fonts": { "body": "Source Sans 3" },
  "primitives": { "borderRadius": { "lg": "12px" } }
}
```

**Response — 200 OK**: Full brand object with updated values.

**Notes**:
- Updating `seedColor` invalidates cached token CSS immediately
- Async re-validation runs in the background — check `/validate` after 1–2s
- `primitives` is merged: you can update one key without resetting others

---

### DELETE /brands/{id} — Delete a brand

Removes the brand and all its overrides. Cached token CSS is invalidated.

**Response — 204 No Content** (empty body)

**Errors**: 404 if brand not found.

---

### GET /brands/{id}/validate — Get validation result

Returns the most recent validation report for the brand.

**Response — 200 OK (validation ran)**

```json
{
  "brandId": "acme",
  "status": "pass",
  "runAt": "2026-03-03T10:00:01.000Z",
  "errors": []
}
```

**Response — 202 Accepted (validation not yet run)**

```json
{
  "brandId": "acme",
  "status": "pending",
  "message": "Validation not yet run"
}
```

**Error object** (when `status: "fail"`):

```json
{
  "code": "CONTRAST_FAIL",
  "foreground": "color.text.primary",
  "background": "color.surface.default",
  "scheme": "dark",
  "actual": 3.8,
  "required": 4.5,
  "message": "WCAG AA contrast failure in dark mode: 3.8:1 < 4.5:1"
}
```

Error `code` values:

| Code | Description |
|---|---|
| `BROKEN_REF` | Semantic token references a step or primitive path that doesn't exist |
| `CIRCULAR_REF` | Token graph contains a cycle |
| `CONTRAST_FAIL` | WCAG AA contrast ratio below 4.5:1 |

---

### POST /brands/{id}/overrides — Add a per-brand component override

Remaps a component token to a different semantic token for this brand only.

**Request**

```json
{
  "componentToken": "button.background.default",
  "semanticTokenOverride": "color.surface.default"
}
```

Both must reference existing tokens. The change takes effect immediately on the next token
resolution request (cached tokens are invalidated).

**Response — 201 Created**

```json
{
  "brandId": "acme",
  "componentToken": "button.background.default",
  "semanticTokenOverride": "color.surface.default",
  "createdAt": "2026-03-03T10:05:00.000Z"
}
```

**Errors**: 409 if override for this component token already exists for this brand.

---

### GET /brands/{id}/overrides — List per-brand overrides

**Response — 200 OK**

```json
{
  "brandId": "acme",
  "overrides": [
    {
      "componentToken": "button.background.default",
      "semanticTokenOverride": "color.surface.default"
    }
  ]
}
```

---

### DELETE /brands/{id}/overrides/{componentToken} — Remove an override

Restores the component token to its platform default semantic mapping.

**Response — 204 No Content**

---

## Token Resolution

### GET /brands/{id}/tokens.css — Resolved CSS

Returns a `:root {}` block of CSS custom properties ready to load in a browser.

**Query parameter**: `scheme=light` | `scheme=dark` (required)

**Response — 200 OK** (`Content-Type: text/css`, `Cache-Control: public, max-age=300`)

```css
:root {
  --palette-brand-light-50: oklch(0.980 0.0113 240.0);
  /* ... all 11 palette steps ... */
  --color-action-primary: var(--palette-brand-light-500);
  /* ... all semantic tokens ... */
  --sl-button-background: var(--color-action-primary);
  /* ... all component tokens, typography, spacing, radius, motion, elevation ... */
}
```

**Errors**

| Status | Cause |
|---|---|
| 400 | Missing or invalid `scheme` parameter |
| 404 | Brand not found |
| 503 | Brand exists but `validStatus` is `"invalid"` or `"pending"` |

**Caching**: Response is cached in Cloudflare KV for 300 seconds. Any brand mutation (PUT, POST
override, DELETE override) invalidates the cache immediately.

---

### GET /brands/{id}/tokens.json — Resolved JSON

Returns the full token map as structured JSON. Useful for inspecting resolved values, feeding into
design tools, or building custom token consumers.

**Query parameter**: `scheme=light` | `scheme=dark` (required)

**Response — 200 OK**

```json
{
  "brandId": "acme",
  "scheme": "light",
  "generatedAt": "2026-03-03T10:00:00.000Z",
  "palette": {
    "50":  "oklch(0.980 0.0113 240.0)",
    "100": "oklch(0.950 0.0225 240.0)",
    "200": "oklch(0.900 0.0450 240.0)",
    "300": "oklch(0.820 0.0788 240.0)",
    "400": "oklch(0.720 0.1136 240.0)",
    "500": "oklch(0.620 0.1800 240.0)",
    "600": "oklch(0.520 0.1439 240.0)",
    "700": "oklch(0.420 0.1136 240.0)",
    "800": "oklch(0.320 0.0788 240.0)",
    "900": "oklch(0.220 0.0450 240.0)",
    "950": "oklch(0.120 0.0225 240.0)"
  },
  "semantic": {
    "color.action.primary":  "oklch(0.620 0.1800 240.0)",
    "color.surface.default": "oklch(0.980 0.0113 240.0)",
    "color.text.primary":    "oklch(0.220 0.0450 240.0)"
  },
  "component": {
    "button.background.default": "oklch(0.980 0.0113 240.0)",
    "input.border.focus":        "oklch(0.620 0.1800 240.0)",
    "surface.background":        "oklch(0.980 0.0113 240.0)"
  },
  "typography": {
    "font.family.display": "\"Cal Sans\", sans-serif",
    "font.family.heading": "\"Inter\", serif",
    "font.family.body":    "\"Inter\", sans-serif"
  },
  "spacing": {
    "spacing.small":  "0.5rem",
    "spacing.medium": "1rem",
    "spacing.large":  "1.5rem"
  },
  "borderRadius": {
    "borderRadius.sm": "2px",
    "borderRadius.md": "6px",
    "borderRadius.lg": "8px",
    "borderRadius.xl": "16px"
  },
  "motion": {
    "motion.durationFast":    "150ms",
    "motion.durationBase":    "200ms",
    "motion.durationSlow":    "400ms",
    "motion.easingStandard":  "cubic-bezier(0.4, 0, 0.2, 1)"
  },
  "elevation": {
    "elevation.sm": "0 1px 2px rgba(0,0,0,0.05)",
    "elevation.md": "0 4px 6px rgba(0,0,0,0.07)",
    "elevation.lg": "0 10px 15px rgba(0,0,0,0.10)"
  }
}
```

---

## Semantic Tokens

Semantic tokens are platform-level — they apply to all brands. Changing a semantic token affects
every brand that uses it.

### POST /tokens/semantic — Create

```json
{
  "name": "color.action.primary",
  "tier1RefLight": "500",
  "tier1RefDark": "400",
  "description": "Primary interactive element color"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | Dot-namespaced: `{category}.{role}.{variant}` |
| `tier1RefLight` | string | one of these two | Step `50`–`950` |
| `tier1RefDark` | string | one of these two | Step `50`–`950` |
| `primitiveRef` | string | or this one | Dot-path like `spacing.base` |
| `description` | string | no | Human-readable purpose |

A semantic token must have either a pair of `tier1Ref*` (color) or a `primitiveRef` (non-color).

**Response — 201 Created**

---

### GET /tokens/semantic — List all semantic tokens

**Response — 200 OK**

```json
{
  "semanticTokens": [
    {
      "name": "color.action.primary",
      "tier1RefLight": "500",
      "tier1RefDark": "400",
      "primitiveRef": null,
      "description": "Primary interactive element color",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "total": 1
}
```

---

### GET /tokens/semantic/{name} — Get one semantic token

---

### PUT /tokens/semantic/{name} — Update

All fields optional. Updates take effect on next token resolution (cache invalidated for all
brands).

---

### DELETE /tokens/semantic/{name} — Delete

Removes the semantic token. Any component tokens that reference it will produce empty values on
next resolution. Run validation on affected brands afterward.

---

## Component Tokens

Component tokens are platform-level mappings from component property names to semantic tokens.

### POST /tokens/components — Create

```json
{
  "name": "button.background.default",
  "semanticToken": "color.action.primary",
  "description": "Button fill in its default resting state"
}
```

The `name` determines the CSS variable: `button.background.default` → `--sl-button-background`
(the `.default` suffix is stripped).

**Response — 201 Created**

---

### GET /tokens/components — List all component tokens

```json
{
  "componentTokens": [
    {
      "name": "button.background.default",
      "semanticToken": "color.action.primary",
      "description": "Button fill in its default resting state",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "total": 3
}
```

---

### GET /tokens/components/{name} — Get one component token

---

### PUT /tokens/components/{name} — Update

---

### DELETE /tokens/components/{name} — Delete

---

## Primitives Object Reference

The `primitives` field on a brand overrides platform defaults for non-color tokens.
All fields are optional — omitted fields inherit platform defaults.

```json
{
  "spacing": {
    "base": "1rem",
    "scale": [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8]
  },
  "borderRadius": {
    "sm":   "2px",
    "md":   "4px",
    "lg":   "8px",
    "xl":   "16px",
    "full": "9999px"
  },
  "motion": {
    "durationFast":       "150ms",
    "durationBase":       "250ms",
    "durationSlow":       "400ms",
    "easingStandard":     "cubic-bezier(0.4, 0, 0.2, 1)",
    "easingDecelerate":   "cubic-bezier(0, 0, 0.2, 1)",
    "easingAccelerate":   "cubic-bezier(0.4, 0, 1, 1)"
  },
  "elevation": {
    "sm": "0 1px 2px rgba(0,0,0,0.05)",
    "md": "0 4px 6px rgba(0,0,0,0.07)",
    "lg": "0 10px 15px rgba(0,0,0,0.10)",
    "xl": "0 20px 25px rgba(0,0,0,0.15)"
  }
}
```

---

## Health Endpoints

| Endpoint | Description |
|---|---|
| `GET /health` | Returns `{ "status": "ok" }` |
| `GET /health/db` | Tests D1 database connectivity |
| `GET /health/kv` | Tests KV store connectivity |
| `GET /health/r2` | Tests R2 storage connectivity |
| `GET /db/test` | Initialises schema (idempotent) + lists all tables |
