'use client';

import { Context } from '@repo/ui/ai/context';
import { Card } from '@repo/ui/components/card';

export function PreviewContextWindow() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Description className="text-xs">Context window</Card.Description>
        <Card.Title className="text-3xl font-bold tracking-tight">84.3K</Card.Title>
      </Card.Header>
      <Card.Content compact className="mt-4">
        <Context
          maxTokens={200000}
          usedTokens={84320}
          className="w-full flex-col items-stretch gap-4"
        >
          <div className="flex items-center justify-between gap-2">
            <Context.Trigger />
            <span className="text-muted-foreground text-[11px]">of 200K</span>
          </div>
          <div className="bg-surface-muted space-y-2 rounded-md p-3.5">
            <Context.Usage label="Input" tokens={61200} />
            <Context.Usage label="Output" tokens={14100} tone="info" />
            <Context.Usage label="Reasoning" tokens={6800} tone="warning" />
            <Context.Usage label="Cached" tokens={2220} tone="success" />
          </div>
        </Context>
      </Card.Content>
    </Card>
  );
}
