'use client';

import * as React from 'react';
import { Attachments } from '../ai/attachments';
import { Context } from '../ai/context';
import {
  PromptInput,
  usePromptInput,
  usePromptInputAttachments,
  type PromptInputMessage,
  type PromptInputStatus,
} from '../ai/prompt-input';
import { Suggestion } from '../ai/suggestion';
import { DropdownMenu } from '../components/dropdown-menu';
import { cn } from '../lib/cn';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function ChevronDownIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function SquareIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="7" y="7" width="10" height="10" rx="2" />
    </svg>
  );
}

function CheckIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

type ComposerStatus = PromptInputStatus;

interface ComposerMessage {
  text: string;
  files: File[];
}

interface ComposerModel {
  id: string;
  label: string;
  description?: string;
}

interface ComposerContextUsage {
  used: number;
  max: number;
}

interface ComposerLabels {
  send: string;
  stop: string;
  attach: string;
  model: string;
}

const DEFAULT_LABELS: ComposerLabels = {
  send: 'Send message',
  stop: 'Stop generating',
  attach: 'Add files',
  model: 'Model',
};

interface ComposerContextValue {
  status: ComposerStatus;
  disabled: boolean;
  labels: ComposerLabels;
  placeholder: string;
  suggestions: string[];
  sendOnSuggestion: boolean;
  models: ComposerModel[];
  model: string | undefined;
  onModelChange: ((model: string) => void) | undefined;
  context: ComposerContextUsage | undefined;
  onStop: (() => void) | undefined;
  send: (message: ComposerMessage) => void;
}

const ComposerContext = React.createContext<ComposerContextValue | null>(null);

const useComposer = (): ComposerContextValue => {
  const context = React.use(ComposerContext);
  if (!context) {
    throw new Error('Composer components must be used within Composer');
  }
  return context;
};

interface ComposerProps extends Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'onSubmit' | 'onError' | 'value' | 'defaultValue'
> {
  onSend: (message: ComposerMessage) => void;
  onStop?: () => void;
  status?: ComposerStatus;
  placeholder?: string;
  disabled?: boolean;
  maxFiles?: number;
  accept?: string;
  suggestions?: string[];
  sendOnSuggestion?: boolean;
  models?: ComposerModel[];
  model?: string;
  onModelChange?: (model: string) => void;
  context?: ComposerContextUsage;
  labels?: Partial<ComposerLabels>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

type ComposerSuggestionsProps = React.HTMLAttributes<HTMLDivElement>;
type ComposerAttachmentsProps = React.HTMLAttributes<HTMLDivElement>;
type ComposerInputProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'onChange'
>;
type ComposerFooterProps = React.HTMLAttributes<HTMLDivElement>;
type ComposerSendProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const ValueBridge = ({
  value,
  defaultValue,
  onValueChange,
}: Pick<ComposerProps, 'value' | 'defaultValue' | 'onValueChange'>) => {
  const { text, setText } = usePromptInput();
  const seeded = React.useRef(false);

  React.useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    if (value !== undefined) setText(value);
    else if (defaultValue) setText(defaultValue);
  }, [value, defaultValue, setText]);

  React.useEffect(() => {
    if (value !== undefined && value !== text) setText(value);
  }, [value, text, setText]);

  React.useEffect(() => {
    onValueChange?.(text);
  }, [text, onValueChange]);

  return null;
};

const ComposerRoot = ({
  className,
  onSend,
  onStop,
  status = 'ready',
  placeholder = 'Ask anything…',
  disabled = false,
  maxFiles,
  accept,
  suggestions = [],
  sendOnSuggestion = true,
  models = [],
  model,
  onModelChange,
  context,
  labels,
  value,
  defaultValue,
  onValueChange,
  children,
  ref,
  ...props
}: ComposerProps & { ref?: React.Ref<HTMLFormElement> }) => {
  const mergedLabels = React.useMemo<ComposerLabels>(
    () => ({ ...DEFAULT_LABELS, ...labels }),
    [labels],
  );

  const send = React.useCallback(
    (message: ComposerMessage) => {
      if (disabled || status === 'streaming' || status === 'submitted') return;
      onSend(message);
    },
    [disabled, status, onSend],
  );

  const handleSubmit = React.useCallback(
    (message: PromptInputMessage) => {
      send({ text: message.text.trim(), files: message.files.map((entry) => entry.file) });
    },
    [send],
  );

  const contextValue = React.useMemo<ComposerContextValue>(
    () => ({
      status,
      disabled,
      labels: mergedLabels,
      placeholder,
      suggestions,
      sendOnSuggestion,
      models,
      model,
      onModelChange,
      context,
      onStop,
      send,
    }),
    [
      status,
      disabled,
      mergedLabels,
      placeholder,
      suggestions,
      sendOnSuggestion,
      models,
      model,
      onModelChange,
      context,
      onStop,
      send,
    ],
  );

  return (
    <ComposerContext value={contextValue}>
      <PromptInput
        ref={ref}
        onSubmit={handleSubmit}
        multiple
        maxFiles={maxFiles}
        accept={accept}
        data-status={status}
        className={cn(disabled && 'opacity-60', className)}
        {...props}
      >
        <ValueBridge value={value} defaultValue={defaultValue} onValueChange={onValueChange} />
        {children ?? (
          <>
            <ComposerSuggestions />
            <ComposerAttachments />
            <ComposerInput />
            <ComposerFooter>
              <ComposerSend />
            </ComposerFooter>
          </>
        )}
      </PromptInput>
    </ComposerContext>
  );
};

ComposerRoot.displayName = 'Composer';

const ComposerSuggestions = ({
  className,
  ref,
  ...props
}: ComposerSuggestionsProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { suggestions, sendOnSuggestion, send, disabled } = useComposer();
  const { text, setText } = usePromptInput();

  if (suggestions.length === 0 || text.trim().length > 0) return null;

  return (
    <PromptInput.Header ref={ref} className={cn('pt-2.5', className)} {...props}>
      <Suggestion.Group>
        {suggestions.map((suggestion) => (
          <Suggestion
            key={suggestion}
            suggestion={suggestion}
            size="sm"
            disabled={disabled}
            onClick={(picked) => {
              if (sendOnSuggestion) send({ text: picked, files: [] });
              else setText(picked);
            }}
          />
        ))}
      </Suggestion.Group>
    </PromptInput.Header>
  );
};

ComposerSuggestions.displayName = 'ComposerSuggestions';

const ComposerAttachments = ({
  className,
  ref,
  ...props
}: ComposerAttachmentsProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { files, remove } = usePromptInputAttachments();

  if (files.length === 0) return null;

  return (
    <PromptInput.Header ref={ref} className={cn('pt-2.5', className)} {...props}>
      <Attachments variant="inline">
        {files.map((file) => (
          <Attachments.Item
            key={file.id}
            data={{
              id: file.id,
              filename: file.filename,
              mediaType: file.mediaType,
              size: file.size,
              url: file.url,
            }}
            onRemove={() => remove(file.id)}
          >
            <Attachments.Preview />
            <Attachments.Info />
            <Attachments.Remove label={`Remove ${file.filename}`} />
          </Attachments.Item>
        ))}
      </Attachments>
    </PromptInput.Header>
  );
};

ComposerAttachments.displayName = 'ComposerAttachments';

const ComposerInput = ({
  className,
  onKeyDown,
  ref,
  ...props
}: ComposerInputProps & { ref?: React.Ref<HTMLTextAreaElement> }) => {
  const { placeholder, disabled } = useComposer();
  const { setText } = usePromptInput();

  return (
    <PromptInput.Body>
      <PromptInput.Textarea
        ref={ref}
        placeholder={placeholder}
        disabled={disabled}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if (event.key === 'Escape') {
            event.preventDefault();
            setText('');
          }
        }}
        className={className}
        {...props}
      />
    </PromptInput.Body>
  );
};

ComposerInput.displayName = 'ComposerInput';

const ComposerModelPicker = () => {
  const { models, model, onModelChange, labels, disabled } = useComposer();

  if (models.length === 0) return null;

  const current = models.find((entry) => entry.id === model) ?? models[0];

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <PromptInput.Button label={labels.model} variant="ghost" disabled={disabled}>
          <span className="font-mono">{current?.label}</span>
          <ChevronDownIcon size={14} className="text-muted-foreground" />
        </PromptInput.Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start" className="w-56">
        {models.map((entry) => (
          <DropdownMenu.Item key={entry.id} onSelect={() => onModelChange?.(entry.id)}>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-mono text-xs">{entry.label}</span>
              {entry.description ? (
                <span className="text-muted-foreground truncate text-[11px]">
                  {entry.description}
                </span>
              ) : null}
            </span>
            {entry.id === current?.id ? (
              <CheckIcon size={14} className="text-foreground shrink-0" />
            ) : null}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

ComposerModelPicker.displayName = 'ComposerModelPicker';

const ComposerFooter = ({
  className,
  children,
  ref,
  ...props
}: ComposerFooterProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { labels, disabled, context } = useComposer();

  return (
    <PromptInput.Footer ref={ref} className={className} {...props}>
      <PromptInput.Tools>
        <PromptInput.AddAttachments label={labels.attach} disabled={disabled} />
        <ComposerModelPicker />
      </PromptInput.Tools>
      <PromptInput.Tools className="gap-2">
        {context ? (
          <Context maxTokens={context.max} usedTokens={context.used}>
            <Context.Trigger />
            <Context.Content align="end" side="top">
              <Context.Header />
            </Context.Content>
          </Context>
        ) : null}
        {children ?? <ComposerSend />}
      </PromptInput.Tools>
    </PromptInput.Footer>
  );
};

ComposerFooter.displayName = 'ComposerFooter';

const ComposerSend = ({
  className,
  ref,
  ...props
}: ComposerSendProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { status, labels, disabled, onStop } = useComposer();

  if (status === 'streaming') {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={labels.stop}
        title={labels.stop}
        data-status={status}
        disabled={disabled}
        onClick={() => onStop?.()}
        className={cn(
          'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 [&>svg]:size-4 [&>svg]:shrink-0',
          className,
        )}
        {...props}
      >
        <SquareIcon />
      </button>
    );
  }

  return (
    <PromptInput.Submit
      ref={ref}
      status={status}
      label={labels.send}
      disabled={disabled || status === 'submitted' ? true : undefined}
      className={className}
      {...props}
    />
  );
};

ComposerSend.displayName = 'ComposerSend';

const Composer = Object.assign(ComposerRoot, {
  Suggestions: ComposerSuggestions,
  Attachments: ComposerAttachments,
  Input: ComposerInput,
  Footer: ComposerFooter,
  Send: ComposerSend,
});

export { Composer, useComposer };
export type {
  ComposerAttachmentsProps,
  ComposerContextUsage,
  ComposerFooterProps,
  ComposerInputProps,
  ComposerLabels,
  ComposerMessage,
  ComposerModel,
  ComposerProps,
  ComposerSendProps,
  ComposerStatus,
  ComposerSuggestionsProps,
};
