import * as React from 'react';
import { cn } from '../../../utils/cn';

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
    const hasLeftSlot = !!leftSlot;
    const hasRightSlot = !!rightSlot;

    return (
      <div className="ui-input-group">
        <div className="ui-input-shell">
          {leftSlot && (
            <div className="ui-input-slot ui-input-slot--left">
              {leftSlot}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'ui-input',
              error && 'ui-input--error',
              hasLeftSlot && 'ui-input--with-left-slot',
              hasRightSlot && 'ui-input--with-right-slot',
              className,
            )}
            aria-describedby={errorId}
            aria-invalid={!!error}
            {...props}
          />
          {rightSlot && (
            <div className="ui-input-slot ui-input-slot--right">
              {rightSlot}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="ui-input-error-text" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';
