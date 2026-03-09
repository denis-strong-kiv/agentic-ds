import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { QuickFilterChip } from '@travel/ui/components/travel/filter-chip';

const placeholder = <div style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--color-foreground-muted)' }}>Filter interface</div>;

const meta: Meta<typeof QuickFilterChip> = {
  title: 'Travel/FilterChip/QuickFilterChip',
  component: QuickFilterChip,
  tags: ['autodocs'],
  args: {
    label: 'Nonstop only',
    isActive: false,
  },
  argTypes: {
    label: { control: 'text' },
    isActive: { control: 'boolean' },
    popoverContent: { table: { disable: true } },
    onClick: { table: { disable: true } },
    onClear: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    style: { table: { disable: true } },
    'data-flip-id': { table: { disable: true } },
  },
  render: (args) => (
    <QuickFilterChip
      {...args}
      onClick={() => {}}
      {...(args.isActive ? { popoverContent: placeholder, onClear: () => {} } : {})}
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
type Story = StoryObj<typeof QuickFilterChip>;

export const Playground: Story = {};

export const Interactive: Story = {
  name: 'Interactive toggle',
  render: () => {
    const [active, setActive] = useState(false);
    return (
      <QuickFilterChip
        label="Nonstop only"
        isActive={active}
        onClick={() => setActive(true)}
        {...(active ? { popoverContent: placeholder, onClear: () => setActive(false) } : {})}
      />
    );
  },
};
