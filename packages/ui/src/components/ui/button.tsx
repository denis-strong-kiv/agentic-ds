import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium',
    'transition-[colors,transform,box-shadow] duration-[var(--duration-normal)] ease-[var(--easing-ease-out)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-default)] focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'rounded-[var(--shape-preset-button)]',
    // Micro-interactions
    'motion-safe:active:scale-[0.98]',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-[var(--color-primary-default)] text-[var(--color-primary-foreground)]',
          'hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)]',
        ],
        secondary: [
          'bg-[var(--color-surface-card)] text-[var(--color-foreground-default)]',
          'border border-[var(--color-border-default)]',
          'hover:bg-[var(--color-background-subtle)] active:bg-[var(--color-border-default)]',
        ],
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
          'hover:opacity-90 active:opacity-80',
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
