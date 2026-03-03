'use client';

import { cn } from '../../utils/cn.js';
import { Button } from '../ui/button.js';
import { Badge } from '../ui/badge.js';
import { AspectRatio } from '../ui/aspect-ratio.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ActivityCategory = 'Tour' | 'Experience' | 'Transfer' | 'Attraction' | 'Food & Drink' | 'Sport' | 'Wellness';
export type ActivityDifficulty = 'Easy' | 'Moderate' | 'Challenging' | 'Expert';

export interface AvailableDates {
  earliest: string;
  count: number;
}

export interface ActivityCardProps {
  title: string;
  category: ActivityCategory;
  imageUrl?: string;
  description?: string;
  duration: string;
  difficulty?: ActivityDifficulty;
  ratingScore?: number;
  reviewCount?: number;
  pricePerPerson: string;
  currency?: string;
  instantConfirmation?: boolean;
  freeCancellation?: boolean;
  availableDates?: AvailableDates;
  onBook?: () => void;
  className?: string;
}

// ─── Star display ─────────────────────────────────────────────────────────────

function RatingStars({ score }: { score: number }) {
  const full = Math.floor(score);
  const half = score % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5" aria-label={`${score} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'text-sm',
            i < full ? 'text-[var(--color-warning-default)]'
            : i === full && half ? 'text-[var(--color-warning-default)] opacity-60'
            : 'text-[var(--color-border-default)]',
          )}
          aria-hidden
        >
          ★
        </span>
      ))}
    </div>
  );
}

// ─── ActivityCard ─────────────────────────────────────────────────────────────

export function ActivityCard({
  title,
  category,
  imageUrl,
  description,
  duration,
  difficulty,
  ratingScore,
  reviewCount,
  pricePerPerson,
  currency = 'USD',
  instantConfirmation = false,
  freeCancellation = false,
  availableDates,
  onBook,
  className,
}: ActivityCardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--shape-preset-card)] border border-[var(--color-border-default)]',
        'bg-[var(--color-surface-card)] overflow-hidden',
        className,
      )}
    >
      {/* Cover image with category overlay */}
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-[var(--color-background-subtle)] flex items-center justify-center text-[var(--color-foreground-subtle)]">
              <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" />
                <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" />
                <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" />
                <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z" />
                <path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
                <path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z" />
                <path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z" />
              </svg>
            </div>
          )}
        </AspectRatio>
        {/* Category overlay */}
        <div className="absolute top-2 left-2">
          <Badge variant="default" className="bg-black/60 text-white border-0 backdrop-blur-sm">
            {category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-[var(--color-foreground-default)] line-clamp-2 mb-2">{title}</h3>

        {description && (
          <p className="text-xs text-[var(--color-foreground-muted)] line-clamp-2 mb-2">{description}</p>
        )}

        {/* Meta badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge variant="outline" className="text-xs">
            ⏱ {duration}
          </Badge>
          {difficulty && (
            <Badge
              variant={difficulty === 'Easy' ? 'deal' : difficulty === 'Challenging' || difficulty === 'Expert' ? 'destructive' : 'popular'}
              className="text-xs"
            >
              {difficulty}
            </Badge>
          )}
        </div>

        {/* Rating */}
        {ratingScore !== undefined && (
          <div className="flex items-center gap-2 mb-3">
            <RatingStars score={ratingScore} />
            <span className="text-sm font-medium text-[var(--color-foreground-default)]">{ratingScore.toFixed(1)}</span>
            {reviewCount !== undefined && (
              <span className="text-xs text-[var(--color-foreground-muted)]">({reviewCount.toLocaleString()} reviews)</span>
            )}
          </div>
        )}

        {/* Confirmation + cancellation badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {instantConfirmation && <Badge variant="deal" className="text-xs">⚡ Instant Confirmation</Badge>}
          {freeCancellation && <Badge variant="deal" className="text-xs">✓ Free Cancellation</Badge>}
        </div>

        {/* Available dates */}
        {availableDates && (
          <p className="text-xs text-[var(--color-foreground-muted)] mb-3">
            Available from {availableDates.earliest} ({availableDates.count} dates)
          </p>
        )}

        {/* Price + CTA */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-[var(--color-foreground-default)]">{pricePerPerson}</p>
            <p className="text-xs text-[var(--color-foreground-muted)]">{currency} per person</p>
          </div>
          <Button onClick={onBook}>Book Now</Button>
        </div>
      </div>
    </div>
  );
}
