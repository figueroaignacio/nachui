'use client';

import { PromptInput } from '@repo/ui/ai/prompt-input';
import { Card } from '@repo/ui/components/card';
import { Kbd } from '@repo/ui/components/kbd';

export function PreviewAiComposer() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">Ask the codebase</Card.Title>
        <Card.Description className="text-xs">
          Drop a file or paste a stack trace to give it context.
        </Card.Description>
      </Card.Header>
      <Card.Content compact className="mt-4 space-y-2.5">
        <PromptInput>
          <PromptInput.Body>
            <PromptInput.Textarea
              placeholder="Why does the build fail on CI but not locally?"
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
        <p className="text-muted-foreground flex items-center gap-1.5 text-[10px]">
          <Kbd size="sm">⏎</Kbd> to send, <Kbd size="sm">⇧⏎</Kbd> for a new line
        </p>
      </Card.Content>
    </Card>
  );
}
