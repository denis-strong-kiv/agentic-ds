'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { Badge } from '../ui/badge.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TimelineEventType = 'flight' | 'hotel' | 'car' | 'activity' | 'layover' | 'transfer';
export type TimelineEventStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  status: TimelineEventStatus;
  title: string;
  subtitle?: string;
  startTime: string;
  endTime?: string;
  duration?: string;
  location?: string;
  details?: Array<{ label: string; value: string }>;
  /** Duration gap before next event, e.g. "2h 30m layover" */
  gapToNext?: string;
}

export interface ItineraryTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

// ─── Event type config ────────────────────────────────────────────────────────

const eventConfig: Record<
  TimelineEventType,
  { icon: React.ReactNode; color: string; bgColor: string }
> = {
  flight: {
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5S18 2 16.5 3.5L13 7 4.8 5.2 3.3 6.7l4 2-2 2-4-1-1.5 1.5 3 2 2 3 1.5-1.5-1-4 2-2 2 4 1.5-1.5z" />
      </svg>
    ),
    color: 'text-[var(--color-primary-default)]',
    bgColor: 'bg-[var(--color-primary-default)]/10 border-[var(--color-primary-default)]/30',
  },
  hotel: {
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    color: 'text-[var(--color-accent-default)]',
    bgColor: 'bg-[var(--color-accent-default)]/10 border-[var(--color-accent-default)]/30',
  },
  car: {
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-3" />
        <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
      </svg>
    ),
    color: 'text-[var(--color-warning-default)]',
    bgColor: 'bg-[var(--color-warning-default)]/10 border-[var(--color-warning-default)]/30',
  },
  activity: {
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    color: 'text-[var(--color-success-default)]',
    bgColor: 'bg-[var(--color-success-default)]/10 border-[var(--color-success-default)]/30',
  },
  layover: {
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    color: 'text-[var(--color-foreground-muted)]',
    bgColor: 'bg-[var(--color-background-subtle)] border-[var(--color-border-muted)]',
  },
  transfer: {
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
    color: 'text-[var(--color-foreground-muted)]',
    bgColor: 'bg-[var(--color-background-subtle)] border-[var(--color-border-muted)]',
  },
};

const statusVariant: Record<TimelineEventStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  confirmed: 'default',
  pending: 'secondary',
  cancelled: 'destructive',
  completed: 'outline',
};

// ─── Event card ───────────────────────────────────────────────────────────────

function TimelineEventCard({ event, isLast }: { event: TimelineEvent; isLast: boolean }) {
  const [expanded, setExpanded] = React.useState(false);
  const config = eventConfig[event.type];
  const hasDetails = (event.details?.length ?? 0) > 0;

  return (
    <div className="relative flex gap-4">
      {/* Vertical line */}
      {!isLast && (
        <div
          aria-hidden
          className="absolute left-[18px] top-10 bottom-0 w-0.5 bg-[var(--color-border-muted)]"
        />
      )}

      {/* Icon node */}
      <div
        className={cn(
          'flex-shrink-0 h-9 w-9 rounded-full border flex items-center justify-center z-10',
          config.bgColor,
          config.color,
          event.status === 'cancelled' && 'opacity-50',
        )}
        aria-hidden
      >
        {config.icon}
      </div>

      {/* Content */}
      <div className={cn('flex-1 pb-6', isLast && 'pb-0')}>
        <div
          className={cn(
            'rounded-[var(--shape-preset-card)] border border-[var(--color-border-default)]',
            'bg-[var(--color-surface-card)] p-3',
            event.status === 'cancelled' && 'opacity-60',
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-sm text-[var(--color-foreground-default)] truncate">
                  {event.title}
                </p>
                <Badge variant={statusVariant[event.status]} className="text-[10px] capitalize">
                  {event.status}
                </Badge>
              </div>
              {event.subtitle && (
                <p className="text-xs text-[var(--color-foreground-muted)]">{event.subtitle}</p>
              )}
            </div>
            {hasDetails && (
              <button
                type="button"
                onClick={() => setExpanded(e => !e)}
                aria-expanded={expanded}
                aria-label={expanded ? 'Collapse details' : 'Expand details'}
                className="flex-shrink-0 p-1 rounded hover:bg-[var(--color-background-subtle)] text-[var(--color-foreground-muted)] transition-colors"
              >
                <svg
                  className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            )}
          </div>

          {/* Time row */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <div className="flex items-center gap-1 text-xs text-[var(--color-foreground-muted)]">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="font-medium text-[var(--color-foreground-default)]">{event.startTime}</span>
              {event.endTime && (
                <>
                  <span>→</span>
                  <span className="font-medium text-[var(--color-foreground-default)]">{event.endTime}</span>
                </>
              )}
              {event.duration && (
                <span className="text-[var(--color-foreground-subtle)]">({event.duration})</span>
              )}
            </div>
            {event.location && (
              <div className="flex items-center gap-1 text-xs text-[var(--color-foreground-muted)]">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {event.location}
              </div>
            )}
          </div>

          {/* Expandable details */}
          {hasDetails && expanded && (
            <div className="mt-3 pt-3 border-t border-[var(--color-border-muted)] grid grid-cols-2 gap-x-4 gap-y-2">
              {event.details!.map(d => (
                <div key={d.label}>
                  <p className="text-[10px] uppercase tracking-wide text-[var(--color-foreground-subtle)]">{d.label}</p>
                  <p className="text-xs font-medium text-[var(--color-foreground-default)]">{d.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gap indicator */}
        {event.gapToNext && !isLast && (
          <div className="flex items-center gap-2 my-2 px-1">
            <div className="flex-1 h-px bg-[var(--color-border-muted)] border-dashed border-t border-[var(--color-border-muted)]" />
            <span className="text-[10px] text-[var(--color-foreground-subtle)] whitespace-nowrap px-1">
              {event.gapToNext}
            </span>
            <div className="flex-1 h-px bg-[var(--color-border-muted)] border-dashed border-t border-[var(--color-border-muted)]" />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ItineraryTimeline ────────────────────────────────────────────────────────

export function ItineraryTimeline({ events, className }: ItineraryTimelineProps) {
  if (events.length === 0) {
    return (
      <div className={cn('text-center py-8 text-[var(--color-foreground-subtle)]', className)}>
        No itinerary events.
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)} aria-label="Itinerary timeline">
      {events.map((event, i) => (
        <TimelineEventCard key={event.id} event={event} isLast={i === events.length - 1} />
      ))}
    </div>
  );
}
