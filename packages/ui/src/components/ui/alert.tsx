import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

const alertVariants = cva(
  [
    'relative w-full rounded-[var(--shape-preset-card)]',
    'border p-4',
    '[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px]',
    '[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:h-4 [&>svg]:w-4',
  ],
  {
    variants: {
      variant: {
        info: [
          'border-[var(--color-info-default)] bg-[var(--color-info-subtle)]',
          'text-[var(--color-foreground-default)]',
          '[&>svg]:text-[var(--color-info-default)]',
        ],
        success: [
          'border-[var(--color-success-default)] bg-[var(--color-success-subtle)]',
          'text-[var(--color-foreground-default)]',
          '[&>svg]:text-[var(--color-success-default)]',
        ],
        warning: [
          'border-[var(--color-warning-default)] bg-[var(--color-warning-subtle)]',
          'text-[var(--color-foreground-default)]',
          '[&>svg]:text-[var(--color-warning-default)]',
        ],
        error: [
          'border-[var(--color-error-default)] bg-[var(--color-error-subtle)]',
          'text-[var(--color-foreground-default)]',
          '[&>svg]:text-[var(--color-error-default)]',
        ],
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
          className="absolute right-4 top-4 opacity-70 hover:opacity-100"
          aria-label="Dismiss"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
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
      className={cn('mb-1 font-medium leading-none tracking-tight', className)}
      {...props}
    />
  ),
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
  ),
);
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
