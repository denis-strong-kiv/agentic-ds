import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@travel/ui/components/ui/button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary', 'secondary', 'tertiary', 'neutral',
        'inverted-primary', 'inverted-secondary', 'inverted-tertiary',
        'outline', 'ghost', 'destructive', 'link',
      ],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl', 'icon'] },
    disabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: { children: 'Button', onClick: () => {} },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        {(['primary', 'secondary', 'tertiary', 'neutral', 'outline', 'ghost', 'destructive', 'link'] as const).map(v => (
          <Button key={v} variant={v}>{v}</Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 bg-[var(--color-foreground-default)] p-4 rounded-lg">
        {(['inverted-primary', 'inverted-secondary', 'inverted-tertiary'] as const).map(v => (
          <Button key={v} variant={v}>{v}</Button>
        ))}
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center flex-wrap gap-3">
      {(['sm', 'md', 'lg', 'xl'] as const).map(s => (
        <Button key={s} size={s}>Size {s}</Button>
      ))}
    </div>
  ),
};

export const AllDisabled: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        {(['primary', 'secondary', 'tertiary', 'neutral', 'destructive'] as const).map(v => (
          <Button key={v} variant={v} disabled>{v}</Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 bg-[var(--color-foreground-default)] p-4 rounded-lg">
        {(['inverted-primary', 'inverted-secondary', 'inverted-tertiary'] as const).map(v => (
          <Button key={v} variant={v} disabled>{v}</Button>
        ))}
      </div>
    </div>
  ),
};
