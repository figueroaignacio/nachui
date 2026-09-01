'use client';

import { Timeline } from '../../components/timeline';

const MILESTONES = [
  {
    step: 1,
    date: 'Q1',
    title: 'Discovery',
    body: 'Interviews with twelve teams and a first prototype.',
  },
  {
    step: 2,
    date: 'Q2',
    title: 'Private beta',
    body: 'Fifty workspaces onboarded behind a feature flag.',
  },
  {
    step: 3,
    date: 'Q3',
    title: 'General availability',
    body: 'Self-serve signup, billing and the public docs.',
  },
  {
    step: 4,
    date: 'Q4',
    title: 'Integrations',
    body: 'Slack, Linear and GitHub apps in the marketplace.',
  },
];

export function Alternate() {
  return (
    <Timeline alternate value={2} className="w-full max-w-xl">
      {MILESTONES.map((milestone) => (
        <Timeline.Item key={milestone.step} step={milestone.step}>
          <Timeline.Header>
            <Timeline.Date>{milestone.date}</Timeline.Date>
            <Timeline.Title>{milestone.title}</Timeline.Title>
          </Timeline.Header>
          <Timeline.Indicator />
          <Timeline.Separator />
          <Timeline.Content>{milestone.body}</Timeline.Content>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
