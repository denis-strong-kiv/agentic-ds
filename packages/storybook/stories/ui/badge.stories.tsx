import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@travel/ui/components/ui/badge';
import React from 'react';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'destructive', 'deal', 'new', 'popular'],
    },
    children: { control: 'text' },
  },
  args: { children: 'Badge' },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { variant: 'default' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Outline: Story = { args: { variant: 'outline' } };
export const Destructive: Story = { args: { variant: 'destructive' } };
export const Deal: Story = { args: { variant: 'deal', children: 'Best Deal' } };
export const New: Story = { args: { variant: 'new', children: 'New' } };
export const Popular: Story = { args: { variant: 'popular', children: 'Popular' } };

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="deal">Best Deal</Badge>
      <Badge variant="new">New</Badge>
      <Badge variant="popular">Popular</Badge>
    </div>
  ),
};

export const TravelBadges: Story = {
  name: 'Travel-specific Badges',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <Badge variant="deal">Best Deal</Badge>
        <Badge variant="deal">Save 30%</Badge>
        <Badge variant="new">New Route</Badge>
        <Badge variant="popular">Top Pick</Badge>
      </div>
      <p style={{ fontSize: 13, color: 'var(--color-foreground-muted)', margin: 0 }}>
        Travel-specific variants exist alongside base variants. Shape token controls border-radius.
      </p>
    </div>
  ),
};
