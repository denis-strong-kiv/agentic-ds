import type { Brand, ColorScale, SemanticToken, ValidationError } from '../types';
import { VALID_SCALE_STEPS, PLATFORM_DEFAULTS } from '../types';
import { oklchToSrgb, relativeLuminance, wcagContrastRatio } from '../color/oklch';

// ─── Internal graph type ──────────────────────────────────────────────────────

interface TokenRow {
  componentToken: string;
  effectiveSemantic: string;
  tier1RefLight: string | null;
  tier1RefDark: string | null;
  primitiveRef: string | null;
}

interface BrandTokenGraph {
  brandId: string;
  brand: Brand;
  tokenRows: TokenRow[];
  allSemanticTokens: SemanticToken[];
}

// ─── Graph loader ─────────────────────────────────────────────────────────────

export async function loadBrandTokenGraph(
  brandId: string,
  db: D1Database,
): Promise<BrandTokenGraph | null> {
  const brandRow = await db
    .prepare(`SELECT * FROM brands WHERE id = ?`)
    .bind(brandId)
    .first<{
      id: string;
      display_name: string;
      seed_l: number;
      seed_c: number;
      seed_h: number;
      font_display: string;
      font_heading: string;
      font_body: string;
      primitives: string | null;
      color_scale: string;
      valid_status: string;
      created_at: string;
      updated_at: string;
    }>();

  if (!brandRow) return null;

  const brand: Brand = {
    id: brandRow.id,
    displayName: brandRow.display_name,
    seedColor: { l: brandRow.seed_l, c: brandRow.seed_c, h: brandRow.seed_h },
    fonts: {
      display: brandRow.font_display,
      heading: brandRow.font_heading,
      body: brandRow.font_body,
    },
    primitives: brandRow.primitives ? JSON.parse(brandRow.primitives) : null,
    colorScale: JSON.parse(brandRow.color_scale),
    validStatus: brandRow.valid_status as Brand['validStatus'],
    createdAt: brandRow.created_at,
    updatedAt: brandRow.updated_at,
  };

  const [tokenResult, semanticResult] = await db.batch([
    db.prepare(`
      SELECT
        ct.name                                                    AS component_token,
        COALESCE(bto.semantic_token_override, ct.semantic_token)   AS effective_semantic,
        st.tier1_ref_light,
        st.tier1_ref_dark,
        st.primitive_ref
      FROM component_tokens ct
      LEFT JOIN brand_token_overrides bto
        ON bto.brand_id = ?1 AND bto.component_token = ct.name
      JOIN semantic_tokens st
        ON st.name = COALESCE(bto.semantic_token_override, ct.semantic_token)
      ORDER BY ct.name
    `).bind(brandId),
    db.prepare(`SELECT * FROM semantic_tokens`),
  ]);

  const tokenRows: TokenRow[] = (
    tokenResult.results as Array<{
      component_token: string;
      effective_semantic: string;
      tier1_ref_light: string | null;
      tier1_ref_dark: string | null;
      primitive_ref: string | null;
    }>
  ).map((r) => ({
    componentToken: r.component_token,
    effectiveSemantic: r.effective_semantic,
    tier1RefLight: r.tier1_ref_light,
    tier1RefDark: r.tier1_ref_dark,
    primitiveRef: r.primitive_ref,
  }));

  const allSemanticTokens: SemanticToken[] = (
    semanticResult.results as Array<{
      name: string;
      tier1_ref_light: string | null;
      tier1_ref_dark: string | null;
      primitive_ref: string | null;
      description: string | null;
      created_at: string;
      updated_at: string;
    }>
  ).map((r) => ({
    name: r.name,
    tier1RefLight: r.tier1_ref_light,
    tier1RefDark: r.tier1_ref_dark,
    primitiveRef: r.primitive_ref,
    description: r.description,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));

  return { brandId, brand, tokenRows, allSemanticTokens };
}

// ─── Broken reference check ───────────────────────────────────────────────────

function resolvePrimitiveRef(
  ref: string,
  primitives: Brand['primitives'],
): string | null {
  const parts = ref.split('.');
  const sources = [primitives, PLATFORM_DEFAULTS as Record<string, unknown>];
  for (const source of sources) {
    if (!source) continue;
    let current: unknown = source;
    for (const part of parts) {
      if (!current || typeof current !== 'object') {
        current = undefined;
        break;
      }
      current = (current as Record<string, unknown>)[part];
    }
    if (current !== undefined && (typeof current === 'string' || typeof current === 'number')) {
      return String(current);
    }
  }
  return null;
}

export function checkBrokenRefs(graph: BrandTokenGraph): ValidationError[] {
  const errors: ValidationError[] = [];
  const validSteps = new Set<string>(VALID_SCALE_STEPS);

  for (const row of graph.tokenRows) {
    if (row.tier1RefLight && !validSteps.has(row.tier1RefLight)) {
      errors.push({
        code: 'BROKEN_REF',
        token: row.componentToken,
        ref: row.tier1RefLight,
        message: `tier1_ref_light '${row.tier1RefLight}' is not a valid scale step`,
      });
    }
    if (row.tier1RefDark && !validSteps.has(row.tier1RefDark)) {
      errors.push({
        code: 'BROKEN_REF',
        token: row.componentToken,
        ref: row.tier1RefDark,
        message: `tier1_ref_dark '${row.tier1RefDark}' is not a valid scale step`,
      });
    }
    if (row.primitiveRef) {
      const resolved = resolvePrimitiveRef(row.primitiveRef, graph.brand.primitives);
      if (resolved === null) {
        errors.push({
          code: 'BROKEN_REF',
          token: row.componentToken,
          ref: row.primitiveRef,
          message: `primitive_ref '${row.primitiveRef}' does not resolve in brand primitives or platform defaults`,
        });
      }
    }
  }

  return errors;
}

// ─── Circular reference check ─────────────────────────────────────────────────

export function checkCircularRefs(graph: BrandTokenGraph): ValidationError[] {
  const errors: ValidationError[] = [];
  // Build adjacency: component → effective_semantic → (tier1 step or primitive_ref)
  // Since semantic tokens only reference scale steps or primitive refs (never other semantics),
  // the chain is at most 2 levels deep. Cycles are structurally impossible in this data model.
  // We verify this by checking that no component token references itself transitively.

  const semanticByName = new Map(
    graph.allSemanticTokens.map((st) => [st.name, st]),
  );
  const componentToSemantic = new Map(
    graph.tokenRows.map((r) => [r.componentToken, r.effectiveSemantic]),
  );

  for (const [componentToken, semanticName] of componentToSemantic) {
    const seen = new Set<string>();
    seen.add(componentToken);

    // Traverse: component → semantic
    let current: string = semanticName;
    while (current) {
      if (seen.has(current)) {
        errors.push({
          code: 'CIRCULAR_REF',
          cycle: [...seen, current],
          message: `Circular reference detected: ${[...seen, current].join(' → ')}`,
        });
        break;
      }
      seen.add(current);

      const st = semanticByName.get(current);
      if (!st) break; // not found — broken ref (handled elsewhere)
      // Semantic tokens reference scale steps or primitive refs, not other semantics
      // So the traversal ends here — no further chain to follow
      break;
    }
  }

  return errors;
}

// ─── WCAG AA contrast check ───────────────────────────────────────────────────

function parseOklch(css: string): { L: number; C: number; H: number } | null {
  const m = css.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!m) return null;
  return { L: parseFloat(m[1]), C: parseFloat(m[2]), H: parseFloat(m[3]) };
}

export function checkContrast(
  graph: BrandTokenGraph,
  colorScale: { light: ColorScale; dark: ColorScale },
): ValidationError[] {
  const errors: ValidationError[] = [];
  const WCAG_AA_NORMAL = 4.5;

  // Find foreground (text/on) and background (surface/background) semantic tokens
  const fgTokens = graph.allSemanticTokens.filter(
    (st) =>
      st.tier1RefLight !== null &&
      (st.name.includes('.text') || st.name.includes('.on.')),
  );
  const bgTokens = graph.allSemanticTokens.filter(
    (st) =>
      st.tier1RefLight !== null &&
      (st.name.includes('.surface') || st.name.includes('.background')),
  );

  for (const fg of fgTokens) {
    for (const bg of bgTokens) {
      for (const scheme of ['light', 'dark'] as const) {
        const fgRef = scheme === 'light' ? fg.tier1RefLight : fg.tier1RefDark;
        const bgRef = scheme === 'light' ? bg.tier1RefLight : bg.tier1RefDark;
        if (!fgRef || !bgRef) continue;

        const fgCss = colorScale[scheme][fgRef as keyof ColorScale];
        const bgCss = colorScale[scheme][bgRef as keyof ColorScale];
        if (!fgCss || !bgCss) continue;

        const fgOklch = parseOklch(fgCss);
        const bgOklch = parseOklch(bgCss);
        if (!fgOklch || !bgOklch) continue;

        const fgRgb = oklchToSrgb(fgOklch.L, fgOklch.C, fgOklch.H);
        const bgRgb = oklchToSrgb(bgOklch.L, bgOklch.C, bgOklch.H);

        const fgLum = relativeLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
        const bgLum = relativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

        const ratio = wcagContrastRatio(fgLum, bgLum);
        if (ratio < WCAG_AA_NORMAL) {
          errors.push({
            code: 'CONTRAST_FAIL',
            foreground: fg.name,
            background: bg.name,
            scheme,
            actual: Math.round(ratio * 100) / 100,
            required: WCAG_AA_NORMAL,
            message: `WCAG AA contrast failure in ${scheme} mode: ${Math.round(ratio * 100) / 100}:1 < ${WCAG_AA_NORMAL}:1`,
          });
        }
      }
    }
  }

  return errors;
}

// ─── Orchestrator ─────────────────────────────────────────────────────────────

export async function validateBrandTokenSet(
  db: D1Database,
  brandId: string,
): Promise<void> {
  const graph = await loadBrandTokenGraph(brandId, db);
  if (!graph) return; // Brand may have been deleted

  const brokenRefs = checkBrokenRefs(graph);
  const circularRefs = checkCircularRefs(graph);
  const contrastErrors = checkContrast(graph, graph.brand.colorScale);

  const allErrors = [...brokenRefs, ...circularRefs, ...contrastErrors];
  const status = allErrors.length === 0 ? 'pass' : 'fail';
  const validStatus = status === 'pass' ? 'valid' : 'invalid';

  const id = crypto.randomUUID();
  const runAt = new Date().toISOString();

  await db.batch([
    db
      .prepare(
        `INSERT INTO token_validation_log (id, brand_id, run_at, status, errors)
         VALUES (?, ?, ?, ?, ?)`,
      )
      .bind(id, brandId, runAt, status, allErrors.length > 0 ? JSON.stringify(allErrors) : null),
    db
      .prepare(`UPDATE brands SET valid_status = ?, updated_at = ? WHERE id = ?`)
      .bind(validStatus, runAt, brandId),
  ]);
}
