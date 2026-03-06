'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '../../../utils/cn.js';

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn('ui-avatar', className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('ui-avatar-image', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn('ui-avatar-fallback', className)}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export interface AvatarStatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: 'online' | 'away' | 'busy' | 'offline';
}

/** Status indicator dot overlay for Avatar */
export function AvatarStatus({ status, className, ...props }: AvatarStatusProps) {
  const colorMap = {
    online: 'var(--color-success-default)',
    away: 'var(--color-warning-default)',
    busy: 'var(--color-error-default)',
    offline: 'var(--color-foreground-subtle)',
  };

  return (
    <span
      className={cn(
        'ui-avatar-status',
        className,
      )}
      role="img"
      style={{ backgroundColor: colorMap[status] }}
      aria-label={status}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
