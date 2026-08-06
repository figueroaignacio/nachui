import type { Message } from '@/lib/definitions';
import { cn } from '@repo/ui/lib/cn';
import type { RefObject } from 'react';
import { useEffect } from 'react';
import { ChatError } from '../ui/chat-error';
import { ChatLoading } from '../ui/chat-loading';
import { ChatMessage } from '../ui/chat-message';
import { ChatSuggestions } from '../ui/chat-suggestions';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  error: Error | undefined;
  endRef: RefObject<HTMLDivElement>;
  onSuggestionClick: (text: string) => void;
}

export function ChatMessages({
  messages,
  isLoading,
  isStreaming,
  error,
  endRef,
  onSuggestionClick,
}: ChatMessagesProps) {
  const showSuggestions = messages.length === 0;

  const lastMsg = messages[messages.length - 1];
  const lastContent = lastMsg?.content ?? '';
  const lastRole = lastMsg?.role;

  useEffect(() => {
    if (!endRef.current) return;
    endRef.current.scrollIntoView({
      behavior: isStreaming ? 'instant' : 'smooth',
      block: 'end',
    });
  }, [lastContent, lastRole, isLoading, messages.length, isStreaming, endRef]);

  return (
    <div
      className={cn(
        'flex-1 space-y-6 overflow-x-hidden overflow-y-auto px-6 py-2',
        messages.length === 0 && 'flex flex-col justify-center',
      )}
    >
      {messages.map((msg, idx) => {
        const isLastAssistant = idx === messages.length - 1 && msg.role === 'assistant';
        const isActiveStream = isLastAssistant && isStreaming;

        return (
          <div
            key={idx}
            className={cn('flex flex-col', msg.role === 'user' ? 'items-end' : 'items-start')}
          >
            <ChatMessage message={msg} isStreaming={isActiveStream} />
          </div>
        );
      })}

      {error && !isLoading && !isStreaming && (
        <div>
          <ChatError />
        </div>
      )}

      {showSuggestions && !isLoading && !isStreaming && (
        <ChatSuggestions onSuggestionClick={onSuggestionClick} />
      )}

      {isLoading && !isStreaming && (
        <div>
          <ChatLoading />
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
