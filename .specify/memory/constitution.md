<!--
## Sync Impact Report

**Version Change**: none (uninitialized) → 1.0.0
**Bump Rationale**: Initial ratification — MAJOR 1 establishes all governance from scratch.

### Principles Defined
- (new) I. Brand Isolation
- (new) II. Runtime Configurability
- (new) III. Simplicity by Default
- (new) IV. Deployability

### Sections Added
- Technology Constraints (platform & storage rules)
- Development Standards (cache invalidation, routing, type safety)

### Templates
- `.specify/templates/plan-template.md` — Constitution Check placeholder retained;
  gates (Brand Isolation, Runtime Configurability, Deployability) must be verified
  per feature. ✅ noted in report, no structural edit required.
- `.specify/templates/spec-template.md` — Existing structure is compatible. ✅
- `.specify/templates/tasks-template.md` — Existing phase/story structure is compatible. ✅

### Deferred TODOs
- None. All required fields resolved from repo context and user input.
-->

# Agentic-DS Constitution

## Core Principles

### I. Brand Isolation

Every brand MUST have independently scoped configuration, routing, and assets.
No brand's data or configuration MAY be readable, writable, or inferable from
another brand's request context. Brand identity MUST be resolved at the edge
before any application logic executes.

**Rationale**: Cross-brand data leakage is a correctness and trust failure.
Isolation is the foundational contract that makes multi-brand viable.

### II. Runtime Configurability

Brand configuration MUST be resolvable at runtime without redeployment.
Onboarding a new brand MUST require only data changes (D1 rows + KV entries +
R2 assets) — never a code change or redeployment. Feature flags and brand
overrides MUST follow the same runtime-only rule.

**Rationale**: Code deploys gated on brand onboarding create bottlenecks and
operational risk. Runtime config is the only scalable path.

### III. Simplicity by Default

Shared code is the default. Brand-specific code paths are the exception and
MUST be justified by a concrete divergent requirement. Abstractions MUST NOT
be introduced unless two or more distinct, existing use-cases require them.
YAGNI applies unconditionally.

**Rationale**: Over-engineering for hypothetical brand differences produces
bloat that is harder to onboard, test, and reason about.

### IV. Single-Deploy Constraint

The system MUST run as a single Cloudflare Worker deployment. Separate Workers
per brand, brand-specific build pipelines, or environment-per-brand topologies
are prohibited unless explicitly approved via a constitution amendment with a
documented migration plan.

**Rationale**: A single-deploy model keeps operational overhead minimal and
ensures uniform behaviour across brands on a shared edge runtime.

## Technology Constraints

The platform is Cloudflare Workers (TypeScript). The following bindings are
the canonical storage layer and MUST NOT be substituted without a constitution
amendment:

- **D1** (`env.DB`): Source of truth for brand configuration and `items` data.
- **KV** (`env.KV`): Edge-cache for brand config and list endpoints (60 s TTL).
  Any mutation to brand config MUST invalidate the relevant KV key(s).
- **R2** (`env.BUCKET`): Brand asset storage (logos, themes, static files).

No external runtime dependencies MAY be introduced. All logic MUST be
expressible within the single-file Worker (`src/index.ts`) unless a feature
amendment explicitly approves additional source files.

## Development Standards

- **Routing**: Manual URL pattern matching in the `fetch` handler. No router
  library MAY be added without a constitution amendment. Route ordering is
  significant — more-specific patterns MUST precede catch-all patterns.
- **Cache invalidation**: Every mutation endpoint (create, update, delete) for
  any brand-scoped resource MUST delete the corresponding KV cache key before
  returning a response.
- **Type safety**: `noUnusedLocals` and `noUnusedParameters` are enforced by
  `tsconfig.json`. New bindings require `npm run cf-typegen` after updating
  `wrangler.toml`.
- **Smoke testing**: `GET /db/test` initialises the schema and serves as the
  canonical smoke test. New schema objects MUST be initialised via this endpoint
  or an equivalent idempotent migration endpoint.

## Governance

This constitution supersedes all other practices and documentation. It is the
authoritative source of truth for architectural decisions on this project.

**Amendment procedure**:
1. Propose the amendment in a PR with a written rationale.
2. Identify the version bump type (MAJOR / MINOR / PATCH) per the policy below.
3. Update `constitution.md`, increment `CONSTITUTION_VERSION`, and set
   `LAST_AMENDED_DATE` to the amendment date.
4. Run the consistency propagation checklist (plan-template, spec-template,
   tasks-template) and resolve any misalignments before merging.

**Versioning policy**:
- **MAJOR**: Removal or redefinition of a principle; backward-incompatible
  governance change.
- **MINOR**: New principle, new section, or materially expanded guidance.
- **PATCH**: Wording clarifications, typo fixes, non-semantic refinements.

**Compliance**: Every PR that introduces a new feature or changes application
behaviour MUST include a Constitution Check confirming no principle is violated.
Complexity MUST be justified; unjustified complexity is grounds for rejection.

**Version**: 1.0.0 | **Ratified**: 2026-03-02 | **Last Amended**: 2026-03-02

## Design System Reference

The canonical design system inventory — token scopes, component token mappings, D1/KV schemas,
route table, and extension protocol — is maintained at:

`.specify/memory/design-system.md`

Agents implementing UI features, token authoring, or brand management MUST read this file before
generating plans or code. It defines the semantic naming convention, what is currently implemented
versus planned, and the rules for adding new tokens correctly.
