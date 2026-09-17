'use client';

import { useState } from 'react';
import { PromptInput, type PromptInputStatus } from '../../ai/prompt-input';

const STATUSES: PromptInputStatus[] = ['ready', 'submitted', 'streaming', 'error'];

export function Statuses() {
  const [status, setStatus] = useState<PromptInputStatus>('ready');

  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setStatus(value)}
            data-active={status === value ? '' : undefined}
            className="border-border hover:bg-muted data-active:bg-muted rounded-full border px-3 py-1 text-xs transition-colors"
          >
            {value}
          </button>
        ))}
      </div>
      <PromptInput>
        <PromptInput.Body>
          <PromptInput.Textarea placeholder="The submit button reflects the status…" />
        </PromptInput.Body>
        <PromptInput.Footer>
          <PromptInput.Tools>
            <PromptInput.AddAttachments />
          </PromptInput.Tools>
          <PromptInput.Submit status={status} disabled={status !== 'ready'} />
        </PromptInput.Footer>
      </PromptInput>
    </div>
  );
}
