'use client';

import * as React from 'react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/button/index';
import { Badge } from '../../ui/badge/index';
import type { FlightLeg, FlightSegment } from '../flight-card/index';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FareOption {
  id: string;
  name: string;
  fareClass: string;
  price: string;
  features: string[];
  isRecommended?: boolean;
}

export interface FlightDetailsProps {
  title: string;
  legs: FlightLeg[];
  /** Night count between outbound arrival and return departure */
  nightsBetween?: number;
  fareOptions?: FareOption[];
  isOpen: boolean;
  onClose: () => void;
  onShare?: () => void;
  onSelectFare?: (fareId: string) => void;
  className?: string;
}

// ─── Segment row ──────────────────────────────────────────────────────────────

function SegmentRow({ segment }: { segment: FlightSegment }) {
  return (
    <div className="travel-flight-details-segment">
      <div className="travel-flight-details-segment-airline">
        {segment.airlineLogo ? (
          <img
            src={segment.airlineLogo}
            alt={segment.airline}
            className="travel-flight-details-segment-logo"
          />
        ) : (
          <div className="travel-flight-details-segment-logo-fallback" aria-hidden>
            {segment.airline.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <p className="travel-flight-details-segment-airline-name">{segment.airline}</p>
          <p className="travel-flight-details-segment-flight-number">{segment.flightNumber}</p>
        </div>
      </div>

      <div className="travel-flight-details-segment-timeline">
        <div className="travel-flight-details-segment-stop">
          <span className="travel-flight-details-segment-time">{segment.departureTime}</span>
          <span className="travel-flight-details-segment-airport">
            {segment.originCity ? `${segment.originCity} ` : ''}{segment.origin}
          </span>
        </div>

        <div className="travel-flight-details-segment-line" aria-hidden>
          <div className="travel-flight-details-segment-line-dot" />
          <div className="travel-flight-details-segment-line-track" />
          <svg className="travel-flight-details-segment-plane" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M1 7.5L5.5 5.5L7 1.5L8.5 5.5L13 7.5L8.5 9.5L7 13.5L5.5 9.5L1 7.5Z" fill="currentColor" />
          </svg>
          <div className="travel-flight-details-segment-line-track" />
          <div className="travel-flight-details-segment-line-dot" />
        </div>

        <div className="travel-flight-details-segment-stop">
          <span className="travel-flight-details-segment-time">{segment.arrivalTime}</span>
          <span className="travel-flight-details-segment-airport">
            {segment.destinationCity ? `${segment.destinationCity} ` : ''}{segment.destination}
          </span>
        </div>
      </div>

      <div className="travel-flight-details-segment-info">
        <span className="travel-flight-details-segment-duration">{segment.duration}</span>
        {segment.aircraft && (
          <span className="travel-flight-details-segment-aircraft">✈ {segment.aircraft}</span>
        )}
        {segment.class && (
          <span className="travel-flight-details-segment-class">{segment.class}</span>
        )}
        {segment.operatedBy && (
          <span className="travel-flight-details-segment-operated">
            Operated by {segment.operatedBy}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Layover row ──────────────────────────────────────────────────────────────

function LayoverRow({ from, to }: { from: FlightSegment; to: FlightSegment }) {
  return (
    <div className="travel-flight-details-layover" role="note">
      <div className="travel-flight-details-layover-line" aria-hidden />
      <span className="travel-flight-details-layover-label">
        Layover · {to.origin}
        {from.destination !== to.origin && ` (${from.destination})`}
      </span>
    </div>
  );
}

// ─── Leg section ──────────────────────────────────────────────────────────────

function LegSection({ leg, index }: { leg: FlightLeg; index: number }) {
  const directions = ['Depart', 'Return', 'Leg 3', 'Leg 4', 'Leg 5', 'Leg 6'];
  const directionLabel = directions[index] ?? `Leg ${index + 1}`;

  return (
    <section className="travel-flight-details-leg" aria-label={directionLabel}>
      <div className="travel-flight-details-leg-header">
        <span
          className={cn(
            'travel-flight-details-leg-badge',
            index === 0 && 'travel-flight-details-leg-badge--depart',
            index === 1 && 'travel-flight-details-leg-badge--return',
          )}
        >
          {directionLabel}
        </span>
        {leg.date && (
          <span className="travel-flight-details-leg-date">{leg.date}</span>
        )}
        <span className="travel-flight-details-leg-duration">
          Duration: {leg.duration}
        </span>
      </div>

      <div className="travel-flight-details-leg-segments">
        {leg.segments.map((segment, si) => (
          <React.Fragment key={si}>
            {si > 0 && <LayoverRow from={leg.segments[si - 1]} to={segment} />}
            <SegmentRow segment={segment} />
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

// ─── Fare option card ─────────────────────────────────────────────────────────

function FareCard({
  fare,
  onSelect,
}: {
  fare: FareOption;
  onSelect?: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        'travel-flight-details-fare',
        fare.isRecommended && 'travel-flight-details-fare--recommended',
      )}
    >
      {fare.isRecommended && (
        <Badge variant="deal" className="travel-flight-details-fare-badge">
          Recommended
        </Badge>
      )}
      <p className="travel-flight-details-fare-name">{fare.name}</p>
      <p className="travel-flight-details-fare-class">{fare.fareClass}</p>
      <ul className="travel-flight-details-fare-features">
        {fare.features.map((f, i) => (
          <li key={i} className="travel-flight-details-fare-feature">
            <span className="travel-flight-details-fare-feature-icon" aria-hidden>✓</span>
            {f}
          </li>
        ))}
      </ul>
      <p className="travel-flight-details-fare-price">{fare.price}</p>
      <Button
        size="sm"
        variant={fare.isRecommended ? 'primary' : 'outline'}
        className="travel-flight-details-fare-cta"
        onClick={() => onSelect?.(fare.id)}
      >
        Select
      </Button>
    </div>
  );
}

// ─── FlightDetails ────────────────────────────────────────────────────────────

export function FlightDetails({
  title,
  legs,
  nightsBetween,
  fareOptions = [],
  isOpen,
  onClose,
  onShare,
  onSelectFare,
  className,
}: FlightDetailsProps) {
  if (!isOpen) return null;

  return (
    <div
      className={cn('travel-flight-details', className)}
      role="dialog"
      aria-modal="true"
      aria-label={`Flight details: ${title}`}
    >
      {/* Header */}
      <div className="travel-flight-details-header">
        <h2 className="travel-flight-details-title">{title}</h2>
        <div className="travel-flight-details-header-actions">
          {onShare && (
            <Button variant="outline" size="sm" onClick={onShare} aria-label="Share this flight">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <circle cx="11" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="11" cy="11.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="3" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M4.5 6.1L9.5 3.4M4.5 7.9L9.5 10.6" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              Share
            </Button>
          )}
          <button
            type="button"
            className="travel-flight-details-close"
            onClick={onClose}
            aria-label="Close flight details"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="travel-flight-details-body">
        {legs.map((leg, i) => (
          <React.Fragment key={i}>
            {i > 0 && nightsBetween !== undefined && (
              <div className="travel-flight-details-nights" aria-label={`${nightsBetween} nights`}>
                {nightsBetween} night{nightsBetween !== 1 ? 's' : ''}
              </div>
            )}
            <LegSection leg={leg} index={i} />
          </React.Fragment>
        ))}

        {/* Fare options */}
        {fareOptions.length > 0 && (
          <section className="travel-flight-details-fares" aria-label="Booking options">
            <h3 className="travel-flight-details-fares-title">Select booking option</h3>
            <div className="travel-flight-details-fares-grid">
              {fareOptions.map(fare => (
                <FareCard
                  key={fare.id}
                  fare={fare}
                  {...(onSelectFare ? { onSelect: onSelectFare } : {})}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
