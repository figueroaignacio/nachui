'use client';

import { ChainOfThought, type ChainOfThoughtStatus } from '../../ai/chain-of-thought';
import { usePlayback } from '../../lib/use-playback';

export function Default() {
  const { step, rootProps } = usePlayback(4, 1100);

  const statusOf = (index: number): ChainOfThoughtStatus =>
    index < step ? 'complete' : index === step ? 'active' : 'pending';

  return (
    <div {...rootProps} className="w-full max-w-md">
      <ChainOfThought defaultOpen>
        <ChainOfThought.Header />
        <ChainOfThought.Content>
          <ChainOfThought.Step label="Understanding the request" status={statusOf(0)}>
            <span className="text-muted-foreground text-xs">
              The user wants a dark mode toggle that does not flash on first paint.
            </span>
          </ChainOfThought.Step>
          <ChainOfThought.Step
            label="Searching the documentation"
            description="Looking for the theming and dark mode pages"
            status={statusOf(1)}
          >
            {step >= 2 ? (
              <ChainOfThought.SearchResults>
                <ChainOfThought.SearchResult>docs/concepts/dark-mode</ChainOfThought.SearchResult>
                <ChainOfThought.SearchResult>docs/concepts/theming</ChainOfThought.SearchResult>
                <ChainOfThought.SearchResult>nach-themes</ChainOfThought.SearchResult>
              </ChainOfThought.SearchResults>
            ) : null}
          </ChainOfThought.Step>
          <ChainOfThought.Step label="Writing the answer" status={statusOf(2)} />
          <ChainOfThought.Step label="Checking the snippet compiles" status={statusOf(3)} />
        </ChainOfThought.Content>
      </ChainOfThought>
    </div>
  );
}
