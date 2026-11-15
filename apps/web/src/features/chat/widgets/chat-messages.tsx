import type { Message } from '@/lib/definitions';
import { Button } from '@repo/ui/components/button';
import { RefreshIcon } from '@repo/ui/icons/refresh';
import { SquareIcon } from '@repo/ui/icons/square';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';
import type { RefObject } from 'react';
import { useEffect } from 'react';
import { isDisplayedChatError, type ChatErrorCode } from '../lib/chat-error';
import { ChatError } from '../ui/chat-error';
import { ChatMessage } from '../ui/chat-message';
import { ChatWorking } from '../ui/chat-steps';
import { ChatSuggestions } from '../ui/chat-suggestions';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  wasStopped: boolean;
  errorCode: ChatErrorCode | null;
  endRef: RefObject<HTMLDivElement | null>;
  onSuggestionClick: (text: string) => void;
  onRetry: () => void;
}

export function ChatMessages({
  messages,
  isLoading,
  isStreaming,
  wasStopped,
  errorCode,
  endRef,
  onSuggestionClick,
  onRetry,
}: ChatMessagesProps) {
  const t = useTranslations('components.chat.messages');
  const lastMsg = messages[messages.length - 1];
  const lastContent = lastMsg?.content ?? '';
  const lastRole = lastMsg?.role;
  const lastSteps = lastMsg?.steps?.length ?? 0;

  const showError = isDisplayedChatError(errorCode) && !isLoading;
  const showSuggestions = messages.length === 0 && !isLoading && !showError;
  const showPending = isLoading && lastRole !== 'assistant';
  const showStopped = wasStopped && !isLoading && !showError && messages.length > 0;

  useEffect(() => {
    if (!endRef.current) return;
    endRef.current.scrollIntoView({
      behavior: isStreaming ? 'instant' : 'smooth',
      block: 'end',
    });
  }, [lastContent, lastRole, lastSteps, isLoading, messages.length, isStreaming, endRef]);

  useEffect(() => {
    if (errorCode !== 'offline' || messages.length === 0) return;
    window.addEventListener('online', onRetry, { once: true });
    return () => window.removeEventListener('online', onRetry);
  }, [errorCode, messages.length, onRetry]);

  return (
    <div
      className={cn(
        'flex-1 space-y-6 overflow-x-hidden overflow-y-auto px-5 py-6',
        messages.length === 0 && 'flex flex-col justify-end',
      )}
    >
      {messages.map((msg, idx) => {
        const isLast = idx === messages.length - 1;
        const isActive = isLast && msg.role === 'assistant' && isLoading;

        return (
          <ChatMessage
            key={msg.id ?? idx}
            message={msg}
            isActive={isActive}
            isStreaming={isActive && isStreaming && msg.content.length > 0}
            onRegenerate={
              isLast && msg.role === 'assistant' && !isLoading && !wasStopped ? onRetry : undefined
            }
          />
        );
      })}

      {showPending && <ChatWorking steps={[]} />}

      {showStopped && (
        <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <SquareIcon size={11} aria-hidden="true" className="fill-current" />
            {t('stopped')}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshIcon size={13} aria-hidden="true" />}
            className="h-7 px-3"
          >
            {t('regenerate')}
          </Button>
        </div>
      )}

      {showError && (
        <ChatError code={errorCode} onRetry={messages.length > 0 ? onRetry : undefined} />
      )}

      {showSuggestions && <ChatSuggestions onSuggestionClick={onSuggestionClick} />}

      <div ref={endRef} />
    </div>
  );
}
