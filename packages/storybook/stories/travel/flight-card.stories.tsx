import type { Meta, StoryObj } from '@storybook/react';
import { FlightCard } from '@travel/ui/components/travel/flight-card';
import type { FlightLeg } from '@travel/ui/components/travel/flight-card';

// ─── Sample data ──────────────────────────────────────────────────────────────

const JFK_LHR: FlightLeg = {
  duration: '7h 45m',
  stops: 0,
  segments: [
    {
      airline: 'British Airways',
      flightNumber: 'BA 117',
      origin: 'JFK',
      destination: 'LHR',
      departureTime: '21:45',
      arrivalTime: '09:30+1',
      duration: '7h 45m',
    },
  ],
};

const LHR_JFK: FlightLeg = {
  duration: '8h 10m',
  stops: 0,
  segments: [
    {
      airline: 'British Airways',
      flightNumber: 'BA 178',
      origin: 'LHR',
      destination: 'JFK',
      departureTime: '11:15',
      arrivalTime: '14:25',
      duration: '8h 10m',
    },
  ],
};

const JFK_LHR_1STOP: FlightLeg = {
  duration: '11h 20m',
  stops: 1,
  stopAirports: ['BOS'],
  segments: [
    {
      airline: 'American Airlines',
      flightNumber: 'AA 202',
      origin: 'JFK',
      destination: 'BOS',
      departureTime: '08:00',
      arrivalTime: '09:10',
      duration: '1h 10m',
    },
    {
      airline: 'American Airlines',
      flightNumber: 'AA 726',
      origin: 'BOS',
      destination: 'LHR',
      departureTime: '11:30',
      arrivalTime: '23:20',
      duration: '6h 50m',
    },
  ],
};

const sampleFareBreakdown = [
  { label: 'Base fare', amount: '$480', type: 'base' as const },
  { label: 'Taxes & fees', amount: '$98', type: 'tax' as const },
  { label: 'Total', amount: '$578', type: 'total' as const },
];

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof FlightCard> = {
  title: 'Travel/FlightCard',
  component: FlightCard,
  tags: ['autodocs'],
  args: {
    legs: [JFK_LHR],
    price: '$578',
    fareClass: 'Economy',
    onSelect: () => {},
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof FlightCard>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Nonstop: Story = {
  args: { legs: [JFK_LHR], isCheapest: true },
};

export const OneStop: Story = {
  args: {
    legs: [JFK_LHR_1STOP],
    price: '$412',
  },
};

export const RoundTrip: Story = {
  name: 'Round trip (2 legs)',
  args: {
    legs: [JFK_LHR, LHR_JFK],
    price: '$1,156',
    totalPrice: '$1,156',
    isBestValue: true,
    fareBreakdown: sampleFareBreakdown,
  },
};

export const BestValue: Story = {
  args: {
    legs: [JFK_LHR],
    isBestValue: true,
    fareBreakdown: sampleFareBreakdown,
    price: '$578',
  },
};

export const BusinessClass: Story = {
  args: {
    legs: [
      {
        ...JFK_LHR,
        segments: [{ ...JFK_LHR.segments[0], airline: 'Lufthansa', flightNumber: 'LH 400' }],
      },
    ],
    fareClass: 'Business',
    price: '$2,840',
    isBestValue: true,
  },
};

export const SeatsLeft: Story = {
  name: 'Seats left warning',
  args: {
    legs: [JFK_LHR],
    price: '$578',
    seatsLeft: 3,
  },
};

export const Compact: Story = {
  name: 'Compact (detail panel open)',
  args: {
    legs: [JFK_LHR, LHR_JFK],
    price: '$1,156',
    isCompact: true,
  },
};

export const Selected: Story = {
  args: {
    legs: [JFK_LHR],
    price: '$578',
    isSelected: true,
  },
};

export const MultipleResults: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 640 }}>
      <FlightCard
        legs={[JFK_LHR]}
        price="$578"
        fareClass="Economy"
        isCheapest
        onSelect={() => {}}
      />
      <FlightCard
        legs={[JFK_LHR_1STOP]}
        price="$412"
        fareClass="Economy"
        fareBreakdown={sampleFareBreakdown}
        onSelect={() => {}}
      />
      <FlightCard
        legs={[
          {
            ...JFK_LHR,
            segments: [{ ...JFK_LHR.segments[0], airline: 'Lufthansa', flightNumber: 'LH 400' }],
          },
        ]}
        price="$2,840"
        fareClass="Business"
        isBestValue
        onSelect={() => {}}
      />
    </div>
  ),
};
