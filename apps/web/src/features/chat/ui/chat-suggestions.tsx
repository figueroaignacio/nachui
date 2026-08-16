import { BulbIcon, CodeIcon, Comment01Icon, SparklesIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Typography } from '@repo/ui/components/typography';
import { useTranslations } from 'next-intl';

interface ChatSuggestionsProps {
  onSuggestionClick: (text: string) => void;
}

export function ChatSuggestions({ onSuggestionClick }: ChatSuggestionsProps) {
  const t = useTranslations('components.chat.suggestions');

  const suggestions = [
    {
      icon: Comment01Icon,
      text: t('howWorks'),
    },
    {
      icon: CodeIcon,
      text: t('technologies'),
    },
    {
      icon: SparklesIcon,
      text: t('features'),
    },
    {
      icon: BulbIcon,
      text: t('getStarted'),
    },
  ];

  return (
    <div className="flex flex-col justify-center space-y-4 py-4">
      <div>
        <Typography variant="h3" className="text-foreground mb-1 text-sm font-semibold">
          {t('title')}
        </Typography>
        <Typography variant="p" className="text-muted-foreground text-xs">
          {t('subtitle')}
        </Typography>
      </div>
      {/* One per row: the panel is narrow, and pills wrapping mid-question
          read as broken rather than compact. */}
      <div className="flex flex-col gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            type="button"
            key={index}
            onClick={() => onSuggestionClick(suggestion.text)}
            className="group border-border/50 bg-secondary/20 hover:border-border hover:bg-secondary/40 flex w-full cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors"
          >
            <HugeiconsIcon
              icon={suggestion.icon}
              size={14}
              className="text-muted-foreground group-hover:text-foreground transition-colors"
            />
            <Typography
              variant="small"
              className="text-foreground/70 group-hover:text-foreground text-left text-[13px] leading-snug font-medium transition-colors"
            >
              {suggestion.text}
            </Typography>
          </button>
        ))}
      </div>
    </div>
  );
}
