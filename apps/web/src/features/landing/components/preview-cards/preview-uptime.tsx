import { Card } from '@repo/ui/components/card';
import { cn } from '@repo/ui/lib/cn';

const DAYS = 40;
const DEGRADED_DAY = 27;

export function PreviewUptime() {
  return (
    <Card>
      <Card.Header compact>
        <div className="flex items-baseline justify-between gap-2">
          <Card.Title className="text-sm font-semibold">Uptime</Card.Title>
          <span className="text-foreground font-mono text-xs">99.98%</span>
        </div>
      </Card.Header>
      <Card.Content compact>
        <div className="flex h-8 gap-0.5">
          {Array.from({ length: DAYS }, (_, day) => (
            <span
              key={day}
              className={cn(
                'flex-1 rounded-[1px]',
                day === DEGRADED_DAY ? 'bg-warning' : 'bg-muted-foreground',
              )}
            />
          ))}
        </div>
        <p className="text-muted-foreground mt-2.5 text-[11px]">Last 40 days</p>
      </Card.Content>
    </Card>
  );
}
