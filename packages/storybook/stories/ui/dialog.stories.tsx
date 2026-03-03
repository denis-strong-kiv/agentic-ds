import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogClose,
} from '@travel/ui/components/ui/dialog';
import { Button } from '@travel/ui/components/ui/button';

const meta: Meta = {
  title: 'UI/Dialog',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

function DialogDemo({ size }: { size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog {size ?? 'md'}</Button>
      </DialogTrigger>
      <DialogContent size={size}>
        <DialogHeader>
          <DialogTitle>Booking Confirmation</DialogTitle>
          <DialogDescription>
            Please review your booking details before confirming.
          </DialogDescription>
        </DialogHeader>
        <div style={{ padding: '0.5rem 0', color: 'var(--color-foreground-muted)', fontSize: 14 }}>
          <p>Flight: NYC → LAX</p>
          <p>Date: Mar 15, 2026</p>
          <p>Passengers: 2 adults</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button>Confirm Booking</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const Default: Story = { render: () => <DialogDemo /> };
export const Small: Story = { render: () => <DialogDemo size="sm" /> };
export const Large: Story = { render: () => <DialogDemo size="lg" /> };
export const ExtraLarge: Story = { render: () => <DialogDemo size="xl" /> };

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
      {(['sm', 'md', 'lg', 'xl'] as const).map(s => (
        <DialogDemo key={s} size={s} />
      ))}
    </div>
  ),
};
