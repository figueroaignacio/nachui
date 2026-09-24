'use client';

import * as React from 'react';
import { Actions } from '../ai/actions';
import { type AttachmentData, Attachments } from '../ai/attachments';
import { CodeBlock } from '../ai/code-block';
import { Conversation } from '../ai/conversation';
import { PromptInput, type PromptInputMessage } from '../ai/prompt-input';
import { Reasoning } from '../ai/reasoning';
import { Response } from '../ai/response';
import { Sources } from '../ai/sources';
import { Suggestion } from '../ai/suggestion';
import { Tool, type ToolStatus } from '../ai/tool';
import { Bubble } from '../components/bubble';
import { Message } from '../components/message';
import { cn } from '../lib/cn';

type ChatStatus = 'ready' | 'submitted' | 'streaming' | 'error';
type ChatRole = 'user' | 'assistant';
type ChatFeedback = 'up' | 'down';

type ChatTextPart = { type: 'text'; text: string };
type ChatCodePart = { type: 'code'; code: string; language?: string };
type ChatToolPart = {
  type: 'tool';
  name: string;
  status: ToolStatus;
  input?: unknown;
  output?: unknown;
};
type ChatReasoningPart = { type: 'reasoning'; text: string };
type ChatSourcesPart = { type: 'sources'; items: { href: string; title: string }[] };
type ChatFilePart = {
  type: 'file';
  name: string;
  size?: number;
  url?: string;
  mediaType?: string;
};

type ChatPart =
  | ChatTextPart
  | ChatCodePart
  | ChatToolPart
  | ChatReasoningPart
  | ChatSourcesPart
  | ChatFilePart;

interface ChatMessage {
  id: string;
  role: ChatRole;
  parts: ChatPart[];
}

interface ChatSendMessage {
  text: string;
  files?: File[];
}

interface ChatLabels {
  placeholder: string;
  emptyTitle: string;
  emptyDescription: string;
  user: string;
  assistant: string;
  copy: string;
  copied: string;
  retry: string;
  thumbsUp: string;
  thumbsDown: string;
  send: string;
  addFiles: string;
  scrollToBottom: string;
  sources: (count: number) => string;
}

const DEFAULT_LABELS: ChatLabels = {
  placeholder: 'Ask anything…',
  emptyTitle: 'Start a conversation',
  emptyDescription: 'Ask a question or pick one of the suggestions.',
  user: 'You',
  assistant: 'Assistant',
  copy: 'Copy',
  copied: 'Copied',
  retry: 'Retry',
  thumbsUp: 'Good answer',
  thumbsDown: 'Bad answer',
  send: 'Send message',
  addFiles: 'Add files',
  scrollToBottom: 'Scroll to bottom',
  sources: (count) => `Used ${count} ${count === 1 ? 'source' : 'sources'}`,
};

interface ChatContextValue {
  messages: ChatMessage[];
  status: ChatStatus;
  labels: ChatLabels;
  suggestions: string[];
  onSend: (message: ChatSendMessage) => void;
  onStop?: () => void;
  onRetry?: (messageId: string) => void;
  onFeedback?: (messageId: string, feedback: ChatFeedback) => void;
  onSuggestion?: (text: string) => void;
  renderMarkdown: (text: string) => React.ReactNode;
}

const ChatContext = React.createContext<ChatContextValue | null>(null);

const useChat = (): ChatContextValue => {
  const context = React.use(ChatContext);
  if (!context) {
    throw new Error('Chat components must be used within Chat');
  }
  return context;
};

function renderParagraphs(text: string): React.ReactNode {
  return text
    .split(/\n{2,}/)
    .filter((paragraph) => paragraph.trim().length > 0)
    .map((paragraph, index) => <p key={index}>{paragraph}</p>);
}

function messageText(message: ChatMessage): string {
  return message.parts
    .filter((part): part is ChatTextPart => part.type === 'text')
    .map((part) => part.text)
    .join('\n\n');
}

function toAttachment(part: ChatFilePart, index: number): AttachmentData {
  return {
    id: `${part.name}-${index}`,
    filename: part.name,
    mediaType: part.mediaType,
    url: part.url,
    size: part.size,
  };
}

interface ChatProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  messages: ChatMessage[];
  status?: ChatStatus;
  onSend: (message: ChatSendMessage) => void;
  onStop?: () => void;
  onRetry?: (messageId: string) => void;
  onFeedback?: (messageId: string, feedback: ChatFeedback) => void;
  suggestions?: string[];
  onSuggestion?: (text: string) => void;
  placeholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  labels?: Partial<ChatLabels>;
  renderMarkdown?: (text: string) => React.ReactNode;
  children?: React.ReactNode;
}

type ChatThreadProps = React.HTMLAttributes<HTMLDivElement>;

interface ChatMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  message: ChatMessage;
  isLast?: boolean;
}

type ChatPendingProps = React.HTMLAttributes<HTMLDivElement>;
type ChatSuggestionsProps = React.HTMLAttributes<HTMLDivElement>;

interface ChatComposerProps extends Omit<
  React.ComponentProps<typeof PromptInput>,
  'onSubmit' | 'children'
> {
  children?: React.ReactNode;
}

const EMPTY_SUGGESTIONS: string[] = [];

const ChatRoot = ({
  className,
  messages,
  status = 'ready',
  onSend,
  onStop,
  onRetry,
  onFeedback,
  suggestions = EMPTY_SUGGESTIONS,
  onSuggestion,
  placeholder,
  emptyTitle,
  emptyDescription,
  labels: partialLabels,
  renderMarkdown = renderParagraphs,
  children,
  ref,
  ...props
}: ChatProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const labels = React.useMemo<ChatLabels>(
    () => ({
      ...DEFAULT_LABELS,
      ...partialLabels,
      ...(placeholder !== undefined ? { placeholder } : {}),
      ...(emptyTitle !== undefined ? { emptyTitle } : {}),
      ...(emptyDescription !== undefined ? { emptyDescription } : {}),
    }),
    [partialLabels, placeholder, emptyTitle, emptyDescription],
  );

  const value = React.useMemo<ChatContextValue>(
    () => ({
      messages,
      status,
      labels,
      suggestions,
      onSend,
      onStop,
      onRetry,
      onFeedback,
      onSuggestion,
      renderMarkdown,
    }),
    [
      messages,
      status,
      labels,
      suggestions,
      onSend,
      onStop,
      onRetry,
      onFeedback,
      onSuggestion,
      renderMarkdown,
    ],
  );

  return (
    <ChatContext value={value}>
      <div
        ref={ref}
        data-status={status}
        className={cn('flex h-full min-h-0 w-full flex-col', className)}
        {...props}
      >
        {children ?? (
          <>
            <ChatThread />
            <ChatComposer />
          </>
        )}
      </div>
    </ChatContext>
  );
};

ChatRoot.displayName = 'Chat';

const ChatThread = ({
  className,
  children,
  ref,
  ...props
}: ChatThreadProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { messages, labels, suggestions } = useChat();

  return (
    <Conversation ref={ref} className={cn('flex-1', className)} {...props}>
      {messages.length === 0 ? (
        <Conversation.Empty>
          <span className="text-foreground font-medium">{labels.emptyTitle}</span>
          <span>{labels.emptyDescription}</span>
          {suggestions.length > 0 && <ChatSuggestions className="mt-4 justify-center" />}
        </Conversation.Empty>
      ) : (
        <Conversation.Content>
          {children ??
            messages.map((message, index) => (
              <ChatMessageItem
                key={message.id}
                message={message}
                isLast={index === messages.length - 1}
              />
            ))}
          <ChatPending />
        </Conversation.Content>
      )}
      <Conversation.ScrollButton label={labels.scrollToBottom} />
    </Conversation>
  );
};

ChatThread.displayName = 'ChatThread';

const ChatUserMessage = ({ message }: { message: ChatMessage }) => {
  const { labels } = useChat();
  const text = messageText(message);
  const files = message.parts.filter((part): part is ChatFilePart => part.type === 'file');

  return (
    <Message.Content>
      <Message.Header>{labels.user}</Message.Header>
      {files.length > 0 && (
        <Attachments variant="inline">
          {files.map((file, index) => {
            const data = toAttachment(file, index);
            return (
              <Attachments.Item key={data.id} data={data}>
                <Attachments.Preview />
                <Attachments.Info />
              </Attachments.Item>
            );
          })}
        </Attachments>
      )}
      {text && (
        <Bubble>
          <Bubble.Content>{text}</Bubble.Content>
        </Bubble>
      )}
    </Message.Content>
  );
};

const ChatAssistantMessage = ({ message, isLast }: { message: ChatMessage; isLast: boolean }) => {
  const { status, labels, onRetry, onFeedback, renderMarkdown } = useChat();
  const streaming = isLast && status === 'streaming';
  const text = messageText(message);

  return (
    <Message.Content className="max-w-full">
      <Message.Header>{labels.assistant}</Message.Header>
      <Response isStreaming={streaming}>
        {message.parts.map((part, index) => {
          switch (part.type) {
            case 'reasoning':
              return (
                <Reasoning key={index} isStreaming={streaming} defaultOpen={false}>
                  <Reasoning.Trigger />
                  <Reasoning.Content>{part.text}</Reasoning.Content>
                </Reasoning>
              );
            case 'text':
              return <React.Fragment key={index}>{renderMarkdown(part.text)}</React.Fragment>;
            case 'code':
              return (
                <CodeBlock key={index} code={part.code} language={part.language} className="my-3">
                  <CodeBlock.CopyButton />
                  <CodeBlock.Content />
                </CodeBlock>
              );
            case 'tool':
              return (
                <Tool key={index} status={part.status} className="my-3">
                  <Tool.Header name={part.name} />
                  <Tool.Content>
                    {part.input !== undefined && <Tool.Input value={part.input} />}
                    {part.output !== undefined && (
                      <Tool.Output value={part.output} error={part.status === 'error'} />
                    )}
                  </Tool.Content>
                </Tool>
              );
            case 'sources':
              return (
                <Sources key={index} className="my-3">
                  <Sources.Trigger label={labels.sources} />
                  <Sources.Content>
                    {part.items.map((item) => (
                      <Sources.Item key={item.href} href={item.href} title={item.title} />
                    ))}
                  </Sources.Content>
                </Sources>
              );
            default:
              return null;
          }
        })}
      </Response>
      {!streaming && (
        <Message.Footer className="px-0">
          <Actions>
            {text && <Actions.Copy text={text} label={labels.copy} copiedLabel={labels.copied} />}
            {onRetry && (
              <Actions.Button label={labels.retry} onClick={() => onRetry(message.id)}>
                <Actions.Icons.retry />
              </Actions.Button>
            )}
            {onFeedback && (
              <>
                <Actions.Button
                  label={labels.thumbsUp}
                  onClick={() => onFeedback(message.id, 'up')}
                >
                  <Actions.Icons.thumbsUp />
                </Actions.Button>
                <Actions.Button
                  label={labels.thumbsDown}
                  onClick={() => onFeedback(message.id, 'down')}
                >
                  <Actions.Icons.thumbsDown />
                </Actions.Button>
              </>
            )}
          </Actions>
        </Message.Footer>
      )}
    </Message.Content>
  );
};

const ChatMessageItem = ({
  className,
  message,
  isLast = false,
  ref,
  ...props
}: ChatMessageProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const isUser = message.role === 'user';

  return (
    <Message
      ref={ref}
      align={isUser ? 'end' : 'start'}
      data-role={message.role}
      className={className}
      {...props}
    >
      {isUser ? (
        <ChatUserMessage message={message} />
      ) : (
        <ChatAssistantMessage message={message} isLast={isLast} />
      )}
    </Message>
  );
};

ChatMessageItem.displayName = 'ChatMessage';

const ChatPending = ({
  className,
  ref,
  ...props
}: ChatPendingProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { messages, status, labels } = useChat();
  const last = messages[messages.length - 1];

  if (status !== 'submitted' || !last || last.role !== 'user') return null;

  return (
    <Message ref={ref} className={className} {...props}>
      <Message.Content className="max-w-full">
        <Message.Header>{labels.assistant}</Message.Header>
        <Response.Skeleton />
      </Message.Content>
    </Message>
  );
};

ChatPending.displayName = 'ChatPending';

const ChatSuggestions = ({
  className,
  ref,
  ...props
}: ChatSuggestionsProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { suggestions, onSuggestion, onSend } = useChat();

  if (suggestions.length === 0) return null;

  return (
    <Suggestion.Group ref={ref} className={cn('flex-wrap', className)} {...props}>
      {suggestions.map((suggestion) => (
        <Suggestion
          key={suggestion}
          suggestion={suggestion}
          size="sm"
          onClick={(text) => (onSuggestion ? onSuggestion(text) : onSend({ text }))}
        />
      ))}
    </Suggestion.Group>
  );
};

ChatSuggestions.displayName = 'ChatSuggestions';

const ChatComposer = ({
  className,
  children,
  ref,
  ...props
}: ChatComposerProps & { ref?: React.Ref<HTMLFormElement> }) => {
  const { status, labels, onSend, onStop } = useChat();
  const busy = status === 'submitted' || status === 'streaming';

  const handleSubmit = (message: PromptInputMessage) => {
    if (busy) return;
    onSend({ text: message.text, files: message.files.map((file) => file.file) });
  };

  return (
    <div className="border-border shrink-0 border-t p-3">
      <PromptInput ref={ref} multiple onSubmit={handleSubmit} className={className} {...props}>
        {children ?? (
          <>
            <PromptInput.Header>
              <PromptInput.Attachments />
            </PromptInput.Header>
            <PromptInput.Body>
              <PromptInput.Textarea placeholder={labels.placeholder} />
            </PromptInput.Body>
            <PromptInput.Footer>
              <PromptInput.Tools>
                <PromptInput.AddAttachments label={labels.addFiles} />
              </PromptInput.Tools>
              <PromptInput.Submit
                status={status}
                label={labels.send}
                disabled={busy ? false : undefined}
                onClick={(event) => {
                  if (!busy) return;
                  event.preventDefault();
                  onStop?.();
                }}
              />
            </PromptInput.Footer>
          </>
        )}
      </PromptInput>
    </div>
  );
};

ChatComposer.displayName = 'ChatComposer';

interface UIMessageLike {
  id: string;
  role: string;
  parts: Array<{
    type: string;
    text?: string;
    state?: string;
    input?: unknown;
    output?: unknown;
    errorText?: string;
    url?: string;
    title?: string;
    filename?: string;
    mediaType?: string;
  }>;
}

function toolStatus(state?: string, errorText?: string): ToolStatus {
  if (errorText || state === 'output-error') return 'error';
  if (state === 'output-available') return 'complete';
  if (state === 'input-available') return 'running';
  return 'pending';
}

function toChatMessages(uiMessages: UIMessageLike[]): ChatMessage[] {
  return uiMessages
    .filter((message) => message.role === 'user' || message.role === 'assistant')
    .map((message) => {
      const parts: ChatPart[] = [];
      let sources: ChatSourcesPart | null = null;

      for (const part of message.parts) {
        if (part.type === 'text' && part.text !== undefined) {
          parts.push({ type: 'text', text: part.text });
        } else if (part.type === 'reasoning' && part.text !== undefined) {
          parts.push({ type: 'reasoning', text: part.text });
        } else if (part.type === 'file') {
          parts.push({
            type: 'file',
            name: part.filename ?? part.url?.split('/').pop() ?? 'file',
            url: part.url,
            mediaType: part.mediaType,
          });
        } else if (part.type === 'source-url' && part.url) {
          if (!sources) {
            sources = { type: 'sources', items: [] };
            parts.push(sources);
          }
          sources.items.push({ href: part.url, title: part.title ?? part.url });
        } else if (part.type.startsWith('tool-')) {
          parts.push({
            type: 'tool',
            name: part.type.slice('tool-'.length),
            status: toolStatus(part.state, part.errorText),
            input: part.input,
            output: part.errorText ?? part.output,
          });
        }
      }

      return { id: message.id, role: message.role as ChatRole, parts };
    });
}

const Chat = Object.assign(ChatRoot, {
  Thread: ChatThread,
  Message: ChatMessageItem,
  Pending: ChatPending,
  Suggestions: ChatSuggestions,
  Composer: ChatComposer,
});

export { Chat, toChatMessages, useChat };
export type {
  ChatComposerProps,
  ChatFeedback,
  ChatLabels,
  ChatMessage,
  ChatMessageProps,
  ChatPart,
  ChatPendingProps,
  ChatProps,
  ChatRole,
  ChatSendMessage,
  ChatStatus,
  ChatSuggestionsProps,
  ChatThreadProps,
};
