'use client';

import { Suggestion } from '../../ai/suggestion';
import { usePlayback } from '../../lib/use-playback';

const SUGGESTIONS = [
  'How do I install NachUI?',
  'Show me the prompt input',
  'What is a brick?',
  'Explain the registry pipeline',
  'How does theming work?',
];

export function Default() {
  const { step, rootProps } = usePlayback(SUGGESTIONS.length, 220);

  return (
    <div {...rootProps} className="min-h-9 w-full max-w-md">
      <Suggestion.Group>
        {SUGGESTIONS.slice(0, step).map((suggestion) => (
          <Suggestion key={suggestion} suggestion={suggestion} />
        ))}
      </Suggestion.Group>
    </div>
  );
}
