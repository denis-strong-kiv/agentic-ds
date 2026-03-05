import type { Meta, StoryObj } from '@storybook/react';
import { CarCard } from '@travel/ui/components/travel/car-card';

const economySpecs = {
  seats: 5,
  doors: 4,
  transmission: 'Automatic' as const,
  hasAC: true,
  luggageCapacity: 2,
};

const suvSpecs = {
  seats: 7,
  doors: 5,
  transmission: 'Automatic' as const,
  hasAC: true,
  luggageCapacity: 4,
};

const luxurySpecs = {
  seats: 5,
  doors: 4,
  transmission: 'Automatic' as const,
  hasAC: true,
  luggageCapacity: 3,
};

const insuranceOptions = [
  { id: 'basic', label: 'Basic Cover', pricePerDay: '$8', description: 'Third-party liability only' },
  { id: 'full', label: 'Full Cover', pricePerDay: '$18', description: 'Comprehensive with zero excess' },
];

const meta: Meta<typeof CarCard> = {
  title: 'Travel/CarCard',
  component: CarCard,
  tags: ['autodocs'],
  args: {
    name: 'Toyota Corolla',
    category: 'Economy',
    specs: economySpecs,
    pickupLocation: 'JFK Airport, Terminal 4',
    pricePerDay: '$42',
    totalPrice: '$252',
    currency: 'USD',
    providerName: 'Hertz',
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
type Story = StoryObj<typeof CarCard>;

export const Economy: Story = {};

export const WithInsuranceOptions: Story = {
  name: 'With insurance options',
  args: { insuranceOptions },
};

export const SUV: Story = {
  args: {
    name: 'Ford Explorer',
    category: 'SUV',
    specs: suvSpecs,
    pricePerDay: '$89',
    totalPrice: '$534',
    insuranceOptions,
    providerName: 'Enterprise',
  },
};

export const Luxury: Story = {
  args: {
    name: 'Mercedes-Benz E-Class',
    category: 'Luxury',
    specs: luxurySpecs,
    pricePerDay: '$189',
    totalPrice: '$1,134',
    providerName: 'Avis',
    insuranceOptions,
  },
};

export const ManualTransmission: Story = {
  name: 'Manual transmission',
  args: {
    name: 'Volkswagen Golf',
    category: 'Compact',
    specs: { seats: 5, doors: 4, transmission: 'Manual', hasAC: true, luggageCapacity: 2 },
    pricePerDay: '$35',
    totalPrice: '$210',
  },
};

export const OneWayRental: Story = {
  name: 'One-way (different drop-off)',
  args: {
    dropoffLocation: 'LAX Airport, Terminal 5',
    totalPrice: '$315',
  },
};

export const NoImage: Story = {
  name: 'No image (placeholder)',
  // omit imageUrl to trigger the placeholder SVG
  args: {},
};

export const ResultList: Story = {
  name: 'Result list (3-up)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 640 }}>
      <CarCard
        name="Toyota Corolla"
        category="Economy"
        specs={economySpecs}
        pickupLocation="JFK Airport"
        pricePerDay="$42"
        totalPrice="$252"
        providerName="Hertz"
        onSelect={() => {}}
      />
      <CarCard
        name="Ford Explorer"
        category="SUV"
        specs={suvSpecs}
        pickupLocation="JFK Airport"
        pricePerDay="$89"
        totalPrice="$534"
        providerName="Enterprise"
        insuranceOptions={insuranceOptions}
        onSelect={() => {}}
      />
      <CarCard
        name="Mercedes-Benz E-Class"
        category="Luxury"
        specs={luxurySpecs}
        pickupLocation="JFK Airport"
        pricePerDay="$189"
        totalPrice="$1,134"
        providerName="Avis"
        onSelect={() => {}}
      />
    </div>
  ),
};
