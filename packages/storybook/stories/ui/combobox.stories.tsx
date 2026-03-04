import type { Meta, StoryObj } from '@storybook/react';
import { Combobox } from '@travel/ui/components/ui/combobox';

const meta: Meta<typeof Combobox> = {
  title: 'UI/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Combobox>;

const AIRPORTS = [
  { value: 'LHR', label: 'LHR', sublabel: 'London Heathrow' },
  { value: 'CDG', label: 'CDG', sublabel: 'Paris Charles de Gaulle' },
  { value: 'JFK', label: 'JFK', sublabel: 'New York John F. Kennedy' },
  { value: 'DXB', label: 'DXB', sublabel: 'Dubai International' },
  { value: 'SIN', label: 'SIN', sublabel: 'Singapore Changi' },
  { value: 'NRT', label: 'NRT', sublabel: 'Tokyo Narita', disabled: true },
  { value: 'BCN', label: 'BCN', sublabel: 'Barcelona El Prat' },
  { value: 'AMS', label: 'AMS', sublabel: 'Amsterdam Schiphol' },
];

export const AirportSearch: Story = {
  name: 'Airport search with sublabels',
  args: {
    options: AIRPORTS,
    value: 'LHR',
    placeholder: 'Origin airport',
    searchPlaceholder: 'Search airports...',
  },
};

export const NoSelection: Story = {
  name: 'Unselected (placeholder)',
  args: {
    options: AIRPORTS,
    placeholder: 'Select destination',
    searchPlaceholder: 'Search airports...',
  },
};

export const Loading: Story = {
  name: 'Loading state',
  args: {
    options: [],
    isLoading: true,
    placeholder: 'Destination airport',
    searchPlaceholder: 'Type to search...',
  },
};

export const EmptyResults: Story = {
  name: 'No results',
  args: {
    options: [],
    placeholder: 'Destination airport',
    searchPlaceholder: 'Search airports...',
  },
};

export const WithDisabledOptions: Story = {
  name: 'With disabled options',
  args: {
    options: AIRPORTS,
    placeholder: 'Select airport',
    searchPlaceholder: 'Search...',
  },
};
