// ─── Cloudflare env bindings ─────────────────────────────────────────────────

export interface Env {
  DB: D1Database;
  KV: KVNamespace;
  BUCKET: R2Bucket;
}

// ─── Color ───────────────────────────────────────────────────────────────────

export type ColorStep =
  | '50'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | '950';

export type ColorScale = Record<ColorStep, string>;

export const VALID_SCALE_STEPS: ColorStep[] = [
  '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950',
];

// ─── Primitives ───────────────────────────────────────────────────────────────

export interface Primitives {
  spacing?: { base?: string; scale?: number[] };
  borderRadius?: { sm?: string; md?: string; lg?: string; xl?: string; full?: string };
  motion?: {
    durationFast?: string;
    durationBase?: string;
    durationSlow?: string;
    easingStandard?: string;
    easingDecelerate?: string;
    easingAccelerate?: string;
  };
  elevation?: { sm?: string; md?: string; lg?: string; xl?: string };
}

export const PLATFORM_DEFAULTS: Required<Primitives> = {
  spacing: { base: '1rem', scale: [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8] },
  borderRadius: { sm: '2px', md: '4px', lg: '8px', xl: '16px', full: '9999px' },
  motion: {
    durationFast: '150ms',
    durationBase: '250ms',
    durationSlow: '400ms',
    easingStandard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easingDecelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    easingAccelerate: 'cubic-bezier(0.4, 0, 1, 1)',
  },
  elevation: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.07)',
    lg: '0 10px 15px rgba(0,0,0,0.10)',
    xl: '0 20px 25px rgba(0,0,0,0.15)',
  },
};

// ─── Brand ────────────────────────────────────────────────────────────────────

export interface Brand {
  id: string;
  displayName: string;
  seedColor: { l: number; c: number; h: number };
  fonts: { display: string; heading: string; body: string };
  primitives: Primitives | null;
  colorScale: { light: ColorScale; dark: ColorScale };
  validStatus: 'pending' | 'valid' | 'invalid';
  createdAt: string;
  updatedAt: string;
}

export interface BrandInput {
  id: string;
  displayName: string;
  seedColor: { l: number; c: number; h: number };
  fonts: { display: string; heading: string; body: string };
  primitives?: Primitives;
}

export interface BrandPatch {
  displayName?: string;
  seedColor?: { l: number; c: number; h: number };
  fonts?: { display?: string; heading?: string; body?: string };
  primitives?: Primitives;
}

// ─── Tokens ───────────────────────────────────────────────────────────────────

export interface SemanticToken {
  name: string;
  tier1RefLight: string | null;
  tier1RefDark: string | null;
  primitiveRef: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SemanticTokenInput {
  name: string;
  tier1RefLight?: string;
  tier1RefDark?: string;
  primitiveRef?: string;
  description?: string;
}

export interface ComponentToken {
  name: string;
  semanticToken: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ComponentTokenInput {
  name: string;
  semanticToken: string;
  description?: string;
}

export interface Override {
  brandId: string;
  componentToken: string;
  semanticTokenOverride: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Validation ───────────────────────────────────────────────────────────────

export interface FieldError {
  field: string;
  message: string;
}

export interface ValidationError {
  code: 'BROKEN_REF' | 'CIRCULAR_REF' | 'CONTRAST_FAIL';
  token?: string;
  ref?: string;
  foreground?: string;
  background?: string;
  scheme?: 'light' | 'dark';
  actual?: number;
  required?: number;
  cycle?: string[];
  message: string;
}

export interface ValidationReport {
  id: string;
  brandId: string;
  status: 'pass' | 'fail';
  runAt: string;
  errors: ValidationError[];
}

// ─── Token resolution ─────────────────────────────────────────────────────────

export interface TokenMap {
  palette: ColorScale;
  semantic: Record<string, string>;
  component: Record<string, string>;
  typography: {
    'font.family.display': string;
    'font.family.heading': string;
    'font.family.body': string;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  motion: Record<string, string>;
  elevation: Record<string, string>;
}
