import type { Meta, StoryObj } from '@storybook/react';
import { Label } from '@travel/ui/components/ui/label';
import { Input } from '@travel/ui/components/ui/input';
import { Checkbox } from '@travel/ui/components/ui/checkbox';

const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  render: () => <Label>Departure city</Label>,
};

export const Required: Story = {
  render: () => <Label required>Passport number</Label>,
};

export const WithHelperText: Story = {
  render: () => (
    <Label helperText="Must match your travel document exactly">
      Full name
    </Label>
  ),
};

export const RequiredWithHelper: Story = {
  render: () => (
    <Label required helperText="Enter your IATA airport code or city name">
      Origin airport
    </Label>
  ),
};

export const PairedWithInput: Story = {
  name: 'Paired with input',
  render: () => (
    <div className="sb-stack-sm sb-max-xs">
      <Label htmlFor="passport" required helperText="As shown on your travel document">
        Passport number
      </Label>
      <Input id="passport" placeholder="e.g. GB123456A" />
    </div>
  ),
};

export const PairedWithCheckbox: Story = {
  name: 'Paired with checkbox',
  render: () => (
    <div className="sb-row-start-sm">
      <Checkbox id="terms" className="sb-mt-half" />
      <Label htmlFor="terms" helperText="You can unsubscribe at any time.">
        Send me price alerts for this route
      </Label>
    </div>
  ),
};
