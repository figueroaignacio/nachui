import { Badge } from '../../components/badge';
import { Frame } from '../../components/frame';

const SERVICES = [
  { name: 'auth-service', region: 'us-east-1', status: 'Healthy', variant: 'success' },
  { name: 'registry-api', region: 'us-east-1', status: 'Healthy', variant: 'success' },
  { name: 'rag-worker', region: 'eu-west-2', status: 'Degraded', variant: 'warning' },
  { name: 'ingest-cron', region: 'eu-west-2', status: 'Stopped', variant: 'destructive' },
] as const;

export function Stacked() {
  return (
    <Frame stacked dense className="max-w-md">
      <Frame.Header>
        <Frame.Title>Services</Frame.Title>
        <Frame.Description>Status across regions, updated every minute.</Frame.Description>
      </Frame.Header>
      {SERVICES.map((service) => (
        <Frame.Panel key={service.name}>
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-mono text-sm">{service.name}</span>
              <span className="text-muted-foreground text-xs">{service.region}</span>
            </div>
            <Badge variant={service.variant}>{service.status}</Badge>
          </div>
        </Frame.Panel>
      ))}
    </Frame>
  );
}
