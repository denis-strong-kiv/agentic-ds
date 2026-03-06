import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

// Hover/active states are derived in CSS via OKLCH relative color syntax:
//   oklch(from <base> calc(l - 0.07) c h)  → 7% darker lightness, same chroma + hue
// White-alpha for inverted surfaces:
//   oklch(100% 0 0 / 0.8)                  → white at 80% opacity

const buttonVariants = cva(
  ['ui-button'],
  {
    variants: {
      variant: {
        primary: ['ui-button--primary'],
        secondary: ['ui-button--secondary'],
        tertiary: ['ui-button--tertiary'],
        neutral: ['ui-button--neutral'],
        'inverted-primary': ['ui-button--inverted-primary'],
        'inverted-secondary': ['ui-button--inverted-secondary'],
        'inverted-tertiary': ['ui-button--inverted-tertiary'],
        outline: ['ui-button--outline'],
        ghost: ['ui-button--ghost'],
        destructive: ['ui-button--destructive'],
        link: ['ui-button--link'],
      },
      size: {
        sm: 'ui-button--sm',
        md: 'ui-button--md',
        lg: 'ui-button--lg',
        xl: 'ui-button--xl',
        icon: 'ui-button--icon',
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
