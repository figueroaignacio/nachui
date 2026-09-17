'use client';

import { Card } from '@repo/ui/components/card';
import { Label } from '@repo/ui/components/label';
import { Progress } from '@repo/ui/components/progress';
import { Select } from '@repo/ui/components/select';
import { Switch } from '@repo/ui/components/switch';

export function PreviewModelRouting() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">Model routing</Card.Title>
        <Card.Description className="text-xs">
          Cheap model first, escalate when it is not confident.
        </Card.Description>
      </Card.Header>
      <Card.Content compact className="mt-4 space-y-5">
        <div className="space-y-1.5">
          <Label className="text-xs">Default model</Label>
          <Select defaultValue="haiku">
            <Select.Trigger aria-label="Default model" />
            <Select.Content>
              <Select.Item value="haiku">Haiku 4.5, fastest</Select.Item>
              <Select.Item value="sonnet">Sonnet 5, balanced</Select.Item>
              <Select.Item value="opus">Opus 5, deepest</Select.Item>
            </Select.Content>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-foreground text-xs font-medium">Escalation threshold</span>
            <span className="text-foreground text-lg font-bold tracking-tight">68%</span>
          </div>
          <Progress value={68} aria-label="Escalation threshold" />
          <p className="text-muted-foreground text-[10px]">
            12% of turns escalated in the last 24 hours.
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-foreground text-xs font-medium">Stream tokens</div>
            <div className="text-muted-foreground text-[11px]">Show the answer as it arrives.</div>
          </div>
          <Switch defaultChecked aria-label="Stream tokens" />
        </div>
      </Card.Content>
    </Card>
  );
}
