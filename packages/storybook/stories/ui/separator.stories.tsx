import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from '@travel/ui/components/ui/separator';

const meta: Meta<typeof Separator> = {
  title: 'UI/Separator',
  component: Separator,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  name: 'Horizontal (between sections)',
  render: () => (
    <div className="max-w-sm space-y-4">
      <div>
        <p className="text-sm font-medium text-[var(--color-foreground-default)]">Outbound flight</p>
        <p className="text-sm text-[var(--color-foreground-muted)]">LHR → BCN · Jun 15 · 09:45</p>
      </div>
      <Separator />
      <div>
        <p className="text-sm font-medium text-[var(--color-foreground-default)]">Return flight</p>
        <p className="text-sm text-[var(--color-foreground-muted)]">BCN → LHR · Jun 22 · 18:20</p>
      </div>
      <Separator />
      <div>
        <p className="text-sm font-medium text-[var(--color-foreground-default)]">Total</p>
        <p className="text-lg font-bold text-[var(--color-primary-default)]">$842</p>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  name: 'Vertical (inline items)',
  render: () => (
    <div className="flex items-center gap-2 text-sm text-[var(--color-foreground-muted)]">
      <span>2 stops</span>
      <Separator orientation="vertical" className="h-4" />
      <span>14h 30m</span>
      <Separator orientation="vertical" className="h-4" />
      <span>Economy</span>
    </div>
  ),
};

export const Semantic: Story = {
  name: 'Semantic (non-decorative)',
  render: () => (
    <div className="max-w-sm">
      <p className="text-sm text-[var(--color-foreground-muted)] mb-2">
        Decorative by default; set <code>decorative=false</code> for semantic separation.
      </p>
      <Separator decorative={false} />
    </div>
  ),
};
