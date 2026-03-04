import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

// Hover/active states are derived in CSS via OKLCH relative color syntax:
//   oklch(from <base> calc(l - 0.07) c h)  → 7% darker lightness, same chroma + hue
// White-alpha for inverted surfaces:
//   oklch(100% 0 0 / 0.8)                  → white at 80% opacity

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold',
    'transition-[colors,transform,box-shadow] duration-[var(--duration-normal)] ease-[var(--easing-ease-out)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-default)] focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'rounded-[var(--shape-preset-button)]',
    'motion-safe:active:scale-[0.98]',
  ],
  {
    variants: {
      variant: {
        // ── Figma: Primary ────────────────────────────────────────────────────
        primary: [
          'bg-[var(--color-primary-default)] text-[var(--color-primary-foreground)]',
          'hover:bg-[oklch(from_var(--color-primary-default)_calc(l_-_0.07)_c_h)]',
          'active:bg-[oklch(from_var(--color-primary-default)_calc(l_-_0.13)_c_h)]',
        ],
        // ── Figma: Secondary ──────────────────────────────────────────────────
        secondary: [
          'bg-transparent text-[var(--color-foreground-default)]',
          'border border-[var(--color-border-default)]',
          'hover:bg-[var(--color-background-subtle)] active:bg-[var(--color-border-muted)]',
        ],
        // ── Figma: Tertiary ───────────────────────────────────────────────────
        // ── Figma: Tertiary ───────────────────────────────────────────────────
        tertiary: [
          'bg-transparent text-[var(--color-foreground-default)]',
          'hover:bg-[var(--color-background-subtle)] active:bg-[var(--color-border-muted)]',
        ],
        // ── Figma: Default (dark neutral fill) ────────────────────────────────
        neutral: [
          'bg-[var(--color-foreground-default)] text-[var(--color-background-default)]',
          'hover:bg-[oklch(from_var(--color-foreground-default)_calc(l_-_0.07)_c_h)]',
          'active:bg-[oklch(from_var(--color-foreground-default)_calc(l_-_0.13)_c_h)]',
        ],
        // ── Figma: Inverted Primary (for dark surfaces) ───────────────────────
        'inverted-primary': [
          'bg-[oklch(100%_0_0)] text-[var(--color-foreground-default)]',
          'hover:bg-[oklch(100%_0_0_/_0.8)] active:bg-[oklch(100%_0_0_/_0.64)]',
        ],
        // ── Figma: Inverted Secondary (for dark surfaces) ─────────────────────
        'inverted-secondary': [
          'bg-transparent text-[oklch(100%_0_0)] border border-[oklch(100%_0_0)]',
          'hover:bg-[oklch(100%_0_0_/_0.2)] active:bg-[oklch(100%_0_0_/_0.32)]',
        ],
        // ── Figma: Inverted Tertiary (for dark surfaces) ──────────────────────
        'inverted-tertiary': [
          'bg-transparent text-[oklch(100%_0_0)]',
          'hover:bg-[oklch(100%_0_0_/_0.2)] active:bg-[oklch(100%_0_0_/_0.32)]',
        ],
        // ── Kept for backward compatibility ───────────────────────────────────
        outline: [
          'border border-[var(--color-primary-default)] text-[var(--color-primary-default)]',
          'hover:bg-[var(--color-background-subtle)]',
        ],
        ghost: [
          'text-[var(--color-foreground-default)]',
          'hover:bg-[var(--color-background-subtle)]',
        ],
        destructive: [
          'bg-[var(--color-error-default)] text-[var(--color-error-foreground)]',
          'hover:bg-[oklch(from_var(--color-error-default)_calc(l_-_0.07)_c_h)]',
          'active:bg-[oklch(from_var(--color-error-default)_calc(l_-_0.13)_c_h)]',
        ],
        link: [
          'text-[var(--color-primary-default)] underline-offset-4 hover:underline',
          'p-0 h-auto',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Shows a loading spinner and disables the button */
  isLoading?: boolean;
  /** Custom spinner element; defaults to an animated SVG ring */
  spinner?: React.ReactNode;
}

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, spinner, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled ?? isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (spinner ?? <Spinner />) : null}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';

export { buttonVariants };
