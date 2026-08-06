import type { Message } from '@/lib/definitions';
import { Typography } from '@repo/ui/components/typography';
import { cn } from '@repo/ui/lib/cn';
import { ChatExplanationRequest } from './chat-explanation-request';
import { ChatMarkdownContent } from './chat-markdown-content';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
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

  return (
    <div className={cn('flex w-full max-w-full gap-3', !isUser && 'mt-2')}>
      <div className="min-w-0 flex-1">
        {isUser ? (
          <div className="mb-8 flex justify-end">
            {isExplanation ? (
              <ChatExplanationRequest componentName={componentName} />
            ) : (
              <Typography
                variant="p"
                className="max-w-[85%] px-2 py-5 text-sm leading-relaxed font-medium wrap-break-word"
              >
                {message.content}
              </Typography>
            )}
          </div>
        ) : (
          <div className="group text-foreground/90 relative mb-8 w-full min-w-0 pl-1 text-sm leading-relaxed">
            <ChatMarkdownContent content={message.content} />
            {isStreaming && (
              <span
                aria-hidden
                className="bg-foreground ml-0.5 inline-block h-[1em] w-0.5 animate-pulse rounded-sm align-middle"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
