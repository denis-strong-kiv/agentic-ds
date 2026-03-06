import type { Meta, StoryObj } from '@storybook/react';
import { ArrowLeftRight } from 'lucide-react';
import { DestinationItemContent } from '@travel/ui/components/travel/destination-item-content';
import { Icon } from '@travel/ui/components/ui/icon';

const meta: Meta<typeof DestinationItemContent> = {
  title: 'Travel/DestinationItemContent',
  component: DestinationItemContent,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div
        style={{
          width: 360,
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--shape-preset-card)',
          background: 'var(--color-surface-popover)',
          padding: '0.5rem',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DestinationItemContent>;

export const AirportRow: Story = {
  args: {
    destinationType: 'airport',
    title: 'John F. Kennedy Intl Airport (JFK)',
    subtitle: '13 km from city center',
  },
  render: args => (
    <div className="flex items-center gap-3 rounded-lg px-2 py-2">
      <DestinationItemContent {...args} />
    </div>
  ),
};

export const CityRow: Story = {
  args: {
    destinationType: 'city',
    title: 'London',
    subtitle: 'England, United Kingdom',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=160&q=60',
    imageAlt: 'London skyline',
  },
  render: args => (
    <div className="flex items-center gap-3 rounded-lg px-2 py-2">
      <DestinationItemContent {...args} />
    </div>
  ),
};

export const CityFallbackIcon: Story = {
  args: {
    destinationType: 'city',
    title: 'Madrid',
    subtitle: 'Spain',
  },
  render: args => (
    <div className="flex items-center gap-3 rounded-lg px-2 py-2">
      <DestinationItemContent {...args} />
    </div>
  ),
};

export const RecentSearchRow: Story = {
  args: {
    destinationType: 'airport',
    title: (
      <span className="inline-flex items-center gap-1.5">
        <span>New York (JFK)</span>
        <Icon icon={ArrowLeftRight} size="sm" className="shrink-0 text-[var(--color-foreground-subtle)]" aria-hidden />
        <span>London (LHR)</span>
      </span>
    ),
    subtitle: 'Oct 20 – Nov 26',
  },
  render: args => (
    <div className="flex items-center gap-2 rounded-md px-2 py-2">
      <DestinationItemContent {...args} />
    </div>
  ),
};

export const DropdownGroup: Story = {
  render: () => (
    <div className="space-y-1">
      <div className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-[var(--color-background-subtle)]">
        <DestinationItemContent
          destinationType="airport"
          title="LaGuardia Airport (LGA)"
          subtitle="8 km from city center"
        />
      </div>

      <div className="ms-10 flex w-[calc(100%-2.5rem)] items-center gap-3 rounded-lg px-2 py-2 hover:bg-[var(--color-background-subtle)]">
        <DestinationItemContent
          destinationType="airport-indented"
          title="Newark Liberty Intl Airport (EWR)"
          subtitle="17 km from city center"
        />
      </div>

      <div className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-[var(--color-background-subtle)]">
        <DestinationItemContent
          title="Berlin"
          subtitle="Germany"
          destinationType="city"
        />
      </div>

      <div className="border-t border-[var(--color-border-default)] pt-2" />

      <div className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-[var(--color-background-subtle)]">
        <DestinationItemContent
          title={(
            <span className="inline-flex items-center gap-1.5">
              <span>Newark (EWR)</span>
              <Icon icon={ArrowLeftRight} size="sm" className="shrink-0 text-[var(--color-foreground-subtle)]" aria-hidden />
              <span>London (LHR)</span>
            </span>
          )}
          subtitle="Oct 20"
          destinationType="airport"
        />
      </div>
    </div>
  ),
};
