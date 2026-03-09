import type { ComponentMetadataShape } from '../../../component-metadata';

export const metadata: ComponentMetadataShape = {
  aiHints: {
    whenToUse: 'Hotel search result card in a results list or grid. Displays hotel name, star classification, image carousel, location, review score, amenity pills, per-night price, and a "View Deal" CTA.',
    whenNotToUse: 'Compact list rows where image carousels would be too heavy — use a plain text row instead. Do not use for flight or car results.',
    alternatives: ['FlightCard — for flight search results', 'DestinationItemContent — for destination autocomplete rows'],
    preferOver: 'Custom hotel listing cards that duplicate the carousel, favorite toggle, and review badge logic.',
  },
  behavior: {
    states: [
      'default — card with image carousel and all provided content',
      'no images — placeholder graphic shown in the 4:3 image area',
      'isFavorite=true — heart icon filled, aria-pressed="true"',
      'isFavorite=false — heart icon outline, aria-pressed="false"',
      'reviewScore >= 8.5 — "deal" badge variant',
      'reviewScore >= 7.0 — "popular" badge variant',
      'reviewScore < 7.0 — default badge variant',
    ],
    interactions: [
      'Image carousel prev/next buttons cycle through images array',
      'Dot indicators jump to a specific image',
      'Favorite button fires onFavoriteToggle callback',
      'View Deal button fires onViewDeal callback',
    ],
    responsive: 'Card is vertical with full-width image top. Image area uses 4:3 AspectRatio. Amenity pills truncate after 5 with a "+N more" label.',
  },
  accessibility: {
    role: 'generic (div)',
    keyboardNav: 'Tab through: carousel prev button, carousel next button, dot navigation buttons, favorite button, View Deal button.',
    ariaAttributes: [
      'aria-label on favorite button ("Add to wishlist" / "Remove from wishlist")',
      'aria-pressed on favorite button',
      'aria-label on carousel prev/next buttons ("Previous image" / "Next image")',
      'aria-label on dot buttons ("Go to image N")',
      'role="img" aria-label="{N} star hotel" on star rating group',
      'aria-hidden on individual star spans and placeholder icon',
      'aria-label="Amenities" on amenity list container',
    ],
    wcag: ['2.1.1 Keyboard', '1.1.1 Non-text Content', '4.1.2 Name, Role, Value'],
    screenReader: 'Each carousel image alt text includes position ("Hotel Name (2 of 4)"). Star rating announced via group aria-label.',
  },
  examples: [
    {
      label: 'Hotel card with carousel and review score',
      code: `<HotelCard
  name="The Savoy"
  starRating={5}
  images={['/images/savoy-1.jpg', '/images/savoy-2.jpg']}
  location="Strand, London"
  distanceToCenter="0.3 km"
  amenities={['Free WiFi', 'Spa', 'Restaurant', 'Fitness Center', 'Pool']}
  pricePerNight="$450"
  totalPrice="$3,150"
  currency="USD"
  reviewScore={9.2}
  reviewCount={2847}
  isFavorite={false}
  onFavoriteToggle={() => toggleFavorite(id)}
  onViewDeal={() => navigateToHotel(id)}
/>`,
    },
  ],
};
