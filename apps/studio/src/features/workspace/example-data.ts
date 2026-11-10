import type { UIMessage } from 'ai';
import type { Project } from '@/lib/types';

const SCREEN = `'use client';

import { useState } from 'react';
import { Badge } from '../components/badge';
import { Button } from '../components/button';
import { Card } from '../components/card';
import { Progress } from '../components/progress';
import { Table } from '../components/table';
import { UsageChart } from './billing-page/usage-chart';

const INVOICES = [
  { id: 'INV-0142', date: 'Nov 1, 2026', status: 'Paid', amount: '$24.00' },
  { id: 'INV-0131', date: 'Oct 1, 2026', status: 'Paid', amount: '$24.00' },
  { id: 'INV-0120', date: 'Sep 1, 2026', status: 'Paid', amount: '$19.00' },
  { id: 'INV-0108', date: 'Aug 1, 2026', status: 'Refunded', amount: '$19.00' },
] as const;

const USAGE = [12, 18, 9, 22, 30, 16, 25, 28, 14, 20, 26, 33, 19, 24];

export default function BillingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 p-6 sm:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Billing</h1>
          <p className="text-muted-foreground text-sm">Manage your plan, seats and invoices.</p>
        </div>
        <Button variant="outline" onClick={() => setAnnual(!annual)}>
          {annual ? 'Switch to monthly' : 'Switch to annual'}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between gap-3">
              <Card.Description>Current plan</Card.Description>
              <Badge variant="success">Active</Badge>
            </div>
            <Card.Title className="text-2xl">Pro</Card.Title>
          </Card.Header>
          <Card.Content className="text-muted-foreground text-sm">
            {annual ? '$240 per year' : '$24 per month'} · renews Dec 1
          </Card.Content>
        </Card>
        <Card>
          <Card.Header>
            <Card.Description>Seats</Card.Description>
            <Card.Title className="text-2xl">5 of 8</Card.Title>
          </Card.Header>
          <Card.Content>
            <Progress value={62} label="Seats used" />
          </Card.Content>
        </Card>
        <UsageChart days={USAGE} />
      </div>

      <Card>
        <Card.Header>
          <Card.Title>Invoices</Card.Title>
        </Card.Header>
        <Card.Content>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Invoice</Table.Head>
                <Table.Head>Date</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head className="text-end">Amount</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {INVOICES.map((invoice) => (
                <Table.Row key={invoice.id}>
                  <Table.Cell className="font-mono text-xs">{invoice.id}</Table.Cell>
                  <Table.Cell>{invoice.date}</Table.Cell>
                  <Table.Cell>
                    <Badge variant={invoice.status === 'Paid' ? 'outline' : 'warning'}>{invoice.status}</Badge>
                  </Table.Cell>
                  <Table.Cell className="text-end">{invoice.amount}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card.Content>
      </Card>
    </main>
  );
}
`;

const CHART = `import { Card } from '../../components/card';
import { cn } from '../../lib/cn';

export function UsageChart({ days }: { days: number[] }) {
  const max = Math.max(1, ...days);
  const today = days.length - 1;

  return (
    <Card>
      <Card.Header>
        <Card.Description>Usage this month</Card.Description>
        <Card.Title className="text-2xl">{days.reduce((sum, day) => sum + day, 0)} builds</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="flex h-16 items-end gap-1" role="img" aria-label="Builds per day this month">
          {days.map((count, index) => (
            <span
              key={index}
              className={cn('flex-1 rounded-sm', index === today ? 'bg-foreground' : 'bg-foreground/25')}
              style={{ height: \`\${(count / max) * 100}%\` }}
            />
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}
`;

export const EXAMPLE_FILES = {
  'screens/billing-page.tsx': SCREEN,
  'screens/billing-page/usage-chart.tsx': CHART,
};

const MESSAGES = [
  {
    id: 'example-u1',
    role: 'user',
    parts: [
      {
        type: 'text',
        text: 'A billing page with the current plan, seats, usage this month and a table of invoices.',
      },
    ],
  },
  {
    id: 'example-a1',
    role: 'assistant',
    parts: [
      {
        type: 'tool-setPlan',
        toolCallId: 'p1',
        state: 'output-available',
        input: {
          title: 'Build the billing page',
          steps: [
            { title: 'Pick components from the catalog', status: 'complete' },
            { title: 'Write the page and the usage chart', status: 'complete' },
            { title: 'Check types and imports', status: 'complete' },
          ],
        },
        output: { ok: true },
      },
      {
        type: 'tool-listComponents',
        toolCallId: 't1',
        state: 'output-available',
        input: {},
        output: {
          components: Array.from({ length: 112 }, (_, index) => `components/item-${index}`),
        },
      },
      {
        type: 'tool-getComponentCode',
        toolCallId: 't2',
        state: 'output-available',
        input: { componentName: 'table' },
        output: { found: true, componentName: 'ui/table', code: '' },
      },
      {
        type: 'tool-writeFile',
        toolCallId: 't3',
        state: 'output-available',
        input: { path: 'screens/billing-page/usage-chart.tsx', content: CHART },
        output: {
          ok: true,
          path: 'screens/billing-page/usage-chart.tsx',
          lines: CHART.split('\n').length,
          created: true,
        },
      },
      {
        type: 'tool-writeFile',
        toolCallId: 't4',
        state: 'output-available',
        input: { path: 'screens/billing-page.tsx', content: SCREEN },
        output: {
          ok: true,
          path: 'screens/billing-page.tsx',
          lines: SCREEN.split('\n').length,
          created: true,
        },
      },
      {
        type: 'tool-runChecks',
        toolCallId: 't5',
        state: 'output-available',
        input: {},
        output: { ok: true, checked: 2, diagnostics: [] },
      },
      {
        type: 'text',
        state: 'done',
        text: 'The billing page has the plan, a seats meter, a usage chart and the invoices table. It uses Card, Badge, Button, Progress and Table, and the chart lives in its own file so you can reuse it.',
      },
    ],
  },
] as unknown as UIMessage[];

export const EXAMPLE_PROJECT: Project = {
  id: 'example',
  name: 'Billing page',
  version: 1,
  lastError: null,
  pullRequestUrl: null,
  updatedAt: '2026-11-10T12:00:00.000Z',
  files: EXAMPLE_FILES,
  versions: [
    {
      number: 1,
      summary: 'A billing page with the current plan',
      messageId: 'example-a1',
      createdAt: '2026-11-10T12:00:00.000Z',
    },
  ],
  messages: MESSAGES,
};
