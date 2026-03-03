/**
 * Motion utilities for the Travel Design System.
 *
 * All helpers resolve animation durations and easings from CSS custom properties
 * and automatically respect `prefers-reduced-motion: reduce` by collapsing
 * animations to instant opacity transitions.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type Duration = 'instant' | 'fast' | 'normal' | 'slow' | 'slower';
export type Easing = 'ease-out' | 'ease-in' | 'ease-in-out' | 'spring';
export type AnimationPreset =
  | 'fade-in'
  | 'fade-out'
  | 'slide-up'
  | 'slide-down'
  | 'scale-in'
  | 'scale-out'
  | 'skeleton-pulse'
  | 'skeleton-shimmer';

// ─── CSS variable helpers ─────────────────────────────────────────────────────

const DUR: Record<Duration, string> = {
  instant: 'var(--duration-instant, 0ms)',
  fast:    'var(--duration-fast, 100ms)',
  normal:  'var(--duration-normal, 200ms)',
  slow:    'var(--duration-slow, 300ms)',
  slower:  'var(--duration-slower, 500ms)',
};

const EASE: Record<Easing, string> = {
  'ease-out':    'var(--easing-ease-out, cubic-bezier(0, 0, 0.2, 1))',
  'ease-in':     'var(--easing-ease-in, cubic-bezier(0.4, 0, 1, 1))',
  'ease-in-out': 'var(--easing-ease-in-out, cubic-bezier(0.4, 0, 0.2, 1))',
  'spring':      'var(--easing-spring, cubic-bezier(0.34, 1.56, 0.64, 1))',
};

// ─── Core helpers ─────────────────────────────────────────────────────────────

/**
 * Returns a CSS `transition` value using design token durations and easings.
 * When `prefers-reduced-motion: reduce` is active, collapses to instant.
 *
 * @example
 * ```tsx
 * <div style={{ transition: transition('opacity', 'normal', 'ease-out') }} />
 * ```
 */
export function transition(
  property: string | string[] = 'all',
  duration: Duration = 'normal',
  easing: Easing = 'ease-out',
): string {
  const props = Array.isArray(property) ? property : [property];
  const dur = DUR[duration];
  const ease = EASE[easing];
  return props.map((p) => `${p} ${dur} ${ease}`).join(', ');
}

/**
 * Returns a CSS `animation` string using design token animation presets.
 *
 * @example
 * ```tsx
 * <div style={{ animation: animate('fade-in') }} />
 * ```
 */
export function animate(preset: AnimationPreset): string {
  const presetMap: Record<AnimationPreset, string> = {
    'fade-in':          `var(--animation-fade-in, fade-in ${DUR.normal} ${EASE['ease-out']} both)`,
    'fade-out':         `var(--animation-fade-out, fade-out ${DUR.normal} ${EASE['ease-in']} both)`,
    'slide-up':         `var(--animation-slide-up, slide-up ${DUR.normal} ${EASE['ease-out']} both)`,
    'slide-down':       `var(--animation-slide-down, slide-down ${DUR.normal} ${EASE['ease-out']} both)`,
    'scale-in':         `var(--animation-scale-in, scale-in ${DUR.fast} ${EASE.spring} both)`,
    'scale-out':        `var(--animation-scale-out, scale-out ${DUR.fast} ${EASE['ease-in']} both)`,
    'skeleton-pulse':   `var(--animation-skeleton-pulse, skeleton-pulse 1.5s ${EASE['ease-in-out']} infinite)`,
    'skeleton-shimmer': `var(--animation-skeleton-shimmer, skeleton-shimmer 1.8s linear infinite)`,
  };
  return presetMap[preset];
}

/**
 * Wraps a CSS value in a `@media (prefers-reduced-motion: no-preference)`
 * guard by returning `{full}` if motion is allowed, or `{reduced}` if not.
 *
 * Used in JS/inline styles. For Tailwind/CSS-based usage, rely on the
 * `motion-safe:` and `motion-reduce:` variants instead.
 *
 * @example
 * ```tsx
 * const transitionValue = reduceMotion(
 *   transition('transform', 'normal', 'spring'),
 *   'opacity 0ms',
 * );
 * ```
 */
export function reduceMotion(full: string, reduced = 'none'): string {
  if (typeof window === 'undefined') return full;
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return motionQuery.matches ? reduced : full;
}

// ─── Tailwind class maps ──────────────────────────────────────────────────────

/**
 * Tailwind animation utility class names backed by CSS custom property keyframes.
 * Pair with `motion-safe:` prefix for automatic reduced-motion support.
 *
 * @example
 * ```tsx
 * <div className={`motion-safe:${ANIMATE_CLASS['fade-in']}`} />
 * ```
 */
export const ANIMATE_CLASS: Record<AnimationPreset, string> = {
  'fade-in':          'animate-[fade-in_var(--duration-normal)_var(--easing-ease-out)_both]',
  'fade-out':         'animate-[fade-out_var(--duration-normal)_var(--easing-ease-in)_both]',
  'slide-up':         'animate-[slide-up_var(--duration-normal)_var(--easing-ease-out)_both]',
  'slide-down':       'animate-[slide-down_var(--duration-normal)_var(--easing-ease-out)_both]',
  'scale-in':         'animate-[scale-in_var(--duration-fast)_var(--easing-spring)_both]',
  'scale-out':        'animate-[scale-out_var(--duration-fast)_var(--easing-ease-in)_both]',
  'skeleton-pulse':   'animate-[skeleton-pulse_1.5s_var(--easing-ease-in-out)_infinite]',
  'skeleton-shimmer': 'animate-[skeleton-shimmer_1.8s_linear_infinite]',
};
