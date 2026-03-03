import type { Brand, ColorScale, ColorStep, Env, Primitives, TokenMap } from '../types';
import { PLATFORM_DEFAULTS, VALID_SCALE_STEPS } from '../types';

// ─── CSS naming helpers ───────────────────────────────────────────────────────

/** `color.action.primary` → `--color-action-primary` */
function semanticVarName(tokenName: string): string {
  return '--' + tokenName.replace(/\./g, '-');
}

/** `button.background.default` → `--sl-button-background` (drops trailing `.default`) */
function componentVarName(tokenName: string): string {
  const name = tokenName.endsWith('.default')
    ? tokenName.slice(0, -'.default'.length)
    : tokenName;
  return '--sl-' + name.replace(/\./g, '-');
}

/** `--palette-brand-{scheme}-{step}` */
function paletteVarName(scheme: string, step: string): string {
  return `--palette-brand-${scheme}-${step}`;
}

// ─── Primitive resolution ─────────────────────────────────────────────────────

function mergePrimitives(brandPrimitives: Primitives | null): Required<Primitives> {
  return {
    spacing: {
      ...PLATFORM_DEFAULTS.spacing,
      ...brandPrimitives?.spacing,
    },
    borderRadius: {
      ...PLATFORM_DEFAULTS.borderRadius,
      ...brandPrimitives?.borderRadius,
    },
    motion: {
      ...PLATFORM_DEFAULTS.motion,
      ...brandPrimitives?.motion,
    },
    elevation: {
      ...PLATFORM_DEFAULTS.elevation,
      ...brandPrimitives?.elevation,
    },
  };
}

function resolvePrimitiveRef(ref: string, primitives: Required<Primitives>): string {
  const parts = ref.split('.');
  let current: unknown = primitives;
  for (const part of parts) {
    if (!current || typeof current !== 'object') return '';
    current = (current as Record<string, unknown>)[part];
  }
  if (typeof current === 'string') return current;
  if (typeof current === 'number') return String(current);
  return '';
}

// ─── D1 query types ───────────────────────────────────────────────────────────

interface BrandRow {
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
}

interface TokenJoinRow {
  component_token: string;
  effective_semantic: string;
  tier1_ref_light: string | null;
  tier1_ref_dark: string | null;
  primitive_ref: string | null;
}

interface SemanticRow {
  name: string;
  tier1_ref_light: string | null;
  tier1_ref_dark: string | null;
  primitive_ref: string | null;
}

// ─── Token map builder ────────────────────────────────────────────────────────

/**
 * Runs the hot-path D1 batch (brand + JOIN query) and builds a fully-resolved TokenMap.
 * Returns null if brand is not found or valid_status ≠ 'valid'.
 */
export async function buildTokenMap(
  db: D1Database,
  brandId: string,
  scheme: 'light' | 'dark',
): Promise<{ map: TokenMap; brand: Brand } | null> {
  const [brandResult, semanticResult, tokenResult] = await db.batch([
    db.prepare(`SELECT * FROM brands WHERE id = ?`).bind(brandId),
    db.prepare(`SELECT name, tier1_ref_light, tier1_ref_dark, primitive_ref FROM semantic_tokens ORDER BY name`),
    db
      .prepare(
        `SELECT
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
        ORDER BY ct.name`,
      )
      .bind(brandId),
  ]);

  const brandRow = brandResult.results[0] as BrandRow | undefined;
  if (!brandRow) return null;
  if (brandRow.valid_status !== 'valid') return null;

  const colorScaleJson = JSON.parse(brandRow.color_scale) as {
    light: ColorScale;
    dark: ColorScale;
  };
  const palette = colorScaleJson[scheme];
  const primitives = brandRow.primitives
    ? (JSON.parse(brandRow.primitives) as Primitives)
    : null;
  const merged = mergePrimitives(primitives);

  const brand: Brand = {
    id: brandRow.id,
    displayName: brandRow.display_name,
    seedColor: { l: brandRow.seed_l, c: brandRow.seed_c, h: brandRow.seed_h },
    fonts: {
      display: brandRow.font_display,
      heading: brandRow.font_heading,
      body: brandRow.font_body,
    },
    primitives,
    colorScale: colorScaleJson,
    validStatus: 'valid',
    createdAt: brandRow.created_at,
    updatedAt: brandRow.updated_at,
  };

  const semanticRows = semanticResult.results as SemanticRow[];
  const tokenRows = tokenResult.results as TokenJoinRow[];

  // Resolve semantic and component values
  const semantic: Record<string, string> = {};
  const component: Record<string, string> = {};

  const ref = scheme === 'light' ? 'tier1_ref_light' : 'tier1_ref_dark';

  // First pass: populate ALL semantic tokens so none are omitted from the output
  for (const row of semanticRows) {
    const tier1Ref = (scheme === 'light' ? row.tier1_ref_light : row.tier1_ref_dark) as string | null;
    if (tier1Ref) {
      semantic[row.name] = palette[tier1Ref as ColorStep] ?? '';
    } else if (row.primitive_ref) {
      semantic[row.name] = resolvePrimitiveRef(row.primitive_ref, merged);
    } else {
      semantic[row.name] = '';
    }
  }

  // Second pass: component tokens (same resolution — overrides semantic map with same values)
  for (const row of tokenRows) {
    const tier1Ref = row[ref] as string | null;
    let resolvedValue: string;

    if (tier1Ref) {
      resolvedValue = palette[tier1Ref as ColorStep] ?? '';
    } else if (row.primitive_ref) {
      resolvedValue = resolvePrimitiveRef(row.primitive_ref, merged);
    } else {
      resolvedValue = '';
    }

    semantic[row.effective_semantic] = resolvedValue;
    component[row.component_token] = resolvedValue;
  }

  // Build spacing/borderRadius/motion/elevation maps for JSON output
  const spacingMap: Record<string, string> = {
    'spacing.small': merged.spacing.scale?.[1]
      ? `${merged.spacing.scale[1]}rem`
      : '0.5rem',
    'spacing.medium': merged.spacing.base ?? '1rem',
    'spacing.large': merged.spacing.scale?.[4]
      ? `${merged.spacing.scale[4]}rem`
      : '1.5rem',
  };

  const borderRadiusMap: Record<string, string> = {
    'borderRadius.sm': merged.borderRadius.sm ?? '2px',
    'borderRadius.md': merged.borderRadius.md ?? '4px',
    'borderRadius.lg': merged.borderRadius.lg ?? '8px',
    'borderRadius.xl': merged.borderRadius.xl ?? '16px',
  };

  const motionMap: Record<string, string> = {
    'motion.durationFast': merged.motion.durationFast ?? '150ms',
    'motion.durationBase': merged.motion.durationBase ?? '250ms',
    'motion.durationSlow': merged.motion.durationSlow ?? '400ms',
    'motion.easingStandard': merged.motion.easingStandard ?? 'cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const elevationMap: Record<string, string> = {
    'elevation.sm': merged.elevation.sm ?? '0 1px 2px rgba(0,0,0,0.05)',
    'elevation.md': merged.elevation.md ?? '0 4px 6px rgba(0,0,0,0.07)',
    'elevation.lg': merged.elevation.lg ?? '0 10px 15px rgba(0,0,0,0.10)',
  };

  const map: TokenMap = {
    palette,
    semantic,
    component,
    typography: {
      'font.family.display': `"${brand.fonts.display}", sans-serif`,
      'font.family.heading': `"${brand.fonts.heading}", serif`,
      'font.family.body': `"${brand.fonts.body}", sans-serif`,
    },
    spacing: spacingMap,
    borderRadius: borderRadiusMap,
    motion: motionMap,
    elevation: elevationMap,
  };

  return { map, brand };
}

// ─── CSS serializer ───────────────────────────────────────────────────────────

export function tokenMapToCSS(
  map: TokenMap,
  _brand: Brand,
  scheme: 'light' | 'dark',
): string {
  const lines: string[] = [':root {'];

  lines.push('  /* ── Generated color scale ───────────────────────────────── */');
  for (const step of VALID_SCALE_STEPS) {
    const value = map.palette[step];
    if (value) {
      lines.push(`  ${paletteVarName(scheme, step)}: ${value};`);
    }
  }

  lines.push('\n  /* ── Semantic tokens ─────────────────────────────────────── */');
  // Build a unique map of semantic name → palette step for this scheme
  // We need to use var() references, so we need the original tier1 refs
  // Since TokenMap.semantic has resolved values, we output them directly as vars
  // The var() chain is reconstructed: --semantic: var(--palette-brand-{scheme}-{step})
  // We need the tier1 ref to create the var() reference. Use the resolved value
  // as a fallback if no palette mapping found.
  for (const [name, value] of Object.entries(map.semantic)) {
    // Find which palette step this resolves to by reverse-lookup
    const step = VALID_SCALE_STEPS.find((s) => map.palette[s] === value);
    const cssValue = step ? `var(${paletteVarName(scheme, step)})` : value;
    lines.push(`  ${semanticVarName(name)}: ${cssValue};`);
  }

  lines.push('\n  /* ── Component tokens ────────────────────────────────────── */');
  for (const [name, value] of Object.entries(map.component)) {
    // Find the effective semantic that this component resolves to
    const semanticName = Object.entries(map.semantic).find(
      ([, v]) => v === value,
    )?.[0];
    const cssValue = semanticName ? `var(${semanticVarName(semanticName)})` : value;
    lines.push(`  ${componentVarName(name)}: ${cssValue};`);
  }

  lines.push('\n  /* ── Typography ──────────────────────────────────────────── */');
  lines.push(`  --sl-font-sans:  ${map.typography['font.family.display']};`);
  lines.push(`  --sl-font-serif: ${map.typography['font.family.heading']};`);
  lines.push(`  --sl-font-mono:  ui-monospace, monospace;`);
  lines.push(`  --font-body:     ${map.typography['font.family.body']};`);

  lines.push('\n  /* ── Spacing ─────────────────────────────────────────────── */');
  const sm = map.spacing['spacing.small'] ?? '0.5rem';
  const md = map.spacing['spacing.medium'] ?? '1rem';
  const lg = map.spacing['spacing.large'] ?? '1.5rem';
  lines.push(`  --sl-spacing-small:  ${sm};`);
  lines.push(`  --sl-spacing-medium: ${md};`);
  lines.push(`  --sl-spacing-large:  ${lg};`);

  lines.push('\n  /* ── Border radius ───────────────────────────────────────── */');
  lines.push(`  --sl-border-radius-small:  ${map.borderRadius['borderRadius.sm'] ?? '2px'};`);
  lines.push(`  --sl-border-radius-medium: ${map.borderRadius['borderRadius.md'] ?? '4px'};`);
  lines.push(`  --sl-border-radius-large:  ${map.borderRadius['borderRadius.lg'] ?? '8px'};`);

  lines.push('\n  /* ── Motion ──────────────────────────────────────────────── */');
  const fast = map.motion['motion.durationFast'] ?? '150ms';
  const base = map.motion['motion.durationBase'] ?? '250ms';
  const slow = map.motion['motion.durationSlow'] ?? '400ms';
  const easing = map.motion['motion.easingStandard'] ?? 'cubic-bezier(0.4, 0, 0.2, 1)';
  lines.push(`  --sl-transition-fast:   ${fast} ${easing};`);
  lines.push(`  --sl-transition-medium: ${base} ${easing};`);
  lines.push(`  --sl-transition-slow:   ${slow} ${easing};`);

  lines.push('\n  /* ── Elevation ───────────────────────────────────────────── */');
  lines.push(`  --sl-shadow-small:  ${map.elevation['elevation.sm'] ?? '0 1px 2px rgba(0,0,0,0.05)'};`);
  lines.push(`  --sl-shadow-medium: ${map.elevation['elevation.md'] ?? '0 4px 6px rgba(0,0,0,0.07)'};`);
  lines.push(`  --sl-shadow-large:  ${map.elevation['elevation.lg'] ?? '0 10px 15px rgba(0,0,0,0.10)'};`);

  lines.push('}');
  return lines.join('\n');
}

// ─── JSON serializer ──────────────────────────────────────────────────────────

export function tokenMapToJSON(
  map: TokenMap,
  brandId: string,
  scheme: string,
  generatedAt: string,
): Record<string, unknown> {
  return {
    brandId,
    scheme,
    generatedAt,
    palette: map.palette,
    semantic: map.semantic,
    component: map.component,
    typography: map.typography,
    spacing: map.spacing,
    borderRadius: map.borderRadius,
    motion: map.motion,
    elevation: map.elevation,
  };
}

// ─── KV-backed resolution ─────────────────────────────────────────────────────

interface CachedTokens {
  css: string;
  json: Record<string, unknown>;
}

/**
 * Returns resolved CSS and JSON for a brand+scheme. Uses KV as a cache.
 * Returns null when:
 *   - brand does not exist → caller returns 404
 *   - valid_status ≠ 'valid' → caller returns 422 or 503
 */
export async function getResolvedTokens(
  env: Env,
  brandId: string,
  scheme: 'light' | 'dark',
): Promise<{ css: string; json: Record<string, unknown> } | 'not_found' | 'not_valid'> {
  // 1. KV hit
  const cacheKey = `brand:${brandId}:tokens:${scheme}`;
  const cached = await env.KV.get(cacheKey);
  if (cached) {
    const { css, json } = JSON.parse(cached) as CachedTokens;
    return { css, json };
  }

  // 2. Check brand existence and valid_status separately for accurate error
  const brandRow = await env.DB.prepare(
    `SELECT valid_status FROM brands WHERE id = ?`,
  )
    .bind(brandId)
    .first<{ valid_status: string }>();

  if (!brandRow) return 'not_found';
  if (brandRow.valid_status !== 'valid') return 'not_valid';

  // 3. Build token map on D1 miss
  const result = await buildTokenMap(env.DB, brandId, scheme);
  if (!result) return 'not_valid'; // race: status changed between checks

  const { map, brand } = result;
  const generatedAt = new Date().toISOString();
  const css = tokenMapToCSS(map, brand, scheme);
  const json = tokenMapToJSON(map, brandId, scheme, generatedAt);

  // 4. Write to KV (300s TTL)
  const payload: CachedTokens = { css, json };
  await env.KV.put(cacheKey, JSON.stringify(payload), { expirationTtl: 300 });

  return { css, json };
}
