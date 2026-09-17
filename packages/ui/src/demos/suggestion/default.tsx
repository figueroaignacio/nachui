'use client';

import { Suggestion } from '../../ai/suggestion';

const SUGGESTIONS = [
  'How do I install NachUI?',
  'Show me the prompt input',
  'What is a brick?',
  'Explain the registry pipeline',
  'How does theming work?',
];

export function Default() {
  return (
    <div className="w-full max-w-md">
      <Suggestion.Group>
        {SUGGESTIONS.map((suggestion) => (
          <Suggestion key={suggestion} suggestion={suggestion} />
        ))}
      </Suggestion.Group>
    </div>
  );
}
