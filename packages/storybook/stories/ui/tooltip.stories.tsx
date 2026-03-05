import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@travel/ui/components/ui/tooltip';
import { Button } from '@travel/ui/components/ui/button';

const meta: Meta = {
  title: 'UI/Tooltip',
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to wishlist</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const AllSides: Story = {
  name: 'All sides',
  render: () => (
    <div className="sb-tooltip-grid">
      {(['top', 'right', 'bottom', 'left'] as const).map(side => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">{side}</Button>
          </TooltipTrigger>
          <TooltipContent side={side}>
            <p>Tooltip on the {side}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

export const OnIconButton: Story = {
  name: 'Info icon with tooltip',
  render: () => (
    <div className="sb-row-sm sb-text-sm-default">
      <span>Baggage allowance</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="sb-tooltip-icon-btn"
            aria-label="Baggage allowance info"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4m0-4h.01" />
            </svg>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>1 carry-on (7 kg) + 1 checked bag (23 kg) included</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const Delayed: Story = {
  name: 'Custom delay',
  render: () => (
    <Tooltip delayDuration={800}>
      <TooltipTrigger asChild>
        <Button variant="ghost">Slow tooltip (800ms)</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Appears after 800ms delay</p>
      </TooltipContent>
    </Tooltip>
  ),
};
