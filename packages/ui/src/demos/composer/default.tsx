'use client';

import { useState } from 'react';
import { Composer, type ComposerMessage } from '../../hybrids/composer';

const MODELS = [
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', description: 'Fast, cheap, most turns' },
  { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', description: 'Slower, for hard questions' },
  { id: 'claude-sonnet-5', label: 'Claude Sonnet 5', description: 'Long context, careful' },
];

const SUGGESTIONS = ['What is NachUI?', 'Install the CLI', 'Show me a chat example'];

export function Default() {
  const [model, setModel] = useState(MODELS[0]?.id ?? '');
  const [sent, setSent] = useState<ComposerMessage | null>(null);

  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <Composer
        onSend={setSent}
        suggestions={SUGGESTIONS}
        models={MODELS}
        model={model}
        onModelChange={setModel}
        context={{ used: 12400, max: 128000 }}
        placeholder="Ask about any component…"
      />
      {sent && (
        <p className="text-muted-foreground text-xs">
          Sent “{sent.text}” with {sent.files.length} file{sent.files.length === 1 ? '' : 's'}
        </p>
      )}
    </div>
  );
}
