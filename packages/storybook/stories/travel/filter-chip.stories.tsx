import type { Meta, StoryObj } from '@storybook/react';
import { AllFiltersChip, QuickFilterChip, FilterChip } from '@travel/ui/components/travel/filter-chip';

const placeholder = <div style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--color-foreground-muted)' }}>Filter interface</div>;

const meta: Meta<typeof FilterChip> = {
  title: 'Travel/FilterChip/FilterChip',
  component: FilterChip,
  tags: ['autodocs'],
  args: {
    label: 'Price',
    isActive: false,
    activeLabel: 'Up to $800',
  },
  argTypes: {
    label: { control: 'text' },
    isActive: { control: 'boolean' },
    activeLabel: { control: 'text' },
    popoverContent: { table: { disable: true } },
    onClear: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    style: { table: { disable: true } },
    'data-flip-id': { table: { disable: true } },
  },
  render: (args) => (
    <FilterChip
      {...args}
      popoverContent={placeholder}
      {...(args.isActive ? { onClear: () => {} } : {})}
    />
  ),
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', gap: '0.5rem', padding: '1.5rem', alignItems: 'center' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof FilterChip>;

export const Playground: Story = {};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <>
      <FilterChip label="Price" popoverContent={placeholder} />
      <FilterChip label="Price" isActive activeLabel="Up to $800" popoverContent={placeholder} onClear={() => {}} />
      <FilterChip label="Bags" />
    </>
  ),
};

// ─── Composite — all three chip types in a bar ────────────────────────────────

export const ChipStrip: Story = {
  name: 'All three types — strip',
  render: () => (
    <>
      <AllFiltersChip isActive count={2} onClick={() => {}} />
      <QuickFilterChip label="Nonstop only" isActive onClear={() => {}} onClick={() => {}} />
      <FilterChip label="Price" isActive activeLabel="Up to $800" onClear={() => {}} popoverContent={placeholder} />
      <FilterChip label="Airlines" popoverContent={placeholder} />
      <FilterChip label="Bags" />
      <FilterChip label="Departure" />
    </>
  ),
};
