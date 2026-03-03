import type { Meta, StoryObj } from '@storybook/react';
import { HotelCard } from '@travel/ui/components/travel/hotel-card';
import React from 'react';

const meta: Meta<typeof HotelCard> = {
  title: 'Travel/HotelCard',
  component: HotelCard,
  tags: ['autodocs'],
  args: {
    name: 'Hotel Lumière',
    starRating: 4,
    location: 'Saint-Germain-des-Prés, Paris',
    distanceToCenter: '1.2 km to city centre',
    amenities: ['Free WiFi', 'Pool', 'Breakfast', 'Gym', 'Spa'],
    pricePerNight: '$245',
    totalPrice: '$1,225',
    currency: 'USD',
    reviewScore: 8.9,
    reviewCount: 2840,
    onViewDeal: () => {},
    onFavoriteToggle: () => {},
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof HotelCard>;

export const Default: Story = {};

export const Luxury: Story = {
  args: {
    name: 'The Ritz Paris',
    starRating: 5,
    location: 'Place Vendôme, Paris',
    distanceToCenter: '0.3 km to city centre',
    amenities: ['Free WiFi', 'Pool', 'Fine Dining', 'Concierge', 'Spa', 'Valet'],
    pricePerNight: '$1,280',
    totalPrice: '$6,400',
    reviewScore: 9.6,
    reviewCount: 1200,
  },
};

export const Budget: Story = {
  args: {
    name: 'Generator Paris',
    starRating: 2,
    location: 'Belleville, Paris',
    distanceToCenter: '3.5 km to city centre',
    amenities: ['Free WiFi', 'Bar', 'Luggage Storage'],
    pricePerNight: '$42',
    totalPrice: '$210',
    reviewScore: 7.2,
    reviewCount: 5600,
  },
};

export const Favorite: Story = {
  args: { isFavorite: true },
};

export const Grid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
      {[
        { name: 'Hotel Lumière', stars: 4 as const, price: '$245', score: 8.9 },
        { name: 'The Ritz Paris', stars: 5 as const, price: '$1,280', score: 9.6 },
        { name: 'Generator Paris', stars: 2 as const, price: '$42', score: 7.2 },
      ].map((h) => (
        <HotelCard
          key={h.name}
          name={h.name}
          starRating={h.stars}
          location="Paris, France"
          amenities={['Free WiFi', 'Pool', 'Breakfast']}
          pricePerNight={h.price}
          reviewScore={h.score}
          reviewCount={1200}
          onViewDeal={() => {}}
          onFavoriteToggle={() => {}}
        />
      ))}
    </div>
  ),
};
