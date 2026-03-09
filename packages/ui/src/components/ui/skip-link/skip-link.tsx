import * as React from 'react';
import { cn } from '../../../utils/cn';

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
      className={cn('ui-skip-link', className)}
      {...props}
    >
      {children}
    </a>
  );
}
