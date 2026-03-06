'use client';

import * as React from 'react';
import { cn } from '../../../utils/cn.js';
import { Popover, PopoverTrigger, PopoverContent } from '../../ui/popover/index.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FilterChipProps {
  /** Inactive label e.g. "Price" */
  label: string;
  /** Summary shown when active e.g. "Up to $1,200" */
  activeLabel?: string;
  isActive?: boolean;
  /** Badge count shown on AllFilters chip */
  count?: number;
  /** Renders the "All filters" pill with filter icon */
  isAllFilters?: boolean;
  /** Popover content — if omitted the chip acts as a toggle button */
  popoverContent?: React.ReactNode;
  /** Clears this filter — renders × button when active */
  onClear?: () => void;
  onClick?: () => void;
  className?: string;
}

// ─── FilterChip ───────────────────────────────────────────────────────────────

export function FilterChip({
  label,
  activeLabel,
  isActive = false,
  count,
  isAllFilters = false,
  popoverContent,
  onClear,
  onClick,
  className,
}: FilterChipProps) {
  const displayLabel = isActive && activeLabel ? activeLabel : label;

  const chipContent = (
    <span className="travel-filter-chip-inner">
      {isAllFilters && (
        <svg className="travel-filter-chip-filter-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
      <span className="travel-filter-chip-label">{displayLabel}</span>
      {count !== undefined && count > 0 && (
        <span className="travel-filter-chip-count" aria-label={`${count} active filters`}>
          {count}
        </span>
      )}
      {!isAllFilters && !isActive && (
        <svg className="travel-filter-chip-arrow" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );

  // AllFilters chip — no popover, just onClick
  if (isAllFilters || !popoverContent) {
    return (
      <button
        type="button"
        className={cn(
          'travel-filter-chip',
          isAllFilters && 'travel-filter-chip--all-filters',
          isActive && 'travel-filter-chip--active',
          className,
        )}
        onClick={onClick}
        aria-pressed={isActive}
      >
        {chipContent}
      </button>
    );
  }

  // Chip with popover
  return (
    <div className={cn('travel-filter-chip-wrap', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              'travel-filter-chip',
              isActive && 'travel-filter-chip--active',
            )}
            aria-pressed={isActive}
          >
            {chipContent}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="travel-filter-chip-popover"
          align="start"
          sideOffset={6}
        >
          {popoverContent}
        </PopoverContent>
      </Popover>

      {/* Clear button — separate from trigger so it doesn't open the popover */}
      {isActive && onClear && (
        <button
          type="button"
          className="travel-filter-chip-clear"
          onClick={onClear}
          aria-label={`Remove ${label} filter`}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
