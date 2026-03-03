'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { Button } from '../ui/button.js';
import { Badge } from '../ui/badge.js';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/accordion.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FlightSegment {
  airline: string;
  airlineLogo?: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  stopAirports?: string[];
}

export interface FareBreakdownItem {
  label: string;
  amount: string;
  type?: 'base' | 'tax' | 'fee' | 'total';
}

export interface FlightCardProps {
  segment: FlightSegment;
  price: string;
  currency?: string;
  fareClass?: string;
  fareBreakdown?: FareBreakdownItem[];
  isBestValue?: boolean;
  isCheapest?: boolean;
  onSelect?: () => void;
  className?: string;
}

// ─── Stop Visualization ───────────────────────────────────────────────────────

function StopsLine({ stops }: { stops: number }) {
  const dots = stops + 2; // origin + stops + destination
  return (
    <div className="flex items-center gap-0.5 w-full max-w-[120px]" aria-hidden>
      {Array.from({ length: dots }).map((_, i) => (
        <React.Fragment key={i}>
          <div
            className={cn(
              'h-2 w-2 rounded-full flex-shrink-0',
              i === 0 || i === dots - 1
                ? 'bg-[var(--color-primary-default)]'
                : 'bg-[var(--color-border-default)] ring-1 ring-[var(--color-primary-default)]',
            )}
          />
          {i < dots - 1 && (
            <div className="h-px flex-1 bg-[var(--color-border-default)]" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── FlightCard ───────────────────────────────────────────────────────────────

export function FlightCard({
  segment,
  price,
  currency = 'USD',
  fareClass,
  fareBreakdown = [],
  isBestValue,
  isCheapest,
  onSelect,
  className,
}: FlightCardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--shape-preset-card)] border border-[var(--color-border-default)]',
        'bg-[var(--color-surface-card)] overflow-hidden',
        className,
      )}
    >
      {/* Main card row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
        {/* Airline */}
        <div className="flex items-center gap-2 w-32 flex-shrink-0">
          {segment.airlineLogo ? (
            <img src={segment.airlineLogo} alt={segment.airline} className="h-8 w-8 object-contain" />
          ) : (
            <div className="h-8 w-8 rounded flex items-center justify-center bg-[var(--color-background-subtle)] text-xs font-bold text-[var(--color-foreground-muted)]">
              {segment.airline.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-[var(--color-foreground-default)] truncate">{segment.airline}</p>
            <p className="text-xs text-[var(--color-foreground-muted)]">{segment.flightNumber}</p>
          </div>
        </div>

        {/* Times */}
        <div className="flex items-center gap-3 flex-1">
          <div className="text-center">
            <p className="text-lg font-bold text-[var(--color-foreground-default)]">{segment.departureTime}</p>
            <p className="text-xs text-[var(--color-foreground-muted)]">{segment.origin}</p>
          </div>

          <div className="flex flex-col items-center gap-1 flex-1 min-w-[80px]">
            <p className="text-xs text-[var(--color-foreground-muted)]">{segment.duration}</p>
            <StopsLine stops={segment.stops} />
            <p className="text-xs text-[var(--color-foreground-muted)]">
              {segment.stops === 0 ? 'Non-stop' : `${segment.stops} stop${segment.stops > 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="text-center">
            <p className="text-lg font-bold text-[var(--color-foreground-default)]">{segment.arrivalTime}</p>
            <p className="text-xs text-[var(--color-foreground-muted)]">{segment.destination}</p>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex flex-col items-end gap-2 sm:ml-4">
          <div className="text-right">
            {(isBestValue || isCheapest) && (
              <div className="mb-1">
                {isBestValue && <Badge variant="deal">Best Value</Badge>}
                {isCheapest && !isBestValue && <Badge variant="popular">Cheapest</Badge>}
              </div>
            )}
            <p className="text-2xl font-bold text-[var(--color-foreground-default)]">{price}</p>
            <p className="text-xs text-[var(--color-foreground-muted)]">{currency} per person</p>
            {fareClass && (
              <Badge variant="outline" className="mt-1 text-xs">{fareClass}</Badge>
            )}
          </div>
          <Button onClick={onSelect} size="sm">Select</Button>
        </div>
      </div>

      {/* Fare breakdown accordion */}
      {fareBreakdown.length > 0 && (
        <div className="border-t border-[var(--color-border-muted)]">
          <Accordion type="single" collapsible>
            <AccordionItem value="breakdown" className="border-none">
              <AccordionTrigger className="px-4 text-sm text-[var(--color-primary-default)]">
                Fare breakdown
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-4 pb-4 space-y-2">
                  {fareBreakdown.map((item, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex justify-between text-sm',
                        item.type === 'total' && 'font-semibold border-t border-[var(--color-border-muted)] pt-2 mt-2',
                      )}
                    >
                      <span className="text-[var(--color-foreground-muted)]">{item.label}</span>
                      <span className="text-[var(--color-foreground-default)]">{item.amount}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  );
}
