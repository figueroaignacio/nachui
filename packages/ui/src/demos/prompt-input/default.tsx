'use client';

import { useState } from 'react';
import { PromptInput, type PromptInputMessage } from '../../ai/prompt-input';
import { usePlayback } from '../../lib/use-playback';

const DRAFT = 'Why did checkout lose a cent on discounted orders?';
const TYPED = Math.ceil(DRAFT.length / 2);
const SUBMITTED = TYPED + 6;
const STREAMING = SUBMITTED + 8;
const TOTAL = STREAMING + 22;

export function Default() {
  const [value, setValue] = useState('');
  const [sent, setSent] = useState<string | null>(null);
  const { step, playing, rootProps } = usePlayback(TOTAL, 60);

  const handleSubmit = (message: PromptInputMessage) => {
    setSent(message.text);
    setValue('');
  };

  const status =
    !playing || step < SUBMITTED ? 'ready' : step < STREAMING ? 'submitted' : 'streaming';
  const draft = step < SUBMITTED ? DRAFT.slice(0, step * 2) : '';
  const note = playing ? (step >= SUBMITTED ? DRAFT : null) : sent;

  return (
    <div {...rootProps} className="flex w-full max-w-lg flex-col gap-3">
      <PromptInput
        value={playing ? draft : value}
        onValueChange={setValue}
        status={status}
        onSubmit={handleSubmit}
      >
        <PromptInput.Body>
          <PromptInput.Textarea placeholder="Ask about any component…" />
        </PromptInput.Body>
        <PromptInput.Footer>
          <PromptInput.Tools>
            <PromptInput.AddAttachments />
          </PromptInput.Tools>
          <PromptInput.Submit />
        </PromptInput.Footer>
      </PromptInput>
      <p className="text-muted-foreground min-h-4 text-xs">{note ? `Submitted: ${note}` : null}</p>
    </div>
  );
}
