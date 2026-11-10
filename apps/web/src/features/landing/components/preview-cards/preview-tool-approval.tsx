'use client';

import { Confirmation } from '@repo/ui/ai/confirmation';
import { Badge } from '@repo/ui/components/badge';
import { Card } from '@repo/ui/components/card';
import { Checkbox } from '@repo/ui/components/checkbox';
import { TerminalIcon } from '@repo/ui/icons/terminal';

export function PreviewToolApproval() {
  return (
    <Card>
      <Card.Header compact>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-muted flex size-7 items-center justify-center rounded-sm">
              <TerminalIcon size={14} />
            </span>
            <span className="text-foreground font-mono text-xs font-medium">run_migration</span>
          </div>
          <Badge variant="warning" className="text-[10px]">
            Needs approval
          </Badge>
        </div>
      </Card.Header>
      <Card.Content compact className="space-y-3">
        <Confirmation className="border-0 bg-transparent p-0">
          <Confirmation.Title className="text-xs">
            Run this migration on staging?
          </Confirmation.Title>
          <pre className="bg-surface-muted border-border text-muted-strong overflow-hidden rounded-md border px-3 py-2.5 font-mono text-[11px] leading-relaxed">
            <span className="text-code-keyword">ALTER TABLE</span> invoices{'\n'}
            {'  '}
            <span className="text-code-keyword">ADD COLUMN</span> due_at{' '}
            <span className="text-code-function">timestamptz</span>;
          </pre>
          <div className="text-muted-strong flex items-center gap-2 text-xs">
            <Checkbox aria-label="Always allow on staging" />
            <span aria-hidden="true">Always allow on staging</span>
          </div>
          <Confirmation.Actions className="justify-end">
            <Confirmation.Deny size="sm">Deny</Confirmation.Deny>
            <Confirmation.Approve size="sm">Approve</Confirmation.Approve>
          </Confirmation.Actions>
        </Confirmation>
      </Card.Content>
    </Card>
  );
}
