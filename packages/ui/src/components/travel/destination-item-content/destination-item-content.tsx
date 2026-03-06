import * as React from 'react';
import { Building2, Globe2, Landmark, Map, MapPin, Plane } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { Icon } from '../../ui/icon/index.js';

export type DestinationDisplayType =
  | 'airport'
  | 'airport-indented'
  | 'city'
  | 'neighborhood'
  | 'country'
  | 'landmark'
  | 'area';

const destinationDecorationVariants = cva(
  ['travel-destination-item-decoration'],
  {
    variants: {
      destinationType: {
        airport: ['travel-destination-item-decoration--airport'],
        'airport-indented': ['travel-destination-item-decoration--airport-indented'],
        city: ['travel-destination-item-decoration--city'],
        neighborhood: ['travel-destination-item-decoration--neighborhood'],
        country: ['travel-destination-item-decoration--country'],
        landmark: ['travel-destination-item-decoration--landmark'],
        area: ['travel-destination-item-decoration--area'],
      },
    },
    defaultVariants: {
      destinationType: 'city',
    },
  },
);

const destinationImageVariants = cva([
  'travel-destination-item-image',
]);

const destinationTitleRowVariants = cva([
  'travel-destination-item-title-row',
]);

const destinationSubtitleVariants = cva([
  'travel-destination-item-subtitle',
]);

export interface DestinationItemContentProps {
  destinationType?: DestinationDisplayType;
  title: React.ReactNode;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
}

function DestinationDecoration({
  destinationType = 'city',
  imageUrl,
  imageAlt,
}: {
  destinationType?: DestinationDisplayType;
  imageUrl?: string;
  imageAlt?: string;
}) {
  if (destinationType === 'city' && imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={imageAlt ?? 'Destination'}
        className={destinationImageVariants()}
      />
    );
  }

  const iconByType: Record<DestinationDisplayType, typeof Plane> = {
    airport: Plane,
    'airport-indented': Plane,
    city: Building2,
    neighborhood: MapPin,
    country: Globe2,
    landmark: Landmark,
    area: Map,
  };

  const icon = iconByType[destinationType] ?? Building2;
  const size = 22;

  return (
    <span
      className={destinationDecorationVariants({ destinationType })}
    >
      <Icon icon={icon} size={size} aria-hidden />
    </span>
  );
}

export function DestinationItemContent({
  destinationType = 'city',
  title,
  subtitle,
  imageUrl,
  imageAlt,
}: DestinationItemContentProps) {
  const decorationProps = {
    ...(destinationType ? { destinationType } : {}),
    ...(imageUrl ? { imageUrl } : {}),
    ...(imageAlt ? { imageAlt } : {}),
  };

  return (
    <>
      <DestinationDecoration
        {...decorationProps}
      />
      <span className="travel-destination-item-content">
        <span className={destinationTitleRowVariants()}>
          <span className="travel-destination-item-title">{title}</span>
        </span>
        {subtitle && (
          <span className={destinationSubtitleVariants()}>
            {subtitle}
          </span>
        )}
      </span>
    </>
  );
}
