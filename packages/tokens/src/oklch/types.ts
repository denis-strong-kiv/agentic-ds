// ─── OKLCH color primitives ───────────────────────────────────────────────────

export interface OKLCHColor {
  /** Perceptual lightness, range [0, 1] */
  lightness: number;
  /** Chroma (color intensity), range [0, ~0.37] */
  chroma: number;
  /** Hue angle in degrees, range [0, 360) */
  hue: number;
}

export type ColorScaleStep = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export type ColorScale = Record<ColorScaleStep, OKLCHColor>;

export type ColorMode = 'light' | 'dark';

export type NeutralTemperature = 'warm' | 'cool' | 'neutral';

export type SemanticTemperature = 'warm' | 'cool' | 'neutral';

export type Shape = 'sharp' | 'rounded' | 'pill';

// ─── Brand configuration ──────────────────────────────────────────────────────

export interface BrandColorConfig {
  /** Primary brand color — drives primary + influences secondary scale */
  primarySeed: OKLCHColor;
  /** Accent color — drives accent + influences secondary and warm neutral tint */
  accentSeed: OKLCHColor;
  /** Controls neutral background/surface tinting */
  neutralTemperature: NeutralTemperature;
  /** Controls hue shift of semantic status colors (success/warning/error/info) */
  semanticTemperature: SemanticTemperature;
}

// ─── Derived palette ──────────────────────────────────────────────────────────

export interface BrandPalette {
  primary: { light: ColorScale; dark: ColorScale };
  accent: { light: ColorScale; dark: ColorScale };
  secondary: { light: ColorScale; dark: ColorScale };
  neutral: { light: ColorScale; dark: ColorScale };
  success: { light: ColorScale; dark: ColorScale };
  warning: { light: ColorScale; dark: ColorScale };
  error: { light: ColorScale; dark: ColorScale };
  info: { light: ColorScale; dark: ColorScale };
}

// ─── Shape tokens ─────────────────────────────────────────────────────────────

export interface ShapeTokens {
  button: string;
  card: string;
  input: string;
  badge: string;
  dialog: string;
  sm: string;
  md: string;
  lg: string;
  full: string;
}

// ─── Brand config ─────────────────────────────────────────────────────────────

export interface BrandConfig {
  id: string;
  displayName: string;
  primarySeed: OKLCHColor;
  accentSeed: OKLCHColor;
  neutralTemperature: NeutralTemperature;
  semanticTemperature: SemanticTemperature;
  shape: Shape;
  fonts: {
    display: string;
    heading: string;
    body: string;
  };
  overrides?: Record<string, string>;
}

// ─── Resolved output ──────────────────────────────────────────────────────────

export interface ResolvedBrandTokens {
  brandId: string;
  mode: ColorMode;
  palette: BrandPalette;
  shape: ShapeTokens;
  fonts: BrandConfig['fonts'];
  cssCustomProperties: Record<string, string>;
}

// ─── Brand registry ───────────────────────────────────────────────────────────

export interface BrandRegistry {
  list(): Promise<BrandConfig[]>;
  get(id: string): Promise<BrandConfig | null>;
  set(brand: BrandConfig): Promise<void>;
  delete(id: string): Promise<void>;
}
