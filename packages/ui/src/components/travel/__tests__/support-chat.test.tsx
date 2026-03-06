import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SupportChat } from '../support-chat/index';

describe('SupportChat', () => {
  it('renders semantic root class and FAB', () => {
    const { container } = render(<SupportChat agentName="Mia" />);
    expect(container.firstElementChild).toHaveClass('travel-chat-root');
    expect(screen.getByRole('button', { name: /open support chat/i })).toBeInTheDocument();
  });

  it('opens chat window from FAB', async () => {
    const user = userEvent.setup();
    render(<SupportChat agentName="Mia" bookingReference="AB123" />);

    await user.click(screen.getByRole('button', { name: /open support chat/i }));

    expect(screen.getByRole('dialog', { name: /support chat/i })).toBeInTheDocument();
    expect(screen.getByText(/ref: AB123/i)).toBeInTheDocument();
  });

  it('sends a message with Enter key', async () => {
    const user = userEvent.setup();
    const onSendMessage = vi.fn();

    render(<SupportChat agentName="Mia" onSendMessage={onSendMessage} />);

    await user.click(screen.getByRole('button', { name: /open support chat/i }));
    const input = screen.getByLabelText(/message input/i);
    await user.type(input, 'Need help{enter}');

    expect(onSendMessage).toHaveBeenCalledWith('Need help');
  });
});
