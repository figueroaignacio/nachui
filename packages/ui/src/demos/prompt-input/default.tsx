'use client';

import { useState } from 'react';
import { PromptInput, type PromptInputMessage } from '../../ai/prompt-input';

export function Default() {
  const [sent, setSent] = useState<string | null>(null);

  const handleSubmit = (message: PromptInputMessage) => {
    setSent(message.text);
  };

  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <PromptInput onSubmit={handleSubmit}>
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
      {sent && <p className="text-muted-foreground text-xs">Submitted: {sent}</p>}
    </div>
  );
}
