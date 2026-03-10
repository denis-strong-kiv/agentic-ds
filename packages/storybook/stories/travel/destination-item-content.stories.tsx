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
    <div className="sb-destination-row">
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
    <div className="sb-destination-row">
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
    <div className="sb-destination-row">
      <DestinationItemContent {...args} />
    </div>
  ),
};

export const RecentSearchRow: Story = {
  args: {
    destinationType: 'airport',
    title: (
      <span className="sb-row-sm">
        <span>New York (JFK)</span>
        <Icon
          icon={ArrowLeftRight}
          size="sm"
          className="sb-icon-sm"
          aria-hidden
          style={{ color: 'var(--color-foreground-subtle)' }}
        />
        <span>London (LHR)</span>
      </span>
    ),
    subtitle: 'Oct 20 – Nov 26',
  },
  render: args => (
    <div className="sb-destination-row sb-destination-row--compact">
      <DestinationItemContent {...args} />
    </div>
  ),
};

export const DropdownGroup: Story = {
  render: () => (
    <div className="sb-stack-sm">
      <div className="sb-destination-row sb-destination-row--hover">
        <DestinationItemContent
          destinationType="city"
          title="London"
          subtitle="United Kingdom"
        />
      </div>

      <div className="sb-destination-row sb-destination-row--hover sb-destination-row--indented">
        <DestinationItemContent
          destinationType="airport"
          title="London Heathrow (LHR)"
          subtitle="17 km from city center"
        />
      </div>

      <div className="sb-destination-row sb-destination-row--hover sb-destination-row--indented">
        <DestinationItemContent
          destinationType="airport"
          title="London Gatwick (LGW)"
          subtitle="45 km from city center"
        />
      </div>

      <div className="sb-destination-row sb-destination-row--hover sb-destination-row--indented">
        <DestinationItemContent
          destinationType="airport"
          title="London Stansted (STN)"
          subtitle="63 km from city center"
        />
      </div>

      <div className="sb-destination-row sb-destination-row--hover sb-destination-row--indented">
        <DestinationItemContent
          destinationType="airport"
          title="London Luton (LTN)"
          subtitle="55 km from city center"
        />
      </div>

      <div className="sb-destination-row sb-destination-row--hover sb-destination-row--indented">
        <DestinationItemContent
          destinationType="airport"
          title="London City (LCY)"
          subtitle="11 km from city center"
        />
      </div>
    </div>
  ),
};
