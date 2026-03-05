import type { Meta, StoryObj } from '@storybook/react';
import { RoomGallery } from '@travel/ui/components/travel/room-gallery';
import type { RoomType } from '@travel/ui/components/travel/room-gallery';

// ─── Sample data ──────────────────────────────────────────────────────────────

const rooms: RoomType[] = [
  {
    id: 'standard',
    name: 'Standard Room',
    description: 'A comfortable room with a city view, featuring modern furnishings and all essential amenities.',
    size: '28 m²',
    bedConfiguration: '1 King bed',
    amenities: ['Free WiFi', 'Air conditioning', 'Flat-screen TV', 'Mini bar', 'Safe', 'Hairdryer'],
    pricePerNight: '$189',
    currency: 'USD',
    images: [],
    availability: 8,
  },
  {
    id: 'deluxe',
    name: 'Deluxe Room',
    description: 'Spacious room with panoramic views and upgraded bathroom with a rainfall shower.',
    size: '38 m²',
    bedConfiguration: '1 King bed or 2 Twin beds',
    amenities: ['Free WiFi', 'Air conditioning', 'Flat-screen TV', 'Mini bar', 'Bathtub', 'Lounge area'],
    pricePerNight: '$249',
    currency: 'USD',
    images: [],
    availability: 3,
    isLastFew: true,
  },
  {
    id: 'suite',
    name: 'Executive Suite',
    description: 'Indulge in a luxury suite with a separate living room, private balcony and butler service.',
    size: '72 m²',
    bedConfiguration: '1 King bed',
    amenities: ['Free WiFi', 'Butler service', 'Private balcony', 'Jacuzzi', 'Espresso machine', 'Living room', 'Dining area', 'Complimentary breakfast'],
    pricePerNight: '$489',
    currency: 'USD',
    images: [],
    availability: 1,
    isLastFew: true,
  },
];

const singleRoom: RoomType[] = [
  {
    id: 'twin',
    name: 'Twin Room',
    description: 'Ideal for friends or colleagues sharing — two comfortable single beds.',
    size: '26 m²',
    bedConfiguration: '2 Single beds',
    amenities: ['Free WiFi', 'Air conditioning', 'Flat-screen TV'],
    pricePerNight: '$159',
    currency: 'USD',
    images: [],
    availability: 12,
  },
];

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof RoomGallery> = {
  title: 'Travel/RoomGallery',
  component: RoomGallery,
  tags: ['autodocs'],
  args: {
    rooms,
    onSelectRoom: () => {},
  },
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof RoomGallery>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const ThreeRoomTypes: Story = {
  name: 'Three room types',
};

export const SingleRoom: Story = {
  name: 'Single room type',
  args: { rooms: singleRoom },
};

export const LastFewRooms: Story = {
  name: 'Last few rooms warning',
  args: {
    rooms: [
      {
        ...rooms[1],
        availability: 2,
        isLastFew: true,
      },
      {
        ...rooms[2],
        availability: 1,
        isLastFew: true,
      },
    ],
  },
};

export const EmptyRooms: Story = {
  name: 'No rooms available',
  args: { rooms: [] },
};
