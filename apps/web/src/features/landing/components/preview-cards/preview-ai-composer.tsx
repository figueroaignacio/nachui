'use client';

import { PromptInput } from '@repo/ui/ai/prompt-input';
import { Card } from '@repo/ui/components/card';
import { Kbd } from '@repo/ui/components/kbd';

export function PreviewAiComposer() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">Plan your trip</Card.Title>
        <Card.Description className="text-xs">
          Add a photo or a link to give it context.
        </Card.Description>
      </Card.Header>
      <Card.Content compact className="space-y-2.5">
        <PromptInput className="rounded-md">
          <PromptInput.Body>
            <PromptInput.Textarea
              placeholder="Three days by the lake, on a budget"
              className="text-xs"
            />
          </PromptInput.Body>
          <PromptInput.Footer>
            <PromptInput.Tools>
              <PromptInput.AddAttachments />
              <PromptInput.Button label="Model">claude-opus-5</PromptInput.Button>
            </PromptInput.Tools>
            <PromptInput.Submit />
          </PromptInput.Footer>
        </PromptInput>
        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Kbd size="sm">⏎</Kbd> to send, <Kbd size="sm">⇧⏎</Kbd> for a new line
        </p>
      </Card.Content>
    </Card>
  );
}
