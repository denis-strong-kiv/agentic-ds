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
    <div className="flex flex-col gap-6 max-w-sm">
      {(['pulse', 'shimmer', 'none'] as const).map(animation => (
        <div key={animation} className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-[var(--color-foreground-muted)] uppercase tracking-wide">
            {animation}
          </p>
          <Skeleton animation={animation} className="h-4 w-full" />
          <Skeleton animation={animation} className="h-4 w-3/4" />
          <Skeleton animation={animation} className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  ),
};

export const FlightCardSkeleton: Story = {
  name: 'Flight card skeleton',
  render: () => (
    <div className="max-w-md rounded-[var(--shape-preset-card)] border border-[var(--color-border-default)] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex items-center gap-4">
        <div className="space-y-1">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-px flex-1" />
        <div className="space-y-1 text-center">
          <Skeleton className="h-3 w-16 mx-auto" />
          <Skeleton className="h-3 w-10 mx-auto" />
        </div>
        <Skeleton className="h-px flex-1" />
        <div className="space-y-1 text-right">
          <Skeleton className="h-6 w-12 ms-auto" />
          <Skeleton className="h-3 w-8 ms-auto" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-24 rounded-[var(--shape-preset-button)]" />
      </div>
    </div>
  ),
};

export const HotelCardSkeleton: Story = {
  name: 'Hotel card skeleton',
  render: () => (
    <div className="max-w-xs rounded-[var(--shape-preset-card)] border border-[var(--color-border-default)] overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" animation="shimmer" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" animation="shimmer" />
        <Skeleton className="h-4 w-1/2" animation="shimmer" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-4 w-16" animation="shimmer" />
          <Skeleton className="h-6 w-20" animation="shimmer" />
        </div>
      </div>
    </div>
  ),
};
