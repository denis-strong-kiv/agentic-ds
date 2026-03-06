'use client';

import * as React from 'react';
import { ChevronDown, CircleX, SlidersHorizontal } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Popover, PopoverTrigger, PopoverContent } from '../../ui/popover/index';

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

  // Shared inner content
  const chipInner = (
    <span className="travel-filter-chip-inner">
      {isAllFilters && (
        <SlidersHorizontal size={14} className="travel-filter-chip-filter-icon" aria-hidden />
      )}
      <span className="travel-filter-chip-label">{displayLabel}</span>
      {count !== undefined && count > 0 && (
        <span className="travel-filter-chip-count" aria-label={`${count} active filters`}>
          {count}
        </span>
      )}
      {!isAllFilters && !isActive && (
        <ChevronDown size={12} className="travel-filter-chip-arrow" aria-hidden />
      )}
    </span>
  );

  // Simple button chips (all-filters, toggle-only)
  if (isAllFilters || !popoverContent) {
    return (
      <button
        type="button"
        className={cn(
          'travel-filter-chip',
          isAllFilters && 'travel-filter-chip--all-filters',
          isActive && 'travel-filter-chip--set',
          !onClear && isActive && 'travel-filter-chip--set-full',
          className,
        )}
        onClick={onClick}
        aria-pressed={isActive}
      >
        {chipInner}
        {isActive && onClear && (
          <span
            role="button"
            tabIndex={0}
            className="travel-filter-chip-clear-icon"
            aria-label={`Remove ${label} filter`}
            onClick={e => { e.stopPropagation(); onClear(); }}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onClear(); } }}
          >
            <CircleX size={16} aria-hidden />
          </span>
        )}
      </button>
    );
  }

  // Chip with popover — split into trigger + clear to avoid nested buttons
  return (
    <div className={cn('travel-filter-chip-wrap', isActive && 'travel-filter-chip-wrap--set', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              'travel-filter-chip',
              isActive && 'travel-filter-chip--set',
              isActive && onClear && 'travel-filter-chip--set-split',
            )}
            aria-pressed={isActive}
          >
            {chipInner}
            {/* Clear icon inside trigger when no external clear handler needed */}
            {isActive && !onClear && (
              <CircleX size={16} className="travel-filter-chip-clear-icon" aria-hidden />
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="travel-filter-chip-popover" align="start" sideOffset={6}>
          {popoverContent}
        </PopoverContent>
      </Popover>

      {/* Separate clear button — avoids nested <button> */}
      {isActive && onClear && (
        <button
          type="button"
          className="travel-filter-chip-clear"
          onClick={onClear}
          aria-label={`Remove ${label} filter`}
        >
          <CircleX size={16} aria-hidden />
        </button>
      )}
    </div>
  );
}
