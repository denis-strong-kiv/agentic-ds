'use client';

import { cn } from '../../../utils/cn';
import { Button } from '../../ui/button/index';
import { Badge } from '../../ui/badge/index';
import { AspectRatio } from '../../ui/aspect-ratio/index';

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
    <div className="travel-activity-card-stars" aria-label={`${score} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'travel-activity-card-star',
            i < full ? 'travel-activity-card-star--filled'
            : i === full && half ? 'travel-activity-card-star--half'
            : 'travel-activity-card-star--empty',
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
        'travel-activity-card',
        className,
      )}
    >
      {/* Cover image with category overlay */}
      <div className="travel-activity-card-media-wrap">
        <AspectRatio ratio={16 / 9}>
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="travel-activity-card-image" />
          ) : (
            <div className="travel-activity-card-image-fallback">
              <svg className="travel-activity-card-image-fallback-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
        <div className="travel-activity-card-category-wrap">
          <Badge variant="default" className="travel-activity-card-category-badge">
            {category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="travel-activity-card-content">
        <h3 className="travel-activity-card-title">{title}</h3>

        {description && (
          <p className="travel-activity-card-description">{description}</p>
        )}

        {/* Meta badges */}
        <div className="travel-activity-card-meta-badges">
          <Badge variant="outline" className="travel-activity-card-meta-badge">
            ⏱ {duration}
          </Badge>
          {difficulty && (
            <Badge
              variant={difficulty === 'Easy' ? 'deal' : difficulty === 'Challenging' || difficulty === 'Expert' ? 'destructive' : 'popular'}
              className="travel-activity-card-meta-badge"
            >
              {difficulty}
            </Badge>
          )}
        </div>

        {/* Rating */}
        {ratingScore !== undefined && (
          <div className="travel-activity-card-rating">
            <RatingStars score={ratingScore} />
            <span className="travel-activity-card-rating-score">{ratingScore.toFixed(1)}</span>
            {reviewCount !== undefined && (
              <span className="travel-activity-card-rating-count">({reviewCount.toLocaleString()} reviews)</span>
            )}
          </div>
        )}

        {/* Confirmation + cancellation badges */}
        <div className="travel-activity-card-confirmation-badges">
          {instantConfirmation && <Badge variant="deal" className="travel-activity-card-meta-badge">⚡ Instant Confirmation</Badge>}
          {freeCancellation && <Badge variant="deal" className="travel-activity-card-meta-badge">✓ Free Cancellation</Badge>}
        </div>

        {/* Available dates */}
        {availableDates && (
          <p className="travel-activity-card-availability">
            Available from {availableDates.earliest} ({availableDates.count} dates)
          </p>
        )}

        {/* Price + CTA */}
        <div className="travel-activity-card-footer">
          <div className="travel-activity-card-price-wrap">
            <p className="travel-activity-card-price">{pricePerPerson}</p>
            <p className="travel-activity-card-price-meta">{currency} per person</p>
          </div>
          <Button onClick={onBook}>Book Now</Button>
        </div>
      </div>
    </div>
  );
}
