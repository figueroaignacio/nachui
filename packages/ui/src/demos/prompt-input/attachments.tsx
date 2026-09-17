'use client';

import { PromptInput } from '../../ai/prompt-input';

export function Attachments() {
  return (
    <div className="w-full max-w-lg">
      <PromptInput accept="image/*,.pdf,.md" multiple maxFiles={4} globalDrop>
        <PromptInput.Header>
          <PromptInput.Attachments />
        </PromptInput.Header>
        <PromptInput.Body>
          <PromptInput.Textarea placeholder="Drop a file anywhere, or use the clip…" />
        </PromptInput.Body>
        <PromptInput.Footer>
          <PromptInput.Tools>
            <PromptInput.AddAttachments />
            <PromptInput.Button label="Model">gpt-5</PromptInput.Button>
          </PromptInput.Tools>
          <PromptInput.Submit />
        </PromptInput.Footer>
      </PromptInput>
    </div>
  );
}
