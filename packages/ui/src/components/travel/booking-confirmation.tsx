'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { Button } from '../ui/button.js';
import { Badge } from '../ui/badge.js';
import { Separator } from '../ui/separator.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ConfirmationSegment {
  type: 'flight' | 'hotel' | 'car' | 'activity';
  title: string;
  subtitle?: string;
  date: string;
  details: Array<{ label: string; value: string }>;
}

export interface BookingConfirmationProps {
  confirmationNumber: string;
  bookingDate: string;
  status?: 'confirmed' | 'pending' | 'cancelled';
  segments: ConfirmationSegment[];
  totalAmount: string;
  currency?: string;
  contactEmail?: string;
  onAddToCalendar?: () => void;
  onShareItinerary?: () => void;
  onPrint?: () => void;
  className?: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const CopyIcon = () => (
  <svg className="travel-booking-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg className="travel-booking-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="travel-booking-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ShareIcon = () => (
  <svg className="travel-booking-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const PrintIcon = () => (
  <svg className="travel-booking-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

// ─── Segment type icons ───────────────────────────────────────────────────────

const segmentIcons: Record<ConfirmationSegment['type'], React.ReactNode> = {
  flight: (
    <svg className="travel-booking-segment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5S18 2 16.5 3.5L13 7 4.8 5.2 3.3 6.7l4 2-2 2-4-1-1.5 1.5 3 2 2 3 1.5-1.5-1-4 2-2 2 4 1.5-1.5z" />
    </svg>
  ),
  hotel: (
    <svg className="travel-booking-segment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  car: (
    <svg className="travel-booking-segment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-3" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  ),
  activity: (
    <svg className="travel-booking-segment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

// ─── QR Code placeholder ──────────────────────────────────────────────────────

function QRCodePlaceholder({ value }: { value: string }) {
  return (
    <div
      className="travel-booking-qr"
      aria-label={`QR code for booking ${value}`}
      role="img"
    >
      {/* Simple decorative QR-like pattern */}
      <div className="travel-booking-qr-grid">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'travel-booking-qr-cell',
              // Corner squares + random pattern
              [0, 1, 5, 6, 4, 9, 15, 20, 21, 24, 19, 23, 2, 10, 14, 22, 7, 17].includes(i)
                ? 'travel-booking-qr-cell--filled'
                : 'travel-booking-qr-cell--empty',
            )}
          />
        ))}
      </div>
      <p className="travel-booking-qr-text">
        {value.slice(0, 8)}
      </p>
    </div>
  );
}

// ─── Segment card ─────────────────────────────────────────────────────────────

function SegmentCard({ segment }: { segment: ConfirmationSegment }) {
  return (
    <div className="travel-booking-segment-card">
      <div className="travel-booking-segment-badge">
        {segmentIcons[segment.type]}
      </div>
      <div className="travel-booking-segment-content">
        <div className="travel-booking-segment-header">
          <div>
            <p className="travel-booking-segment-title">{segment.title}</p>
            {segment.subtitle && (
              <p className="travel-booking-segment-subtitle">{segment.subtitle}</p>
            )}
          </div>
          <p className="travel-booking-segment-date">{segment.date}</p>
        </div>
        {segment.details.length > 0 && (
          <div className="travel-booking-segment-details">
            {segment.details.map(d => (
              <div key={d.label}>
                <span className="travel-booking-segment-detail-label">{d.label}</span>
                <p className="travel-booking-segment-detail-value">{d.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── BookingConfirmation ──────────────────────────────────────────────────────

export function BookingConfirmation({
  confirmationNumber,
  bookingDate,
  status = 'confirmed',
  segments,
  totalAmount,
  currency = 'USD',
  contactEmail,
  onAddToCalendar,
  onShareItinerary,
  onPrint,
  className,
}: BookingConfirmationProps) {
  const [copied, setCopied] = React.useState(false);

  function handleCopy() {
    navigator.clipboard?.writeText(confirmationNumber).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const statusVariant =
    status === 'confirmed' ? 'default' : status === 'pending' ? 'secondary' : 'destructive';

  return (
    <div
      className={cn(
        'travel-booking-card',
        className,
      )}
    >
      {/* Success banner */}
      <div className="travel-booking-banner">
        <div className="travel-booking-banner-icon-wrap">
          <svg className="travel-booking-banner-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div>
          <h2 className="travel-booking-title">
            {status === 'confirmed' ? 'Booking Confirmed!' : status === 'pending' ? 'Booking Pending' : 'Booking Cancelled'}
          </h2>
          {contactEmail && (
            <p className="travel-booking-contact-text">
              Confirmation sent to <span className="travel-booking-contact-email">{contactEmail}</span>
            </p>
          )}
        </div>
        <Badge variant={statusVariant} className="travel-booking-status-badge">{status}</Badge>
      </div>

      <div className="travel-booking-content">
        {/* Confirmation number + QR */}
        <div className="travel-booking-reference-row">
          <div>
            <p className="travel-booking-reference-label">
              Booking Reference
            </p>
            <div className="travel-booking-reference-value-row">
              <span className="travel-booking-reference-value">
                {confirmationNumber}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                aria-label={copied ? 'Copied!' : 'Copy confirmation number'}
                className={cn(
                  'travel-booking-copy-btn',
                  copied
                    ? 'travel-booking-copy-btn--copied'
                    : 'travel-booking-copy-btn--idle',
                )}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
            <p className="travel-booking-date-text">Booked on {bookingDate}</p>
          </div>
          <QRCodePlaceholder value={confirmationNumber} />
        </div>

        <Separator />

        {/* Itinerary segments */}
        {segments.length > 0 && (
          <div>
            <h3 className="travel-booking-itinerary-title">
              Your Itinerary
            </h3>
            <div className="travel-booking-segment-list">
              {segments.map((seg, i) => (
                <SegmentCard key={i} segment={seg} />
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Total */}
        <div className="travel-booking-total-row">
          <div>
            <p className="travel-booking-total-label">Total paid</p>
            <p className="travel-booking-total-subtext">{currency} incl. all taxes</p>
          </div>
          <p className="travel-booking-total-amount">{totalAmount}</p>
        </div>

        {/* Action buttons */}
        <div className="travel-booking-actions">
          {onAddToCalendar && (
            <Button variant="outline" size="sm" onClick={onAddToCalendar} className="travel-booking-action-btn">
              <CalendarIcon />
              Add to Calendar
            </Button>
          )}
          {onShareItinerary && (
            <Button variant="outline" size="sm" onClick={onShareItinerary} className="travel-booking-action-btn">
              <ShareIcon />
              Share Itinerary
            </Button>
          )}
          {onPrint && (
            <Button variant="outline" size="sm" onClick={onPrint} className="travel-booking-action-btn">
              <PrintIcon />
              Print
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
