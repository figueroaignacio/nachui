import { Typography } from '@repo/ui/components/typography';
import { Loading03Icon, SentIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';

interface ChatInputProps {
  message: string;
  isLoading: boolean;
  onMessageChange: (value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function ChatInput(props: ChatInputProps) {
  const { message, isLoading, onMessageChange, onSubmit, onKeyDown } = props;
  const t = useTranslations('components.chat');

  const disabled = isLoading || !message.trim();

  return (
    <form
      onSubmit={onSubmit}
      className="bg-background/80 border-rule relative z-10 w-full border-t px-4 py-4 backdrop-blur-md"
    >
      <div className="bg-background border-border/50 focus-within:border-foreground/20 focus-within:ring-ring/10 flex items-center gap-2 rounded-md border p-1 transition-all duration-200 focus-within:ring-2">
        <input
          value={message}
          disabled={isLoading}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t('input.placeholder')}
          aria-label={t('input.placeholder')}
          className="placeholder:text-muted-foreground/70 min-w-0 flex-1 bg-transparent px-2.5 py-1.5 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled}
          aria-label="Send message"
          className="bg-foreground text-background hover:bg-foreground/90 flex size-7 shrink-0 items-center justify-center rounded-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <HugeiconsIcon
              icon={Loading03Icon}
              size={14}
              className="animate-spin"
              aria-hidden="true"
            />
          ) : (
            <HugeiconsIcon icon={SentIcon} size={14} aria-hidden="true" />
          )}
        </button>
      </div>
      <Typography
        variant="p"
        className="text-muted-foreground mt-2 hidden px-0.5 text-[11px] lg:block"
      >
        {t('messages.helperText')}
      </Typography>
    </form>
  );
}
