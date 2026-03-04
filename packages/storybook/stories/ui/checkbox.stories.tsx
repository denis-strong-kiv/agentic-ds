import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '@travel/ui/components/ui/checkbox';
import { Label } from '@travel/ui/components/ui/label';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: () => <Checkbox aria-label="Select item" />,
};

export const Checked: Story = {
  render: () => <Checkbox defaultChecked aria-label="Select item" />,
};

export const Indeterminate: Story = {
  render: () => <Checkbox checked="indeterminate" aria-label="Select all" />,
};

export const Disabled: Story = {
  render: () => (
    <div className="flex gap-4">
      <Checkbox disabled aria-label="Disabled unchecked" />
      <Checkbox disabled defaultChecked aria-label="Disabled checked" />
      <Checkbox disabled checked="indeterminate" aria-label="Disabled indeterminate" />
    </div>
  ),
};

export const AmenitiesFilter: Story = {
  name: 'Amenities filter group',
  render: () => (
    <fieldset className="flex flex-col gap-3 border-0 p-0">
      <legend className="text-sm font-semibold text-[var(--color-foreground-default)] mb-1">
        Hotel amenities
      </legend>
      {[
        { id: 'wifi', label: 'Free Wi-Fi', defaultChecked: true },
        { id: 'pool', label: 'Swimming pool', defaultChecked: true },
        { id: 'spa', label: 'Spa & wellness' },
        { id: 'gym', label: 'Fitness centre' },
        { id: 'parking', label: 'Free parking' },
        { id: 'restaurant', label: 'On-site restaurant' },
      ].map(({ id, label, defaultChecked }) => (
        <div key={id} className="flex items-center gap-2">
          <Checkbox id={id} defaultChecked={defaultChecked} />
          <Label htmlFor={id} className="cursor-pointer">{label}</Label>
        </div>
      ))}
    </fieldset>
  ),
};

export const SelectAll: Story = {
  name: 'Select-all with indeterminate',
  render: () => (
    <div className="flex flex-col gap-2 max-w-xs">
      <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-default)]">
        <Checkbox id="select-all" checked="indeterminate" />
        <Label htmlFor="select-all">Select all passengers</Label>
      </div>
      {['Emma Wilson', 'James Davis', 'Sophie Allen'].map((name, i) => (
        <div key={i} className="flex items-center gap-2 ps-4">
          <Checkbox id={`p-${i}`} defaultChecked={i === 0} />
          <Label htmlFor={`p-${i}`}>{name}</Label>
        </div>
      ))}
    </div>
  ),
};
