import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, RadioGroupItem } from '@travel/ui/components/ui/radio-group';
import { Label } from '@travel/ui/components/ui/label';

const meta: Meta<typeof RadioGroup> = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const CabinClass: Story = {
  name: 'Cabin class selection',
  render: () => (
    <RadioGroup defaultValue="economy" className="sb-gap-3">
      {[
        { value: 'economy', label: 'Economy', sublabel: 'From $299' },
        { value: 'premium-economy', label: 'Premium Economy', sublabel: 'From $599' },
        { value: 'business', label: 'Business', sublabel: 'From $1,299' },
        { value: 'first', label: 'First Class', sublabel: 'From $3,499' },
      ].map(({ value, label, sublabel }) => (
        <div key={value} className="sb-row-md">
          <RadioGroupItem value={value} id={`cabin-${value}`} />
          <Label htmlFor={`cabin-${value}`} helperText={sublabel}>{label}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
};

export const TripType: Story = {
  name: 'Trip type (horizontal)',
  render: () => (
    <RadioGroup defaultValue="round-trip" className="sb-row-lg">
      {['Round-trip', 'One-way', 'Multi-city'].map(type => (
        <div key={type} className="sb-row-sm">
          <RadioGroupItem value={type.toLowerCase().replace(' ', '-')} id={`trip-${type}`} />
          <Label htmlFor={`trip-${type}`}>{type}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="economy" className="sb-gap-3">
      <div className="sb-row-md">
        <RadioGroupItem value="economy" id="d-economy" />
        <Label htmlFor="d-economy">Economy</Label>
      </div>
      <div className="sb-row-md">
        <RadioGroupItem value="business" id="d-business" disabled />
        <Label htmlFor="d-business" className="sb-opacity-50">Business (sold out)</Label>
      </div>
      <div className="sb-row-md">
        <RadioGroupItem value="first" id="d-first" disabled />
        <Label htmlFor="d-first" className="sb-opacity-50">First (sold out)</Label>
      </div>
    </RadioGroup>
  ),
};
