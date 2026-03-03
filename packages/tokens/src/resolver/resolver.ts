// ─── Three-Tier Token Resolver ────────────────────────────────────────────────
// Traverses component → semantic → primitive/generated hierarchy.

import type { BrandConfig, ColorMode, OKLCHColor, ColorScaleStep } from '../oklch/types.js';
import { deriveFullPalette, deriveShapeTokens } from '../oklch/engine.js';
import { oklchToCSS } from '../oklch/utils.js';
import colorSemantic from '../definitions/semantic/color-semantic.json' assert { type: 'json' };

export interface ResolvedValue {
  cssValue: string;
  tier: 'component' | 'semantic' | 'primitive';
}

export type TokenStore = Record<string, string>;

// ─── Reference parsing ────────────────────────────────────────────────────────

/** Detect `{token.path}` reference syntax */
const REF_RE = /^\{(.+)\}$/;

function isReference(value: string): boolean {
  return REF_RE.test(value);
}

function extractRef(value: string): string {
  return value.replace(REF_RE, '$1');
}

// ─── Palette step resolution ──────────────────────────────────────────────────

/** Parse "palette.step" → OKLCHColor from a derived palette */
function resolvePaletteRef(
  ref: string,
  brand: BrandConfig,
  mode: ColorMode,
): string | null {
  const palette = deriveFullPalette({
    primarySeed: brand.primarySeed,
    accentSeed: brand.accentSeed,
    neutralTemperature: brand.neutralTemperature,
    semanticTemperature: brand.semanticTemperature,
  });

  // e.g. "neutral.50" or "primary.500"
  const parts = ref.split('.');
  if (parts.length !== 2) return null;

  const [paletteName, stepStr] = parts;
  const step = parseInt(stepStr) as ColorScaleStep;

  const paletteEntry = palette[paletteName as keyof typeof palette];
  if (!paletteEntry) return null;

  const scale = paletteEntry[mode];
  const color = scale[step] as OKLCHColor | undefined;
  if (!color) return null;

  return oklchToCSS(color);
}

// ─── Semantic color resolution ────────────────────────────────────────────────

type SemanticColorNode = {
  lightValue?: string;
  darkValue?: string;
  type?: string;
  alpha?: number;
};

/** Navigate nested JSON by dot-separated path */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/** Resolve a semantic color token name → CSS value for the given mode */
function resolveSemanticColor(name: string, brand: BrandConfig, mode: ColorMode): string | null {
  const node = getNestedValue(colorSemantic as Record<string, unknown>, name) as SemanticColorNode | undefined;
  if (!node) return null;

  const ref = mode === 'light' ? node.lightValue : node.darkValue;
  if (!ref) return null;

  const css = resolvePaletteRef(ref, brand, mode);
  return css;
}

// ─── Shape resolution ─────────────────────────────────────────────────────────

/** Resolve a shape semantic token name → CSS value */
function resolveSemanticShape(name: string, brand: BrandConfig): string | null {
  const shapeTokens = deriveShapeTokens(brand.shape);
  // name might be "shape.button" → "button"
  const key = name.split('.').pop() as keyof typeof shapeTokens | undefined;
  if (!key || !(key in shapeTokens)) return null;
  return shapeTokens[key];
}

// ─── Reference cycle detection ────────────────────────────────────────────────

function resolveRef(
  ref: string,
  brand: BrandConfig,
  mode: ColorMode,
  visited: Set<string>,
): string | null {
  if (visited.has(ref)) {
    throw new Error(`Circular reference detected: ${[...visited, ref].join(' → ')}`);
  }
  visited.add(ref);

  // Try semantic color
  const colorResult = resolveSemanticColor(ref, brand, mode);
  if (colorResult !== null) return colorResult;

  // Try semantic shape
  if (ref.startsWith('shape.')) {
    return resolveSemanticShape(ref, brand);
  }

  // Try brand overrides
  if (brand.overrides && ref in brand.overrides) {
    const override = brand.overrides[ref];
    if (isReference(override)) {
      return resolveRef(extractRef(override), brand, mode, visited);
    }
    return override;
  }

  return null;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Resolve a token name through the three-tier hierarchy:
 * component → semantic → primitive/generated
 */
export function resolveToken(
  name: string,
  brand: BrandConfig,
  mode: ColorMode,
): ResolvedValue {
  // Tier 1: check brand overrides (component-level)
  if (brand.overrides && name in brand.overrides) {
    const override = brand.overrides[name];
    if (isReference(override)) {
      const resolved = resolveRef(extractRef(override), brand, mode, new Set([name]));
      if (resolved !== null) return { cssValue: resolved, tier: 'component' };
    } else {
      return { cssValue: override, tier: 'component' };
    }
  }

  // Tier 2: semantic tokens
  const semanticColor = resolveSemanticColor(name, brand, mode);
  if (semanticColor !== null) return { cssValue: semanticColor, tier: 'semantic' };

  if (name.startsWith('shape.')) {
    const shape = resolveSemanticShape(name, brand);
    if (shape !== null) return { cssValue: shape, tier: 'semantic' };
  }

  throw new Error(`Token "${name}" could not be resolved for brand "${brand.id}" (mode: ${mode})`);
}

/**
 * Generate a complete flat CSS custom properties map for a brand + mode.
 * Includes all semantic color tokens and shape tokens.
 */
export function generateTokenStore(brand: BrandConfig, mode: ColorMode): TokenStore {
  const store: TokenStore = {};

  // Shape tokens
  const shapeTokens = deriveShapeTokens(brand.shape);
  for (const [key, value] of Object.entries(shapeTokens)) {
    store[`--shape-preset-${key}`] = value;
    store[`--shape-${key}`] = value;
  }

  // Derived palette: all 8 palettes × 2 modes × 11 steps
  const palette = deriveFullPalette({
    primarySeed: brand.primarySeed,
    accentSeed: brand.accentSeed,
    neutralTemperature: brand.neutralTemperature,
    semanticTemperature: brand.semanticTemperature,
  });

  for (const [paletteName, entry] of Object.entries(palette)) {
    const scale = entry[mode];
    for (const [step, color] of Object.entries(scale)) {
      store[`--color-${paletteName}-${step}`] = oklchToCSS(color as OKLCHColor);
    }
  }

  // Semantic color tokens
  function walkSemantic(obj: Record<string, unknown>, prefix: string) {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$')) continue;
      const path = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === 'object' && ('lightValue' in value || 'darkValue' in value)) {
        const node = value as SemanticColorNode;
        const ref = mode === 'light' ? node.lightValue : node.darkValue;
        if (ref) {
          const css = resolvePaletteRef(ref, brand, mode);
          if (css) store[`--${path.replace(/\./g, '-')}`] = css;
        }
      } else if (value && typeof value === 'object') {
        walkSemantic(value as Record<string, unknown>, path);
      }
    }
  }

  walkSemantic(colorSemantic as Record<string, unknown>, '');

  // Font vars
  store['--font-display'] = brand.fonts.display;
  store['--font-heading'] = brand.fonts.heading;
  store['--font-body'] = brand.fonts.body;

  return store;
}

/** Serialize a TokenStore to a CSS string with a given selector. */
export function tokenStoreToCss(store: TokenStore, selector: string = ':root'): string {
  const vars = Object.entries(store)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');
  return `${selector} {\n${vars}\n}\n`;
}
