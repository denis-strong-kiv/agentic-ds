import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from '../dialog.js';

function DialogFixture({
  size,
  hideClose,
  onOpenChange,
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  hideClose?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Dialog {...(onOpenChange !== undefined ? { onOpenChange } : {})}>
      <DialogTrigger asChild>
        <button>Open Dialog</button>
      </DialogTrigger>
      <DialogContent
        {...(size !== undefined ? { size } : {})}
        {...(hideClose !== undefined ? { hideClose } : {})}
      >
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description text</DialogDescription>
        </DialogHeader>
        <p>Dialog body content</p>
      </DialogContent>
    </Dialog>
  );
}

describe('Dialog', () => {
  it('is closed by default', () => {
    render(<DialogFixture />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<DialogFixture />);
    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders title and description in open state', async () => {
    const user = userEvent.setup();
    render(<DialogFixture />);
    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    expect(screen.getByText('Dialog description text')).toBeInTheDocument();
  });

  it('closes when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<DialogFixture />);
    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    render(<DialogFixture />);
    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('hides close button when hideClose is true', async () => {
    const user = userEvent.setup();
    render(<DialogFixture hideClose />);
    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('renders dialog with role="dialog"', async () => {
    const user = userEvent.setup();
    render(<DialogFixture />);
    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    // Radix Dialog.Content has role="dialog" by default
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toBeVisible();
  });

  it('calls onOpenChange when dialog opens/closes', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<DialogFixture onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  describe('sizes', () => {
    it('renders sm size', async () => {
      const user = userEvent.setup();
      render(<DialogFixture size="sm" />);
      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(screen.getByRole('dialog').className).toContain('ui-dialog-content--sm');
    });

    it('renders lg size', async () => {
      const user = userEvent.setup();
      render(<DialogFixture size="lg" />);
      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(screen.getByRole('dialog').className).toContain('ui-dialog-content--lg');
    });
  });
});
