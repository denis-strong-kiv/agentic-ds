import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FilterPanel, createDefaultFilters } from '@travel/ui/components/travel/filter-panel';
import type { FilterState } from '@travel/ui/components/travel/filter-panel';

// ─── Shared data ──────────────────────────────────────────────────────────────

const AIRLINES = [
  { value: 'BA', label: 'British Airways' },
  { value: 'AA', label: 'American Airlines' },
  { value: 'LH', label: 'Lufthansa' },
  { value: 'EK', label: 'Emirates' },
  { value: 'QR', label: 'Qatar Airways' },
  { value: 'AF', label: 'Air France' },
];

const HOTEL_CHAINS = [
  { value: 'marriott', label: 'Marriott' },
  { value: 'hilton', label: 'Hilton' },
  { value: 'hyatt', label: 'Hyatt' },
  { value: 'ihg', label: 'IHG' },
  { value: 'accor', label: 'Accor' },
];

// ─── Stateful wrapper ─────────────────────────────────────────────────────────

function ControlledFilterPanel({
  initialFilters,
  maxPrice = 2000,
  ...props
}: Omit<React.ComponentProps<typeof FilterPanel>, 'filters' | 'onChange' | 'onClearAll'> & {
  initialFilters?: FilterState;
}) {
  const [filters, setFilters] = useState<FilterState>(
    initialFilters ?? createDefaultFilters(maxPrice),
  );
  return (
    <FilterPanel
      {...props}
      maxPrice={maxPrice}
      filters={filters}
      onChange={setFilters}
      onClearAll={() => setFilters(createDefaultFilters(maxPrice))}
    />
  );
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof FilterPanel> = {
  title: 'Travel/FilterPanel',
  component: FilterPanel,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 300 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof FilterPanel>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Flights: Story = {
  render: () => (
    <ControlledFilterPanel mode="flights" providerOptions={AIRLINES} maxPrice={2000} />
  ),
};

export const Hotels: Story = {
  render: () => (
    <ControlledFilterPanel mode="hotels" providerOptions={HOTEL_CHAINS} maxPrice={1000} />
  ),
};

export const Cars: Story = {
  render: () => <ControlledFilterPanel mode="cars" maxPrice={500} />,
};

export const WithActiveFilters: Story = {
  name: 'With active filters',
  render: () => (
    <ControlledFilterPanel
      mode="flights"
      providerOptions={AIRLINES}
      maxPrice={2000}
      initialFilters={{
        priceRange: [200, 800],
        stops: ['nonstop', '1-stop'],
        airlines: ['BA', 'LH'],
        departureRange: [6, 20],
        arrivalRange: [0, 24],
        amenities: [],
        starRatings: [],
      }}
    />
  ),
};

export const HotelWithAmenities: Story = {
  name: 'Hotels — amenities pre-selected',
  render: () => (
    <ControlledFilterPanel
      mode="hotels"
      providerOptions={HOTEL_CHAINS}
      maxPrice={1000}
      initialFilters={{
        priceRange: [100, 500],
        stops: [],
        airlines: [],
        departureRange: [0, 24],
        arrivalRange: [0, 24],
        amenities: ['wifi', 'pool', 'breakfast'],
        starRatings: [4, 5],
      }}
    />
  ),
};

export const NoProviders: Story = {
  name: 'No provider options',
  render: () => <ControlledFilterPanel mode="flights" maxPrice={2000} />,
};
