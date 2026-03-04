import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '@travel/ui/components/ui/switch';

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    labelPosition: { control: 'inline-radio', options: ['left', 'right'] },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  name: 'No label',
  render: () => <Switch aria-label="Enable feature" />,
};

export const WithLabelRight: Story = {
  name: 'Label right (default)',
  args: { label: 'Price alerts', labelPosition: 'right', defaultChecked: true },
};

export const WithLabelLeft: Story = {
  name: 'Label left',
  args: { label: 'Direct flights only', labelPosition: 'left' },
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Switch label="Disabled off" disabled />
      <Switch label="Disabled on" disabled defaultChecked />
    </div>
  ),
};

export const NotificationSettings: Story = {
  name: 'Notification preferences',
  render: () => (
    <div className="flex flex-col gap-4 max-w-xs">
      <p className="text-sm font-semibold text-[var(--color-foreground-default)]">
        Notifications
      </p>
      {[
        { label: 'Price drop alerts', defaultChecked: true },
        { label: 'Booking confirmations', defaultChecked: true },
        { label: 'Flight status updates', defaultChecked: true },
        { label: 'Promotional offers', defaultChecked: false },
        { label: 'Newsletter', defaultChecked: false },
      ].map(({ label, defaultChecked }) => (
        <div key={label} className="flex items-center justify-between">
          <span className="text-sm text-[var(--color-foreground-default)]">{label}</span>
          <Switch defaultChecked={defaultChecked} aria-label={label} />
        </div>
      ))}
    </div>
  ),
};
