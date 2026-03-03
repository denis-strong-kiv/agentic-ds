import * as React from 'react';
import { cn } from '../../utils/cn.js';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  /** Show character count (requires maxLength) */
  showCount?: boolean;
  /** Auto-resize height to fit content */
  autoResize?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, showCount, autoResize, id, maxLength, onChange, ...props }, ref) => {
    const [count, setCount] = React.useState(0);
    const errorId = error && id ? `${id}-error` : undefined;

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCount(e.target.value.length);
        if (autoResize) {
          e.target.style.height = 'auto';
          e.target.style.height = `${e.target.scrollHeight}px`;
        }
        onChange?.(e);
      },
      [autoResize, onChange],
    );

    return (
      <div className="flex flex-col gap-1.5">
        <textarea
          ref={ref}
          id={id}
          maxLength={maxLength}
          onChange={handleChange}
          className={cn(
            'flex min-h-[80px] w-full rounded-[var(--shape-preset-input)]',
            'border border-[var(--color-border-default)]',
            'bg-[var(--color-surface-card)] text-[var(--color-foreground-default)]',
            'px-3 py-2 text-sm',
            'placeholder:text-[var(--color-foreground-subtle)]',
            'transition-colors duration-[var(--duration-normal)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-default)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-[var(--color-error-default)] focus-visible:ring-[var(--color-error-default)]',
            autoResize && 'resize-none overflow-hidden',
            className,
          )}
          aria-describedby={errorId}
          aria-invalid={!!error}
          {...props}
        />
        <div className="flex justify-between">
          {error && (
            <p id={errorId} className="text-sm text-[var(--color-error-default)]" role="alert">
              {error}
            </p>
          )}
          {showCount && maxLength && (
            <p className="text-xs text-[var(--color-foreground-muted)] ml-auto">
              {count}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';
