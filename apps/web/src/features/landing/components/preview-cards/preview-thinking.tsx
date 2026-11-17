'use client';

import { ChainOfThought } from '@repo/ui/ai/chain-of-thought';
import { Card } from '@repo/ui/components/card';

export function PreviewThinking() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">How it got here</Card.Title>
        <Card.Description className="text-xs">Every step the assistant took.</Card.Description>
      </Card.Header>
      <Card.Content compact>
        <ChainOfThought defaultOpen>
          <ChainOfThought.Header>Chain of thought</ChainOfThought.Header>
          <ChainOfThought.Content>
            <ChainOfThought.Step
              label="Read your dates and budget"
              description="Four nights in November, up to $160 a night."
              status="complete"
            />
            <ChainOfThought.Step label="Compared 12 stays" status="complete">
              <ChainOfThought.SearchResults>
                <ChainOfThought.SearchResult>Lakeside cabin</ChainOfThought.SearchResult>
                <ChainOfThought.SearchResult>Forest loft</ChainOfThought.SearchResult>
              </ChainOfThought.SearchResults>
            </ChainOfThought.Step>
            <ChainOfThought.Step label="Ordering the days" status="active" />
          </ChainOfThought.Content>
        </ChainOfThought>
      </Card.Content>
    </Card>
  );
}
