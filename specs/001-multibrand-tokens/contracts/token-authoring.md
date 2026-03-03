# Contract: Token Authoring API

**Base paths**: `/tokens/semantic`, `/tokens/components`
**Audience**: Platform operators / design-system developers (internal)

---

## Semantic Tokens

### POST /tokens/semantic — Create a semantic token

**Request (color token)**
```json
{
  "name": "color.action.primary",
  "tier1RefLight": "500",
  "tier1RefDark": "400",
  "description": "Primary interactive element color"
}
```

**Request (non-color token)**
```json
{
  "name": "spacing.content.gap",
  "primitiveRef": "spacing.scale.4",
  "description": "Standard gap between content sections"
}
```

**Fields**
| Field | Type | Required | Rules |
|---|---|---|---|
| `name` | string | ✅ | dot-notation `[a-z][a-z0-9.]*`, unique, max 128 |
| `tier1RefLight` | string | color only | One of: `50 100 200 300 400 500 600 700 800 900 950` |
| `tier1RefDark` | string | color only | Same set as light |
| `primitiveRef` | string | non-color only | Dot-path into `primitives` JSON or platform defaults |
| `description` | string | — | Optional |

Either (`tier1RefLight` + `tier1RefDark`) or `primitiveRef` must be set — not both, not neither.

**Responses**
```
201 Created
{
  "name": "color.action.primary",
  "tier1RefLight": "500",
  "tier1RefDark": "400",
  "description": "Primary interactive element color",
  "createdAt": "2026-03-02T12:00:00Z"
}

409 Conflict      — name already exists
422 Unprocessable — invalid name format or conflicting fields
```

**Side effects**: Deletes `tokens:semantic` KV key.

---

### GET /tokens/semantic — List all semantic tokens

```
200 OK
{
  "tokens": [
    { "name": "color.action.primary", "tier1RefLight": "500", "tier1RefDark": "400" },
    { "name": "spacing.content.gap", "primitiveRef": "spacing.scale.4" }
  ]
}
```

Served from KV (`tokens:semantic`) when available.

---

### GET /tokens/semantic/:name — Get a semantic token

```
200 OK  — token object (same shape as POST response)
404 Not Found
```

---

### PUT /tokens/semantic/:name — Update a semantic token

**Request**: Same shape as POST (all fields optional; only provided fields updated).

```
200 OK  — updated token object
404 Not Found
422 Unprocessable
```

**Side effects**
- Deletes `tokens:semantic` KV key
- **Global brand cache invalidation**: enumerates `brands:ids`, deletes
  `brand:{id}:tokens:light` and `brand:{id}:tokens:dark` for every brand
- Enqueues async validation for all brands (via `ctx.waitUntil`)

---

### DELETE /tokens/semantic/:name — Delete a semantic token

```
204 No Content
404 Not Found
409 Conflict — token is referenced by one or more component tokens (list provided)
{
  "error": "REFERENCED",
  "referencedBy": ["button.background.default", "input.border.focus"]
}
```

---

## Component Tokens

### POST /tokens/components — Create a component token

**Request**
```json
{
  "name": "button.background.default",
  "semanticToken": "color.action.primary",
  "description": "Default button background color"
}
```

**Fields**
| Field | Type | Required | Rules |
|---|---|---|---|
| `name` | string | ✅ | dot-notation, unique, max 128 |
| `semanticToken` | string | ✅ | Must reference an existing semantic token |
| `description` | string | — | Optional |

**Responses**
```
201 Created
{
  "name": "button.background.default",
  "semanticToken": "color.action.primary",
  "createdAt": "2026-03-02T12:00:00Z"
}

409 Conflict
422 Unprocessable — referenced semantic token does not exist
```

**Side effects**: Deletes `tokens:components` KV key. Global brand token cache invalidation.

---

### GET /tokens/components — List all component tokens

```
200 OK
{
  "tokens": [
    {
      "name": "button.background.default",
      "semanticToken": "color.action.primary"
    }
  ]
}
```

Served from KV (`tokens:components`) when available.

---

### GET /tokens/components/:name — Get a component token

```
200 OK  — token object
404 Not Found
```

---

### PUT /tokens/components/:name — Update a component token

```
200 OK  — updated token object
404 Not Found
422 Unprocessable
```

**Side effects**: Same global brand cache invalidation as POST.

---

### DELETE /tokens/components/:name — Delete a component token

```
204 No Content
404 Not Found
409 Conflict — token has per-brand overrides (list brands provided)
```
