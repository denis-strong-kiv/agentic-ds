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
    <div className="sb-stack-lg">
      <div className="sb-row-wrap-sm">
        {(['brand', 'accent', 'success', 'warning', 'danger', 'neutral'] as const).map((v) => (
          <div key={v} className="sb-stack-center-xs">
            <NotificationBadge variant={v} count={1} />
            <span className="sb-caption-muted">{v}</span>
          </div>
        ))}
      </div>
      <div className="sb-row-wrap-sm sb-inverse-panel">
        <div className="sb-stack-center-xs">
          <NotificationBadge variant="inverted" count={1} />
          <span className="sb-caption-inverse">inverted</span>
        </div>
      </div>
    </div>
  ),
};

// ── Overview: all sizes ────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div className="sb-row-end-md">
      {(['lg', 'md'] as const).map((s) => (
        <div key={s} className="sb-stack-center-xs">
          <NotificationBadge size={s} count={5} />
          <span className="sb-caption-muted">{s}</span>
        </div>
      ))}
    </div>
  ),
};

// ── Overview: count overflow ───────────────────────────────────────────────

export const CountOverflow: Story = {
  render: () => (
    <div className="sb-row-sm">
      {[1, 9, 10, 42, 99, 100, 999].map((n) => (
        <div key={n} className="sb-stack-center-xs">
          <NotificationBadge count={n} />
          <span className="sb-caption-muted">{n}</span>
        </div>
      ))}
    </div>
  ),
};

// ── Composition: badge overlaid on a button ────────────────────────────────

export const OnButton: Story = {
  render: () => (
    <div className="sb-row-lg">
      <div className="sb-relative-inline">
        <button className="sb-icon-btn sb-icon-btn--tile">
          🔔
        </button>
        <NotificationBadge
          count={3}
          size="md"
          className="sb-badge-overlay"
        />
      </div>
      <div className="sb-relative-inline">
        <button className="sb-icon-btn sb-icon-btn--round-primary">
          JD
        </button>
        <NotificationBadge
          count={12}
          variant="danger"
          size="md"
          className="sb-badge-overlay"
        />
      </div>
      <div className="sb-relative-inline">
        <button className="sb-icon-btn sb-icon-btn--tile">
          ✉️
        </button>
        <NotificationBadge
          count={150}
          variant="accent"
          size="lg"
          className="sb-badge-overlay sb-badge-overlay--lg"
        />
      </div>
    </div>
  ),
};
