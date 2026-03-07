'use client';

import * as React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Popover, PopoverTrigger, PopoverContent } from '../../ui/popover/index';
import { OtaCancelCircleFill, OtaArrowDown04Round } from '../../ui/icon/ota-icons';

// ─── AllFiltersChip ───────────────────────────────────────────────────────────
// Always first in the bar. Shows a count badge of applied filters.
// Clicking opens the full filter sidebar.

export interface AllFiltersChipProps {
  count?: number;
  isActive?: boolean;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function AllFiltersChip({ count, isActive = false, onClick, className, style }: AllFiltersChipProps) {
  return (
    <button
      type="button"
      className={cn('travel-filter-chip travel-filter-chip--all-filters', isActive && 'travel-filter-chip--all-filters-open', className)}
      style={style}
      onClick={onClick}
      aria-pressed={isActive}
    >
      <span className="travel-filter-chip-inner">
        <SlidersHorizontal size={14} className="travel-filter-chip-filter-icon" aria-hidden />
        <span className="travel-filter-chip-label">All filters</span>
        {count !== undefined && count > 0 && (
          <span className="travel-filter-chip-count" aria-label={`${count} active filters`}>
            {count}
          </span>
        )}
      </span>
    </button>
  );
}

// ─── QuickFilterChip ──────────────────────────────────────────────────────────
// Represents a single option from any filter type (e.g. "Nonstop only").
// No dropdown — click to toggle. Setting it dismisses the original filter chip.

export interface QuickFilterChipProps {
  label: string;
  isActive?: boolean;
  onClick: () => void;
  onClear?: () => void;
  /** When active, clicking the chip label opens this popover instead of dismissing the filter. */
  popoverContent?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  'data-flip-id'?: string;
}

export function QuickFilterChip({
  label,
  isActive = false,
  onClick,
  onClear,
  popoverContent,
  onOpenChange,
  className,
  style,
  'data-flip-id': flipId,
}: QuickFilterChipProps) {
  const chipInner = (
    <span className="travel-filter-chip-inner">
      <span className="travel-filter-chip-label">{label}</span>
    </span>
  );

  const clearIcon = onClear && (
    <span
      role="button"
      tabIndex={0}
      className="travel-filter-chip-clear-icon"
      aria-label={`Remove ${label} filter`}
      onClick={e => { e.stopPropagation(); onClear(); }}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onClear(); } }}
    >
      <OtaCancelCircleFill size={16} aria-hidden />
    </span>
  );

  // Active + popover: label opens filter interface, X dismisses
  if (isActive && popoverContent) {
    return (
      <div
        data-flip-id={flipId}
        className={cn('travel-filter-chip-wrap', className)}
        style={style}
      >
        <Popover {...(onOpenChange !== undefined ? { onOpenChange } : {})}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn('travel-filter-chip', 'travel-filter-chip--set')}
              aria-pressed
            >
              {chipInner}
              {clearIcon}
            </button>
          </PopoverTrigger>
          <PopoverContent className="travel-filter-chip-popover" align="start" sideOffset={6}>
            {popoverContent}
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  // Inactive: click activates. Active (no popover): click does nothing — only X dismisses.
  return (
    <button
      type="button"
      data-flip-id={flipId}
      className={cn(
        'travel-filter-chip',
        isActive && 'travel-filter-chip--set',
        className,
      )}
      style={style}
      onClick={isActive ? undefined : onClick}
      aria-pressed={isActive}
    >
      {chipInner}
      {isActive && clearIcon}
    </button>
  );
}

// ─── FilterChip ───────────────────────────────────────────────────────────────
// Normal filter chip with a dropdown arrow. Opens a popover with the filter UI.
// When a value is set it shows the active label + a clear button and flies to
// the first position in the bar.

export interface FilterChipProps {
  label: string;
  activeLabel?: string;
  isActive?: boolean;
  popoverContent?: React.ReactNode;
  onClear?: () => void;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  'data-flip-id'?: string;
}

export function FilterChip({
  label,
  activeLabel,
  isActive = false,
  popoverContent,
  onClear,
  onOpenChange,
  className,
  style,
  'data-flip-id': flipId,
}: FilterChipProps) {
  const displayLabel = isActive && activeLabel ? activeLabel : label;

  const chipInner = (
    <span className="travel-filter-chip-inner">
      <span className="travel-filter-chip-label">{displayLabel}</span>
    </span>
  );

  // No popover — plain button (placeholder chips, or degenerate use)
  if (!popoverContent) {
    return (
      <button
        type="button"
        data-flip-id={flipId}
        className={cn(
          'travel-filter-chip',
          isActive && 'travel-filter-chip--set',
          className,
        )}
        style={style}
        aria-pressed={isActive}
      >
        {chipInner}
        {!isActive && <OtaArrowDown04Round size={8} className="travel-filter-chip-arrow" aria-hidden />}
        {isActive && onClear && (
          <span
            role="button"
            tabIndex={0}
            className="travel-filter-chip-clear-icon"
            aria-label={`Remove ${label} filter`}
            onClick={e => { e.stopPropagation(); onClear(); }}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onClear(); } }}
          >
            <OtaCancelCircleFill size={16} aria-hidden />
          </span>
        )}
      </button>
    );
  }

  // Chip with popover — inline clear icon (same pattern as QuickFilterChip)
  return (
    <div
      data-flip-id={flipId}
      className={cn('travel-filter-chip-wrap', className)}
      style={style}
    >
      <Popover {...(onOpenChange !== undefined ? { onOpenChange } : {})}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn('travel-filter-chip', isActive && 'travel-filter-chip--set')}
            aria-pressed={isActive}
          >
            {chipInner}
            {!isActive && <OtaArrowDown04Round size={8} className="travel-filter-chip-arrow" aria-hidden />}
            {isActive && onClear && (
              <span
                role="button"
                tabIndex={0}
                className="travel-filter-chip-clear-icon"
                aria-label={`Remove ${label} filter`}
                onClick={e => { e.stopPropagation(); onClear(); }}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onClear(); } }}
              >
                <OtaCancelCircleFill size={16} aria-hidden />
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="travel-filter-chip-popover" align="start" sideOffset={6}>
          {popoverContent}
        </PopoverContent>
      </Popover>
    </div>
  );
}
