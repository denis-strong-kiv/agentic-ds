import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentType } from 'react';
import { SearchForm } from '@travel/ui/components/travel/search-form';
import type { SearchPayload } from '@travel/ui/components/travel/search-form';

const airports = [
  { value: 'JFK', label: 'New York (JFK)', description: 'John F. Kennedy International' },
  { value: 'LHR', label: 'London (LHR)', description: 'Heathrow Airport' },
  { value: 'CDG', label: 'Paris (CDG)', description: 'Charles de Gaulle Airport' },
  { value: 'DXB', label: 'Dubai (DXB)', description: 'Dubai International Airport' },
  { value: 'SIN', label: 'Singapore (SIN)', description: 'Changi Airport' },
  { value: 'LAX', label: 'Los Angeles (LAX)', description: 'Los Angeles International' },
  { value: 'NRT', label: 'Tokyo (NRT)', description: 'Narita International Airport' },
  { value: 'SYD', label: 'Sydney (SYD)', description: 'Sydney International Airport' },
];

const meta: Meta<typeof SearchForm> = {
  title: 'Travel/SearchForm',
  component: SearchForm,
  tags: ['autodocs'],
  args: {
    locationOptions: airports,
    onSearch: (payload: SearchPayload) => console.log('Search', payload),
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story: ComponentType) => (
      <div style={{ background: 'var(--color-primary-default)', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof SearchForm>;

export const Flights: Story = {
  args: { defaultVertical: 'flights' },
};

export const Hotels: Story = {
  args: { defaultVertical: 'hotels' },
};

export const Cars: Story = {
  args: { defaultVertical: 'cars' },
};

export const Activities: Story = {
  args: { defaultVertical: 'activities' },
};

