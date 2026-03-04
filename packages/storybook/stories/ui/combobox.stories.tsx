import type { Meta, StoryObj } from '@storybook/react';
import { Combobox } from '@travel/ui/components/ui/combobox';
import { Label } from '@travel/ui/components/ui/label';

const meta: Meta<typeof Combobox> = {
  title: 'UI/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [Story => <div className="w-72"><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Combobox>;

const AIRLINES = [
  { value: 'AA', label: 'American Airlines' },
  { value: 'AC', label: 'Air Canada' },
  { value: 'AF', label: 'Air France' },
  { value: 'AI', label: 'Air India' },
  { value: 'AZ', label: 'ITA Airways' },
  { value: 'BA', label: 'British Airways' },
  { value: 'BR', label: 'EVA Air' },
  { value: 'CA', label: 'Air China' },
  { value: 'CI', label: 'China Airlines' },
  { value: 'CX', label: 'Cathay Pacific' },
  { value: 'DL', label: 'Delta Air Lines' },
  { value: 'EK', label: 'Emirates' },
  { value: 'ET', label: 'Ethiopian Airlines' },
  { value: 'EY', label: 'Etihad Airways' },
  { value: 'FZ', label: 'flydubai' },
  { value: 'GA', label: 'Garuda Indonesia' },
  { value: 'IB', label: 'Iberia' },
  { value: 'JL', label: 'Japan Airlines' },
  { value: 'KE', label: 'Korean Air' },
  { value: 'KL', label: 'KLM Royal Dutch Airlines' },
  { value: 'LH', label: 'Lufthansa' },
  { value: 'LX', label: 'Swiss International Air Lines' },
  { value: 'MH', label: 'Malaysia Airlines' },
  { value: 'MU', label: 'China Eastern Airlines' },
  { value: 'NH', label: 'All Nippon Airways' },
  { value: 'NZ', label: 'Air New Zealand' },
  { value: 'OS', label: 'Austrian Airlines' },
  { value: 'OZ', label: 'Asiana Airlines' },
  { value: 'QF', label: 'Qantas' },
  { value: 'QR', label: 'Qatar Airways' },
  { value: 'RJ', label: 'Royal Jordanian', disabled: true },
  { value: 'SA', label: 'South African Airways', disabled: true },
  { value: 'SK', label: 'Scandinavian Airlines' },
  { value: 'SQ', label: 'Singapore Airlines' },
  { value: 'TG', label: 'Thai Airways' },
  { value: 'TK', label: 'Turkish Airlines' },
  { value: 'UA', label: 'United Airlines' },
  { value: 'UL', label: 'SriLankan Airlines' },
  { value: 'VS', label: 'Virgin Atlantic' },
  { value: 'WY', label: 'Oman Air' },
];

export const Default: Story = {
  name: 'Airline picker',
  args: {
    options: AIRLINES,
    placeholder: 'Search airline…',
    'aria-label': 'Airline',
  },
};

export const WithValue: Story = {
  name: 'Pre-selected airline',
  args: {
    options: AIRLINES,
    value: 'SQ',
    'aria-label': 'Airline',
  },
};

export const WithDisabledOptions: Story = {
  name: 'Some routes unavailable',
  args: {
    options: AIRLINES,
    placeholder: 'Search airline…',
    'aria-label': 'Airline',
  },
};

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    options: AIRLINES,
    value: 'EK',
    disabled: true,
    'aria-label': 'Airline',
  },
};

export const InForm: Story = {
  name: 'In a form',
  render: () => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="airline" required>Preferred airline</Label>
      <Combobox
        options={AIRLINES}
        placeholder="Search airline…"
        aria-label="Preferred airline"
      />
    </div>
  ),
};
