'use client';

import { cn } from '../../../utils/cn.js';
import { Slider } from '../../ui/slider/index.js';
import { Checkbox } from '../../ui/checkbox/index.js';
import { Label } from '../../ui/label/index.js';
import { FilterChip } from '../filter-chip/index.js';
import type { FilterState, SortOption } from '../filter-panel/index.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  sortBy?: SortOption;
  onSortChange?: (sort: SortOption) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  /** Available airline options for the Airlines chip popover */
  airlineOptions?: Array<{ value: string; label: string }>;
  maxPrice?: number;
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function countActiveFilters(filters: FilterState, maxPrice: number): number {
  let count = 0;
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) count++;
  if (filters.stops.length > 0) count++;
  if (filters.airlines.length > 0) count++;
  if (filters.alliances.length > 0) count++;
  if (filters.departureRange[0] !== 0 || filters.departureRange[1] !== 24) count++;
  if (filters.arrivalRange[0] !== 0 || filters.arrivalRange[1] !== 24) count++;
  return count;
}

function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
}

// ─── Popover contents ─────────────────────────────────────────────────────────

function PricePopover({
  filters,
  onChange,
  maxPrice,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  maxPrice: number;
}) {
  return (
    <div className="travel-filter-bar-popover-body">
      <p className="travel-filter-bar-popover-title">Price range</p>
      <Slider
        min={0}
        max={maxPrice}
        step={10}
        value={filters.priceRange}
        onValueChange={v => onChange({ ...filters, priceRange: v as [number, number] })}
        showValue
        formatValue={v => `$${v}`}
      />
      <div className="travel-filter-bar-range-labels">
        <span>$0</span>
        <span>${maxPrice}+</span>
      </div>
    </div>
  );
}

function StopsPopover({
  filters,
  onChange,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
}) {
  const options: { value: FilterState['stops'][number]; label: string }[] = [
    { value: 'nonstop', label: 'Nonstop only' },
    { value: '1-stop', label: '1 stop or fewer' },
    { value: '2-plus', label: '2+ stops' },
  ];
  return (
    <div className="travel-filter-bar-popover-body">
      <p className="travel-filter-bar-popover-title">Stops</p>
      {options.map(opt => (
        <div key={opt.value} className="travel-filter-bar-popover-row">
          <Checkbox
            id={`bar-stop-${opt.value}`}
            checked={filters.stops.includes(opt.value)}
            onCheckedChange={() =>
              onChange({ ...filters, stops: toggleItem(filters.stops, opt.value) })
            }
          />
          <Label htmlFor={`bar-stop-${opt.value}`}>{opt.label}</Label>
        </div>
      ))}
    </div>
  );
}

function AirlinesPopover({
  filters,
  onChange,
  options,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="travel-filter-bar-popover-body">
      <p className="travel-filter-bar-popover-title">Airlines</p>
      <div className="travel-filter-bar-popover-scroll">
        {options.map(opt => (
          <div key={opt.value} className="travel-filter-bar-popover-row">
            <Checkbox
              id={`bar-airline-${opt.value}`}
              checked={filters.airlines.includes(opt.value)}
              onCheckedChange={() =>
                onChange({ ...filters, airlines: toggleItem(filters.airlines, opt.value) })
              }
            />
            <Label htmlFor={`bar-airline-${opt.value}`}>{opt.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FilterBar ────────────────────────────────────────────────────────────────

export function FilterBar({
  filters,
  onChange,
  sidebarOpen,
  onToggleSidebar,
  airlineOptions = [],
  maxPrice = 2000,
  className,
}: FilterBarProps) {
  const totalActive = countActiveFilters(filters, maxPrice);

  const priceActive = filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice;
  const priceLabel = priceActive
    ? filters.priceRange[0] === 0
      ? `Up to $${filters.priceRange[1]}`
      : `$${filters.priceRange[0]}–$${filters.priceRange[1]}`
    : undefined;

  const stopsActive = filters.stops.length > 0;
  const stopsLabel = stopsActive
    ? filters.stops.includes('nonstop') && filters.stops.length === 1
      ? 'Nonstop only'
      : `${filters.stops.length} stop type${filters.stops.length > 1 ? 's' : ''}`
    : undefined;

  const airlinesActive = filters.airlines.length > 0;
  const airlinesLabel = airlinesActive
    ? filters.airlines.length === 1
      ? filters.airlines[0]
      : `${filters.airlines.length} airlines`
    : undefined;

  const nonstopOnly = filters.stops.length === 1 && filters.stops.includes('nonstop');

  // Active chips sorted to front, inactive after
  return (
    <nav
      className={cn('travel-filter-bar', className)}
      aria-label="Filter options"
    >
      <div className="travel-filter-bar-scroll">
        {/* All filters — always first */}
        <FilterChip
          label="All filters"
          isAllFilters
          isActive={sidebarOpen}
          {...(totalActive > 0 ? { count: totalActive } : {})}
          onClick={onToggleSidebar}
        />

        <div className="travel-filter-bar-divider" role="separator" aria-hidden />

        {/* Active chips first */}
        {priceActive && (
          <FilterChip
            label="Price"
            {...(priceLabel ? { activeLabel: priceLabel } : {})}
            isActive
            onClear={() => onChange({ ...filters, priceRange: [0, maxPrice] })}
            popoverContent={
              <PricePopover filters={filters} onChange={onChange} maxPrice={maxPrice} />
            }
          />
        )}
        {stopsActive && (
          <FilterChip
            label="Stops"
            {...(stopsLabel ? { activeLabel: stopsLabel } : {})}
            isActive
            onClear={() => onChange({ ...filters, stops: [] })}
            popoverContent={
              <StopsPopover filters={filters} onChange={onChange} />
            }
          />
        )}
        {airlinesActive && (
          <FilterChip
            label="Airlines"
            {...(airlinesLabel ? { activeLabel: airlinesLabel } : {})}
            isActive
            onClear={() => onChange({ ...filters, airlines: [] })}
            popoverContent={
              <AirlinesPopover filters={filters} onChange={onChange} options={airlineOptions} />
            }
          />
        )}

        {/* Inactive chips */}
        <FilterChip
          label="Nonstop only"
          isActive={nonstopOnly}
          {...(nonstopOnly ? { onClear: () => onChange({ ...filters, stops: [] }) } : {})}
          onClick={() =>
            onChange({
              ...filters,
              stops: nonstopOnly ? [] : ['nonstop'],
            })
          }
        />

        {!priceActive && (
          <FilterChip
            label="Price"
            popoverContent={
              <PricePopover filters={filters} onChange={onChange} maxPrice={maxPrice} />
            }
          />
        )}
        {!stopsActive && (
          <FilterChip
            label="Stops"
            popoverContent={<StopsPopover filters={filters} onChange={onChange} />}
          />
        )}
        {!airlinesActive && airlineOptions.length > 0 && (
          <FilterChip
            label="Airlines"
            popoverContent={
              <AirlinesPopover filters={filters} onChange={onChange} options={airlineOptions} />
            }
          />
        )}

        {/* Placeholder chips for non-implemented filters */}
        {(['Bags', 'Travel time', 'Layover duration', 'Departure airport', 'Arrival airport'] as const).map(
          label => (
            <FilterChip key={label} label={label} />
          ),
        )}
      </div>
    </nav>
  );
}
