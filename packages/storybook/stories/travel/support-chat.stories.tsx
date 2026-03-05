import type { Meta, StoryObj } from '@storybook/react';
import { SupportChat } from '@travel/ui/components/travel/support-chat';
import type { ChatMessage } from '@travel/ui/components/travel/support-chat';

// ─── Sample conversations ─────────────────────────────────────────────────────

const CONVERSATION: ChatMessage[] = [
  {
    id: '1',
    role: 'system',
    content: 'Chat started — Booking ref TRV-8812-JFK',
    timestamp: '14:02',
  },
  {
    id: '2',
    role: 'agent',
    content: 'Hi! I\'m Sarah from the support team. How can I help you today?',
    timestamp: '14:02',
  },
  {
    id: '3',
    role: 'user',
    content: 'Hi! I\'d like to change my departure date on booking TRV-8812-JFK.',
    timestamp: '14:03',
  },
  {
    id: '4',
    role: 'agent',
    content: 'Of course! I can see your booking — JFK to LHR on March 18. What date would you like to change it to?',
    timestamp: '14:04',
  },
  {
    id: '5',
    role: 'user',
    content: 'March 22 if possible. Is there any change fee?',
    timestamp: '14:04',
  },
  {
    id: '6',
    role: 'agent',
    content: 'Great news — your fare allows one free date change. I can move you to March 22 at no extra cost. There are seats available on the 21:45 BA 117 flight. Shall I go ahead?',
    timestamp: '14:05',
  },
];

const SHORT_CONVERSATION: ChatMessage[] = [
  {
    id: '1',
    role: 'agent',
    content: 'Hello! How can I help you today?',
    timestamp: '10:30',
  },
  {
    id: '2',
    role: 'user',
    content: 'What\'s your cancellation policy?',
    timestamp: '10:31',
  },
];

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof SupportChat> = {
  title: 'Travel/SupportChat',
  component: SupportChat,
  tags: ['autodocs'],
  args: {
    agentName: 'Sarah',
    bookingReference: 'TRV-8812-JFK',
    onSendMessage: () => {},
    onClose: () => {},
  },
  parameters: {
    layout: 'fullscreen',
    // SupportChat is fixed-positioned; render it at canvas level
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', position: 'relative', background: 'var(--color-background-default)' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof SupportChat>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  name: 'Default (FAB closed)',
};

export const WithConversation: Story = {
  name: 'Active conversation',
  args: {
    messages: CONVERSATION,
  },
  play: async ({ canvasElement }) => {
    const fab = canvasElement.querySelector(
      'button[aria-label="Open support chat"]',
    ) as HTMLButtonElement | null;
    fab?.click();
  },
};

export const AgentTyping: Story = {
  name: 'Agent typing indicator',
  args: {
    messages: SHORT_CONVERSATION,
    isTyping: true,
  },
  play: async ({ canvasElement }) => {
    const fab = canvasElement.querySelector(
      'button[aria-label="Open support chat"]',
    ) as HTMLButtonElement | null;
    fab?.click();
  },
};

export const NoBookingRef: Story = {
  name: 'No booking reference (general support)',
  args: {
    agentName: 'Support',
    messages: [],
  },
  play: async ({ canvasElement }) => {
    const fab = canvasElement.querySelector(
      'button[aria-label="Open support chat"]',
    ) as HTMLButtonElement | null;
    fab?.click();
  },
};

export const EmptyChat: Story = {
  name: 'Empty chat (greeting state)',
  args: {
    messages: [],
  },
  play: async ({ canvasElement }) => {
    const fab = canvasElement.querySelector(
      'button[aria-label="Open support chat"]',
    ) as HTMLButtonElement | null;
    fab?.click();
  },
};
