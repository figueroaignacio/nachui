'use client';

import { ChainOfThought } from '../../ai/chain-of-thought';

export function Default() {
  return (
    <div className="w-full max-w-md">
      <ChainOfThought defaultOpen>
        <ChainOfThought.Header />
        <ChainOfThought.Content>
          <ChainOfThought.Step label="Understanding the request" status="complete">
            <span className="text-muted-foreground text-xs">
              The user wants a dark mode toggle that does not flash on first paint.
            </span>
          </ChainOfThought.Step>
          <ChainOfThought.Step
            label="Searching the documentation"
            description="Looking for the theming and dark mode pages"
            status="complete"
          >
            <ChainOfThought.SearchResults>
              <ChainOfThought.SearchResult>docs/concepts/dark-mode</ChainOfThought.SearchResult>
              <ChainOfThought.SearchResult>docs/concepts/theming</ChainOfThought.SearchResult>
              <ChainOfThought.SearchResult>nach-themes</ChainOfThought.SearchResult>
            </ChainOfThought.SearchResults>
          </ChainOfThought.Step>
          <ChainOfThought.Step label="Writing the answer" status="active" />
          <ChainOfThought.Step label="Checking the snippet compiles" status="pending" />
        </ChainOfThought.Content>
      </ChainOfThought>
    </div>
  );
}
