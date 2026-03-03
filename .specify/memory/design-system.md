# Design System Inventory
# Agent context — read before implementing any UI, token, or brand feature.

## Architecture

```
Brand (seed L/C/H + fonts + primitives)
  → generateColorScale() → 11-step ColorScale {light, dark} stored in D1 brands.color_scale
  → SemanticToken (name, tier1RefLight, tier1RefDark, primitiveRef) stored in D1 semantic_tokens
  → ComponentToken (name, semanticToken) stored in D1 component_tokens
  → BrandTokenOverride (brand_id, component_token, semantic_token_override) in D1 brand_token_overrides
  → buildTokenMap() → TokenMap → tokenMapToCSS() → :root{} served from KV (300s TTL)
```

**CSS var derivation (algorithmic — not a lookup table):**
```
semantic token name    →  '--' + name.replace(/\./g, '-')
  color.action.primary →  --color-action-primary

component token name   →  '--sl-' + name.replace(/.default$/, '').replace(/\./g, '-')
  button.background.default →  --sl-button-background
  input.border.focus        →  --sl-input-border-focus

palette step           →  '--palette-brand-{scheme}-{step}'
  light / 500          →  --palette-brand-light-500
```

**Resolution chain in CSS (browser resolves left→right):**
```
--sl-button-background → var(--color-action-primary) → var(--palette-brand-light-500) → oklch(...)
```

---

## Color Scale — Step Reference

| Step | Light L | Dark L  | Intended use |
|------|---------|---------|--------------|
| 50   | 0.98    | 0.12    | Page canvas, input background |
| 100  | 0.95    | 0.20    | Subtle tint, hover on white |
| 200  | 0.90    | 0.28    | Disabled fill, striped rows |
| 300  | 0.82    | 0.36    | Borders, dividers |
| 400  | 0.72    | 0.44    | Placeholder text, muted icons |
| 500  | seed L  | 0.54    | Primary brand color |
| 600  | 0.52    | 0.64    | Hover on primary |
| 700  | 0.42    | 0.74    | Active/pressed state |
| 800  | 0.32    | 0.84    | Dark accent |
| 900  | 0.22    | 0.92    | Body text (light mode) |
| 950  | 0.12    | 0.97    | Dark mode background canvas |

Chroma envelope: `C_step = seedC × sin(targetL × π)` — peaks at mid-scale, fades to near-gray at extremes.

---

## Semantic Token Scopes

Status: ✓ implemented · ○ planned (not yet in D1)

### color.action — interactive elements

| Token | Light step | Dark step | CSS var | Status | Use |
|-------|-----------|----------|---------|--------|-----|
| color.action.primary | 500 | 400 | --color-action-primary | ✓ | Button fill, link color, focus ring |
| color.action.primary.hover | 600 | 500 | --color-action-primary-hover | ○ | Hover state on primary |
| color.action.primary.active | 700 | 600 | --color-action-primary-active | ○ | Pressed/active state |
| color.action.primary.subtle | 100 | 900 | --color-action-primary-subtle | ○ | Ghost button tint, selected row |
| color.action.secondary | 300 | 700 | --color-action-secondary | ○ | Secondary buttons, secondary links |
| color.action.secondary.hover | 400 | 600 | --color-action-secondary-hover | ○ | Hover on secondary |
| color.action.disabled | 200 | 800 | --color-action-disabled | ○ | Disabled interactive elements |

### color.surface — backgrounds and panels

| Token | Light step | Dark step | CSS var | Status | Use |
|-------|-----------|----------|---------|--------|-----|
| color.surface.default | 50 | 950 | --color-surface-default | ✓ | Page canvas, main background |
| color.surface.raised | 100 | 900 | --color-surface-raised | ○ | Cards, panels, sidebars |
| color.surface.overlay | 200 | 800 | --color-surface-overlay | ○ | Modals, drawers, popovers |
| color.surface.sunken | 50 | 950 | --color-surface-sunken | ○ | Input fields, code blocks |
| color.surface.brand | 500 | 500 | --color-surface-brand | ○ | Brand-colored hero sections |

### color.text — typography

| Token | Light step | Dark step | CSS var | Status | Use |
|-------|-----------|----------|---------|--------|-----|
| color.text.primary | 900 | 100 | --color-text-primary | ✓ | Body copy, labels |
| color.text.secondary | 600 | 400 | --color-text-secondary | ○ | Captions, helper text, timestamps |
| color.text.tertiary | 400 | 600 | --color-text-tertiary | ○ | Placeholder text, footnotes |
| color.text.disabled | 300 | 700 | --color-text-disabled | ○ | Disabled labels |
| color.text.inverse | 50 | 950 | --color-text-inverse | ○ | Text on dark/brand surfaces |
| color.text.on.primary | 50 | 950 | --color-text-on-primary | ○ | Text inside primary buttons |
| color.text.link | 500 | 400 | --color-text-link | ○ | Inline anchor text |
| color.text.link.hover | 600 | 500 | --color-text-link-hover | ○ | Hovered link |

### color.border — outlines and dividers

| Token | Light step | Dark step | CSS var | Status | Use |
|-------|-----------|----------|---------|--------|-----|
| color.border.default | 200 | 800 | --color-border-default | ○ | Dividers, card outlines |
| color.border.strong | 300 | 700 | --color-border-strong | ○ | Input borders (resting) |
| color.border.focus | 500 | 400 | --color-border-focus | ○ | Focus ring (keyboard nav) |
| color.border.disabled | 200 | 800 | --color-border-disabled | ○ | Disabled input border |

### color.feedback — status states

Feedback tokens reference a fixed hue, not the brand hue. They are defined with `tier1Ref` steps
drawn from a dedicated per-hue palette, or as literal oklch values via `primitiveRef`.

| Token | CSS var | Status | Use |
|-------|---------|--------|-----|
| color.feedback.success | --color-feedback-success | ○ | Success banners, checkmarks |
| color.feedback.success.surface | --color-feedback-success-surface | ○ | Success alert background |
| color.feedback.error | --color-feedback-error | ○ | Error text, destructive actions |
| color.feedback.error.surface | --color-feedback-error-surface | ○ | Error alert background |
| color.feedback.warning | --color-feedback-warning | ○ | Warning text, caution icons |
| color.feedback.warning.surface | --color-feedback-warning-surface | ○ | Warning alert background |
| color.feedback.info | --color-feedback-info | ○ | Informational text, tips |
| color.feedback.info.surface | --color-feedback-info-surface | ○ | Info alert background |

Note: feedback tokens currently require a `primitiveRef` literal approach since they are
cross-brand fixed hues, not brand-scale references. Implementation pending design decision on
multi-palette support.

### color.overlay — modal/drawer backdrops

| Token | CSS var | Status | Use |
|-------|---------|--------|-----|
| color.overlay.default | --color-overlay-default | ○ | Modal/drawer scrim (rgba) |

---

## Primitive Scopes — Non-Color Tokens

These use `primitiveRef` pointing into the brand's `primitives` object (or PLATFORM_DEFAULTS).

### spacing

Semantic token pattern: `spacing.{role}` → `primitiveRef: "spacing.{key}"`

| Token | Primitive ref | CSS var | Default | Status | Use |
|-------|--------------|---------|---------|--------|-----|
| spacing.content.gap | spacing.base | --spacing-content-gap | 1rem | ○ | Gap between content blocks |
| spacing.component.xs | spacing.scale[0] | --spacing-component-xs | 0.25rem | ○ | Tight internal padding |
| spacing.component.sm | spacing.scale[1] | --spacing-component-sm | 0.5rem | ○ | Small component padding |
| spacing.component.md | spacing.scale[3] | --spacing-component-md | 1rem | ○ | Standard component padding |
| spacing.component.lg | spacing.scale[4] | --spacing-component-lg | 1.5rem | ○ | Large component padding |

Shoelace vars produced: `--sl-spacing-{small,medium,large}` (currently hardcoded from scale indices 1, 3, 4).

### motion

| Token | Primitive ref | CSS var | Default | Status |
|-------|--------------|---------|---------|--------|
| motion.duration.fast | motion.durationFast | --motion-duration-fast | 150ms | ○ |
| motion.duration.base | motion.durationBase | --motion-duration-base | 250ms | ○ |
| motion.duration.slow | motion.durationSlow | --motion-duration-slow | 400ms | ○ |
| motion.easing.standard | motion.easingStandard | --motion-easing-standard | cubic-bezier(0.4,0,0.2,1) | ○ |
| motion.easing.decelerate | motion.easingDecelerate | --motion-easing-decelerate | cubic-bezier(0,0,0.2,1) | ○ |
| motion.easing.accelerate | motion.easingAccelerate | --motion-easing-accelerate | cubic-bezier(0.4,0,1,1) | ○ |

Shoelace vars produced: `--sl-transition-{fast,medium,slow}` (duration + easingStandard combined).

### elevation

| Token | Primitive ref | CSS var | Default | Status |
|-------|--------------|---------|---------|--------|
| elevation.sm | elevation.sm | --sl-shadow-small | 0 1px 2px rgba(0,0,0,0.05) | ○ |
| elevation.md | elevation.md | --sl-shadow-medium | 0 4px 6px rgba(0,0,0,0.07) | ○ |
| elevation.lg | elevation.lg | --sl-shadow-large | 0 10px 15px rgba(0,0,0,0.10) | ○ |
| elevation.xl | elevation.xl | --sl-shadow-xlarge | 0 20px 25px rgba(0,0,0,0.15) | ○ |

### borderRadius

| Token | Primitive ref | CSS var | Default | Status |
|-------|--------------|---------|---------|--------|
| borderRadius.sm | borderRadius.sm | --sl-border-radius-small | 2px | ○ |
| borderRadius.md | borderRadius.md | --sl-border-radius-medium | 4px | ○ |
| borderRadius.lg | borderRadius.lg | --sl-border-radius-large | 8px | ○ |
| borderRadius.xl | borderRadius.xl | --sl-border-radius-xlarge | 16px | ○ |
| borderRadius.full | borderRadius.full | --sl-border-radius-pill | 9999px | ○ |

Note: elevation and borderRadius semantic tokens do not yet exist in D1 — they are resolved
directly from primitives in `buildTokenMap` and written to CSS. Adding them as named semantic
tokens is future work.

---

## Component Token Inventory

### Implemented (✓)

| Component token | → Semantic token | CSS var produced |
|----------------|-----------------|-----------------|
| button.background.default | color.action.primary | --sl-button-background |
| input.border.focus | color.action.primary | --sl-input-border-focus |
| surface.background | color.surface.default | --sl-surface-background |

### Planned (○) — Shoelace surface to wire

Group ordering matches implementation priority. Add semantic tokens first, then component tokens.

**Buttons**
| Component token | → Semantic token (suggested) | CSS var |
|----------------|------------------------------|---------|
| button.background.hover | color.action.primary.hover | --sl-button-background-hover |
| button.background.active | color.action.primary.active | --sl-button-background-active |
| button.color.default | color.text.on.primary | --sl-button-color |
| button.border.default | color.action.primary | --sl-button-border-color |

**Inputs**
| Component token | → Semantic token (suggested) | CSS var |
|----------------|------------------------------|---------|
| input.background.default | color.surface.sunken | --sl-input-background-color |
| input.border.default | color.border.strong | --sl-input-border-color |
| input.color.default | color.text.primary | --sl-input-color |
| input.color.placeholder | color.text.tertiary | --sl-input-placeholder-color |
| input.focus.ring | color.border.focus | --sl-input-focus-ring-color |

**Surface / layout**
| Component token | → Semantic token (suggested) | CSS var |
|----------------|------------------------------|---------|
| surface.color.default | color.text.primary | --sl-color |
| panel.background | color.surface.raised | --sl-panel-background-color |
| panel.border | color.border.default | --sl-panel-border-color |

**Feedback / status**
| Component token | → Semantic token (suggested) | CSS var |
|----------------|------------------------------|---------|
| feedback.success.color | color.feedback.success | --sl-color-success |
| feedback.error.color | color.feedback.error | --sl-color-danger |
| feedback.warning.color | color.feedback.warning | --sl-color-warning |

---

## D1 Schema Summary

| Table | Purpose |
|-------|---------|
| brands | id, displayName, seed L/C/H, fonts, primitives JSON, color_scale JSON, valid_status |
| semantic_tokens | name, tier1_ref_light, tier1_ref_dark, primitive_ref, description |
| component_tokens | name, semantic_token, description |
| brand_token_overrides | brand_id, component_token, semantic_token_override |
| token_validation_log | id, brand_id, run_at, status (pass/fail), errors JSON |

## KV Key Inventory

| Key pattern | TTL | Content |
|-------------|-----|---------|
| brand:{id}:tokens:{scheme} | 300s | {css: string, json: object} |
| brand:{id} | 60s | Brand JSON object |
| brand:{id}:overrides | 60s | Overrides list JSON |
| brands:list | 60s | Paginated brand list (limit=50, no cursor only) |
| brands:ids | — | JSON array of all brand IDs (used for global invalidation) |

Invalidation rules:
- Brand mutation (PUT/DELETE) → deletes brand:{id}, brand:{id}:tokens:*, brand:{id}:overrides, brands:list
- Semantic/component token mutation → deletes tokens:semantic, tokens:components, all brand:{id}:tokens:* for every brand in brands:ids
- Override mutation → deletes brand:{id}:tokens:light, brand:{id}:tokens:dark, brand:{id}:overrides

---

## Routes

| Method | Path | Handler |
|--------|------|---------|
| GET | /brands | handleListBrands |
| POST | /brands | handleCreateBrand |
| GET | /brands/:id | handleGetBrand |
| PUT | /brands/:id | handleUpdateBrand |
| DELETE | /brands/:id | handleDeleteBrand |
| GET | /brands/:id/validate | handleGetValidation |
| GET | /brands/:id/tokens.css | handleGetTokensCss |
| GET | /brands/:id/tokens.json | handleGetTokensJson |
| POST | /brands/:id/overrides | handleCreateOverride |
| GET | /brands/:id/overrides | handleListOverrides |
| DELETE | /brands/:id/overrides/:token | handleDeleteOverride |
| GET | /tokens/semantic | handleListSemanticTokens |
| POST | /tokens/semantic | handleCreateSemanticToken |
| GET | /tokens/semantic/:name | handleGetSemanticToken |
| PUT | /tokens/semantic/:name | handleUpdateSemanticToken |
| DELETE | /tokens/semantic/:name | handleDeleteSemanticToken |
| GET | /tokens/components | handleListComponentTokens |
| POST | /tokens/components | handleCreateComponentToken |
| GET | /tokens/components/:name | handleGetComponentToken |
| PUT | /tokens/components/:name | handleUpdateComponentToken |
| DELETE | /tokens/components/:name | handleDeleteComponentToken |

Route specificity rule: tokens.css / tokens.json MUST be registered before /:id catch-all.

---

## Extension Protocol — Adding New Tokens

### Adding a new semantic token
1. POST /tokens/semantic with name, tier1RefLight, tier1RefDark (or primitiveRef), description
2. Semantic naming: {category}.{role}.{variant} — use existing category prefixes
3. Choose light/dark steps from Scale Reference table by intended use
4. Validation runs automatically for all brands; check /brands/{id}/validate for WCAG failures

### Adding a new component token
1. Identify the Shoelace CSS property: verify in Shoelace docs which --sl-* var controls the property
2. Derive component token name from CSS var: --sl-button-background → button.background.default
3. POST /tokens/components with name, semanticToken, description
4. Token appears in all brand CSS on next uncached request

### Adding a new brand primitive
1. Brand provides override in primitives object on POST/PUT /brands
2. Primitive ref path: dot-separated into the Primitives interface (e.g. borderRadius.md, spacing.base)
3. Semantic tokens with matching primitiveRef pick up the override automatically

### Naming conventions
- Semantic: kebab-scoped dots — `color.action.primary`, `spacing.component.md`
- Component: component.property.state — `button.background.hover`, `input.border.focus`
- State suffixes: default (omitted from CSS var), hover, active, focus, disabled, checked, selected
- Avoid: abbreviations, vendor prefixes, technology names in token names
