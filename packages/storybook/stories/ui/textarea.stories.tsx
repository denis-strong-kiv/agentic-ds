import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '@travel/ui/components/ui/textarea';
import { Label } from '@travel/ui/components/ui/label';

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    error: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: { placeholder: 'Any special requests or requirements?', rows: 4, 'aria-label': 'Special requests' },
};

export const WithError: Story = {
  name: 'Validation error',
  args: {
    id: 'special-req',
    'aria-label': 'Special request',
    placeholder: 'Describe your request',
    error: 'Special request must be under 500 characters.',
    defaultValue: 'I need a wheelchair accessible room with a walk-in shower and...',
    rows: 3,
  },
};

export const WithCharCount: Story = {
  name: 'Character counter',
  args: {
    id: 'flight-feedback',
    'aria-label': 'Flight feedback',
    placeholder: 'Tell us about your flight experience…',
    showCount: true,
    maxLength: 280,
    rows: 4,
  },
};

export const AutoResize: Story = {
  name: 'Auto-resize',
  args: {
    'aria-label': 'Notes',
    placeholder: 'Start typing and this textarea will grow…',
    autoResize: true,
    rows: 2,
  },
};

export const Disabled: Story = {
  args: {
    'aria-label': 'Special requests',
    defaultValue: 'Window seat preferred, no dietary restrictions.',
    disabled: true,
    rows: 3,
  },
};

export const FullForm: Story = {
  name: 'In a form context',
  render: () => (
    <div className="sb-stack-sm sb-max-sm">
      <Label htmlFor="msg" required helperText="Up to 280 characters">
        Message to airline
      </Label>
      <Textarea
        id="msg"
        placeholder="e.g. travelling with an infant, need aisle seat, special meal request…"
        showCount
        maxLength={280}
        rows={4}
      />
    </div>
  ),
};
