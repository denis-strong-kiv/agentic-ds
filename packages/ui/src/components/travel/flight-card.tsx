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
    <div className="travel-flight-card-stops" aria-hidden>
      {Array.from({ length: dots }).map((_, i) => (
        <React.Fragment key={i}>
          <div
            className={cn(
              'travel-flight-card-stop-dot',
              i === 0 || i === dots - 1
                ? 'travel-flight-card-stop-dot--edge'
                : 'travel-flight-card-stop-dot--mid',
            )}
          />
          {i < dots - 1 && (
            <div className="travel-flight-card-stop-line" />
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
        'travel-flight-card',
        className,
      )}
    >
      {/* Main card row */}
      <div className="travel-flight-card-layout">
        {/* Airline */}
        <div className="travel-flight-card-airline">
          {segment.airlineLogo ? (
            <img src={segment.airlineLogo} alt={segment.airline} className="travel-flight-card-airline-logo" />
          ) : (
            <div className="travel-flight-card-airline-fallback">
              {segment.airline.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <p className="travel-flight-card-airline-name">{segment.airline}</p>
            <p className="travel-flight-card-flight-number">{segment.flightNumber}</p>
          </div>
        </div>

        {/* Times */}
        <div className="travel-flight-card-times">
          <div className="travel-flight-card-time-point">
            <p className="travel-flight-card-time">{segment.departureTime}</p>
            <p className="travel-flight-card-code">{segment.origin}</p>
          </div>

          <div className="travel-flight-card-middle">
            <p className="travel-flight-card-duration">{segment.duration}</p>
            <StopsLine stops={segment.stops} />
            <p className="travel-flight-card-stop-label">
              {segment.stops === 0 ? 'Non-stop' : `${segment.stops} stop${segment.stops > 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="travel-flight-card-time-point">
            <p className="travel-flight-card-time">{segment.arrivalTime}</p>
            <p className="travel-flight-card-code">{segment.destination}</p>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="travel-flight-card-price-col">
          <div className="travel-flight-card-price-wrap">
            {(isBestValue || isCheapest) && (
              <div className="travel-flight-card-badges">
                {isBestValue && <Badge variant="deal">Best Value</Badge>}
                {isCheapest && !isBestValue && <Badge variant="popular">Cheapest</Badge>}
              </div>
            )}
            <p className="travel-flight-card-price">{price}</p>
            <p className="travel-flight-card-price-meta">{currency} per person</p>
            {fareClass && (
              <Badge variant="outline" className="travel-flight-card-fare-class">{fareClass}</Badge>
            )}
          </div>
          <Button onClick={onSelect} size="sm">Select</Button>
        </div>
      </div>

      {/* Fare breakdown accordion */}
      {fareBreakdown.length > 0 && (
        <div className="travel-flight-card-breakdown-wrap">
          <Accordion type="single" collapsible>
            <AccordionItem value="breakdown" className="travel-flight-card-breakdown-item">
              <AccordionTrigger className="travel-flight-card-breakdown-trigger">
                Fare breakdown
              </AccordionTrigger>
              <AccordionContent>
                <div className="travel-flight-card-breakdown-content">
                  {fareBreakdown.map((item, i) => (
                    <div
                      key={i}
                      className={cn(
                        'travel-flight-card-breakdown-row',
                        item.type === 'total' && 'travel-flight-card-breakdown-row--total',
                      )}
                    >
                      <span className="travel-flight-card-breakdown-label">{item.label}</span>
                      <span className="travel-flight-card-breakdown-amount">{item.amount}</span>
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
