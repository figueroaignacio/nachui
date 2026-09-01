'use client';

import { Timeline } from '../../components/timeline';

const ACTIVITY = [
  {
    step: 1,
    date: '09:12',
    title: 'Ticket opened',
    body: 'Customer reported a broken checkout on Safari.',
  },
  { step: 2, date: '09:40', title: 'Assigned to Nico', body: 'Escalated to the payments squad.' },
  {
    step: 3,
    date: '11:05',
    title: 'Fix deployed',
    body: 'Patched the Apple Pay session handshake.',
  },
  { step: 4, date: '11:30', title: 'Resolved', body: 'Customer confirmed the order went through.' },
];

export function LeftDates() {
  return (
    <Timeline value={4} className="max-w-lg">
      {ACTIVITY.map((entry) => (
        <Timeline.Item key={entry.step} step={entry.step} className="ms-16">
          <Timeline.Header>
            <Timeline.Date className="absolute -start-16 top-0.5 w-14 text-end font-mono">
              {entry.date}
            </Timeline.Date>
            <Timeline.Title>{entry.title}</Timeline.Title>
          </Timeline.Header>
          <Timeline.Indicator />
          <Timeline.Separator />
          <Timeline.Content>{entry.body}</Timeline.Content>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
