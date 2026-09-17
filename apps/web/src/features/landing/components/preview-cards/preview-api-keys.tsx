'use client';

import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { Switch } from '@repo/ui/components/switch';
import { TrashIcon } from '@repo/ui/icons/trash';

const keys = [
  { label: 'Production', token: 'sk_live_··········4f2a', active: true },
  { label: 'Staging', token: 'sk_test_··········9c01', active: true },
  { label: 'Local', token: 'sk_test_··········1e77', active: false },
];

export function PreviewApiKeys() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">API keys</Card.Title>
        <Card.Description className="text-xs">
          Rotating a key revokes the old one right away.
        </Card.Description>
      </Card.Header>
      <Card.Content compact className="mt-4 space-y-1">
        {keys.map((key) => (
          <div
            key={key.label}
            className="border-rule flex items-center gap-3 border-b py-2.5 last:border-b-0"
          >
            <div className="min-w-0 flex-1">
              <div className="text-foreground text-xs font-medium">{key.label}</div>
              <div className="text-muted-foreground truncate font-mono text-[11px]">
                {key.token}
              </div>
            </div>
            <Switch defaultChecked={key.active} aria-label={`${key.label} key enabled`} />
            <Button
              size="icon"
              variant="ghost"
              aria-label={`Delete the ${key.label} key`}
              className="text-muted-foreground hover:text-destructive-text size-7"
            >
              <TrashIcon size={14} />
            </Button>
          </div>
        ))}
      </Card.Content>
    </Card>
  );
}
