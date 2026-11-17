'use client';

import { Suggestion } from '@repo/ui/ai/suggestion';
import { Card } from '@repo/ui/components/card';

const SUGGESTIONS = ['Plan a weekend for two', 'What if it rains?', 'Places to eat nearby'];

export function PreviewAiSuggestions() {
  return (
    <Card className="gap-3 p-4">
      <p className="text-foreground text-sm font-semibold">Try asking</p>
      <Suggestion.Group>
        {SUGGESTIONS.map((suggestion) => (
          <Suggestion key={suggestion} suggestion={suggestion} />
        ))}
      </Suggestion.Group>
    </Card>
  );
}
