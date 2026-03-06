import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Icon } from '../icon/index';

const alertVariants = cva(
  ['ui-alert'],
  {
    variants: {
      variant: {
        info: ['ui-alert--info'],
        success: ['ui-alert--success'],
        warning: ['ui-alert--warning'],
        error: ['ui-alert--error'],
      },
    },
    defaultVariants: { variant: 'info' },
  },
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  /** Optional dismiss callback — renders a close button when provided */
  onDismiss?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, onDismiss, children, ...props }, ref) => (
    <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
      {children}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ui-alert-dismiss"
          aria-label="Dismiss"
        >
          <Icon icon={X} size="sm" />
        </button>
      )}
    </div>
  ),
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('ui-alert-title', className)}
      {...props}
    />
  ),
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('ui-alert-description', className)} {...props} />
  ),
);
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
