// ─── @travel/tokens public API ────────────────────────────────────────────────

// Types
export type {
  OKLCHColor,
  ColorScaleStep,
  ColorScale,
  ColorMode,
  NeutralTemperature,
  SemanticTemperature,
  Shape,
  BrandColorConfig,
  BrandPalette,
  ShapeTokens,
  BrandConfig,
  ResolvedBrandTokens,
  BrandRegistry,
} from './oklch/types.js';

// OKLCH Engine
export { generateColorScale, deriveFullPalette, deriveShapeTokens } from './oklch/engine.js';

// OKLCH Utilities
export {
  oklchToCSS,
  oklchToHex,
  oklchToSRGB,
  validateOKLCH,
  contrastRatio,
  meetsContrastAA,
} from './oklch/utils.js';
export type { ValidationResult } from './oklch/utils.js';

// Three-tier resolver
export { resolveToken, generateTokenStore, tokenStoreToCss } from './resolver/resolver.js';
export type { ResolvedValue, TokenStore } from './resolver/resolver.js';

// Validation
export { validateBrandTokens } from './validator/validator.js';
export type { ValidationReport, ValidationError, ContrastResult } from './validator/types.js';

// Brand types
export type { ResolvedTokenOutput } from './brand/types.js';
