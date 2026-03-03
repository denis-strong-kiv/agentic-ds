import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@travel/ui/components/ui/button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'icon'] },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: { children: 'Button', onClick: () => {} },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Outline: Story = { args: { variant: 'outline' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Destructive: Story = { args: { variant: 'destructive' } };
export const Link: Story = { args: { variant: 'link' } };
export const Small: Story = { args: { variant: 'primary', size: 'sm' } };
export const Large: Story = { args: { variant: 'primary', size: 'lg' } };
export const Disabled: Story = { args: { variant: 'primary', disabled: true } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {(['primary', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const).map(v => (
        <Button key={v} variant={v}>{v}</Button>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center flex-wrap gap-3">
      {(['sm', 'md', 'lg'] as const).map(s => (
        <Button key={s} size={s}>Size {s}</Button>
      ))}
    </div>
  ),
};
