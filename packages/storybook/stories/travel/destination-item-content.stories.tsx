import type { Meta, StoryObj } from '@storybook/react';
import { Plane } from 'lucide-react';
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
    leading: (
      <span
        style={{
          width: 48,
          height: 48,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
          background: 'var(--color-background-subtle)',
          color: 'var(--color-foreground-muted)',
          flexShrink: 0,
        }}
      >
        <Icon icon={Plane} size="md" aria-hidden />
      </span>
    ),
    title: 'John F. Kennedy Intl Airport',
    trailing: <span style={{ fontWeight: 600, color: 'var(--color-foreground-subtle)' }}>JFK</span>,
    subtitle: '13 km from city center',
    titleClassName: 'text-base font-semibold',
  },
  render: args => (
    <div className="flex items-center gap-3 rounded-lg px-2 py-2">
      <DestinationItemContent {...args} />
    </div>
  ),
};

export const CityRow: Story = {
  args: {
    leading: (
      <span
        style={{
          width: 40,
          textAlign: 'center',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--color-foreground-subtle)',
          flexShrink: 0,
        }}
      >
        CITY
      </span>
    ),
    title: 'London',
    subtitle: 'England, United Kingdom',
    meta: 'City',
  },
  render: args => (
    <div className="flex items-center gap-3 rounded-lg px-2 py-2">
      <DestinationItemContent {...args} />
    </div>
  ),
};

export const RecentSearchRow: Story = {
  args: {
    leading: <Icon icon={Plane} size="sm" className="mt-1 shrink-0 text-[var(--color-foreground-muted)]" aria-hidden />,
    title: 'New York (JFK) ⇄ London (LHR)',
    subtitle: 'Oct 20 – Nov 26',
  },
  render: args => (
    <div className="flex items-start gap-2 rounded-md px-2 py-2">
      <DestinationItemContent {...args} />
    </div>
  ),
};

export const DropdownGroup: Story = {
  render: () => (
    <div className="space-y-1">
      <div className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-[var(--color-background-subtle)]">
        <DestinationItemContent
          leading={
            <span
              style={{
                width: 48,
                height: 48,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 12,
                background: 'var(--color-background-subtle)',
                color: 'var(--color-foreground-muted)',
                flexShrink: 0,
              }}
            >
              <Icon icon={Plane} size="md" aria-hidden />
            </span>
          }
          title="LaGuardia Airport"
          trailing={<span style={{ fontWeight: 600, color: 'var(--color-foreground-subtle)' }}>LGA</span>}
          subtitle="8 km from city center"
          titleClassName="text-base font-semibold"
        />
      </div>

      <div className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-[var(--color-background-subtle)]">
        <DestinationItemContent
          leading={
            <span style={{ width: 40, textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--color-foreground-subtle)', flexShrink: 0 }}>
              CITY
            </span>
          }
          title="Berlin"
          subtitle="Germany"
          meta="City"
        />
      </div>

      <div className="border-t border-[var(--color-border-default)] pt-2" />

      <div className="flex items-start gap-2 rounded-md px-2 py-2 hover:bg-[var(--color-background-subtle)]">
        <DestinationItemContent
          leading={<Icon icon={Plane} size="sm" className="mt-1 shrink-0 text-[var(--color-foreground-muted)]" aria-hidden />}
          title="Newark (EWR) → London (LHR)"
          subtitle="Oct 20"
        />
      </div>
    </div>
  ),
};
