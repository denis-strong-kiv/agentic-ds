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
        'destructive', 'link',
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
    <div className="sb-stack-lg">
      <div className="sb-row-wrap-sm">
        {(['primary', 'secondary', 'tertiary', 'neutral', 'destructive', 'link'] as const).map(v => (
          <Button key={v} variant={v}>{v}</Button>
        ))}
      </div>
      <div className="sb-row-wrap-sm sb-inverse-panel">
        {(['inverted-primary', 'inverted-secondary', 'inverted-tertiary'] as const).map(v => (
          <Button key={v} variant={v}>{v}</Button>
        ))}
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="sb-row-wrap-sm">
      {(['sm', 'md', 'lg', 'xl'] as const).map(s => (
        <Button key={s} size={s}>Size {s}</Button>
      ))}
    </div>
  ),
};

export const AllDisabled: Story = {
  render: () => (
    <div className="sb-stack-lg">
      <div className="sb-row-wrap-sm">
        {(['primary', 'secondary', 'tertiary', 'neutral', 'destructive'] as const).map(v => (
          <Button key={v} variant={v} disabled>{v}</Button>
        ))}
      </div>
      <div className="sb-row-wrap-sm sb-inverse-panel">
        {(['inverted-primary', 'inverted-secondary', 'inverted-tertiary'] as const).map(v => (
          <Button key={v} variant={v} disabled>{v}</Button>
        ))}
      </div>
    </div>
  ),
};
