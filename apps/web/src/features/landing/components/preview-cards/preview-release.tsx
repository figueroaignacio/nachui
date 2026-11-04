import { Card } from '@repo/ui/components/card';
import { Timeline } from '@repo/ui/components/timeline';

const events = [
  { step: 1, title: 'Tests passed', time: '09:12' },
  { step: 2, title: 'Preview deployed', time: '09:18' },
  { step: 3, title: 'Review approved', time: '10:40' },
  { step: 4, title: 'Rolling out', time: 'in progress' },
];

export function PreviewRelease() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">Release v2.4</Card.Title>
      </Card.Header>
      <Card.Content compact>
        <Timeline value={3}>
          {events.map((event) => (
            <Timeline.Item key={event.step} step={event.step}>
              <Timeline.Header>
                <Timeline.Date className="font-mono text-[11px]">{event.time}</Timeline.Date>
                <Timeline.Title className="text-xs">{event.title}</Timeline.Title>
              </Timeline.Header>
              <Timeline.Indicator />
              <Timeline.Separator />
            </Timeline.Item>
          ))}
        </Timeline>
      </Card.Content>
    </Card>
  );
}
