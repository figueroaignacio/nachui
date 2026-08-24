import { ArrowUp01Icon, StopIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ChatAttachment } from './chat-attachment';

interface ChatInputProps {
  message: string;
  isLoading: boolean;
  attachment: string | null;
  onRemoveAttachment: () => void;
  onMessageChange: (value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function ChatInput(props: ChatInputProps) {
  const {
    message,
    isLoading,
    attachment,
    onRemoveAttachment,
    onMessageChange,
    onSubmit,
    onKeyDown,
  } = props;
  const t = useTranslations('components.chat');
  const [isFocused, setIsFocused] = useState(false);

  const canSend = !isLoading && message.trim().length > 0;

  return (
    <form onSubmit={onSubmit} className="relative z-10 w-full px-4 pb-4">
      <div
        className={cn(
          'bg-background border-rule rounded-2xl border px-4 py-3 transition-colors duration-200',
          isFocused && 'border-foreground/25',
        )}
      >
        {attachment && (
          <div className="mb-2">
            <ChatAttachment text={attachment} onRemove={onRemoveAttachment} />
          </div>
        )}
        <textarea
          rows={1}
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={t('input.placeholder')}
          aria-label={t('input.placeholder')}
          className="placeholder:text-muted-foreground/80 max-h-32 w-full resize-none bg-transparent text-sm leading-relaxed outline-none"
        />
        <div className="mt-1 flex items-center justify-end">
          <button
            type="submit"
            disabled={!canSend}
            aria-label={t('launcher.send')}
            className="text-muted-foreground hover:text-foreground flex size-5 shrink-0 items-center justify-center transition-colors disabled:pointer-events-none disabled:opacity-40"
          >
            <HugeiconsIcon
              icon={isLoading ? StopIcon : ArrowUp01Icon}
              size={16}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </form>
  );
}
