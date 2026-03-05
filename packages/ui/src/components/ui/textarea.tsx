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
      <div className="ui-textarea-group">
        <textarea
          ref={ref}
          id={id}
          maxLength={maxLength}
          onChange={handleChange}
          className={cn(
            'ui-textarea',
            error && 'ui-textarea--error',
            autoResize && 'ui-textarea--auto-resize',
            className,
          )}
          aria-describedby={errorId}
          aria-invalid={!!error}
          {...props}
        />
        <div className="ui-textarea-footer">
          {error && (
            <p id={errorId} className="ui-textarea-error-text" role="alert">
              {error}
            </p>
          )}
          {showCount && maxLength && (
            <p className="ui-textarea-count">
              {count}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';
