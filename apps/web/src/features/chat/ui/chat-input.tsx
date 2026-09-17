'use client';

import { PromptInput } from '@repo/ui/ai/prompt-input';
import { useTranslations } from 'next-intl';
import { ChatAttachment } from './chat-attachment';

interface ChatInputProps {
  isLoading: boolean;
  isStreaming: boolean;
  attachment: string | null;
  onRemoveAttachment: () => void;
  onSubmit: (text: string) => void;
  onStop: () => void;
}

export function ChatInput(props: ChatInputProps) {
  const { isLoading, isStreaming, attachment, onRemoveAttachment, onSubmit, onStop } = props;
  const t = useTranslations('components.chat');

  const status = isStreaming ? 'streaming' : isLoading ? 'submitted' : 'ready';

  return (
    <div className="relative z-10 w-full px-4 pb-4">
      <PromptInput
        clearOnSubmit={!isLoading}
        onSubmit={(message) => {
          if (isLoading) return;
          onSubmit(message.text);
        }}
        className="border-rule focus-within:border-foreground/25 rounded-2xl"
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
            placeholder={t('input.placeholder')}
            aria-label={t('input.placeholder')}
          />
        </PromptInput.Body>
        <PromptInput.Footer className="justify-end">
          <PromptInput.Submit
            status={status}
            label={status === 'streaming' ? t('launcher.stop') : t('launcher.send')}
            disabled={status === 'submitted'}
            className="size-7"
            onClick={(event) => {
              if (status !== 'streaming') return;
              event.preventDefault();
              onStop();
            }}
          />
        </PromptInput.Footer>
      </PromptInput>
    </div>
  );
}
