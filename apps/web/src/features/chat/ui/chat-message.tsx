'use client';

import { Link } from '@/i18n/navigation';
import type { Message } from '@/lib/definitions';
import { Actions } from '@repo/ui/ai/actions';
import { Sources } from '@repo/ui/ai/sources';
import { Bubble } from '@repo/ui/components/bubble';
import { RefreshIcon } from '@repo/ui/icons/refresh';
import { useTranslations } from 'next-intl';
import { ChatAttachment } from './chat-attachment';
import { ChatExplanationRequest } from './chat-explanation-request';
import { ChatMarkdownContent } from './chat-markdown-content';
import { ChatThought, ChatWorking } from './chat-steps';

function toPath(url: string) {
  try {
    return new URL(url).pathname;
  } catch {
    return undefined;
  }
}

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  /** The turn is still running: tools or text may still arrive. */
  isActive?: boolean;
  onRegenerate?: () => void;
}

export function ChatMessage({ message, isStreaming, isActive, onRegenerate }: ChatMessageProps) {
  const t = useTranslations('components.chat.messages');
  const isUser = message.role === 'user';

  const explainMatch = message.content.match(
    /^(?:Explain the content of this page:|Explícame el contenido de esta página:) ([^.]+)\./,
  );
  const isExplanation =
    isUser &&
    explainMatch !== null &&
    (message.content.includes('ALWAYS based on the documentation provided.') ||
      message.content.includes('SIEMPRE basandote en la documentación proporcionada.') ||
      message.content.includes('SIEMPRE basándote en la documentación proporcionada.'));
  const componentName = explainMatch ? explainMatch[1] : '';
  const explainUrl = isExplanation
    ? message.content.match(/Context: (\S+?)\.(?:\s|$)/)?.[1]
    : undefined;
  const explainHref = explainUrl ? toPath(explainUrl) : undefined;

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1.5">
        {message.quote && <ChatAttachment text={message.quote} className="max-w-[85%]" />}
        {isExplanation ? (
          <ChatExplanationRequest componentName={componentName} href={explainHref} />
        ) : (
          <Bubble variant="muted" align="end" className="max-w-[85%] rounded-2xl rounded-br-md">
            <Bubble.Content className="py-2.5">{message.content}</Bubble.Content>
          </Bubble>
        )}
      </div>
    );
  }

  const steps = message.steps ?? [];
  const sources = message.sources ?? [];
  const hasText = message.content.length > 0;

  if (!hasText) {
    return isActive ? <ChatWorking steps={steps} /> : null;
  }

  const isDone = !isActive;

  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      {steps.length > 0 && <ChatThought steps={steps} seconds={message.thoughtSeconds} />}
      <div className="text-foreground/90 w-full min-w-0 text-sm leading-relaxed">
        <ChatMarkdownContent content={message.content} />
        {isStreaming && (
          <span
            aria-hidden
            className="bg-foreground ms-0.5 inline-block h-[1em] w-0.5 animate-pulse rounded-sm align-middle"
          />
        )}
      </div>
      {isDone && sources.length > 0 && (
        <Sources count={sources.length}>
          <Sources.Trigger className="text-xs" label={(count) => t('sources', { count })} />
          <Sources.Content>
            {sources.map((source) => (
              <Link
                key={source.slug}
                href={`/docs/${source.slug}`}
                className="text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring flex items-baseline gap-2 rounded-md px-2 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <span className="text-foreground/90 min-w-0 truncate">{source.title}</span>
                <span className="min-w-0 truncate font-mono text-xs">{`/docs/${source.slug}`}</span>
              </Link>
            ))}
          </Sources.Content>
        </Sources>
      )}
      {isDone && (
        <Actions className="-ms-1.5">
          <Actions.Copy text={message.content} label={t('copy')} copiedLabel={t('copied')} />
          {onRegenerate && (
            <Actions.Button label={t('regenerate')} onClick={onRegenerate}>
              <RefreshIcon aria-hidden="true" />
            </Actions.Button>
          )}
        </Actions>
      )}
    </div>
  );
}
