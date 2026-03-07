import * as React from 'react';
import { type LucideIcon, type LucideProps } from 'lucide-react';
import type { OtaIcon } from './ota-icons';

const sizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export interface IconProps extends Omit<LucideProps, 'size' | 'ref'> {
  /** A Lucide icon or a custom OTA icon component */
  icon: LucideIcon | OtaIcon;
  /**
   * Named size from the design system scale, or an explicit pixel number.
   * @default 'md'
   */
  size?: keyof typeof sizes | number;
  /**
   * Accessible label. When provided the icon is announced by screen readers.
   * Omit for decorative icons — they are aria-hidden by default.
   */
  label?: string;
}

/**
 * Thin wrapper around Lucide icons that applies design-system sizing,
 * consistent strokeWidth, and correct accessibility defaults.
 *
 * Decorative (no label):
 *   <Icon icon={Search} size="sm" />
 *
 * Standalone / meaningful (with label):
 *   <Icon icon={AlertCircle} label="Warning" />
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ icon: IconComp, size = 'md', label, className, ...props }, ref) => {
    const px = typeof size === 'number' ? size : sizes[size];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Comp = IconComp as React.ComponentType<any>;

    return (
      <Comp
        ref={ref}
        size={px}
        strokeWidth={1.75}
        aria-hidden={label ? undefined : true}
        aria-label={label}
        className={className}
        {...props}
      />
    );
  },
);
Icon.displayName = 'Icon';
