'use client';

import { Timeline } from '../../components/timeline';

const EVENTS = [
  {
    step: 1,
    date: 'Mar 12',
    title: 'Project created',
    body: 'Repository initialised from the starter template.',
  },
  {
    step: 2,
    date: 'Mar 14',
    title: 'First deploy',
    body: 'Preview environment went live on the staging domain.',
  },
  {
    step: 3,
    date: 'Mar 20',
    title: 'Design review',
    body: 'Tokens and spacing approved by the design team.',
  },
  {
    step: 4,
    date: 'Mar 28',
    title: 'Public launch',
    body: 'Production release scheduled after QA sign-off.',
  },
];

export function Default() {
  return (
    <Timeline value={2} className="max-w-md">
      {EVENTS.map((event) => (
        <Timeline.Item key={event.step} step={event.step}>
          <Timeline.Header>
            <Timeline.Date>{event.date}</Timeline.Date>
            <Timeline.Title>{event.title}</Timeline.Title>
          </Timeline.Header>
          <Timeline.Indicator />
          <Timeline.Separator />
          <Timeline.Content>{event.body}</Timeline.Content>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
