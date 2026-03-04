'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '../../utils/cn.js';

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      className,
    )}
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
    className={cn('aspect-square h-full w-full object-cover', className)}
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
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full',
      'bg-[var(--color-background-subtle)] text-[var(--color-foreground-muted)]',
      'text-sm font-medium',
      className,
    )}
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
        'absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full',
        'border-2 border-[var(--color-surface-card)]',
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
