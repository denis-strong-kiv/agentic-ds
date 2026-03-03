// ─── Token Validation Types ───────────────────────────────────────────────────

export interface ValidationError {
  code: 'INVALID_OKLCH' | 'BROKEN_REFERENCE' | 'CIRCULAR_REFERENCE' | 'CONTRAST_FAIL';
  token?: string;
  message: string;
}

export interface ContrastResult {
  token: string;
  fg: string;
  bg: string;
  ratio: number;
  passes: boolean;
  size: 'normal' | 'large';
}

export interface ValidationReport {
  brandId: string;
  valid: boolean;
  errors: ValidationError[];
  contrastResults: ContrastResult[];
}
