'use client';

import { Suggestion } from '../../ai/suggestion';

export function Variants() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Suggestion.Group>
        <Suggestion suggestion="Outline" variant="outline" />
        <Suggestion suggestion="Secondary" variant="secondary" />
        <Suggestion suggestion="Ghost" variant="ghost" />
      </Suggestion.Group>
      <Suggestion.Group>
        <Suggestion suggestion="Small" size="sm" />
        <Suggestion suggestion="Medium" size="md" />
        <Suggestion suggestion="Large" size="lg" />
      </Suggestion.Group>
    </div>
  );
}
