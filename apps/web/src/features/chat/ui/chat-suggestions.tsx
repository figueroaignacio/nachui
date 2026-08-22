import { Typography } from '@repo/ui/components/typography';
import { useTranslations } from 'next-intl';

interface ChatSuggestionsProps {
  onSuggestionClick: (text: string) => void;
}

export function ChatSuggestions({ onSuggestionClick }: ChatSuggestionsProps) {
  const t = useTranslations('components.chat.suggestions');

  const suggestions = [t('howWorks'), t('technologies'), t('features'), t('getStarted')];

  return (
    <div className="chat-welcome flex flex-col justify-center space-y-4 py-4">
      <div className="chat-welcome-item" style={{ '--cascade-i': 0 } as React.CSSProperties}>
        <Typography variant="h3" className="text-foreground mb-1 text-sm font-semibold">
          {t('title')}
        </Typography>
        <Typography variant="p" className="text-muted-foreground text-xs">
          {t('subtitle')}
        </Typography>
      </div>

      <div className="flex flex-col">
        {suggestions.map((text, index) => (
          <button
            type="button"
            key={text}
            onClick={() => onSuggestionClick(text)}
            style={{ '--cascade-i': index + 1 } as React.CSSProperties}
            className="chat-welcome-item group border-rule/60 flex w-full cursor-pointer items-baseline gap-3 border-b py-2.5 text-left last:border-b-0"
          >
            <span className="text-muted-foreground/40 group-hover:text-foreground/60 font-mono text-[10px] tracking-[0.12em] tabular-nums transition-colors">
              {String(index + 1).padStart(2, '0')}
            </span>
            <Typography
              variant="small"
              className="text-foreground/70 group-hover:text-foreground text-left text-[13px] leading-snug font-medium transition-[color,translate] group-hover:translate-x-0.5"
            >
              {text}
            </Typography>
          </button>
        ))}
      </div>
    </div>
  );
}
