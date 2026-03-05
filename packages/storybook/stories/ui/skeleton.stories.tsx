import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '@travel/ui/components/ui/skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    animation: { control: 'select', options: ['pulse', 'shimmer', 'none'] },
  },
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const AllAnimations: Story = {
  render: () => (
    <div className="sb-stack-lg sb-max-sm">
      {(['pulse', 'shimmer', 'none'] as const).map(animation => (
        <div key={animation} className="sb-stack-sm">
          <p className="sb-caption-upper-muted">
            {animation}
          </p>
          <Skeleton animation={animation} className="sb-h-4 sb-w-full" />
          <Skeleton animation={animation} className="sb-h-4 sb-w-3-4" />
          <Skeleton animation={animation} className="sb-h-4 sb-w-1-2" />
        </div>
      ))}
    </div>
  ),
};

export const FlightCardSkeleton: Story = {
  name: 'Flight card skeleton',
  render: () => (
    <div className="sb-card-skeleton sb-max-md">
      <div className="sb-row-between">
        <Skeleton className="sb-h-4 sb-w-24" />
        <Skeleton className="sb-h-4 sb-w-16" />
      </div>
      <div className="sb-row-md">
        <div className="sb-stack-xs">
          <Skeleton className="sb-h-6 sb-w-12" />
          <Skeleton className="sb-h-3 sb-w-8" />
        </div>
        <Skeleton className="sb-h-px sb-flex-1" />
        <div className="sb-stack-xs sb-text-center">
          <Skeleton className="sb-h-3 sb-w-16 sb-mx-auto" />
          <Skeleton className="sb-h-3 sb-w-10 sb-mx-auto" />
        </div>
        <Skeleton className="sb-h-px sb-flex-1" />
        <div className="sb-stack-xs sb-text-right">
          <Skeleton className="sb-h-6 sb-w-12 sb-ms-auto" />
          <Skeleton className="sb-h-3 sb-w-8 sb-ms-auto" />
        </div>
      </div>
      <div className="sb-row-between sb-pt-xs">
        <Skeleton className="sb-h-3 sb-w-20" />
        <Skeleton className="sb-h-8 sb-w-24 sb-rounded-button" />
      </div>
    </div>
  ),
};

export const HotelCardSkeleton: Story = {
  name: 'Hotel card skeleton',
  render: () => (
    <div className="sb-hotel-skeleton sb-max-xs">
      <Skeleton className="sb-h-48 sb-w-full sb-rounded-none" animation="shimmer" />
      <div className="sb-hotel-skeleton-body">
        <Skeleton className="sb-h-5 sb-w-3-4" animation="shimmer" />
        <Skeleton className="sb-h-4 sb-w-1-2" animation="shimmer" />
        <div className="sb-row-between sb-pt-xs">
          <Skeleton className="sb-h-4 sb-w-16" animation="shimmer" />
          <Skeleton className="sb-h-6 sb-w-20" animation="shimmer" />
        </div>
      </div>
    </div>
  ),
};
