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
  <svg className="travel-chat-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const SendIcon = () => (
  <svg className="travel-chat-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const AttachIcon = () => (
  <svg className="travel-chat-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

const MinimizeIcon = () => (
  <svg className="travel-chat-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const XIcon = () => (
  <svg className="travel-chat-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator({ agentName }: { agentName: string }) {
  return (
    <div className="travel-chat-typing-wrap">
      <div className="travel-chat-avatar-dot">
        <span className="travel-chat-avatar-letter">{agentName[0]}</span>
      </div>
      <div className="travel-chat-typing-bubble">
        <div className="travel-chat-typing-dots" aria-label="Agent is typing">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="travel-chat-typing-dot"
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
      <div className="travel-chat-system-wrap">
        <span className="travel-chat-system-pill">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('travel-chat-message-row', isUser && 'travel-chat-message-row--user')}>
      {/* Avatar */}
      {!isUser && (
        <div className="travel-chat-avatar-dot">
          <span className="travel-chat-avatar-letter">{agentName[0]}</span>
        </div>
      )}

      <div className={cn('travel-chat-message-stack', isUser && 'travel-chat-message-stack--user')}>
        <div
          className={cn(
            'travel-chat-bubble',
            isUser
              ? 'travel-chat-bubble--user'
              : 'travel-chat-bubble--agent',
          )}
        >
          {message.content}
          {message.hasAttachment && (
            <div className="travel-chat-attachment-row">
              <AttachIcon />
              <span>Attachment</span>
            </div>
          )}
        </div>
        <span className="travel-chat-timestamp">{message.timestamp}</span>
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
      className="travel-chat-window"
      role="dialog"
      aria-label="Support chat"
    >
      {/* Header */}
      <div className="travel-chat-header">
        <div className="travel-chat-header-avatar">
          <span className="travel-chat-header-avatar-letter">{agent[0]}</span>
        </div>
        <div className="travel-chat-header-text">
          <p className="travel-chat-header-name">{agent}</p>
          {bookingReference && (
            <p className="travel-chat-header-ref">Ref: {bookingReference}</p>
          )}
        </div>
        <div className="travel-chat-header-actions">
          <button
            type="button"
            onClick={onMinimize}
            aria-label="Minimize chat"
            className="travel-chat-header-btn"
          >
            <MinimizeIcon />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close chat"
              className="travel-chat-header-btn"
            >
              <XIcon />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="travel-chat-messages" aria-live="polite" aria-label="Chat messages">
        {(!messages || messages.length === 0) && (
          <div className="travel-chat-empty-state">
            <p>Hi! How can we help?</p>
            {bookingReference && (
              <p className="travel-chat-empty-ref">
                Booking: <span className="travel-chat-empty-ref-code">{bookingReference}</span>
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
      <div className="travel-chat-input-row">
        <button
          type="button"
          aria-label="Attach file (coming soon)"
          title="Attach file (coming soon)"
          className="travel-chat-attach-btn"
        >
          <AttachIcon />
        </button>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          rows={1}
          className="travel-chat-input"
          aria-label="Message input"
        />
        <Button
          size="sm"
          onClick={handleSend}
          disabled={!input.trim()}
          aria-label="Send message"
          className="travel-chat-send-btn"
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
    <div className={cn('travel-chat-root', props.className)}>
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
          className="travel-chat-minimized-btn"
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
          className="travel-chat-fab"
        >
          <ChatIcon />
          {unreadCount > 0 && (
            <span
              aria-label={`${unreadCount} unread messages`}
              className="travel-chat-fab-unread"
            >
              {unreadCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
