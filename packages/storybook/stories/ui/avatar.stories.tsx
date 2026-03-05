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
    <div className="sb-row-md">
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
    <div className="sb-row-lg">
      {(['online', 'away', 'busy', 'offline'] as const).map(status => (
        <div key={status} className="sb-stack-center-sm">
          <div className="sb-relative-inline">
            <Avatar>
              <AvatarFallback>{status[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <AvatarStatus status={status} />
          </div>
          <span className="sb-caption-muted">{status}</span>
        </div>
      ))}
    </div>
  ),
};

export const AvatarGroup: Story = {
  name: 'Stacked group',
  render: () => (
    <div className="sb-stack-md">
      <p className="sb-text-sm-muted">Passengers on booking</p>
      <div className="sb-avatar-group">
        {['EW', 'JD', 'SA', 'MK', '+2'].map((initials, i) => (
          <Avatar key={i} className="sb-avatar-ring">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="sb-row-end-md">
      {(['sb-avatar-size-xs', 'sb-avatar-size-sm', 'sb-avatar-size-md', 'sb-avatar-size-lg', 'sb-avatar-size-xl'] as const).map((size, i) => (
        <Avatar key={i} className={size}>
          <AvatarFallback className="sb-text-xs">AB</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};
