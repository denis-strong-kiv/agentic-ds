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
    <div className="sb-max-sm sb-stack-md">
      <div>
        <p className="sb-title-sm">Outbound flight</p>
        <p className="sb-text-sm-muted">LHR → BCN · Jun 15 · 09:45</p>
      </div>
      <Separator />
      <div>
        <p className="sb-title-sm">Return flight</p>
        <p className="sb-text-sm-muted">BCN → LHR · Jun 22 · 18:20</p>
      </div>
      <Separator />
      <div>
        <p className="sb-title-sm">Total</p>
        <p className="sb-price-primary">$842</p>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  name: 'Vertical (inline items)',
  render: () => (
    <div className="sb-row-sm sb-text-sm-muted">
      <span>2 stops</span>
      <Separator orientation="vertical" className="sb-h-4" />
      <span>14h 30m</span>
      <Separator orientation="vertical" className="sb-h-4" />
      <span>Economy</span>
    </div>
  ),
};

export const Semantic: Story = {
  name: 'Semantic (non-decorative)',
  render: () => (
    <div className="sb-max-sm">
      <p className="sb-text-sm-muted sb-mb-sm">
        Decorative by default; set <code>decorative=false</code> for semantic separation.
      </p>
      <Separator decorative={false} />
    </div>
  ),
};
