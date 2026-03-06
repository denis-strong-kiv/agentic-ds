'use client';

import * as React from 'react';
import { cn } from '../../../utils/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChipProps {
  label: React.ReactNode;
  /** Shows filled active style */
  isActive?: boolean;
  /** Renders a dismiss (×) button inside the chip */
  onDismiss?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

// ─── Chip ─────────────────────────────────────────────────────────────────────

export function Chip({
  label,
  isActive = false,
  onDismiss,
  onClick,
  disabled = false,
  size = 'md',
  className,
}: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        'ui-chip',
        size === 'sm' && 'ui-chip--sm',
        isActive && 'ui-chip--active',
        className,
      )}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isActive}
    >
      <span className="ui-chip-label">{label}</span>
      {onDismiss && (
        <span
          role="button"
          tabIndex={0}
          className="ui-chip-dismiss"
          onClick={(e) => { e.stopPropagation(); onDismiss(); }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onDismiss(); } }}
          aria-label="Remove"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      )}
    </button>
  );
}
