import * as React from 'react';
import { cn } from '../../utils/cn.js';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Error message — displayed below the input and sets aria-describedby */
  error?: string | undefined;
  /** Element rendered inside the input on the left */
  leftSlot?: React.ReactNode;
  /** Element rendered inside the input on the right */
  rightSlot?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, leftSlot, rightSlot, id, ...props }, ref) => {
    const errorId = error && id ? `${id}-error` : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        <div className="relative flex items-center">
          {leftSlot && (
            <div className="absolute left-3 flex items-center pointer-events-none text-[var(--color-foreground-subtle)]">
              {leftSlot}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'flex h-10 w-full rounded-[var(--shape-preset-input)]',
              'border border-[var(--color-border-default)]',
              'bg-[var(--color-surface-card)] text-[var(--color-foreground-default)]',
              'px-3 py-2 text-sm',
              'placeholder:text-[var(--color-foreground-subtle)]',
              'transition-colors duration-[var(--duration-normal)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-default)]',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-background-subtle)]',
              error && 'border-[var(--color-error-default)] bg-[var(--color-error-subtle)] focus-visible:ring-[var(--color-error-default)]',
              leftSlot && 'pl-9',
              rightSlot && 'pr-9',
              className,
            )}
            aria-describedby={errorId}
            aria-invalid={!!error}
            {...props}
          />
          {rightSlot && (
            <div className="absolute right-3 flex items-center pointer-events-none text-[var(--color-foreground-subtle)]">
              {rightSlot}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-sm text-[var(--color-error-default)]" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';
