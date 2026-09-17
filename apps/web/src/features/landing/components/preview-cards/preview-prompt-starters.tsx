'use client';

import { Shimmer } from '@repo/ui/ai/shimmer';
import { Suggestion } from '@repo/ui/ai/suggestion';
import { Card } from '@repo/ui/components/card';

const STARTERS = [
  'Summarise this PR',
  'Find the slow query',
  'Write the migration',
  'Explain this stack trace',
];

export function PreviewPromptStarters() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">Start a thread</Card.Title>
        <Card.Description className="text-xs">Pick one, or just start typing.</Card.Description>
      </Card.Header>
      <Card.Content compact className="mt-4 space-y-4">
        <Suggestion.Group className="flex-wrap overflow-x-visible">
          {STARTERS.map((starter) => (
            <Suggestion key={starter} suggestion={starter} size="sm" />
          ))}
        </Suggestion.Group>
        <Shimmer className="text-[11px]">Indexing 1,204 files in your workspace</Shimmer>
      </Card.Content>
    </Card>
  );
}
