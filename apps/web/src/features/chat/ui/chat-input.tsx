'use client';

import { PromptInput } from '@repo/ui/ai/prompt-input';
import { useTranslations } from 'next-intl';
import { ChatAttachment } from './chat-attachment';

interface ChatInputProps {
  isLoading: boolean;
  hasMessages: boolean;
  attachment: string | null;
  onRemoveAttachment: () => void;
  onSubmit: (text: string) => void;
  onStop: () => void;
}

export function ChatInput(props: ChatInputProps) {
  const { isLoading, hasMessages, attachment, onRemoveAttachment, onSubmit, onStop } = props;
  const t = useTranslations('components.chat');

  const placeholder = hasMessages ? t('input.followUp') : t('input.placeholder');

  return (
    <div className="relative z-10 w-full px-4 pb-4 max-md:px-3 max-md:pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <PromptInput
        clearOnSubmit={!isLoading}
        onSubmit={(message) => {
          if (isLoading) return;
          onSubmit(message.text);
        }}
        className="border-input focus-within:border-border-interactive rounded-md"
      >
        {attachment && (
          <PromptInput.Header>
            <ChatAttachment text={attachment} onRemove={onRemoveAttachment} />
          </PromptInput.Header>
        )}
        <PromptInput.Body>
          <PromptInput.Textarea
            data-autofocus
            maxRows={5}
            placeholder={placeholder}
            aria-label={placeholder}
          />
        </PromptInput.Body>
        <PromptInput.Footer
          className={hasMessages ? 'justify-end' : 'justify-end md:justify-between'}
        >
          {!hasMessages && (
            <span className="text-muted-foreground min-w-0 truncate ps-1 text-xs max-md:hidden">
              {t('input.hint')}
            </span>
          )}
          <PromptInput.Submit
            status={isLoading ? 'streaming' : 'ready'}
            label={isLoading ? t('launcher.stop') : t('launcher.send')}
            className="size-7 max-md:size-9"
            onStop={onStop}
          />
        </PromptInput.Footer>
      </PromptInput>
    </div>
  );
}
