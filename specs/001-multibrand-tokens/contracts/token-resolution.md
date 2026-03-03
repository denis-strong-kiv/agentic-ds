# Contract: Token Resolution API

**Base path**: `/brands/:id/tokens`
**Audience**: Consumer applications (front-end, CI pipelines, design tools)
**Hot path**: KV-cached; D1 queried only on cache miss

---

## GET /brands/:id/tokens.css — Serve resolved tokens as CSS custom properties

**Request**
```
GET /brands/acme/tokens.css?scheme=light
Accept: text/css
```

**Query parameters**
| Param | Values | Default | Description |
|---|---|---|---|
| `scheme` | `light` \| `dark` | `light` | Color scheme to resolve |

**Responses**

```
200 OK
Content-Type: text/css
Cache-Control: public, max-age=300

:root {
  /* ── Generated color scale ───────────────────────────────── */
  --palette-brand-light-50:  oklch(0.98 0.04 240);
  --palette-brand-light-100: oklch(0.95 0.07 240);
  --palette-brand-light-200: oklch(0.90 0.10 240);
  --palette-brand-light-300: oklch(0.82 0.13 240);
  --palette-brand-light-400: oklch(0.72 0.16 240);
  --palette-brand-light-500: oklch(0.62 0.18 240);
  --palette-brand-light-600: oklch(0.52 0.16 240);
  --palette-brand-light-700: oklch(0.42 0.13 240);
  --palette-brand-light-800: oklch(0.32 0.09 240);
  --palette-brand-light-900: oklch(0.22 0.05 240);
  --palette-brand-light-950: oklch(0.12 0.03 240);

  /* ── Semantic tokens ─────────────────────────────────────── */
  --color-action-primary:    var(--palette-brand-light-500);
  --color-surface-default:   var(--palette-brand-light-50);
  --color-text-primary:      var(--palette-brand-light-900);

  /* ── Component tokens ────────────────────────────────────── */
  --sl-button-background:    var(--color-action-primary);
  --sl-input-border-color:   var(--color-action-primary);

  /* ── Typography ──────────────────────────────────────────── */
  --sl-font-sans:            "Cal Sans", sans-serif;
  --sl-font-serif:           "Inter", serif;
  --sl-font-mono:            ui-monospace, monospace;

  /* ── Spacing ─────────────────────────────────────────────── */
  --sl-spacing-small:        0.5rem;
  --sl-spacing-medium:       1rem;
  --sl-spacing-large:        1.5rem;

  /* ── Border radius ───────────────────────────────────────── */
  --sl-border-radius-small:  2px;
  --sl-border-radius-medium: 6px;
  --sl-border-radius-large:  12px;

  /* ── Motion ──────────────────────────────────────────────── */
  --sl-transition-fast:      150ms cubic-bezier(0.4, 0, 0.2, 1);
  --sl-transition-medium:    250ms cubic-bezier(0.4, 0, 0.2, 1);
  --sl-transition-slow:      400ms cubic-bezier(0.4, 0, 0.2, 1);

  /* ── Elevation ───────────────────────────────────────────── */
  --sl-shadow-small:         0 1px 2px rgba(0,0,0,0.05);
  --sl-shadow-medium:        0 4px 6px rgba(0,0,0,0.07);
  --sl-shadow-large:         0 10px 15px rgba(0,0,0,0.10);
}
```

**Error responses**
```
404 Not Found    — brand id does not exist
400 Bad Request  — invalid scheme value
422 Unprocessable — brand valid_status is 'invalid'
{
  "error": "INVALID_TOKEN_SET",
  "brandId": "acme",
  "validationReport": "/brands/acme/validate"
}
503 Service Unavailable — brand valid_status is 'pending'
{
  "error": "VALIDATION_PENDING",
  "brandId": "acme"
}
```

**Caching behaviour**
- KV key: `brand:{id}:tokens:{scheme}` (300s TTL)
- `Cache-Control: public, max-age=300` on the HTTP response
- On KV miss: builds response from D1, writes to KV, returns result
- CSS variable names use `--sl-*` prefix for Shoelace compatibility

---

## GET /brands/:id/tokens.json — Serve resolved tokens as JSON

**Request**
```
GET /brands/acme/tokens.json?scheme=dark
Accept: application/json
```

**Response**
```
200 OK
Content-Type: application/json

{
  "brandId": "acme",
  "scheme": "dark",
  "generatedAt": "2026-03-02T12:00:00Z",
  "palette": {
    "50":  "oklch(0.12 0.03 240)",
    "100": "oklch(0.20 0.05 240)",
    ...
    "950": "oklch(0.97 0.02 240)"
  },
  "semantic": {
    "color.action.primary": "oklch(0.64 0.18 240)",
    "color.surface.default": "oklch(0.12 0.02 240)"
  },
  "component": {
    "button.background.default": "oklch(0.64 0.18 240)"
  },
  "typography": {
    "font.family.display": "\"Cal Sans\", sans-serif",
    "font.family.heading": "\"Inter\", sans-serif",
    "font.family.body": "\"Inter\", sans-serif"
  },
  "spacing": { ... },
  "borderRadius": { ... },
  "motion": { ... },
  "elevation": { ... }
}
```

Same KV cache as the CSS endpoint (stored together in one KV value; the response format is selected
server-side). Same error responses apply.

---

## Resolution Algorithm (for implementation reference)

```
1. KV lookup: brand:{id}:tokens:{scheme}
   HIT  → parse cached value, return appropriate format (CSS or JSON)
   MISS → continue

2. D1 batch (single round-trip):
   a. SELECT id, valid_status, color_scale, font_*, primitives FROM brands WHERE id = ?
   b. Hot-path join query (see data-model.md)

3. If valid_status ≠ 'valid' → return 422/503

4. Build token map:
   - Parse color_scale[scheme] JSON
   - For each component token row: resolve the effective semantic → tier1 ref → color scale step
   - Merge brand primitives with platform defaults
   - Apply per-brand component overrides (already included in the JOIN result)

5. Serialize to CSS string and JSON object

6. Write to KV: brand:{id}:tokens:{scheme}, TTL 300s

7. Return response
```

---

## Integration Guide for Consumer Applications

**Inject tokens before first render (HTML `<head>`):**
```html
<link rel="stylesheet"
      href="https://your-worker.example.com/brands/acme/tokens.css?scheme=light">
```

**Dynamic scheme switching (JavaScript):**
```js
async function applyBrandScheme(brandId, scheme) {
  const existing = document.getElementById('brand-tokens');
  if (existing) existing.remove();

  const link = document.createElement('link');
  link.id = 'brand-tokens';
  link.rel = 'stylesheet';
  link.href = `/brands/${brandId}/tokens.css?scheme=${scheme}`;
  document.head.appendChild(link);
}
```

**Using with Shoelace's `<sl-theme>` wrapper:**
```html
<!-- Load brand tokens first, then Shoelace -->
<link rel="stylesheet" href="/brands/acme/tokens.css?scheme=light">
<script type="module" src="/shoelace/dist/shoelace.js"></script>

<sl-button>Themed Button</sl-button>
```
