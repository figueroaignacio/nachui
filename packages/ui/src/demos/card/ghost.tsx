import { Card } from '../../components/card';

const channels = [
  { name: 'Deploy failures', detail: 'Email and Slack' },
  { name: 'New comments', detail: 'Slack only' },
  { name: 'Weekly usage report', detail: 'Email, every Monday' },
];

export function Ghost() {
  return (
    <div className="border-border bg-card w-full max-w-sm rounded-xl border p-2">
      <Card variant="ghost">
        <Card.Header>
          <Card.Title>Notifications</Card.Title>
          <Card.Description>How this workspace reaches you.</Card.Description>
        </Card.Header>
        <Card.Content className="text-sm">
          <ul className="space-y-2">
            {channels.map((channel) => (
              <li key={channel.name} className="flex items-baseline justify-between gap-3">
                <span>{channel.name}</span>
                <span className="text-muted-foreground text-xs">{channel.detail}</span>
              </li>
            ))}
          </ul>
        </Card.Content>
      </Card>
    </div>
  );
}
