import * as React from 'react';
import { cn } from '../../utils/cn';

export interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The id of the main content area to skip to (without the `#`). */
  href?: string;
}

/**
 * Skip Navigation Link — WCAG 2.4.1 Bypass Blocks (Level A).
 *
 * Renders a visually hidden anchor that becomes visible on keyboard focus,
 * allowing keyboard users to skip repetitive navigation.
 *
 * @example
 * <SkipLink href="#main-content" />
 * <nav>…</nav>
 * <main id="main-content">…</main>
 */
export function SkipLink({ href = '#main-content', children = 'Skip to main content', className, ...props }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        // Visually hidden until focused
        'sr-only focus:not-sr-only',
        // Position and style when visible
        'focus:fixed focus:start-4 focus:top-4 focus:z-[9999]',
        'focus:inline-block focus:rounded-md',
        'focus:bg-[var(--color-primary-default)] focus:px-4 focus:py-2',
        'focus:text-sm focus:font-semibold focus:text-[var(--color-primary-foreground)]',
        'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-default)] focus:ring-offset-2',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
