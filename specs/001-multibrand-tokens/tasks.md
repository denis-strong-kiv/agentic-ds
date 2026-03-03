---

description: "Task list for Multi-Brand Design Token Platform"
---

# Tasks: Multi-Brand Design Token Platform

**Input**: Design documents from `/specs/001-multibrand-tokens/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/ ✅ quickstart.md ✅

**Tests**: No test tasks — not requested in feature specification.

**Organization**: Tasks grouped by user story. Each story is independently implementable and
testable. No story requires another story to be complete before starting (only the Foundational
phase blocks all stories).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete sibling tasks)
- **[Story]**: User story this task belongs to (US1–US4)
- All file paths are relative to repository root

## Path Conventions

Single project layout (per plan.md):
```
src/index.ts          src/router.ts         src/types.ts
src/color/oklch.ts
src/brands/handler.ts src/brands/service.ts
src/tokens/handler.ts src/tokens/resolver.ts src/tokens/validator.ts
src/db/schema.ts
```

---

## Phase 1: Setup

**Purpose**: Create the multi-file source structure and shared foundation types

- [X] T001 Create subdirectories src/color/, src/brands/, src/tokens/, src/db/ and stub files: src/router.ts, src/types.ts, src/color/oklch.ts, src/brands/handler.ts, src/brands/service.ts, src/tokens/handler.ts, src/tokens/resolver.ts, src/tokens/validator.ts, src/db/schema.ts (each stub exports an empty object or placeholder function)
- [X] T002 Define all shared TypeScript interfaces in src/types.ts: `Brand`, `BrandInput`, `SemanticToken`, `ComponentToken`, `Override`, `ValidationError`, `ValidationReport`, `TokenMap`, `ColorScale`, `ColorStep` — reference data-model.md for field names and types; re-export `Env` augmented with `DB: D1Database`, `KV: KVNamespace`, `BUCKET: R2Bucket`
- [X] T003 [P] Implement URL pattern matching helpers in src/router.ts: `matchRoute(method, pathname, pattern): params | null` using regex extraction; export `routes` type for the dispatch table used in src/index.ts
- [X] T004 [P] Refactor src/index.ts fetch handler to pure URL dispatch: import handler modules (brands, tokens), build dispatch table in specificity order per plan.md Route Map, delegate all matched routes; preserve existing /items/... routes unchanged

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: D1 schema + OKLCH math must be complete before any user story can be implemented

**⚠️ CRITICAL**: No user story work begins until this phase is complete

- [X] T005 Implement D1 schema in src/db/schema.ts: write `CREATE TABLE IF NOT EXISTS` SQL for all 5 tables (brands, semantic_tokens, component_tokens, brand_token_overrides, token_validation_log) and all 5 indexes per data-model.md; export `createSchema(db: D1Database): Promise<void>` that runs all statements idempotently via `db.batch()`
- [X] T006 [P] Implement GET /db/test smoke-test endpoint in src/index.ts: call `createSchema(env.DB)`, then query `sqlite_master` to list created table names, return `{ status: "ok", tables: [...] }` — extends existing pattern per CLAUDE.md
- [X] T007 [P] Implement OKLCH ↔ sRGB math primitives in src/color/oklch.ts: `oklchToSrgb(L,C,H)→{r,g,b}`, `srgbToOklch(r,g,b)→{L,C,H}`, `gammaToLinear(c)→number`, `linearToGamma(c)→number` — use Björn Ottosson M1/M2 matrix constants and IEC 61966-2-1 transfer function; all values clamped to [0,1] on sRGB output
- [X] T008 Implement color scale generation in src/color/oklch.ts (depends on T007): `clampChroma(L,C,H)→{L,C,H}` via 20-iteration binary search, `relativeLuminance(r,g,b)→number` (WCAG BT.709 coefficients), `wcagContrastRatio(L1,L2)→number`, `generateColorScale(seedL,seedC,seedH)→{light:ColorScale, dark:ColorScale}` — 11 steps [50,100…950], sinusoidal chroma envelope `C_i = seedC × sin(L_i × π)`, light L-targets [0.98,0.95,0.90,0.82,0.72,0.62,0.52,0.42,0.32,0.22,0.12], dark targets reversed; clamp each step to sRGB gamut; return as `oklch(L C H)` strings

**Checkpoint**: Schema created, OKLCH math verified — user story phases can begin in parallel

---

## Phase 3: User Story 1 - Platform Operator Registers a Brand (Priority: P1) 🎯 MVP

**Goal**: Platform operators can register, retrieve, update, and delete brands at runtime. Each brand stores a pre-computed light+dark color scale derived from its OKLCH seed. Registration, retrieval, and deletion are all available without redeployment.

**Independent Test**: `POST /brands` with valid seed + 3 fonts → 201; `GET /brands/acme/tokens.css?scheme=light` contains `--palette-brand-light-500`; `GET /brands/acme/tokens.css?scheme=dark` contains different values; second GET is served from KV in < 10ms.

### Implementation for User Story 1

- [X] T009 [US1] Implement input validation in src/brands/service.ts: `validateBrandInput(input: BrandInput): ValidationError[]` — check id matches `[a-z0-9-]+` (1–64 chars), `seedColor.l` ∈ [0,1], `seedColor.c` ∈ [0,0.4], `seedColor.h` ∈ [0,360), all three font families non-empty strings; return array of field-level errors (empty = valid)
- [X] T010 [US1] Implement brand D1 persistence in src/brands/service.ts: `insertBrand(db, brand: Brand): Promise<void>` (D1 INSERT into brands table), `getBrandFromDb(db, id): Promise<Brand | null>` (SELECT with all columns), `updateBrandInDb(db, id, patch): Promise<void>` (UPDATE only provided fields), `deleteBrandFromDb(db, id): Promise<void>` (DELETE, cascades via FK)
- [X] T011 [US1] Implement KV cache helpers in src/brands/service.ts: `getBrandFromKV(kv, id)→Brand|null`, `setBrandKV(kv, id, brand)→void` (TTL 60s, key `brand:{id}`), `invalidateBrandKV(kv, id)→void` (delete `brand:{id}`, `brand:{id}:tokens:light`, `brand:{id}:tokens:dark`, `brand:list`), `addBrandToIdsList(kv, id)→void` (append to JSON array at `brands:ids`), `removeBrandFromIdsList(kv, id)→void`
- [X] T012 [US1] Implement `registerBrand` in src/brands/service.ts: validate input (T009), call `generateColorScale` (T008), build Brand record, call `insertBrand` (T010), call `addBrandToIdsList` (T011), call `setBrandKV` (T011); throw on validation errors
- [X] T013 [US1] Implement POST /brands in src/brands/handler.ts: parse JSON body, call `registerBrand`, on success return 201 with `Location: /brands/{id}` header and brand JSON (validStatus: "pending"); on validation error return 422 with `{ error: "VALIDATION_ERROR", details: [...] }`; on duplicate id return 409
- [X] T014 [US1] Implement GET /brands (list) in src/brands/handler.ts: parse `limit` (default 50, max 200) and `cursor` query params; check KV `brands:list` for cached response; on miss query D1 `SELECT id, display_name, valid_status, created_at FROM brands ORDER BY created_at DESC LIMIT ? OFFSET ?`; write result to KV (TTL 60s); return paginated JSON per contract
- [X] T015 [US1] Implement GET /brands/:id in src/brands/handler.ts: check KV `brand:{id}`; on miss query D1 via `getBrandFromDb`; write to KV on miss; return full brand JSON or 404
- [X] T016 [US1] Implement PUT /brands/:id in src/brands/handler.ts: validate patched fields, if `seedColor.*` changed call `generateColorScale` and update `color_scale` + reset `valid_status = 'pending'`, call `updateBrandInDb`, call `invalidateBrandKV`; return updated brand JSON or 404/422
- [X] T017 [US1] Implement DELETE /brands/:id in src/brands/handler.ts: call `deleteBrandFromDb` (cascades to overrides and validation_log), call `invalidateBrandKV`, call `removeBrandFromIdsList`; return 204 or 404

**Checkpoint**: Brand CRUD fully functional. `POST /brands` + `GET /brands/:id` + `DELETE /brands/:id` all working with KV caching.

---

## Phase 4: User Story 2 - Three-Tier Token Authoring (Priority: P2)

**Goal**: Developers can author shared semantic and component token definitions. Per-brand component token overrides are supported. Changes to shared definitions invalidate all affected brand token caches.

**Independent Test**: `POST /tokens/semantic` with valid color refs → 201; `POST /tokens/components` referencing that semantic token → 201; `POST /brands/acme/overrides` overriding a component token → 201; `GET /brands/globex/tokens.css` is NOT affected by Acme's override.

### Implementation for User Story 2

- [X] T018 [US2] Implement semantic token D1 persistence in src/tokens/handler.ts: `insertSemanticToken`, `getSemanticToken`, `listSemanticTokens`, `updateSemanticToken`, `deleteSemanticToken` — all operate on `semantic_tokens` table; `delete` checks FK references in `component_tokens` and returns 409 with `referencedBy` list if any exist
- [X] T019 [US2] Implement POST /tokens/semantic in src/tokens/handler.ts: validate name format (`[a-z][a-z0-9.]*`, max 128), validate mutual exclusivity (tier1 refs XOR primitive_ref), validate tier1 ref values in `['50','100','200','300','400','500','600','700','800','900','950']`, call `insertSemanticToken`, delete KV `tokens:semantic`; return 201 or 409/422
- [X] T020 [US2] Implement GET /tokens/semantic, GET /tokens/semantic/:name, PUT /tokens/semantic/:name, DELETE /tokens/semantic/:name in src/tokens/handler.ts: list served from KV `tokens:semantic` (TTL 600s); PUT/DELETE invalidate `tokens:semantic` KV; DELETE checks refs before deleting
- [X] T021 [US2] Implement global brand cache invalidation in src/brands/service.ts: `invalidateAllBrandTokenCaches(kv): Promise<void>` — read `brands:ids` JSON array from KV, for each id delete `brand:{id}:tokens:light` and `brand:{id}:tokens:dark`; call from semantic/component token mutating endpoints via `ctx.waitUntil()`
- [X] T022 [US2] Implement component token D1 persistence in src/tokens/handler.ts: `insertComponentToken`, `getComponentToken`, `listComponentTokens`, `updateComponentToken`, `deleteComponentToken` — all operate on `component_tokens` table; insert/update validates FK to `semantic_tokens`; delete checks for per-brand overrides and returns 409 if any exist
- [X] T023 [US2] Implement POST/GET/GET:name/PUT/DELETE /tokens/components in src/tokens/handler.ts: same pattern as semantic tokens; list served from KV `tokens:components` (TTL 600s); all mutations delete `tokens:components` KV and call `invalidateAllBrandTokenCaches`
- [X] T024 [US2] Implement POST /brands/:id/overrides in src/brands/handler.ts: validate `componentToken` exists in `component_tokens`, validate `semanticTokenOverride` exists in `semantic_tokens`, INSERT into `brand_token_overrides`, call `invalidateBrandKV` (only this brand); return 201 or 409 (duplicate) / 422 (invalid refs)
- [X] T025 [US2] Implement GET /brands/:id/overrides in src/brands/handler.ts: check KV `brand:{id}:overrides` (TTL 60s); on miss SELECT from `brand_token_overrides WHERE brand_id = ?`; write to KV; return override list or 404
- [X] T026 [US2] Implement DELETE /brands/:id/overrides/:token in src/brands/handler.ts: DELETE from `brand_token_overrides WHERE brand_id = ? AND component_token = ?`, call `invalidateBrandKV`; return 204 or 404
- [X] T027 [US2] Register all token authoring routes and override routes in src/index.ts dispatch table (per plan.md Route Map specificity order)

**Checkpoint**: Full three-tier token authoring works. Semantic + component token CRUD operational. Per-brand overrides apply to one brand only. Shared token mutations invalidate all brand caches.

---

## Phase 5: User Story 3 - Token Validation & Audit (Priority: P3)

**Goal**: A developer can trigger or retrieve a validation report for any brand's token set. The report identifies WCAG AA contrast failures (both schemes), broken tier-1 references, and circular token references.

**Independent Test**: Register a brand whose seed color produces a semantic pair failing WCAG AA in dark mode. Call `GET /brands/:id/validate`. Verify the report contains a `CONTRAST_FAIL` error with `scheme: "dark"`, actual ratio, and required ratio.

### Implementation for User Story 3

- [X] T028 [US3] Implement `loadBrandTokenGraph` in src/tokens/validator.ts: given `brandId` and `db`, run the hot-path D1 JOIN query from data-model.md (component_tokens LEFT JOIN brand_token_overrides JOIN semantic_tokens), fetch brand's `color_scale` JSON and `primitives` JSON; return `BrandTokenGraph` object containing all resolved data needed for validation
- [X] T029 [US3] Implement broken reference detection in src/tokens/validator.ts: `checkBrokenRefs(graph): ValidationError[]` — for each semantic token with `tier1_ref_light`/`tier1_ref_dark`, verify the ref value is in `['50','100',…,'950']`; for each semantic token with `primitive_ref`, verify the dot-path resolves in brand primitives or platform defaults; return `BROKEN_REF` errors
- [X] T030 [US3] Implement circular reference detection in src/tokens/validator.ts: `checkCircularRefs(graph): ValidationError[]` — build adjacency map of component→semantic→primitive, run DFS cycle detection; return `CIRCULAR_REF` errors with the cycle path array
- [X] T031 [US3] Implement WCAG AA contrast checker in src/tokens/validator.ts: `checkContrast(graph, colorScale): ValidationError[]` — for each semantic token that has both `tier1_ref_light` and `tier1_ref_dark`, resolve the OKLCH string from `colorScale`, convert via `oklchToSrgb` + `relativeLuminance` (from src/color/oklch.ts); for designated foreground+background pairs verify `wcagContrastRatio ≥ 4.5` in both light and dark scheme; return `CONTRAST_FAIL` errors with `actual`, `required`, `scheme` fields
- [X] T032 [US3] Implement `validateBrandTokenSet` orchestrator in src/tokens/validator.ts: call `loadBrandTokenGraph`, run `checkBrokenRefs`, `checkCircularRefs`, `checkContrast` in sequence, aggregate errors; INSERT result into `token_validation_log` (UUID id, brand_id, run_at, status 'pass'|'fail', errors JSON); UPDATE `brands.valid_status` to 'valid' or 'invalid'; export as the single entry point for async validation
- [X] T033 [US3] Wire async validation via `ctx.waitUntil()` in src/brands/handler.ts and src/tokens/handler.ts: after every mutation that affects a brand's token set (POST/PUT brand, POST/PUT/DELETE semantic token, POST/PUT/DELETE component token, POST/DELETE override), call `ctx.waitUntil(validateBrandTokenSet(env.DB, brandId))` — for shared token mutations enqueue validation for all brands in `brands:ids`
- [X] T034 [US3] Implement GET /brands/:id/validate in src/brands/handler.ts: SELECT latest row from `token_validation_log WHERE brand_id = ? ORDER BY run_at DESC LIMIT 1`; if no row exists return 202 Accepted (validation pending); return structured report JSON per contract; register route in src/index.ts

**Checkpoint**: Validation pipeline operational. All three check types produce structured `ValidationError` objects. `brands.valid_status` updated asynchronously after every mutation.

---

## Phase 6: User Story 4 - Runtime Brand Resolution (Priority: P4)

**Goal**: Any request carrying a brand key and scheme returns the correct fully-resolved token set as CSS custom properties or JSON. Two brands with different seeds return different values. KV cache ensures < 10ms for repeated requests.

**Independent Test**: `GET /brands/acme/tokens.css?scheme=light` and `GET /brands/globex/tokens.css?scheme=light` return different `--palette-brand-light-500` values. Second call to same URL completes in < 10ms (KV hit). `GET /brands/unknown/tokens.css` returns 404.

### Implementation for User Story 4

- [X] T035 [US4] Implement `buildTokenMap` in src/tokens/resolver.ts: run the hot-path D1 batch (brand record + JOIN query from data-model.md), merge parsed `color_scale[scheme]` with resolved component→semantic→tier1 chain, merge brand `primitives` with platform defaults; return `TokenMap` object with keys: palette, semantic, component, typography, spacing, borderRadius, motion, elevation
- [X] T036 [US4] Implement CSS serialization in src/tokens/resolver.ts: `tokenMapToCSS(map: TokenMap, brandId: string, scheme: string): string` — generate `:root { ... }` block with sections: (1) `--palette-brand-{scheme}-{step}` for all 11 color steps, (2) semantic CSS vars using `var()` references, (3) component CSS vars (`--sl-*` prefix for Shoelace compatibility), (4) typography `--sl-font-*` vars, (5) spacing/radius/motion/elevation `--sl-*` vars
- [X] T037 [US4] Implement JSON serialization in src/tokens/resolver.ts: `tokenMapToJSON(map: TokenMap, brandId, scheme, generatedAt): object` — structured object with `brandId`, `scheme`, `generatedAt`, `palette`, `semantic`, `component`, `typography`, `spacing`, `borderRadius`, `motion`, `elevation` sections per contracts/token-resolution.md schema
- [X] T038 [US4] Implement KV-backed resolution in src/tokens/resolver.ts: `getResolvedTokens(env, brandId, scheme): {css:string, json:object} | null` — check KV `brand:{id}:tokens:{scheme}`; on HIT parse and return; on MISS call `buildTokenMap`, serialize both formats, write combined object to KV (TTL 300s key `brand:{id}:tokens:{scheme}`), return result; return null if brand not found or valid_status ≠ 'valid'
- [X] T039 [US4] Implement GET /brands/:id/tokens.css in src/tokens/handler.ts: parse `scheme` query param (default 'light', reject invalid values with 400), call `getResolvedTokens`; if null check D1 for brand existence (404 vs 422 vs 503 per contract); on success return `text/css` with `Cache-Control: public, max-age=300`
- [X] T040 [US4] Implement GET /brands/:id/tokens.json in src/tokens/handler.ts: same flow as T039 but return `application/json`; both formats stored together in KV so no extra D1 round-trip
- [X] T041 [US4] Register token resolution routes in src/index.ts BEFORE the `GET /brands/:id` catch-all (tokens.css and tokens.json patterns must match first per plan.md Route Map and CLAUDE.md routing note)

**Checkpoint**: Full token resolution pipeline operational. Both CSS and JSON outputs verified for two brands with different seeds. KV cache confirmed by response time on second request.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Operational readiness, end-to-end validation, and platform defaults

- [X] T042 [P] Define platform default primitives in src/types.ts: export `PLATFORM_DEFAULTS` constant object with spacing, borderRadius, motion, and elevation default values (from data-model.md `primitives` JSON schema); used by `buildTokenMap` (T035) when brand has no override for a category
- [X] T043 [P] Verify wrangler.toml bindings match Env interface: confirm `[[d1_databases]]` binding name `DB` and `[[kv_namespaces]]` binding name `KV` are present; if missing, add and run `npm run cf-typegen` to regenerate Cloudflare types per CLAUDE.md
- [X] T044 Run quickstart.md end-to-end validation with `npm run dev`: execute all 12 checklist items in order (schema init → semantic tokens → component tokens → brand registration → validation → token resolution → override → second brand → isolation check → KV cache timing → update propagation → delete)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001, T002 complete) — blocks all user stories
- **US1 (Phase 3)**: Depends on Foundational complete — specifically needs T005 (schema), T007+T008 (OKLCH), T002 (types)
- **US2 (Phase 4)**: Depends on Foundational + US1 brand CRUD (KV helpers T011 needed for global invalidation T021)
- **US3 (Phase 5)**: Depends on Foundational + US1 (brand data) + US2 (token graph) — all three checks need the full token graph
- **US4 (Phase 6)**: Depends on Foundational + US1 (brand + color scale) + US2 (semantic/component tokens) — resolution needs both
- **Polish (Phase 7)**: Depends on all user stories complete

### Within Each Phase

- Setup: T001 before T002/T003/T004 (types needed by all); T003 and T004 parallel after T001
- Foundational: T005 before T006; T007 before T008; T005 and T007 are parallel (different files)
- US1: T009 → T010 → T011 → T012 (service chain); then T013–T017 in handlers (parallel within handler after service complete)
- US2: T018 → T019 → T020 (semantic CRUD); T021 (global invalidation); T022 → T023 (component CRUD); T024 → T025 → T026 (overrides); T027 (routing)
- US3: T028 → T029, T030, T031 (all need graph); T032 (orchestrator needs T028–T031); T033 → T034 (wiring + endpoint)
- US4: T035 → T036/T037 (serializers need map); T038 (needs T035–T037); T039 → T040 (both need T038); T041 (routing)

### Parallel Opportunities

**Phase 2 — run together:**
```
T005 (schema)     T007 (OKLCH primitives)
      ↓                   ↓
T006 (db/test)    T008 (scale generation)
```

**Phase 3 — after T012 (service complete):**
```
T013 (POST /brands)    T014 (GET /brands list)
T015 (GET /brands/:id) T016 (PUT /brands/:id)
T017 (DELETE /brands/:id)
```

**Phase 4 — parallel streams:**
```
Semantic stream: T018 → T019 → T020
Override stream: T024 → T025 → T026   (after T018 complete for FK validation)
Global inval:    T021  (after T011 from US1)
```

**Phase 5 — parallel validators after T028:**
```
T029 (broken refs)    T030 (circular refs)    T031 (contrast)
              ↓               ↓                    ↓
                        T032 (orchestrator)
```

**Phase 6 — parallel after T035:**
```
T036 (CSS serializer)    T037 (JSON serializer)
              ↓                    ↓
                    T038 (KV resolution)
```

---

## Implementation Strategy

### MVP (User Story 1 only — 17 tasks)

1. Complete Phase 1: Setup (T001–T004)
2. Complete Phase 2: Foundational (T005–T008) — **CRITICAL gate**
3. Complete Phase 3: US1 (T009–T017)
4. **STOP AND VALIDATE**: Run `GET /brands/acme/tokens.css?scheme=light` end-to-end
5. Note: Token output at this stage uses pre-computed `color_scale` raw values only — no semantic/component mapping yet (resolver returns palette only until US2+US4 complete)

### Incremental Delivery

1. Phase 1+2 → Foundation ready
2. Phase 3 (US1) → Brand registration + raw token output → **MVP demo**
3. Phase 4 (US2) → Token authoring + overrides → Semantic/component resolution active
4. Phase 5 (US3) → Validation pipeline → `valid_status` gates resolution correctly
5. Phase 6 (US4) → Full three-tier resolution with CSS/JSON output → Production-ready
6. Phase 7 → Polish + end-to-end quickstart validation

### Parallel Team Strategy (3 developers after Phase 2)

- **Dev A**: US1 (brand CRUD + KV service)
- **Dev B**: US2 (token authoring + overrides)
- **Dev C**: US3 (validation pipeline) — can start after Dev A completes T028 dependency on brand service

---

## Notes

- `[P]` tasks = different files, no incomplete dependencies — safe to execute in parallel
- `[Story]` label maps every implementation task to its user story for traceability
- Each user story phase has an explicit **Checkpoint** — validate independently before moving on
- Route specificity ordering in src/index.ts is **critical**: tokens.css/tokens.json must register before /:id catch-all (per CLAUDE.md architecture note)
- KV invalidation is required on every mutation — the constitution's cache invalidation rule applies to all endpoints
- `ctx.waitUntil()` is the required pattern for async validation — do not block the response on WCAG/circular-ref checks
- Platform defaults for spacing, borderRadius, motion, elevation live in `PLATFORM_DEFAULTS` (T042) and are merged in the resolver (T035)
