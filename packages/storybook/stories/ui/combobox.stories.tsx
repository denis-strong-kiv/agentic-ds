import type { Meta, StoryObj } from '@storybook/react';
import { Combobox } from '@travel/ui/components/ui/combobox';
import { Label } from '@travel/ui/components/ui/label';

const meta: Meta<typeof Combobox> = {
  title: 'UI/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [Story => <div className="w-64"><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Combobox>;

const CABIN_OPTIONS = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium', label: 'Premium Economy' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First Class' },
];

const CURRENCY_OPTIONS = [
  { value: 'usd', label: 'USD — US Dollar' },
  { value: 'eur', label: 'EUR — Euro' },
  { value: 'gbp', label: 'GBP — British Pound' },
  { value: 'jpy', label: 'JPY — Japanese Yen' },
  { value: 'aud', label: 'AUD — Australian Dollar' },
  { value: 'cad', label: 'CAD — Canadian Dollar' },
  { value: 'chf', label: 'CHF — Swiss Franc' },
];

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'es', label: 'Spanish' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ja', label: 'Japanese', disabled: true },
  { value: 'zh', label: 'Chinese (Simplified)', disabled: true },
];

export const Default: Story = {
  name: 'Cabin class selector',
  args: {
    options: CABIN_OPTIONS,
    placeholder: 'Select cabin class',
    'aria-label': 'Cabin class',
  },
};

export const WithValue: Story = {
  name: 'Pre-selected value',
  args: {
    options: CABIN_OPTIONS,
    value: 'business',
    'aria-label': 'Cabin class',
  },
};

export const ManyOptions: Story = {
  name: 'Many options (type to filter)',
  args: {
    options: CURRENCY_OPTIONS,
    placeholder: 'Select currency',
    'aria-label': 'Currency',
  },
};

export const WithDisabledOptions: Story = {
  name: 'With disabled options',
  args: {
    options: LANGUAGE_OPTIONS,
    placeholder: 'Select language',
    'aria-label': 'Language',
  },
};

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    options: CABIN_OPTIONS,
    value: 'economy',
    disabled: true,
    'aria-label': 'Cabin class',
  },
};

export const InForm: Story = {
  name: 'In a form',
  render: () => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="cabin" required>Cabin class</Label>
      <Combobox
        options={CABIN_OPTIONS}
        placeholder="Select cabin class"
        aria-label="Cabin class"
      />
    </div>
  ),
};
