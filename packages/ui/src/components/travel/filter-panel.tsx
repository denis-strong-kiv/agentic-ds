'use client';

import { cn } from '../../utils/cn.js';
import { Button } from '../ui/button.js';
import { Badge } from '../ui/badge.js';
import { Checkbox } from '../ui/checkbox.js';
import { Slider } from '../ui/slider.js';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/accordion.js';
import { Label } from '../ui/label.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FilterState {
  priceRange: [number, number];
  stops: ('nonstop' | '1-stop' | '2-plus')[];
  airlines: string[];
  departureRange: [number, number];
  arrivalRange: [number, number];
  amenities: string[];
  starRatings: number[];
}

export interface FilterOption {
  value: string;
  label: string;
  logoUrl?: string;
}

export interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClearAll?: () => void;
  /** Available airline/provider options */
  providerOptions?: FilterOption[];
  /** Available amenity options */
  amenityOptions?: FilterOption[];
  /** Max price for the slider */
  maxPrice?: number;
  /** Show hotel-specific filters (star rating, amenities) */
  mode?: 'flights' | 'hotels' | 'cars';
  className?: string;
}

const DEFAULT_AMENITIES: FilterOption[] = [
  { value: 'wifi', label: 'Free WiFi' },
  { value: 'pool', label: 'Swimming Pool' },
  { value: 'breakfast', label: 'Breakfast Included' },
  { value: 'parking', label: 'Free Parking' },
  { value: 'gym', label: 'Fitness Center' },
  { value: 'spa', label: 'Spa' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'pet-friendly', label: 'Pet Friendly' },
];

function formatHour(h: number) {
  if (h === 0) return '12am';
  if (h < 12) return `${h}am`;
  if (h === 12) return '12pm';
  return `${h - 12}pm`;
}

function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
}

// ─── Active filter count ──────────────────────────────────────────────────────

function countActiveFilters(filters: FilterState, maxPrice: number): number {
  let count = 0;
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) count++;
  if (filters.stops.length > 0) count += filters.stops.length;
  if (filters.airlines.length > 0) count++;
  if (filters.departureRange[0] !== 0 || filters.departureRange[1] !== 24) count++;
  if (filters.arrivalRange[0] !== 0 || filters.arrivalRange[1] !== 24) count++;
  if (filters.amenities.length > 0) count++;
  if (filters.starRatings.length > 0) count++;
  return count;
}

// ─── FilterPanel ──────────────────────────────────────────────────────────────

export function FilterPanel({
  filters,
  onChange,
  onClearAll,
  providerOptions = [],
  amenityOptions = DEFAULT_AMENITIES,
  maxPrice = 2000,
  mode = 'flights',
  className,
}: FilterPanelProps) {
  const activeCount = countActiveFilters(filters, maxPrice);

  return (
    <aside
      className={cn(
        'w-full rounded-[var(--shape-preset-card)] border border-[var(--color-border-default)]',
        'bg-[var(--color-surface-card)] p-4',
        className,
      )}
      aria-label="Search filters"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[var(--color-foreground-default)]">
          Filters
          {activeCount > 0 && (
            <Badge className="ml-2" variant="default">{activeCount}</Badge>
          )}
        </h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-sm text-[var(--color-primary-default)] hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={['price', 'stops', 'times']}>

        {/* ── Price ──────────────────────────────────────────────────── */}
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4">
              <Slider
                min={0}
                max={maxPrice}
                step={10}
                value={filters.priceRange}
                onValueChange={v => onChange({ ...filters, priceRange: v as [number, number] })}
                showValue
                formatValue={v => `$${v}`}
              />
              <div className="flex justify-between mt-2 text-xs text-[var(--color-foreground-muted)]">
                <span>$0</span>
                <span>${maxPrice}+</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ── Stops (flights only) ────────────────────────────────────── */}
        {mode === 'flights' && (
          <AccordionItem value="stops">
            <AccordionTrigger>Stops</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2 pt-1">
                {([
                  { value: 'nonstop', label: 'Non-stop' },
                  { value: '1-stop', label: '1 Stop' },
                  { value: '2-plus', label: '2+ Stops' },
                ] as { value: FilterState['stops'][number]; label: string }[]).map(opt => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`stop-${opt.value}`}
                      checked={filters.stops.includes(opt.value)}
                      onCheckedChange={() =>
                        onChange({ ...filters, stops: toggleItem(filters.stops, opt.value) })
                      }
                    />
                    <Label htmlFor={`stop-${opt.value}`} className="text-sm font-normal cursor-pointer">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* ── Airlines / Providers ────────────────────────────────────── */}
        {providerOptions.length > 0 && (
          <AccordionItem value="providers">
            <AccordionTrigger>{mode === 'flights' ? 'Airlines' : 'Providers'}</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2 pt-1 max-h-48 overflow-y-auto">
                {providerOptions.map(opt => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`provider-${opt.value}`}
                      checked={filters.airlines.includes(opt.value)}
                      onCheckedChange={() =>
                        onChange({ ...filters, airlines: toggleItem(filters.airlines, opt.value) })
                      }
                    />
                    <Label htmlFor={`provider-${opt.value}`} className="text-sm font-normal cursor-pointer flex items-center gap-2">
                      {opt.logoUrl && (
                        <img src={opt.logoUrl} alt="" className="h-4 w-auto object-contain" aria-hidden />
                      )}
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* ── Departure time ──────────────────────────────────────────── */}
        {mode === 'flights' && (
          <AccordionItem value="times">
            <AccordionTrigger>Departure Time</AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 pb-4">
                <Slider
                  min={0}
                  max={24}
                  step={1}
                  value={filters.departureRange}
                  onValueChange={v => onChange({ ...filters, departureRange: v as [number, number] })}
                  showValue
                  formatValue={formatHour}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* ── Arrival time ────────────────────────────────────────────── */}
        {mode === 'flights' && (
          <AccordionItem value="arrival-times">
            <AccordionTrigger>Arrival Time</AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 pb-4">
                <Slider
                  min={0}
                  max={24}
                  step={1}
                  value={filters.arrivalRange}
                  onValueChange={v => onChange({ ...filters, arrivalRange: v as [number, number] })}
                  showValue
                  formatValue={formatHour}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* ── Star rating (hotels only) ───────────────────────────────── */}
        {mode === 'hotels' && (
          <AccordionItem value="stars">
            <AccordionTrigger>Star Rating</AccordionTrigger>
            <AccordionContent>
              <div className="flex gap-2 flex-wrap pt-1">
                {[1, 2, 3, 4, 5].map(stars => (
                  <button
                    key={stars}
                    type="button"
                    onClick={() =>
                      onChange({ ...filters, starRatings: toggleItem(filters.starRatings, stars) })
                    }
                    aria-pressed={filters.starRatings.includes(stars)}
                    aria-label={`${stars} star${stars !== 1 ? 's' : ''}`}
                    className={cn(
                      'px-3 py-1 rounded-full text-sm border transition-colors',
                      filters.starRatings.includes(stars)
                        ? 'bg-[var(--color-primary-default)] text-[var(--color-primary-foreground)] border-transparent'
                        : 'border-[var(--color-border-default)] text-[var(--color-foreground-default)]',
                    )}
                  >
                    {'★'.repeat(stars)}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* ── Amenities (hotels only) ─────────────────────────────────── */}
        {mode === 'hotels' && (
          <AccordionItem value="amenities">
            <AccordionTrigger>Amenities</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {amenityOptions.map(opt => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`amenity-${opt.value}`}
                      checked={filters.amenities.includes(opt.value)}
                      onCheckedChange={() =>
                        onChange({ ...filters, amenities: toggleItem(filters.amenities, opt.value) })
                      }
                    />
                    <Label htmlFor={`amenity-${opt.value}`} className="text-sm font-normal cursor-pointer">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      {/* Apply button (mobile) */}
      <div className="mt-4 md:hidden">
        <Button className="w-full">Apply Filters</Button>
      </div>
    </aside>
  );
}

// ─── Default filter state factory ─────────────────────────────────────────────

export function createDefaultFilters(maxPrice = 2000): FilterState {
  return {
    priceRange: [0, maxPrice],
    stops: [],
    airlines: [],
    departureRange: [0, 24],
    arrivalRange: [0, 24],
    amenities: [],
    starRatings: [],
  };
}
