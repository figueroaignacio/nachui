'use client';

import { Badge } from '../../components/badge';
import { Timeline } from '../../components/timeline';

const DEPLOYS = [
  {
    step: 1,
    sha: 'e9061f9',
    when: '2 min ago',
    env: 'Production',
    status: 'Live',
    variant: 'success',
  },
  {
    step: 2,
    sha: 'a230044',
    when: '1 hour ago',
    env: 'Production',
    status: 'Superseded',
    variant: 'secondary',
  },
  {
    step: 3,
    sha: 'e841f0d',
    when: 'Yesterday',
    env: 'Preview',
    status: 'Failed',
    variant: 'destructive',
  },
  {
    step: 4,
    sha: '726cc22',
    when: '2 days ago',
    env: 'Preview',
    status: 'Superseded',
    variant: 'secondary',
  },
] as const;

export function Deployments() {
  return (
    <div className="border-border bg-card w-full max-w-md rounded-xl border p-5">
      <p className="mb-4 text-sm font-medium">Deployments</p>
      <Timeline value={1}>
        {DEPLOYS.map((deploy) => (
          <Timeline.Item key={deploy.sha} step={deploy.step} className="pb-5">
            <Timeline.Header className="flex-row items-center justify-between gap-3">
              <Timeline.Title className="font-mono">{deploy.sha}</Timeline.Title>
              <Badge variant={deploy.variant}>{deploy.status}</Badge>
            </Timeline.Header>
            <Timeline.Indicator
              className={deploy.variant === 'destructive' ? 'border-destructive' : undefined}
            />
            <Timeline.Separator />
            <Timeline.Content className="text-xs">
              {deploy.env} <span aria-hidden="true">&middot;</span> {deploy.when}
            </Timeline.Content>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
}
