import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentType } from 'react';
import { TravelSearchForm } from '@travel/ui/components/travel/search-form';
import type { TravelSearchPayload } from '@travel/ui/components/travel/search-form';
import { ResizablePreview } from '../utils/resizable-preview';

const AIRPORTS = [
  {
    id: 'airport-jfk',
    iata: 'JFK',
    city: 'New York',
    country: 'United States',
    shortName: 'New York',
    label: 'John F. Kennedy Intl Airport',
    itemType: 'airport',
    distance: '13 km from city center',
    geographicBreadcrumbs: [
      { type: 'city', label: 'New York' },
      { type: 'country', label: 'United States' },
    ],
  },
  {
    id: 'airport-lga',
    iata: 'LGA',
    city: 'New York',
    country: 'United States',
    shortName: 'New York',
    label: 'LaGuardia Airport',
    itemType: 'airport',
    distance: '8 km from city center',
    geographicBreadcrumbs: [
      { type: 'city', label: 'New York' },
      { type: 'country', label: 'United States' },
    ],
  },
  {
    id: 'airport-ewr',
    iata: 'EWR',
    city: 'Newark',
    country: 'United States',
    shortName: 'Newark',
    label: 'Newark Liberty Intl Airport',
    itemType: 'airport',
    distance: '9 km from city center',
    geographicBreadcrumbs: [
      { type: 'city', label: 'Newark' },
      { type: 'country', label: 'United States' },
    ],
  },
  {
    id: 'city-london',
    city: 'London',
    country: 'United Kingdom',
    shortName: 'London',
    itemType: 'city',
    geographicBreadcrumbs: [{ type: 'country', label: 'United Kingdom' }],
  },
  {
    id: 'airport-lhr',
    iata: 'LHR',
    city: 'London',
    country: 'United Kingdom',
    label: 'London Heathrow Airport',
    itemType: 'airport',
    geographicBreadcrumbs: [
      { type: 'city', label: 'London' },
      { type: 'country', label: 'United Kingdom' },
    ],
  },
  {
    id: 'airport-lgw',
    iata: 'LGW',
    city: 'London',
    country: 'United Kingdom',
    label: 'London Gatwick Airport',
    itemType: 'airport',
    geographicBreadcrumbs: [
      { type: 'city', label: 'London' },
      { type: 'country', label: 'United Kingdom' },
    ],
  },
  {
    id: 'country-france',
    country: 'France',
    shortName: 'France',
    itemType: 'country',
  },
  {
    id: 'city-paris',
    city: 'Paris',
    country: 'France',
    shortName: 'Paris',
    itemType: 'city',
    geographicBreadcrumbs: [{ type: 'country', label: 'France' }],
  },
  {
    id: 'landmark-eiffel',
    city: 'Paris',
    country: 'France',
    shortName: 'Eiffel Tower',
    itemType: 'landmark',
    geographicBreadcrumbs: [
      { type: 'city', label: 'Paris' },
      { type: 'country', label: 'France' },
    ],
  },
  {
    id: 'hotel-liberty',
    city: 'New York',
    country: 'United States',
    shortName: 'Liberty Hotel',
    itemType: 'hotel',
    geographicBreadcrumbs: [
      { type: 'city', label: 'New York' },
      { type: 'country', label: 'United States' },
    ],
  },
  { id: 'airport-cdg', iata: 'CDG', city: 'Paris', country: 'France', label: 'Charles de Gaulle Airport', itemType: 'airport' },
  { id: 'airport-dxb', iata: 'DXB', city: 'Dubai', country: 'United Arab Emirates', label: 'Dubai International Airport', itemType: 'airport' },
  { id: 'airport-sin', iata: 'SIN', city: 'Singapore', country: 'Singapore', label: 'Singapore Changi Airport', itemType: 'airport' },
  { id: 'airport-lax', iata: 'LAX', city: 'Los Angeles', country: 'United States', label: 'Los Angeles International Airport', itemType: 'airport' },
  { id: 'airport-nrt', iata: 'NRT', city: 'Tokyo', country: 'Japan', label: 'Narita International Airport', itemType: 'airport' },
  { id: 'airport-syd', iata: 'SYD', city: 'Sydney', country: 'Australia', label: 'Sydney Airport', itemType: 'airport' },
  { id: 'airport-ams', iata: 'AMS', city: 'Amsterdam', country: 'Netherlands', label: 'Amsterdam Schiphol Airport', itemType: 'airport' },
  { id: 'airport-fra', iata: 'FRA', city: 'Frankfurt', country: 'Germany', label: 'Frankfurt Airport', itemType: 'airport' },
  { id: 'airport-ist', iata: 'IST', city: 'Istanbul', country: 'Turkey', label: 'Istanbul Airport', itemType: 'airport' },
  { id: 'airport-doh', iata: 'DOH', city: 'Doha', country: 'Qatar', label: 'Hamad International Airport', itemType: 'airport' },
  { id: 'airport-bkk', iata: 'BKK', city: 'Bangkok', country: 'Thailand', label: 'Suvarnabhumi Airport', itemType: 'airport' },
  { id: 'airport-hkg', iata: 'HKG', city: 'Hong Kong', country: 'China', label: 'Hong Kong International Airport', itemType: 'airport' },
  { id: 'airport-icn', iata: 'ICN', city: 'Seoul', country: 'South Korea', label: 'Incheon International Airport', itemType: 'airport' },
  { id: 'airport-muc', iata: 'MUC', city: 'Munich', country: 'Germany', label: 'Munich Airport', itemType: 'airport' },
  { id: 'airport-mad', iata: 'MAD', city: 'Madrid', country: 'Spain', label: 'Adolfo Suárez Madrid–Barajas Airport', itemType: 'airport' },
  { id: 'airport-bcn', iata: 'BCN', city: 'Barcelona', country: 'Spain', label: 'Barcelona–El Prat Airport', itemType: 'airport' },
  { id: 'airport-fco', iata: 'FCO', city: 'Rome', country: 'Italy', label: 'Leonardo da Vinci–Fiumicino Airport', itemType: 'airport' },
  { id: 'airport-zrh', iata: 'ZRH', city: 'Zurich', country: 'Switzerland', label: 'Zurich Airport', itemType: 'airport' },
];

const RECENT_SEARCHES = [
  { route: 'New York (JFK) ⇄ London (LHR)', dates: 'Oct 20 – Nov 26' },
  { route: 'Newark (EWR) → London (LHR)', dates: 'Oct 20' },
  { route: 'Newark (EWR) ⇄ London (LHR)', dates: 'Oct 20 – Nov 26' },
];


const meta: Meta<typeof TravelSearchForm> = {
  title: 'Travel/SearchForm',
  component: TravelSearchForm,
  tags: ['autodocs'],
  args: {
    airportOptions: AIRPORTS,
    recentSearches: RECENT_SEARCHES,
    onSearch: (payload: TravelSearchPayload) => console.log('Search payload:', payload),
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story: ComponentType) => (
      <ResizablePreview>
        <Story />
      </ResizablePreview>
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
