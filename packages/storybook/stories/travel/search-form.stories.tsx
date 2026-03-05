import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentType } from 'react';
import { TravelSearchForm } from '@travel/ui/components/travel/search-form';
import type { TravelSearchPayload } from '@travel/ui/components/travel/search-form';

const AIRPORTS = [
  { iata: 'JFK', city: 'New York', country: 'United States' },
  { iata: 'LHR', city: 'London', country: 'United Kingdom' },
  { iata: 'CDG', city: 'Paris', country: 'France' },
  { iata: 'DXB', city: 'Dubai', country: 'United Arab Emirates' },
  { iata: 'SIN', city: 'Singapore', country: 'Singapore' },
  { iata: 'LAX', city: 'Los Angeles', country: 'United States' },
  { iata: 'NRT', city: 'Tokyo', country: 'Japan' },
  { iata: 'SYD', city: 'Sydney', country: 'Australia' },
  { iata: 'AMS', city: 'Amsterdam', country: 'Netherlands' },
  { iata: 'FRA', city: 'Frankfurt', country: 'Germany' },
  { iata: 'IST', city: 'Istanbul', country: 'Turkey' },
  { iata: 'DOH', city: 'Doha', country: 'Qatar' },
  { iata: 'BKK', city: 'Bangkok', country: 'Thailand' },
  { iata: 'HKG', city: 'Hong Kong', country: 'China' },
  { iata: 'ICN', city: 'Seoul', country: 'South Korea' },
  { iata: 'MUC', city: 'Munich', country: 'Germany' },
  { iata: 'MAD', city: 'Madrid', country: 'Spain' },
  { iata: 'BCN', city: 'Barcelona', country: 'Spain' },
  { iata: 'FCO', city: 'Rome', country: 'Italy' },
  { iata: 'ZRH', city: 'Zurich', country: 'Switzerland' },
];

const meta: Meta<typeof TravelSearchForm> = {
  title: 'Travel/SearchForm',
  component: TravelSearchForm,
  tags: ['autodocs'],
  args: {
    airportOptions: AIRPORTS,
    onSearch: (payload: TravelSearchPayload) => console.log('Search payload:', payload),
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story: ComponentType) => (
      <div style={{ padding: '2rem 3rem' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof TravelSearchForm>;

export const FlightsRoundTrip: Story = {
  name: 'Flights — Round trip',
  args: { defaultTab: 'flights' },
};

export const FlightsOneWay: Story = {
  name: 'Flights — One way',
  args: { defaultTab: 'flights' },
  play: async ({ canvasElement }) => {
    // Pre-select one-way trip type so the story renders in that state
    const radio = canvasElement.querySelector('input[value="one-way"]') as HTMLInputElement | null;
    radio?.click();
  },
};

export const Hotels: Story = {
  name: 'Hotels',
  args: { defaultTab: 'hotels' },
};

export const NoOptions: Story = {
  name: 'No airport options (empty state)',
  args: { defaultTab: 'flights', airportOptions: [] },
};
