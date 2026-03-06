import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoomGallery } from '../room-gallery/index.js';

const ROOMS = [
  {
    id: 'deluxe',
    name: 'Deluxe Room',
    description: 'Spacious room with city view',
    size: '35m²',
    bedConfiguration: '1 King Bed',
    amenities: ['WiFi', 'TV', 'Mini Bar', 'Coffee Machine'],
    pricePerNight: '$220',
    currency: 'USD',
    images: ['/room-1.jpg', '/room-2.jpg'],
    availability: 4,
  },
  {
    id: 'suite',
    name: 'Executive Suite',
    bedConfiguration: '1 King Bed + Sofa',
    amenities: ['WiFi', 'TV'],
    pricePerNight: '$390',
    currency: 'USD',
    images: ['/suite-1.jpg'],
    availability: 2,
    isLastFew: true,
  },
];

describe('RoomGallery', () => {
  it('applies semantic root class', () => {
    const { container } = render(<RoomGallery rooms={ROOMS} />);
    expect(container.firstElementChild).toHaveClass('travel-room-gallery-layout');
  });

  it('renders room selector title and room names', () => {
    render(<RoomGallery rooms={ROOMS} />);
    expect(screen.getByText('2 Room Types Available')).toBeInTheDocument();
    expect(screen.getByText('Deluxe Room')).toBeInTheDocument();
    expect(screen.getByText('Executive Suite')).toBeInTheDocument();
  });

  it('calls onSelectRoom when a room is selected', async () => {
    const user = userEvent.setup();
    const onSelectRoom = vi.fn();

    render(<RoomGallery rooms={ROOMS} onSelectRoom={onSelectRoom} />);

    const selectButtons = screen.getAllByRole('button', { name: /select room/i });
    await user.click(selectButtons[0]);

    expect(onSelectRoom).toHaveBeenCalled();
  });
});
