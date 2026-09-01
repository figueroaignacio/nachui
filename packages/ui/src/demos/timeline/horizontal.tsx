'use client';

import { Timeline } from '../../components/timeline';

const STAGES = [
  { step: 1, date: 'Mon', title: 'Ordered' },
  { step: 2, date: 'Tue', title: 'Packed' },
  { step: 3, date: 'Wed', title: 'Shipped' },
  { step: 4, date: 'Fri', title: 'Delivered' },
];

export function Horizontal() {
  return (
    <Timeline orientation="horizontal" value={3} className="w-full max-w-lg">
      {STAGES.map((stage) => (
        <Timeline.Item key={stage.step} step={stage.step}>
          <Timeline.Header>
            <Timeline.Date>{stage.date}</Timeline.Date>
            <Timeline.Title>{stage.title}</Timeline.Title>
          </Timeline.Header>
          <Timeline.Indicator />
          <Timeline.Separator />
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
