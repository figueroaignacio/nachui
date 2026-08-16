import type { Message } from '@/lib/definitions';
import { cn } from '@repo/ui/lib/cn';
import type { RefObject } from 'react';
import { useEffect } from 'react';
import type { ToolName } from '../hooks/use-chat';
import { ChatError } from '../ui/chat-error';
import { ChatReasoning } from '../ui/chat-reasoning';
import { ChatMessage } from '../ui/chat-message';
import { ChatSuggestions } from '../ui/chat-suggestions';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  activeTool: ToolName | null;
  error: Error | undefined;
  endRef: RefObject<HTMLDivElement>;
  onSuggestionClick: (text: string) => void;
}

export function ChatMessages({
  messages,
  isLoading,
  isStreaming,
  activeTool,
  error,
  endRef,
  onSuggestionClick,
}: ChatMessagesProps) {
  const lastMsg = messages[messages.length - 1];
  const lastContent = lastMsg?.content ?? '';
  const lastRole = lastMsg?.role;

  // State selection:
  // - empty    → suggestions
  // - loading  → ChatReasoning, tool-aware. Covers the submitted phase AND the
  //   tool-execution phase — the stream is already "streaming" while a tool
  //   runs, but no text has arrived, which previously left the screen blank.
  // - error    → ChatError
  // - data     → the messages themselves
  const showSuggestions = messages.length === 0 && !isLoading;
  const showLoading = activeTool !== null || (isLoading && lastRole !== 'assistant');
  const showError = error !== undefined && !isLoading;

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
          <ChatError />
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
