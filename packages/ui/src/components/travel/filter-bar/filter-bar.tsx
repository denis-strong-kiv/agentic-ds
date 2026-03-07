'use client';

import * as React from 'react';
import { cn } from '../../../utils/cn';
import { Slider } from '../../ui/slider/index';
import { Checkbox } from '../../ui/checkbox/index';
import { Label } from '../../ui/label/index';
import { AllFiltersChip, QuickFilterChip, FilterChip } from '../filter-chip/index';
import type { FilterState, SortOption } from '../filter-panel/index';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  sortBy?: SortOption;
  onSortChange?: (sort: SortOption) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  airlineOptions?: Array<{ value: string; label: string }>;
  maxPrice?: number;
  className?: string;
}

// ─── FLIP animation ───────────────────────────────────────────────────────────
// Captures visual positions before a state change, then measures the delta
// after React commits and applies an inverse CSS transform that animates away.

function useFlip() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const savedPositions = React.useRef<Map<string, number>>(new Map());

  const capturePositions = React.useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    savedPositions.current = new Map();
    container.querySelectorAll<HTMLElement>('[data-flip-id]').forEach(el => {
      savedPositions.current.set(el.dataset.flipId!, el.getBoundingClientRect().left);
    });
  }, []);

  // Runs after every commit — applies FLIP if positions were captured
  React.useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || savedPositions.current.size === 0) return;

    container.querySelectorAll<HTMLElement>('[data-flip-id]').forEach(el => {
      const id = el.dataset.flipId!;
      const prevLeft = savedPositions.current.get(id);
      if (prevLeft === undefined) return;

      const newLeft = el.getBoundingClientRect().left;
      const dx = prevLeft - newLeft;
      if (Math.abs(dx) < 2) return;

      // Snap to old position, then animate to new
      el.style.transform = `translateX(${dx}px)`;
      el.style.transition = 'none';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = 'transform 280ms cubic-bezier(0.4, 0, 0.2, 1)';
          el.style.transform = '';
        });
      });
    });

    savedPositions.current.clear();
  });

  return { containerRef, capturePositions };
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
  const { containerRef, capturePositions } = useFlip();

  // ── Derived active states ──────────────────────────────────────────────────

  const totalActive = countActiveFilters(filters, maxPrice);

  const priceActive = filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice;
  const priceLabel = priceActive
    ? filters.priceRange[0] === 0
      ? `Up to $${filters.priceRange[1]}`
      : `$${filters.priceRange[0]}–$${filters.priceRange[1]}`
    : undefined;

  // nonstopOnly is a QuickFilter — exclusively stops = ['nonstop']
  const nonstopOnly = filters.stops.length === 1 && filters.stops.includes('nonstop');
  // stopsActive covers any stops selection that isn't exclusively handled by the QuickFilter
  const stopsActive = filters.stops.length > 0 && !nonstopOnly;
  const stopsLabel = stopsActive
    ? `${filters.stops.length} stop type${filters.stops.length > 1 ? 's' : ''}`
    : undefined;

  const airlinesActive = filters.airlines.length > 0;
  const airlinesLabel = airlinesActive
    ? filters.airlines.length === 1
      ? filters.airlines[0]
      : `${filters.airlines.length} airlines`
    : undefined;

  // ── Activation order ───────────────────────────────────────────────────────
  // Tracks the chronological order chips were activated.
  // First activated = lowest index = leftmost position.
  // Position only changes when a popover closes, not while it's open.

  type ChipKey = 'price' | 'stops' | 'airlines' | 'nonstop';

  const [activeOrder, setActiveOrder] = React.useState<ChipKey[]>([]);
  const [isAnyPopoverOpen, setIsAnyPopoverOpen] = React.useState(false);

  // Snapshot frozen while a popover is open so the bar doesn't shift mid-interaction.
  const frozenRef = React.useRef<{ count: number; order: ChipKey[] }>({ count: 0, order: [] });

  // Whether a chip key is currently active given live filter state
  const isKeyActive = (key: ChipKey): boolean => {
    if (key === 'price') return priceActive;
    if (key === 'stops') return stopsActive;
    if (key === 'airlines') return airlinesActive;
    if (key === 'nonstop') return nonstopOnly;
    return false;
  };

  // ownChangeRef: set to true before calling onChange from within our own handlers so the
  // external-sync effect below can distinguish sidebar changes from chip interactions.
  const ownChangeRef = React.useRef(false);

  // handleChange: called for QuickFilter toggles and clear-button clicks (no popover involved).
  // Updates the activation queue immediately and triggers FLIP.
  const handleChange = React.useCallback((newFilters: FilterState) => {
    capturePositions();
    ownChangeRef.current = true;

    const newNonstopOnly = newFilters.stops.length === 1 && newFilters.stops.includes('nonstop');
    const newStopsActive = newFilters.stops.length > 0 && !newNonstopOnly;
    const newPriceActive = newFilters.priceRange[0] > 0 || newFilters.priceRange[1] < maxPrice;
    const newAirlinesActive = newFilters.airlines.length > 0;

    const isNowActive = (key: ChipKey): boolean => {
      if (key === 'price') return newPriceActive;
      if (key === 'stops') return newStopsActive;
      if (key === 'airlines') return newAirlinesActive;
      if (key === 'nonstop') return newNonstopOnly;
      return false;
    };

    setActiveOrder(prev => {
      // Remove chips that are no longer active
      let next = prev.filter(isNowActive);
      // Add nonstop if it just became active (QuickFilter — no popover close event)
      if (newNonstopOnly && !next.includes('nonstop')) next = [...next, 'nonstop'];
      return next;
    });

    onChange(newFilters);
  }, [capturePositions, onChange, maxPrice]);

  // External sync: when filters change via the sidebar (not through our chip handlers),
  // update activeOrder and trigger FLIP so chips animate to their new positions.
  React.useEffect(() => {
    if (ownChangeRef.current) {
      // This change came from our own handler — already handled there.
      ownChangeRef.current = false;
      return;
    }
    if (isAnyPopoverOpen) return;

    capturePositions();
    setActiveOrder(prev => {
      let next = prev.filter(isKeyActive);
      // Append any chip that is now active but not yet in the queue, in definition order.
      if (priceActive && !next.includes('price')) next = [...next, 'price'];
      if (nonstopOnly && !next.includes('nonstop')) next = [...next, 'nonstop'];
      if (stopsActive && !next.includes('stops')) next = [...next, 'stops'];
      if (airlinesActive && !next.includes('airlines')) next = [...next, 'airlines'];
      return next;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // handleOpenChange: called by each popover FilterChip and the nonstop QuickFilterChip.
  // On open: freeze the current order snapshot.
  // On close: append this chip to the queue if it became active, then unfreeze + FLIP.
  const handleOpenChange = React.useCallback((key: 'price' | 'stops' | 'airlines' | 'nonstop', open: boolean) => {
    if (open) {
      frozenRef.current = { count: totalActive, order: activeOrder };
      setIsAnyPopoverOpen(true);
    } else {
      capturePositions();
      setActiveOrder(prev => {
        // Remove any chips that became inactive while the popover was open
        let next = prev.filter(isKeyActive);
        // Append this chip if it became active and isn't already queued.
        // Special case: nonstop popover may have transitioned to a 'stops' selection instead.
        if (key === 'nonstop') {
          if (isKeyActive('nonstop') && !next.includes('nonstop')) next = [...next, 'nonstop'];
          if (isKeyActive('stops') && !next.includes('stops')) next = [...next, 'stops'];
        } else {
          if (isKeyActive(key) && !next.includes(key)) next = [...next, key];
        }
        return next;
      });
      setIsAnyPopoverOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalActive, activeOrder, capturePositions, priceActive, stopsActive, airlinesActive, nonstopOnly]);

  const frozen = frozenRef.current;
  const displayCount = isAnyPopoverOpen ? frozen.count : totalActive;
  const displayOrder = isAnyPopoverOpen ? frozen.order : activeOrder;

  // ── Chip order ────────────────────────────────────────────────────────────
  // AllFilters: order 0 (always first).
  // Active chips: order 1, 2, 3… based on activation time (first = leftmost).
  // Inactive chips: order 10 (after all active chips).

  const ORDER_INACTIVE = 10;

  const chipStyle = (key: ChipKey, live: boolean): React.CSSProperties => {
    const active = isAnyPopoverOpen ? frozen.order.includes(key) : live;
    if (!active) return { order: ORDER_INACTIVE };
    const idx = displayOrder.indexOf(key);
    return { order: idx >= 0 ? idx + 1 : ORDER_INACTIVE };
  };

  // ── Popover content (memoised per filter to avoid churn) ──────────────────

  const pricePopover = (
    <PricePopover filters={filters} onChange={handleChange} maxPrice={maxPrice} />
  );
  const stopsPopover = <StopsPopover filters={filters} onChange={handleChange} />;
  const airlinesPopover = (
    <AirlinesPopover filters={filters} onChange={handleChange} options={airlineOptions} />
  );

  return (
    <nav className={cn('travel-filter-bar', className)} aria-label="Filter options">
      <div className="travel-filter-bar-scroll" ref={containerRef}>

        {/* AllFilters — always first, no FLIP needed */}
        <AllFiltersChip
          isActive={sidebarOpen}
          {...(displayCount > 0 ? { count: displayCount } : {})}
          onClick={onToggleSidebar}
          style={{ order: 0 }}
        />

        {/* ── QuickFilters ── */}

        {/* "Nonstop only" — QuickFilter that dismisses the Stops chip */}
        <QuickFilterChip
          key="nonstop"
          data-flip-id="nonstop"
          label="Nonstop only"
          isActive={nonstopOnly}
          style={chipStyle('nonstop', nonstopOnly)}
          onClick={() => handleChange({ ...filters, stops: ['nonstop'] })}
          {...(nonstopOnly ? { popoverContent: stopsPopover, onOpenChange: open => handleOpenChange('nonstop', open) } : {})}
          {...(nonstopOnly ? { onClear: () => handleChange({ ...filters, stops: [] }) } : {})}
        />

        {/* ── FilterChips ── */}

        <FilterChip
          key="price"
          data-flip-id="price"
          label="Price"
          isActive={priceActive}
          style={chipStyle('price', priceActive)}
          popoverContent={pricePopover}
          onOpenChange={open => handleOpenChange('price', open)}
          {...(priceLabel !== undefined ? { activeLabel: priceLabel } : {})}
          {...(priceActive ? { onClear: () => handleChange({ ...filters, priceRange: [0, maxPrice] }) } : {})}
        />

        {/* Stops chip — hidden while nonstopOnly QuickFilter is covering it */}
        {!nonstopOnly && (
          <FilterChip
            key="stops"
            data-flip-id="stops"
            label="Stops"
            isActive={stopsActive}
            style={chipStyle('stops', stopsActive)}
            popoverContent={stopsPopover}
            onOpenChange={open => handleOpenChange('stops', open)}
            {...(stopsLabel !== undefined ? { activeLabel: stopsLabel } : {})}
            {...(stopsActive ? { onClear: () => handleChange({ ...filters, stops: [] }) } : {})}
          />
        )}

        {airlineOptions.length > 0 && (
          <FilterChip
            key="airlines"
            data-flip-id="airlines"
            label="Airlines"
            isActive={airlinesActive}
            style={chipStyle('airlines', airlinesActive)}
            popoverContent={airlinesPopover}
            onOpenChange={open => handleOpenChange('airlines', open)}
            {...(airlinesLabel !== undefined ? { activeLabel: airlinesLabel } : {})}
            {...(airlinesActive ? { onClear: () => handleChange({ ...filters, airlines: [] }) } : {})}
          />
        )}

        {/* Placeholder chips — inactive, no popover */}
        {(['Bags', 'Travel time', 'Layover duration', 'Departure airport', 'Arrival airport'] as const).map(
          label => (
            <FilterChip
              key={label}
              data-flip-id={label.toLowerCase().replace(/ /g, '-')}
              label={label}
              style={{ order: ORDER_INACTIVE }}
            />
          ),
        )}
      </div>
    </nav>
  );
}
