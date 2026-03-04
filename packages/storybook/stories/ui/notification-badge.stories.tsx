import type { Meta, StoryObj } from '@storybook/react';
import { NotificationBadge } from '@travel/ui/components/ui/notification-badge';

const meta: Meta<typeof NotificationBadge> = {
  title: 'UI/NotificationBadge',
  component: NotificationBadge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['brand', 'accent', 'success', 'warning', 'danger', 'neutral', 'inverted'],
    },
    size: { control: 'select', options: ['lg', 'md'] },
    count: { control: 'number' },
    max: { control: 'number' },
  },
  args: { count: 1 },
};
export default meta;
type Story = StoryObj<typeof NotificationBadge>;

// ── Overview: all variants ─────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        {(['brand', 'accent', 'success', 'warning', 'danger', 'neutral'] as const).map((v) => (
          <div key={v} className="flex flex-col items-center gap-1">
            <NotificationBadge variant={v} count={1} />
            <span className="text-xs text-[var(--color-foreground-muted)]">{v}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 bg-[var(--color-foreground-default)] p-4 rounded-lg">
        <div className="flex flex-col items-center gap-1">
          <NotificationBadge variant="inverted" count={1} />
          <span className="text-xs text-[oklch(100%_0_0)]">inverted</span>
        </div>
      </div>
    </div>
  ),
};

// ── Overview: all sizes ────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(['lg', 'md'] as const).map((s) => (
        <div key={s} className="flex flex-col items-center gap-1">
          <NotificationBadge size={s} count={5} />
          <span className="text-xs text-[var(--color-foreground-muted)]">{s}</span>
        </div>
      ))}
    </div>
  ),
};

// ── Overview: count overflow ───────────────────────────────────────────────

export const CountOverflow: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {[1, 9, 10, 42, 99, 100, 999].map((n) => (
        <div key={n} className="flex flex-col items-center gap-1">
          <NotificationBadge count={n} />
          <span className="text-xs text-[var(--color-foreground-muted)]">{n}</span>
        </div>
      ))}
    </div>
  ),
};

// ── Composition: badge overlaid on a button ────────────────────────────────

export const OnButton: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="relative inline-flex">
        <button className="h-10 w-10 rounded-lg bg-[var(--color-background-subtle)] flex items-center justify-center text-lg">
          🔔
        </button>
        <NotificationBadge
          count={3}
          size="md"
          className="absolute -top-1 -end-1"
        />
      </div>
      <div className="relative inline-flex">
        <button className="h-10 w-10 rounded-full bg-[var(--color-primary-default)] flex items-center justify-center text-[var(--color-primary-foreground)] font-semibold">
          JD
        </button>
        <NotificationBadge
          count={12}
          variant="danger"
          size="md"
          className="absolute -top-1 -end-1"
        />
      </div>
      <div className="relative inline-flex">
        <button className="h-10 w-10 rounded-lg bg-[var(--color-background-subtle)] flex items-center justify-center text-lg">
          ✉️
        </button>
        <NotificationBadge
          count={150}
          variant="accent"
          size="lg"
          className="absolute -top-1.5 -end-1.5"
        />
      </div>
    </div>
  ),
};
