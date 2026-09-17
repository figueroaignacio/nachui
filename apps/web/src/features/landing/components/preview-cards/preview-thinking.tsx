'use client';

import { ChainOfThought } from '@repo/ui/ai/chain-of-thought';
import { Card } from '@repo/ui/components/card';

export function PreviewThinking() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">Why this answer</Card.Title>
        <Card.Description className="text-xs">Every source the agent opened.</Card.Description>
      </Card.Header>
      <Card.Content compact className="mt-4">
        <ChainOfThought defaultOpen>
          <ChainOfThought.Header>Chain of thought</ChainOfThought.Header>
          <ChainOfThought.Content>
            <ChainOfThought.Step
              label="Parsed the question"
              description="Wants a dark mode toggle with no flash on first paint."
              status="complete"
            />
            <ChainOfThought.Step label="Searched the docs" status="complete">
              <ChainOfThought.SearchResults>
                <ChainOfThought.SearchResult>concepts/dark-mode</ChainOfThought.SearchResult>
                <ChainOfThought.SearchResult>concepts/theming</ChainOfThought.SearchResult>
              </ChainOfThought.SearchResults>
            </ChainOfThought.Step>
            <ChainOfThought.Step label="Drafting the snippet" status="active" />
          </ChainOfThought.Content>
        </ChainOfThought>
      </Card.Content>
    </Card>
  );
}
