'use client';

import { Suggestion } from '@repo/ui/ai/suggestion';
import { Typography } from '@repo/ui/components/typography';
import { useTranslations } from 'next-intl';

interface ChatSuggestionsProps {
  onSuggestionClick: (text: string) => void;
}

export function ChatSuggestions({ onSuggestionClick }: ChatSuggestionsProps) {
  const t = useTranslations('components.chat.suggestions');

  const suggestions = [t('howWorks'), t('technologies'), t('features'), t('getStarted')];

  return (
    <div className="chat-welcome flex flex-col justify-center gap-4 py-4">
      <div className="chat-welcome-item" style={{ '--cascade-i': 0 } as React.CSSProperties}>
        <Typography variant="h3" className="text-foreground mb-1 text-sm font-semibold">
          {t('title')}
        </Typography>
        <Typography variant="p" className="text-muted-foreground text-xs">
          {t('subtitle')}
        </Typography>
      </div>

      <Suggestion.Group className="flex-wrap overflow-x-visible">
        {suggestions.map((text, index) => (
          <Suggestion
            key={text}
            suggestion={text}
            onClick={onSuggestionClick}
            size="sm"
            className="chat-welcome-item border-rule text-foreground/70 hover:text-foreground max-w-full whitespace-normal"
            style={{ '--cascade-i': index + 1 } as React.CSSProperties}
          />
        ))}
      </Suggestion.Group>
    </div>
  );
}
