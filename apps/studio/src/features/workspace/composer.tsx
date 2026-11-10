'use client';

import { PromptInput, type PromptInputStatus } from '@repo/ui/ai/prompt-input';
import * as React from 'react';
import { ModelPicker } from '@/features/shell/model-picker';
import type { StudioModel } from '@/lib/types';

export function Composer({
  status,
  model,
  onModelChange,
  onSend,
  onStop,
  disabled,
  placeholder = 'Ask for a change',
}: {
  status: PromptInputStatus;
  model: StudioModel;
  onModelChange: (model: StudioModel) => void;
  onSend: (text: string) => void;
  onStop: () => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <PromptInput
      status={status}
      disabled={disabled}
      className="bg-card shadow-lg"
      onSubmit={(message) => {
        const text = message.text.trim();
        if (text) onSend(text);
      }}
    >
      <PromptInput.Body>
        <PromptInput.Textarea aria-label={placeholder} placeholder={placeholder} />
      </PromptInput.Body>
      <PromptInput.Footer>
        <PromptInput.Tools>
          <ModelPicker value={model} onValueChange={onModelChange} disabled={disabled} />
        </PromptInput.Tools>
        <PromptInput.Submit status={status} onStop={onStop} />
      </PromptInput.Footer>
    </PromptInput>
  );
}
