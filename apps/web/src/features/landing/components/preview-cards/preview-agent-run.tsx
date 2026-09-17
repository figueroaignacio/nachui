'use client';

import { Task } from '@repo/ui/ai/task';
import { Badge } from '@repo/ui/components/badge';
import { Card } from '@repo/ui/components/card';

export function PreviewAgentRun() {
  return (
    <Card>
      <Card.Header compact>
        <div className="flex items-start justify-between gap-2">
          <div>
            <Card.Title className="text-sm font-semibold">Migration run</Card.Title>
            <Card.Description className="text-xs">feat/drop-legacy-slugs</Card.Description>
          </div>
          <Badge variant="outline" className="text-[10px]">
            2m 14s
          </Badge>
        </div>
      </Card.Header>
      <Card.Content compact className="mt-4 space-y-3">
        <Task defaultOpen={false}>
          <Task.Trigger title="Read the schema" status="complete" />
          <Task.Content>
            <Task.Item>4 tables, 2 with unqualified slugs</Task.Item>
          </Task.Content>
        </Task>
        <Task defaultOpen>
          <Task.Trigger title="Writing the migration" status="active" />
          <Task.Content>
            <Task.Item>
              Editing <Task.File>0007_slugs.sql</Task.File>
            </Task.Item>
            <Task.Item>Backfilling 231 rows in batches of 50</Task.Item>
          </Task.Content>
        </Task>
        <Task defaultOpen={false}>
          <Task.Trigger title="Run the test suite" status="pending" />
          <Task.Content>
            <Task.Item>Waiting for the migration to land</Task.Item>
          </Task.Content>
        </Task>
      </Card.Content>
    </Card>
  );
}
