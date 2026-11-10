'use client';

import { ModelSelector } from '../../ai/model-selector';
import { PromptInput } from '../../ai/prompt-input';

export function InPromptInput() {
  return (
    <div className="w-full max-w-lg">
      <PromptInput onSubmit={() => undefined}>
        <PromptInput.Body>
          <PromptInput.Textarea placeholder="Ask about any component" />
        </PromptInput.Body>
        <PromptInput.Footer>
          <PromptInput.Tools>
            <PromptInput.AddAttachments />
            <ModelSelector defaultValue="standard">
              <ModelSelector.Trigger aria-label="Model" />
              <ModelSelector.Content>
                <ModelSelector.Item value="pro" description="Best for hard problems, slower">
                  Pro
                </ModelSelector.Item>
                <ModelSelector.Item value="standard" description="Balanced for everyday work">
                  Standard
                </ModelSelector.Item>
                <ModelSelector.Item value="lite" description="Fastest, for quick answers">
                  Lite
                </ModelSelector.Item>
              </ModelSelector.Content>
            </ModelSelector>
          </PromptInput.Tools>
          <PromptInput.Submit />
        </PromptInput.Footer>
      </PromptInput>
    </div>
  );
}
