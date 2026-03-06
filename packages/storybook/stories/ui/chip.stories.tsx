import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from '@travel/ui/components/ui/chip';

const meta: Meta<typeof Chip> = {
  title: 'UI/Chip',
  component: Chip,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: { label: 'Economy' },
};

export const Active: Story = {
  args: { label: 'Nonstop', isActive: true },
};

export const WithDismiss: Story = {
  args: { label: 'Up to $800', isActive: true, onDismiss: () => {} },
};

export const Small: Story = {
  args: { label: 'Tag', size: 'sm' },
};

export const SmallActive: Story = {
  name: 'Small — active',
  args: { label: 'Selected', size: 'sm', isActive: true, onDismiss: () => {} },
};

export const Disabled: Story = {
  args: { label: 'Unavailable', disabled: true },
};

export const AllVariants: Story = {
  render: () => {
    const [active, setActive] = useState(false);
    return (
      <>
        <Chip label="Default" onClick={() => {}} />
        <Chip label="Active" isActive />
        <Chip label="Toggle me" isActive={active} onClick={() => setActive(v => !v)} />
        <Chip label="With dismiss" isActive onDismiss={() => {}} />
        <Chip label="Small" size="sm" />
        <Chip label="Small active" size="sm" isActive onDismiss={() => {}} />
        <Chip label="Disabled" disabled />
      </>
    );
  },
};
