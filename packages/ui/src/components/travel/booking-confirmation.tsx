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
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ShareIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const PrintIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

// ─── Segment type icons ───────────────────────────────────────────────────────

const segmentIcons: Record<ConfirmationSegment['type'], React.ReactNode> = {
  flight: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5S18 2 16.5 3.5L13 7 4.8 5.2 3.3 6.7l4 2-2 2-4-1-1.5 1.5 3 2 2 3 1.5-1.5-1-4 2-2 2 4 1.5-1.5z" />
    </svg>
  ),
  hotel: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  car: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-3" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  ),
  activity: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

// ─── QR Code placeholder ──────────────────────────────────────────────────────

function QRCodePlaceholder({ value }: { value: string }) {
  return (
    <div
      className="w-32 h-32 bg-[var(--color-background-subtle)] border border-[var(--color-border-default)] rounded flex flex-col items-center justify-center gap-1 p-2"
      aria-label={`QR code for booking ${value}`}
      role="img"
    >
      {/* Simple decorative QR-like pattern */}
      <div className="grid grid-cols-5 gap-0.5 w-full">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'aspect-square rounded-[1px]',
              // Corner squares + random pattern
              [0, 1, 5, 6, 4, 9, 15, 20, 21, 24, 19, 23, 2, 10, 14, 22, 7, 17].includes(i)
                ? 'bg-[var(--color-foreground-default)]'
                : 'bg-transparent',
            )}
          />
        ))}
      </div>
      <p className="text-[10px] text-[var(--color-foreground-subtle)] font-mono truncate w-full text-center">
        {value.slice(0, 8)}
      </p>
    </div>
  );
}

// ─── Segment card ─────────────────────────────────────────────────────────────

function SegmentCard({ segment }: { segment: ConfirmationSegment }) {
  return (
    <div className="flex gap-3 p-3 rounded-[var(--shape-preset-card)] bg-[var(--color-background-subtle)]">
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[var(--color-primary-default)]/10 text-[var(--color-primary-default)] flex items-center justify-center">
        {segmentIcons[segment.type]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-sm text-[var(--color-foreground-default)]">{segment.title}</p>
            {segment.subtitle && (
              <p className="text-xs text-[var(--color-foreground-muted)]">{segment.subtitle}</p>
            )}
          </div>
          <p className="text-xs text-[var(--color-foreground-subtle)] flex-shrink-0">{segment.date}</p>
        </div>
        {segment.details.length > 0 && (
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
            {segment.details.map(d => (
              <div key={d.label}>
                <span className="text-[10px] uppercase tracking-wide text-[var(--color-foreground-subtle)]">{d.label}</span>
                <p className="text-xs text-[var(--color-foreground-default)] font-medium">{d.value}</p>
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
        'rounded-[var(--shape-preset-card)] border border-[var(--color-border-default)]',
        'bg-[var(--color-surface-card)] overflow-hidden',
        className,
      )}
    >
      {/* Success banner */}
      <div className="bg-[var(--color-success-default)]/10 border-b border-[var(--color-success-default)]/30 px-6 py-5 flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-[var(--color-success-default)] text-white flex items-center justify-center flex-shrink-0">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-[var(--color-foreground-default)]">
            {status === 'confirmed' ? 'Booking Confirmed!' : status === 'pending' ? 'Booking Pending' : 'Booking Cancelled'}
          </h2>
          {contactEmail && (
            <p className="text-sm text-[var(--color-foreground-muted)]">
              Confirmation sent to <span className="font-medium">{contactEmail}</span>
            </p>
          )}
        </div>
        <Badge variant={statusVariant} className="ml-auto capitalize">{status}</Badge>
      </div>

      <div className="p-6 space-y-6">
        {/* Confirmation number + QR */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--color-foreground-subtle)] mb-1">
              Booking Reference
            </p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-mono text-[var(--color-foreground-default)] tracking-widest">
                {confirmationNumber}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                aria-label={copied ? 'Copied!' : 'Copy confirmation number'}
                className={cn(
                  'p-1.5 rounded transition-colors',
                  copied
                    ? 'text-[var(--color-success-default)] bg-[var(--color-success-default)]/10'
                    : 'text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground-default)] hover:bg-[var(--color-background-subtle)]',
                )}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
            <p className="text-xs text-[var(--color-foreground-subtle)] mt-1">Booked on {bookingDate}</p>
          </div>
          <QRCodePlaceholder value={confirmationNumber} />
        </div>

        <Separator />

        {/* Itinerary segments */}
        {segments.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-foreground-default)] mb-3">
              Your Itinerary
            </h3>
            <div className="space-y-2">
              {segments.map((seg, i) => (
                <SegmentCard key={i} segment={seg} />
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Total */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--color-foreground-muted)]">Total paid</p>
            <p className="text-xs text-[var(--color-foreground-subtle)]">{currency} incl. all taxes</p>
          </div>
          <p className="text-2xl font-bold text-[var(--color-foreground-default)]">{totalAmount}</p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 print:hidden">
          {onAddToCalendar && (
            <Button variant="outline" size="sm" onClick={onAddToCalendar} className="gap-1.5">
              <CalendarIcon />
              Add to Calendar
            </Button>
          )}
          {onShareItinerary && (
            <Button variant="outline" size="sm" onClick={onShareItinerary} className="gap-1.5">
              <ShareIcon />
              Share Itinerary
            </Button>
          )}
          {onPrint && (
            <Button variant="outline" size="sm" onClick={onPrint} className="gap-1.5">
              <PrintIcon />
              Print
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
