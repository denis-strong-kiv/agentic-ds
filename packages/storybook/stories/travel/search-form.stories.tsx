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
      <div
        style={{
          minHeight: '320px',
          background: 'linear-gradient(135deg, #0f2b5b 0%, #1a4a8a 60%, #1e5fa8 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '3rem 4rem',
        }}
      >
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Explore the globe
        </p>
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
