import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarImage, AvatarFallback, AvatarStatus } from '@travel/ui/components/ui/avatar';

const meta: Meta = {
  title: 'UI/Avatar',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const WithFallbackInitials: Story = {
  name: 'Fallback initials (no image)',
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="/broken.jpg" alt="Emma Wilson" />
        <AvatarFallback>EW</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>SA</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const AllStatuses: Story = {
  name: 'Status indicators',
  render: () => (
    <div className="flex items-center gap-6">
      {(['online', 'away', 'busy', 'offline'] as const).map(status => (
        <div key={status} className="flex flex-col items-center gap-2">
          <div className="relative inline-flex">
            <Avatar>
              <AvatarFallback>{status[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <AvatarStatus status={status} />
          </div>
          <span className="text-xs text-[var(--color-foreground-muted)] capitalize">{status}</span>
        </div>
      ))}
    </div>
  ),
};

export const AvatarGroup: Story = {
  name: 'Stacked group',
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[var(--color-foreground-muted)]">Passengers on booking</p>
      <div className="flex -space-x-2">
        {['EW', 'JD', 'SA', 'MK', '+2'].map((initials, i) => (
          <Avatar key={i} className="border-2 border-[var(--color-surface-card)]">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(['h-6 w-6', 'h-8 w-8', 'h-10 w-10', 'h-12 w-12', 'h-16 w-16'] as const).map((size, i) => (
        <Avatar key={i} className={size}>
          <AvatarFallback className="text-xs">AB</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};
