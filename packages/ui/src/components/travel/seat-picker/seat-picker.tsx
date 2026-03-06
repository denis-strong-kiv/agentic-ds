'use client';

import * as React from 'react';
import { cn } from '../../../utils/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SeatStatus = 'available' | 'occupied' | 'selected' | 'premium' | 'exit-row';
export type FareClass = 'economy' | 'premium-economy' | 'business' | 'first';

export interface Seat {
  id: string;
  row: number;
  column: string;
  status: SeatStatus;
  fareClass?: FareClass;
  price?: string;
  isExitRow?: boolean;
}

export interface SeatPickerProps {
  seats: Seat[];
  selectedSeatIds?: string[];
  onSeatSelect?: (seatId: string) => void;
  maxSelections?: number;
  className?: string;
}

// ─── Seat status colors ───────────────────────────────────────────────────────

function getSeatStyle(seat: Seat, isSelected: boolean): string {
  if (isSelected) {
    return 'bg-[var(--color-primary-default)] text-[var(--color-primary-foreground)] border-[var(--color-primary-default)]';
  }
  switch (seat.status) {
    case 'occupied':
      return 'bg-[var(--color-background-subtle)] text-[var(--color-foreground-subtle)] border-[var(--color-border-muted)] cursor-not-allowed opacity-50';
    case 'premium':
      return 'bg-[var(--color-accent-default)]/20 text-[var(--color-accent-default)] border-[var(--color-accent-default)] hover:bg-[var(--color-accent-default)]/30 cursor-pointer';
    case 'exit-row':
      return 'bg-[var(--color-warning-default)]/20 text-[var(--color-warning-default)] border-[var(--color-warning-default)] hover:bg-[var(--color-warning-default)]/30 cursor-pointer';
    case 'available':
    default:
      return 'bg-[var(--color-surface-card)] text-[var(--color-foreground-default)] border-[var(--color-border-default)] hover:bg-[var(--color-background-subtle)] cursor-pointer';
  }
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function SeatLegend() {
  const items = [
    { color: 'bg-[var(--color-surface-card)] border-[var(--color-border-default)]', label: 'Available' },
    { color: 'bg-[var(--color-primary-default)]', label: 'Selected' },
    { color: 'bg-[var(--color-accent-default)]/20 border-[var(--color-accent-default)]', label: 'Premium' },
    { color: 'bg-[var(--color-warning-default)]/20 border-[var(--color-warning-default)]', label: 'Exit row' },
    { color: 'bg-[var(--color-background-subtle)] border-[var(--color-border-muted)] opacity-50', label: 'Occupied' },
  ];

  return (
    <div className="flex flex-wrap gap-3 mt-4" aria-label="Seat legend">
      {items.map(item => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div className={cn('h-5 w-5 rounded-sm border', item.color)} aria-hidden />
          <span className="text-xs text-[var(--color-foreground-muted)]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── SeatPicker ───────────────────────────────────────────────────────────────

export function SeatPicker({
  seats,
  selectedSeatIds = [],
  onSeatSelect,
  maxSelections = 1,
  className,
}: SeatPickerProps) {
  // Group seats by row
  const rows = React.useMemo(() => {
    const map = new Map<number, Seat[]>();
    for (const seat of seats) {
      const row = map.get(seat.row) ?? [];
      row.push(seat);
      map.set(seat.row, row);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [seats]);

  // Get unique columns to determine aisle position
  const columns = React.useMemo(() => {
    const cols = new Set(seats.map(s => s.column));
    return Array.from(cols).sort();
  }, [seats]);

  const aisleAfter = Math.floor(columns.length / 2) - 1;

  function handleSeatClick(seat: Seat) {
    if (seat.status === 'occupied') return;
    if (selectedSeatIds.includes(seat.id)) {
      onSeatSelect?.(seat.id); // deselect
      return;
    }
    if (selectedSeatIds.length >= maxSelections) return;
    onSeatSelect?.(seat.id);
  }

  function handleKeyDown(e: React.KeyboardEvent, seat: Seat) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSeatClick(seat);
    }
  }

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      {/* Aircraft nose indicator */}
      <div className="text-center mb-4">
        <span className="text-xs text-[var(--color-foreground-muted)] uppercase tracking-wider">Front of aircraft ▲</span>
      </div>

      {/* Column headers */}
      <div className="flex items-center justify-center gap-1 mb-1 pl-8">
        {columns.map((col, idx) => (
          <React.Fragment key={col}>
            <div className="w-9 text-center text-xs font-medium text-[var(--color-foreground-muted)]">
              {col}
            </div>
            {idx === aisleAfter && <div className="w-6" />}
          </React.Fragment>
        ))}
      </div>

      {/* Seat grid */}
      <div className="space-y-1" role="group" aria-label="Seat map">
        {rows.map(([rowNum, rowSeats]) => {
          const isExitRow = rowSeats.some(s => s.isExitRow);
          const seatsByColumn = new Map(rowSeats.map(s => [s.column, s]));

          return (
            <div key={rowNum}>
              {isExitRow && (
                <div className="text-center text-xs text-[var(--color-warning-default)] my-1 font-medium">
                  ← EXIT ROW →
                </div>
              )}
              <div className="flex items-center justify-center gap-1">
                {/* Row number */}
                <span className="w-7 text-right text-xs text-[var(--color-foreground-muted)] flex-shrink-0">
                  {rowNum}
                </span>

                {columns.map((col, idx) => {
                  const seat = seatsByColumn.get(col);
                  if (!seat) {
                    return (
                      <React.Fragment key={col}>
                        <div className="w-9 h-9" />
                        {idx === aisleAfter && <div className="w-6" />}
                      </React.Fragment>
                    );
                  }

                  const isSelected = selectedSeatIds.includes(seat.id);
                  const disabled = seat.status === 'occupied';

                  return (
                    <React.Fragment key={col}>
                      <div
                        role="button"
                        tabIndex={disabled ? -1 : 0}
                        aria-pressed={isSelected}
                        aria-disabled={disabled}
                        aria-label={`Seat ${rowNum}${col}${seat.price ? `, ${seat.price}` : ''}${isSelected ? ', selected' : ''}${disabled ? ', occupied' : ''}`}
                        onClick={() => handleSeatClick(seat)}
                        onKeyDown={e => handleKeyDown(e, seat)}
                        className={cn(
                          'w-9 h-9 flex items-center justify-center text-xs rounded-sm border transition-colors',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-default)]',
                          getSeatStyle(seat, isSelected),
                        )}
                      >
                        {col}
                      </div>
                      {idx === aisleAfter && <div className="w-6" aria-hidden />}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <SeatLegend />
    </div>
  );
}
