import { ScrollArea } from '../../components/scroll-area';

const regions = [
  { city: 'Virginia', code: 'us-east-1', latency: '12 ms' },
  { city: 'Oregon', code: 'us-west-2', latency: '48 ms' },
  { city: 'Frankfurt', code: 'eu-central-1', latency: '96 ms' },
  { city: 'Sao Paulo', code: 'sa-east-1', latency: '140 ms' },
  { city: 'Singapore', code: 'ap-southeast-1', latency: '210 ms' },
  { city: 'Sydney', code: 'ap-southeast-2', latency: '245 ms' },
  { city: 'Tokyo', code: 'ap-northeast-1', latency: '180 ms' },
];

export function Horizontal() {
  return (
    <ScrollArea orientation="horizontal" className="w-full max-w-md">
      <div className="flex gap-3 p-1 pb-3">
        {regions.map((region) => (
          <div
            key={region.code}
            className="border-border bg-card flex w-36 shrink-0 flex-col gap-1 rounded-lg border p-3"
          >
            <span className="text-sm font-medium">{region.city}</span>
            <span className="text-muted-foreground font-mono text-xs">{region.code}</span>
            <span className="text-muted-foreground text-xs">{region.latency}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
