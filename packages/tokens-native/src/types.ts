/**
 * @travel/tokens-native — TypeScript types for React Native token categories.
 * All color values are hex strings since React Native does not support oklch().
 * Spacing values are numbers (density-independent pixels, RN's default unit).
 */

// ─── Color tokens ─────────────────────────────────────────────────────────────

export interface ColorScale {
  default: string;
  hover: string;
  active: string;
  foreground: string;
  subtle: string;
}

export interface NativeColorTokens {
  // Actions
  primary: ColorScale;
  accent: ColorScale;
  secondary: Pick<ColorScale, 'default' | 'hover' | 'foreground'>;

  // Backgrounds
  backgroundDefault: string;
  backgroundSubtle: string;
  surfaceCard: string;
  surfacePopover: string;

  // Foreground
  foregroundDefault: string;
  foregroundMuted: string;
  foregroundSubtle: string;

  // Borders
  borderDefault: string;
  borderMuted: string;

  // Semantic
  success: Pick<ColorScale, 'default' | 'foreground' | 'subtle'>;
  warning: Pick<ColorScale, 'default' | 'foreground' | 'subtle'>;
  error: Pick<ColorScale, 'default' | 'foreground' | 'subtle'>;
  info: Pick<ColorScale, 'default' | 'foreground' | 'subtle'>;
}

// ─── Shape tokens ──────────────────────────────────────────────────────────────

export interface NativeShapeTokens {
  button: number;
  card: number;
  input: number;
  badge: number;
  dialog: number;
}

// ─── Spacing tokens ────────────────────────────────────────────────────────────

export interface NativeSpacingTokens {
  0: number;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  8: number;
  10: number;
  12: number;
  16: number;
  20: number;
  24: number;
  32: number;
}

// ─── Typography tokens ─────────────────────────────────────────────────────────

export type NativeFontWeight =
  | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

export interface NativeTypographyScale {
  fontSize: number;
  lineHeight: number;
  fontWeight: NativeFontWeight;
  letterSpacing?: number;
}

export interface NativeTypographyTokens {
  xs: NativeTypographyScale;
  sm: NativeTypographyScale;
  base: NativeTypographyScale;
  lg: NativeTypographyScale;
  xl: NativeTypographyScale;
  '2xl': NativeTypographyScale;
  '3xl': NativeTypographyScale;
  '4xl': NativeTypographyScale;
}

// ─── Motion tokens ─────────────────────────────────────────────────────────────

export interface NativeMotionTokens {
  durationInstant: number;  // ms
  durationFast: number;
  durationNormal: number;
  durationSlow: number;
  durationSlower: number;
}

// ─── Shadow tokens ─────────────────────────────────────────────────────────────

export interface NativeShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number; // Android
}

export interface NativeShadowTokens {
  sm: NativeShadowStyle;
  md: NativeShadowStyle;
  lg: NativeShadowStyle;
  xl: NativeShadowStyle;
}

// ─── Full native token set ─────────────────────────────────────────────────────

export interface NativeTokens {
  /** Brand identifier */
  brandId: string;
  /** Color mode */
  mode: 'light' | 'dark';
  /** Resolved color tokens */
  color: NativeColorTokens;
  /** Shape (border radius) tokens */
  shape: NativeShapeTokens;
  /** Spacing scale in DPs */
  spacing: NativeSpacingTokens;
  /** Typography scale */
  typography: NativeTypographyTokens;
  /** Motion durations in ms */
  motion: NativeMotionTokens;
  /** Shadow styles */
  shadow: NativeShadowTokens;
}

export type BrandId = 'default' | 'luxury' | 'adventure' | 'eco';
export type ColorMode = 'light' | 'dark';
