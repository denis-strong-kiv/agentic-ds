// ─── Brand Configuration Types ────────────────────────────────────────────────
// Re-exports canonical types from the oklch module and adds runtime-specific types.

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
} from '../oklch/types.js';

/** Flat resolved token artifact for a brand + mode: ready for CSS injection. */
export interface ResolvedTokenOutput {
  brandId: string;
  mode: 'light' | 'dark';
  /** All CSS custom properties as a flat map: '--color-primary-500' → 'oklch(...)' */
  cssCustomProperties: Record<string, string>;
  /** CSS string ready to inject into a <style> tag or :root block */
  cssString: string;
}
