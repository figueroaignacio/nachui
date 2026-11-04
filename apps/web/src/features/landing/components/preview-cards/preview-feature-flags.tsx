import { Card } from '@repo/ui/components/card';
import { Switch } from '@repo/ui/components/switch';

const flags = [
  { label: 'New checkout', enabled: true },
  { label: 'Beta dashboard', enabled: false },
  { label: 'Audit log', enabled: true },
];

export function PreviewFeatureFlags() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">Feature flags</Card.Title>
      </Card.Header>
      <Card.Content compact className="space-y-3">
        {flags.map((flag) => (
          <div key={flag.label} className="flex items-center justify-between gap-3">
            <span className="text-foreground text-xs">{flag.label}</span>
            <Switch defaultChecked={flag.enabled} aria-label={flag.label} />
          </div>
        ))}
      </Card.Content>
    </Card>
  );
}
