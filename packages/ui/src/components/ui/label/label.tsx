import * as React from 'react';
import { cn } from '../../../utils/cn';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Mark field as required with a visual indicator */
  required?: boolean;
  /** Helper text below the label */
  helperText?: string;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, helperText, ...props }, ref) => (
    <div className="ui-label-wrapper">
      <label
        ref={ref}
        className={cn('ui-label', className)}
        {...props}
      >
        {children}
        {required && (
          <span className="ui-label__required" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {helperText && (
        <p className="ui-label__helper">{helperText}</p>
      )}
    </div>
  ),
);
Label.displayName = 'Label';
