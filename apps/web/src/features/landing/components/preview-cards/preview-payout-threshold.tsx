'use client';

import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { Label } from '@repo/ui/components/label';
import { Progress } from '@repo/ui/components/progress';
import { Select } from '@repo/ui/components/select';

export function PreviewPayoutThreshold() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">Payout Threshold</Card.Title>
        <Card.Description className="text-xs">
          Set the minimum balance required before a payout is triggered.
        </Card.Description>
      </Card.Header>
      <Card.Content compact className="mt-4 space-y-5">
        <div className="space-y-1.5">
          <Label className="text-xs">Preferred Currency</Label>
          <Select defaultValue="usd">
            <Select.Trigger aria-label="Preferred currency" />
            <Select.Content>
              <Select.Item value="usd">USD, United States Dollar</Select.Item>
              <Select.Item value="eur">EUR, Euro</Select.Item>
              <Select.Item value="gbp">GBP, British Pound</Select.Item>
            </Select.Content>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-foreground text-xs font-medium">Minimum Payout Amount</span>
            <span className="text-foreground text-lg font-bold tracking-tight">$2,500.00</span>
          </div>
          <Progress value={25} aria-label="Minimum payout amount" />
          <div className="text-muted-foreground flex justify-between text-[10px]">
            <span>$50 (MIN)</span>
            <span>$10,000 (MAX)</span>
          </div>
        </div>
      </Card.Content>
      <Card.Footer compact className="mt-2">
        <Button size="sm" variant="secondary" fullWidth>
          Save Threshold
        </Button>
      </Card.Footer>
    </Card>
  );
}
