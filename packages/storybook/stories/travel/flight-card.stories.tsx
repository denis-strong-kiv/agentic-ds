import type { Meta, StoryObj } from '@storybook/react';
import { FlightCard } from '@travel/ui/components/travel/flight-card';
import React from 'react';

const sampleSegment = {
  airline: 'British Airways',
  flightNumber: 'BA 117',
  origin: 'JFK',
  destination: 'LHR',
  departureTime: '21:45',
  arrivalTime: '09:30+1',
  duration: '7h 45m',
  stops: 0,
};

const sampleFareBreakdown = [
  { label: 'Base fare', amount: '$480', type: 'base' as const },
  { label: 'Taxes & fees', amount: '$98', type: 'tax' as const },
  { label: 'Total', amount: '$578', type: 'total' as const },
];

const meta: Meta<typeof FlightCard> = {
  title: 'Travel/FlightCard',
  component: FlightCard,
  tags: ['autodocs'],
  args: {
    segment: sampleSegment,
    price: '$578',
    currency: 'USD',
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

export const Direct: Story = {
  args: { segment: sampleSegment, isCheapest: true },
};

export const OneStop: Story = {
  args: {
    segment: { ...sampleSegment, flightNumber: 'AA 202 + BA 304', stops: 1, stopAirports: ['BOS'], duration: '10h 20m' },
    price: '$412',
  },
};

export const BestValue: Story = {
  args: {
    segment: sampleSegment,
    isBestValue: true,
    fareBreakdown: sampleFareBreakdown,
    price: '$578',
  },
};

export const WithFareBreakdown: Story = {
  args: {
    segment: sampleSegment,
    fareBreakdown: sampleFareBreakdown,
    price: '$578',
  },
};

export const BusinessClass: Story = {
  args: {
    segment: { ...sampleSegment, airline: 'Lufthansa', flightNumber: 'LH 400' },
    fareClass: 'Business',
    price: '$2,840',
    isBestValue: true,
  },
};

export const MultipleResults: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 640 }}>
      <FlightCard
        segment={sampleSegment}
        price="$578"
        currency="USD"
        fareClass="Economy"
        isCheapest
        onSelect={() => {}}
      />
      <FlightCard
        segment={{ ...sampleSegment, flightNumber: 'AA 202 + BA 304', stops: 1, stopAirports: ['BOS'], duration: '10h 20m' }}
        price="$412"
        currency="USD"
        fareClass="Economy"
        fareBreakdown={sampleFareBreakdown}
        onSelect={() => {}}
      />
      <FlightCard
        segment={{ ...sampleSegment, airline: 'Lufthansa', flightNumber: 'LH 400' }}
        price="$2,840"
        currency="USD"
        fareClass="Business"
        isBestValue
        onSelect={() => {}}
      />
    </div>
  ),
};
