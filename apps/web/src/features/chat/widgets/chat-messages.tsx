import type { Message } from '@/lib/definitions';
import { cn } from '@repo/ui/lib/cn';
import type { RefObject } from 'react';
import { useEffect } from 'react';
import type { ToolName } from '../hooks/use-chat';
import { isDisplayedChatError, type ChatErrorCode } from '../lib/chat-error';
import { ChatError } from '../ui/chat-error';
import { ChatMessage } from '../ui/chat-message';
import { ChatReasoning } from '../ui/chat-reasoning';
import { ChatSuggestions } from '../ui/chat-suggestions';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  activeTool: ToolName | null;
  errorCode: ChatErrorCode | null;
  endRef: RefObject<HTMLDivElement>;
  onSuggestionClick: (text: string) => void;
  onRetry: () => void;
}

export function ChatMessages({
  messages,
  isLoading,
  isStreaming,
  activeTool,
  errorCode,
  endRef,
  onSuggestionClick,
  onRetry,
}: ChatMessagesProps) {
  const lastMsg = messages[messages.length - 1];
  const lastContent = lastMsg?.content ?? '';
  const lastRole = lastMsg?.role;

  const showError = isDisplayedChatError(errorCode) && !isLoading;

  const showSuggestions = messages.length === 0 && !isLoading && !showError;
  const showLoading = activeTool !== null || (isLoading && lastRole !== 'assistant');

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
        'flex-1 space-y-7 overflow-x-hidden overflow-y-auto px-5 py-6',
        messages.length === 0 && 'flex flex-col justify-center',
      )}
    >
      {messages.map((msg, idx) => {
        const isLastAssistant = idx === messages.length - 1 && msg.role === 'assistant';
        const isActiveStream = isLastAssistant && isStreaming;

        return <ChatMessage key={msg.id ?? idx} message={msg} isStreaming={isActiveStream} />;
      })}

      {showError && (
        <div>
          <ChatError code={errorCode} onRetry={messages.length > 0 ? onRetry : undefined} />
        </div>
      )}

      {showSuggestions && <ChatSuggestions onSuggestionClick={onSuggestionClick} />}

      {showLoading && (
        <div>
          <ChatReasoning activeTool={activeTool} />
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
