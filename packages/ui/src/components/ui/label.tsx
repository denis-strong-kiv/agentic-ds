import * as React from 'react';
import { cn } from '../../utils/cn.js';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Mark field as required with a visual indicator */
  required?: boolean;
  /** Helper text below the label */
  helperText?: string;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, helperText, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <label
        ref={ref}
        className={cn(
          'text-sm font-medium text-[var(--color-foreground-default)] leading-none',
          'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          className,
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="ms-1 text-[var(--color-error-default)]" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {helperText && (
        <p className="text-xs text-[var(--color-foreground-muted)]">{helperText}</p>
      )}
    </div>
  ),
);
Label.displayName = 'Label';
