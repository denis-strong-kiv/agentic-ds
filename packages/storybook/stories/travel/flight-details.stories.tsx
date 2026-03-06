import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FlightDetails } from '@travel/ui/components/travel/flight-details';
import type { FlightDetailsProps, FareOption } from '@travel/ui/components/travel/flight-details';
import type { FlightLeg } from '@travel/ui/components/travel/flight-card';

const OUTBOUND: FlightLeg = {
  duration: '7h 25m',
  stops: 0,
  segments: [
    {
      airline: 'United Airlines',
      flightNumber: 'UA 9838',
      origin: 'EWR',
      originCity: 'Newark',
      destination: 'LHR',
      destinationCity: 'London',
      departureTime: '5:30 pm',
      arrivalTime: '5:55 am+1',
      duration: '7h 25m',
      class: 'Economy',
      aircraft: 'Boeing 777-200',
    },
  ],
};

const RETURN_WITH_STOP: FlightLeg = {
  duration: '12h 5m',
  stops: 1,
  stopAirports: ['ZRH'],
  segments: [
    {
      airline: 'Swiss',
      flightNumber: 'LX 4905',
      origin: 'LHR',
      originCity: 'London',
      destination: 'ZRH',
      destinationCity: 'Zürich',
      departureTime: '6:00 am',
      arrivalTime: '9:05 am',
      duration: '2h 5m',
      class: 'Economy',
      aircraft: 'Boeing 777-300ER',
      operatedBy: 'Operated by Swiss',
    },
    {
      airline: 'Swiss',
      flightNumber: 'LX 22',
      origin: 'ZRH',
      originCity: 'Zürich',
      destination: 'JFK',
      destinationCity: 'New York',
      departureTime: '10:30 am',
      arrivalTime: '1:05 pm',
      duration: '9h 35m',
      class: 'Economy',
      aircraft: 'Boeing 777-300ER',
      operatedBy: 'Operated by Swiss',
    },
  ],
};

const FARE_OPTIONS: FareOption[] = [
  {
    id: 'basic',
    name: 'Basic',
    fareClass: 'Economy',
    price: '$578',
    features: ['1 carry-on bag', 'No seat selection', 'No changes'],
  },
  {
    id: 'standard',
    name: 'Standard',
    fareClass: 'Economy',
    price: '$673',
    features: ['1 carry-on bag', '1 checked bag (20 kg)', 'Seat selection', 'Free rebooking'],
    isRecommended: true,
  },
  {
    id: 'flex',
    name: 'Flex',
    fareClass: 'Economy',
    price: '$798',
    features: ['1 carry-on bag', '2 checked bags', 'Any seat', 'Free changes', 'Refundable'],
  },
];

function ToggleableDetails(props: Omit<FlightDetailsProps, 'isOpen' | 'onClose'>) {
  const [open, setOpen] = useState(true);
  if (!open) {
    return (
      <button
        type="button"
        style={{ padding: '0.75rem 1.5rem', background: 'var(--color-primary-default)', color: 'white', borderRadius: '0.5rem' }}
        onClick={() => setOpen(true)}
      >
        Open Flight Details
      </button>
    );
  }
  return <FlightDetails {...props} isOpen onClose={() => setOpen(false)} />;
}

const meta: Meta<typeof FlightDetails> = {
  title: 'Travel/FlightDetails',
  component: FlightDetails,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640, height: '90vh', display: 'flex', flexDirection: 'column', border: '1px solid var(--color-border-default)', borderRadius: '0.5rem', overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof FlightDetails>;

export const Nonstop: Story = {
  name: 'One-way nonstop',
  render: () => (
    <ToggleableDetails
      title="New York – London"
      legs={[OUTBOUND]}
      fareOptions={FARE_OPTIONS}
      onShare={() => {}}
      onSelectFare={(id) => console.log('Selected fare:', id)}
    />
  ),
};

export const RoundTripWithStop: Story = {
  name: 'Round trip with layover',
  render: () => (
    <ToggleableDetails
      title="New York – London"
      legs={[OUTBOUND, RETURN_WITH_STOP]}
      nightsBetween={7}
      fareOptions={FARE_OPTIONS}
      onShare={() => {}}
      onSelectFare={(id) => console.log('Selected fare:', id)}
    />
  ),
};

export const NoFareOptions: Story = {
  name: 'Without fare options',
  render: () => (
    <ToggleableDetails
      title="New York – London"
      legs={[OUTBOUND]}
      onShare={() => {}}
    />
  ),
};
