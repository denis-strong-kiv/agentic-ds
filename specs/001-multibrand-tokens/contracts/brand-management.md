# Contract: Brand Management API

**Base path**: `/brands`
**Audience**: Platform operators (internal)
**Auth**: Network-level (no per-request auth in v1)

---

## POST /brands — Register a brand

**Request**
```
POST /brands
Content-Type: application/json

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
    "borderRadius": { "md": "6px" }
  }
}
```

**Fields**
| Field | Type | Required | Rules |
|---|---|---|---|
| `id` | string | ✅ | `[a-z0-9-]+`, unique, 1–64 chars |
| `displayName` | string | ✅ | 1–128 chars |
| `seedColor.l` | number | ✅ | [0, 1] |
| `seedColor.c` | number | ✅ | [0, 0.4] |
| `seedColor.h` | number | ✅ | [0, 360) |
| `fonts.display` | string | ✅ | Non-empty |
| `fonts.heading` | string | ✅ | Non-empty |
| `fonts.body` | string | ✅ | Non-empty |
| `primitives` | object | — | Valid JSON, optional categories |

**Responses**
```
201 Created
Location: /brands/acme

{
  "id": "acme",
  "displayName": "Acme Corp",
  "validStatus": "pending",
  "createdAt": "2026-03-02T12:00:00Z"
}
```

```
409 Conflict     — id already exists
422 Unprocessable — validation error (missing fonts, out-of-range OKLCH, etc.)
{
  "error": "VALIDATION_ERROR",
  "details": [
    { "field": "seedColor.l", "message": "Must be between 0 and 1" },
    { "field": "fonts.display", "message": "Required; no platform default" }
  ]
}
```

**Side effects**
- Generates and stores `color_scale` (both light + dark, 11 steps each)
- Sets `valid_status = 'pending'`
- Enqueues async full validation (`ctx.waitUntil`)
- Deletes `brands:list` KV key

---

## GET /brands — List brands (paginated)

**Request**
```
GET /brands?limit=50&cursor=<opaque>
```

**Responses**
```
200 OK
{
  "brands": [
    { "id": "acme", "displayName": "Acme Corp", "validStatus": "valid", "createdAt": "..." },
    { "id": "globex", "displayName": "Globex", "validStatus": "invalid", "createdAt": "..." }
  ],
  "nextCursor": "<opaque>",
  "total": 312
}
```

`limit` default: 50, max: 200. Served from KV (`brands:list`) when available.

---

## GET /brands/:id — Get a brand

**Responses**
```
200 OK
{
  "id": "acme",
  "displayName": "Acme Corp",
  "seedColor": { "l": 0.62, "c": 0.18, "h": 240 },
  "fonts": { "display": "Cal Sans", "heading": "Inter", "body": "Inter" },
  "primitives": { "borderRadius": { "md": "6px" } },
  "validStatus": "valid",
  "createdAt": "2026-03-02T12:00:00Z",
  "updatedAt": "2026-03-02T12:00:00Z"
}

404 Not Found
```

---

## PUT /brands/:id — Update a brand

**Request**: Same shape as POST (all fields optional; only provided fields are updated).

Updating any of `seedColor.*` or `fonts.*` triggers color scale regeneration.

**Responses**
```
200 OK  — updated brand object (same shape as GET)
404 Not Found
422 Unprocessable — validation error
```

**Side effects**
- If seed color changed: regenerates `color_scale`, resets `valid_status = 'pending'`
- Deletes `brand:{id}`, `brand:{id}:tokens:light`, `brand:{id}:tokens:dark` KV keys
- Enqueues async validation

---

## DELETE /brands/:id — Remove a brand

**Responses**
```
204 No Content
404 Not Found
```

**Side effects**
- Cascades to `brand_token_overrides` and `token_validation_log` (FK ON DELETE CASCADE)
- Deletes all KV keys for this brand: `brand:{id}`, `brand:{id}:tokens:light`,
  `brand:{id}:tokens:dark`, `brand:{id}:overrides`
- Removes `id` from `brands:ids` KV list
- Deletes `brands:list` KV key

---

## GET /brands/:id/validate — Get validation report

**Responses**
```
200 OK
{
  "brandId": "acme",
  "status": "invalid",
  "runAt": "2026-03-02T12:01:30Z",
  "errors": [
    {
      "code": "CONTRAST_FAIL",
      "foreground": "color.text.primary",
      "background": "color.surface.default",
      "scheme": "dark",
      "actual": 3.2,
      "required": 4.5,
      "message": "WCAG AA contrast failure in dark mode"
    }
  ]
}

404 Not Found — brand does not exist
202 Accepted  — validation still pending (no log entry yet)
```

---

## POST /brands/:id/overrides — Add a per-brand component token override

**Request**
```json
{
  "componentToken": "button.background.default",
  "semanticTokenOverride": "color.brand.accent"
}
```

**Responses**
```
201 Created
409 Conflict  — override already exists (use PUT)
422 Unprocessable — referenced component or semantic token does not exist
```

**Side effects**: Deletes `brand:{id}:tokens:light`, `brand:{id}:tokens:dark`,
`brand:{id}:overrides` KV keys. Enqueues async validation.

---

## GET /brands/:id/overrides — List per-brand overrides

```
200 OK
{
  "brandId": "acme",
  "overrides": [
    {
      "componentToken": "button.background.default",
      "semanticTokenOverride": "color.brand.accent"
    }
  ]
}
```

---

## DELETE /brands/:id/overrides/:componentToken — Remove an override

```
204 No Content
404 Not Found
```

**Side effects**: Same KV invalidation as POST override.
