import type { Message } from '@/lib/definitions';
import { Typography } from '@repo/ui/components/typography';
import { ChatAttachment } from './chat-attachment';
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

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1.5">
        {message.quote && <ChatAttachment text={message.quote} className="max-w-[85%]" />}
        {isExplanation ? (
          <ChatExplanationRequest componentName={componentName} />
        ) : (
          <Typography
            variant="p"
            className="bg-muted text-foreground max-w-[85%] rounded-2xl rounded-br-md px-3.5 py-2.5 text-sm leading-relaxed wrap-break-word"
          >
            {message.content}
          </Typography>
        )}
      </div>
    );
  }

  return (
    <div className="text-foreground/90 w-full min-w-0 text-sm leading-relaxed">
      <ChatMarkdownContent content={message.content} />
      {isStreaming && (
        <span
          aria-hidden
          className="bg-foreground ml-0.5 inline-block h-[1em] w-0.5 animate-pulse rounded-sm align-middle"
        />
      )}
    </div>
  );
}
