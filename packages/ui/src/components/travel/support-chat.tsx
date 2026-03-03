'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { Button } from '../ui/button.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChatMessageRole = 'user' | 'agent' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  timestamp: string;
  /** If true, message has an attachment stub */
  hasAttachment?: boolean;
}

export interface SupportChatProps {
  messages?: ChatMessage[];
  bookingReference?: string;
  agentName?: string;
  agentAvatar?: string;
  isTyping?: boolean;
  onSendMessage?: (message: string) => void;
  onClose?: () => void;
  className?: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const ChatIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const SendIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const AttachIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

const MinimizeIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const XIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator({ agentName }: { agentName: string }) {
  return (
    <div className="flex items-end gap-2">
      <div className="h-7 w-7 rounded-full bg-[var(--color-primary-default)] flex items-center justify-center flex-shrink-0">
        <span className="text-[10px] text-white font-bold">{agentName[0]}</span>
      </div>
      <div className="bg-[var(--color-background-subtle)] rounded-2xl rounded-bl-sm px-3 py-2">
        <div className="flex gap-1 items-center h-4" aria-label="Agent is typing">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-[var(--color-foreground-muted)] animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  message,
  agentName,
}: {
  message: ChatMessage;
  agentName: string;
}) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="text-center">
        <span className="inline-block px-3 py-1 text-[10px] text-[var(--color-foreground-subtle)] bg-[var(--color-background-subtle)] rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-end gap-2', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      {!isUser && (
        <div className="h-7 w-7 rounded-full bg-[var(--color-primary-default)] flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] text-white font-bold">{agentName[0]}</span>
        </div>
      )}

      <div className={cn('max-w-[75%] space-y-1', isUser && 'items-end flex flex-col')}>
        <div
          className={cn(
            'px-3 py-2 rounded-2xl text-sm',
            isUser
              ? 'bg-[var(--color-primary-default)] text-[var(--color-primary-foreground)] rounded-br-sm'
              : 'bg-[var(--color-background-subtle)] text-[var(--color-foreground-default)] rounded-bl-sm',
          )}
        >
          {message.content}
          {message.hasAttachment && (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs opacity-80">
              <AttachIcon />
              <span>Attachment</span>
            </div>
          )}
        </div>
        <span className="text-[10px] text-[var(--color-foreground-subtle)] px-1">{message.timestamp}</span>
      </div>
    </div>
  );
}

// ─── Chat window ──────────────────────────────────────────────────────────────

function ChatWindow({
  messages,
  bookingReference,
  agentName,
  isTyping,
  onSendMessage,
  onClose,
  onMinimize,
}: SupportChatProps & { onMinimize: () => void }) {
  const [input, setInput] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSendMessage?.(trimmed);
    setInput('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const agent = agentName ?? 'Support';

  return (
    <div
      className="flex flex-col w-80 h-[480px] rounded-[var(--shape-preset-card)] border border-[var(--color-border-default)] bg-[var(--color-surface-card)] shadow-[var(--shadow-lg)] overflow-hidden"
      role="dialog"
      aria-label="Support chat"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[var(--color-primary-default)] text-[var(--color-primary-foreground)]">
        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold">{agent[0]}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{agent}</p>
          {bookingReference && (
            <p className="text-[10px] opacity-80">Ref: {bookingReference}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMinimize}
            aria-label="Minimize chat"
            className="p-1.5 rounded hover:bg-white/20 transition-colors"
          >
            <MinimizeIcon />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close chat"
              className="p-1.5 rounded hover:bg-white/20 transition-colors"
            >
              <XIcon />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" aria-live="polite" aria-label="Chat messages">
        {(!messages || messages.length === 0) && (
          <div className="text-center text-xs text-[var(--color-foreground-subtle)] mt-4">
            <p>Hi! How can we help?</p>
            {bookingReference && (
              <p className="mt-1 text-[var(--color-foreground-muted)]">
                Booking: <span className="font-mono font-medium">{bookingReference}</span>
              </p>
            )}
          </div>
        )}
        {messages?.map(msg => (
          <MessageBubble key={msg.id} message={msg} agentName={agent} />
        ))}
        {isTyping && <TypingIndicator agentName={agent} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[var(--color-border-muted)] p-3 flex items-end gap-2">
        <button
          type="button"
          aria-label="Attach file (coming soon)"
          title="Attach file (coming soon)"
          className="flex-shrink-0 p-1.5 rounded text-[var(--color-foreground-subtle)] hover:text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-subtle)] transition-colors"
        >
          <AttachIcon />
        </button>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          rows={1}
          className={cn(
            'flex-1 resize-none text-sm bg-transparent border-none outline-none',
            'text-[var(--color-foreground-default)] placeholder:text-[var(--color-foreground-subtle)]',
            'max-h-24 leading-5',
          )}
          aria-label="Message input"
        />
        <Button
          size="sm"
          onClick={handleSend}
          disabled={!input.trim()}
          aria-label="Send message"
          className="flex-shrink-0 h-8 w-8 p-0 rounded-full"
        >
          <SendIcon />
        </Button>
      </div>
    </div>
  );
}

// ─── SupportChat (FAB + window) ───────────────────────────────────────────────

export function SupportChat(props: SupportChatProps) {
  const [open, setOpen] = React.useState(false);
  const [minimized, setMinimized] = React.useState(false);

  const unreadCount = 0; // Could derive from props in a real impl

  return (
    <div className={cn('fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3', props.className)}>
      {/* Chat window */}
      {open && !minimized && (
        <ChatWindow
          {...props}
          onClose={() => { setOpen(false); props.onClose?.(); }}
          onMinimize={() => setMinimized(true)}
        />
      )}

      {/* Minimized bar */}
      {open && minimized && (
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary-default)] text-[var(--color-primary-foreground)] shadow-[var(--shadow-md)] hover:opacity-90 transition-opacity text-sm font-medium"
          aria-label="Expand support chat"
        >
          <ChatIcon />
          <span>{props.agentName ?? 'Support'}</span>
        </button>
      )}

      {/* FAB */}
      {!open && (
        <button
          type="button"
          onClick={() => { setOpen(true); setMinimized(false); }}
          aria-label="Open support chat"
          className="relative h-14 w-14 rounded-full bg-[var(--color-primary-default)] text-[var(--color-primary-foreground)] flex items-center justify-center shadow-[var(--shadow-lg)] hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-default)] focus-visible:ring-offset-2"
        >
          <ChatIcon />
          {unreadCount > 0 && (
            <span
              aria-label={`${unreadCount} unread messages`}
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[var(--color-destructive-default)] text-white text-[10px] font-bold flex items-center justify-center"
            >
              {unreadCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
