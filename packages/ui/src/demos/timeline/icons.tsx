'use client';

import { GitCommitIcon, GitMergeIcon, Rocket01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Timeline } from '../../components/timeline';

const STEPS = [
  {
    step: 1,
    icon: GitCommitIcon,
    title: 'Commit pushed',
    body: 'feat(ui): add a side-aware caret to the tooltip',
  },
  {
    step: 2,
    icon: Tick02Icon,
    title: 'Checks passed',
    body: 'Lint, type-check and 312 tests in 48s.',
  },
  {
    step: 3,
    icon: GitMergeIcon,
    title: 'Merged into main',
    body: 'Squashed by lucia after one approval.',
  },
  {
    step: 4,
    icon: Rocket01Icon,
    title: 'Deployed',
    body: 'Waiting for the production rollout window.',
  },
];

export function Icons() {
  return (
    <Timeline value={3} className="max-w-md">
      {STEPS.map((item) => (
        <Timeline.Item key={item.step} step={item.step} className="ps-10">
          <Timeline.Header>
            <Timeline.Title>{item.title}</Timeline.Title>
          </Timeline.Header>
          <Timeline.Indicator className="bg-muted text-muted-foreground size-7 border-0 [&_svg]:size-4">
            <HugeiconsIcon icon={item.icon} />
          </Timeline.Indicator>
          <Timeline.Separator />
          <Timeline.Content>{item.body}</Timeline.Content>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
