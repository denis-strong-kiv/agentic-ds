import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HotelCard } from '../hotel-card/index.js';
import type { HotelCardProps } from '../hotel-card/index.js';

const PROPS: HotelCardProps = {
  name: 'Grand Plaza Hotel',
  starRating: 4,
  location: 'Midtown Manhattan',
  pricePerNight: '$199',
};

describe('HotelCard', () => {
  it('applies semantic root class', () => {
    const { container } = render(<HotelCard {...PROPS} />);
    expect(container.firstElementChild).toHaveClass('travel-hotel-card');
  });

  it('renders hotel name', () => {
    render(<HotelCard {...PROPS} />);
    expect(screen.getByText('Grand Plaza Hotel')).toBeInTheDocument();
  });

  it('renders location', () => {
    render(<HotelCard {...PROPS} />);
    expect(screen.getByText(/Midtown Manhattan/)).toBeInTheDocument();
  });

  it('renders distance to center', () => {
    render(<HotelCard {...PROPS} distanceToCenter="0.5 km" />);
    expect(screen.getByText(/0\.5 km from center/)).toBeInTheDocument();
  });

  it('renders price per night', () => {
    render(<HotelCard {...PROPS} />);
    expect(screen.getByText('$199')).toBeInTheDocument();
  });

  it('renders currency label', () => {
    render(<HotelCard {...PROPS} currency="EUR" />);
    expect(screen.getByText('EUR per night')).toBeInTheDocument();
  });

  it('renders total price when provided', () => {
    render(<HotelCard {...PROPS} totalPrice="$995" />);
    expect(screen.getByText('$995 total')).toBeInTheDocument();
  });

  it('renders star rating with aria-label', () => {
    render(<HotelCard {...PROPS} starRating={4} />);
    expect(screen.getByLabelText('4 star hotel')).toBeInTheDocument();
  });

  it('renders review score badge', () => {
    render(<HotelCard {...PROPS} reviewScore={8.7} />);
    expect(screen.getByText('8.7')).toBeInTheDocument();
  });

  it('renders review count', () => {
    render(<HotelCard {...PROPS} reviewScore={8.2} reviewCount={1234} />);
    expect(screen.getByText(/1,234 reviews/)).toBeInTheDocument();
  });

  it('renders amenity pills (max 5)', () => {
    render(
      <HotelCard
        {...PROPS}
        amenities={['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Parking']}
      />,
    );
    expect(screen.getByText('WiFi')).toBeInTheDocument();
    expect(screen.getByText('Pool')).toBeInTheDocument();
    expect(screen.getByText('Spa')).toBeInTheDocument();
    // 6th amenity should be +1 more
    expect(screen.getByText('+1 more')).toBeInTheDocument();
    expect(screen.queryByText('Parking')).not.toBeInTheDocument();
  });

  it('renders View Deal button', () => {
    render(<HotelCard {...PROPS} />);
    expect(screen.getByRole('button', { name: 'View Deal' })).toBeInTheDocument();
  });

  it('calls onViewDeal when View Deal is clicked', async () => {
    const user = userEvent.setup();
    const onViewDeal = vi.fn();
    render(<HotelCard {...PROPS} onViewDeal={onViewDeal} />);
    await user.click(screen.getByRole('button', { name: 'View Deal' }));
    expect(onViewDeal).toHaveBeenCalledOnce();
  });

  it('renders favorite toggle button', () => {
    render(<HotelCard {...PROPS} />);
    expect(screen.getByRole('button', { name: /add to wishlist/i })).toBeInTheDocument();
  });

  it('calls onFavoriteToggle when favorite is clicked', async () => {
    const user = userEvent.setup();
    const onFavoriteToggle = vi.fn();
    render(<HotelCard {...PROPS} onFavoriteToggle={onFavoriteToggle} />);
    await user.click(screen.getByRole('button', { name: /add to wishlist/i }));
    expect(onFavoriteToggle).toHaveBeenCalledOnce();
  });

  it('shows "Remove from wishlist" label when isFavorite', () => {
    render(<HotelCard {...PROPS} isFavorite />);
    expect(screen.getByRole('button', { name: /remove from wishlist/i })).toBeInTheDocument();
  });

  it('renders image carousel with navigation when images provided', () => {
    render(
      <HotelCard
        {...PROPS}
        images={['/img1.jpg', '/img2.jpg', '/img3.jpg']}
      />,
    );
    expect(screen.getByRole('button', { name: 'Previous image' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next image' })).toBeInTheDocument();
  });

  it('navigates carousel to next image', async () => {
    const user = userEvent.setup();
    render(
      <HotelCard
        {...PROPS}
        images={['/img1.jpg', '/img2.jpg']}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Next image' }));
    // Go to image 2
    expect(screen.getByRole('button', { name: 'Go to image 2' })).toBeInTheDocument();
  });
});
