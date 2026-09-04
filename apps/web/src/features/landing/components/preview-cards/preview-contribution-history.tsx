import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';

const bars = [
  { month: 'Dec', value: 55 },
  { month: 'Jan', value: 90 },
  { month: 'Feb', value: 70 },
  { month: 'Mar', value: 100 },
  { month: 'Apr', value: 45 },
  { month: 'May', value: 80 },
];

export function PreviewContributionHistory() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">Contribution History</Card.Title>
        <Card.Description className="text-xs">Last 6 months of activity</Card.Description>
      </Card.Header>
      <Card.Content compact className="mt-4 space-y-4">
        <div
          className="flex h-32 items-end gap-2"
          role="img"
          aria-label="Monthly contribution bar chart"
        >
          {bars.map((bar) => (
            <div key={bar.month} className="flex h-full flex-1 flex-col justify-end gap-1.5">
              <div
                className="bg-muted w-full rounded-sm"
                style={{ height: `${bar.value}%` }}
                aria-hidden="true"
              />
              <span className="text-muted-foreground text-center text-[10px]">{bar.month}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-surface-muted rounded-md p-3">
            <span className="text-muted-foreground text-[9px] font-semibold tracking-wider uppercase">
              Upcoming
            </span>
            <div className="text-foreground mt-1 text-sm font-bold">May 2024</div>
            <div className="text-muted-foreground text-xs">Scheduled</div>
          </div>
          <div className="bg-surface-muted rounded-md p-3">
            <span className="text-muted-foreground text-[9px] font-semibold tracking-wider uppercase">
              Savings Plan
            </span>
            <div className="text-foreground mt-1 text-sm font-bold">Accelerated</div>
            <div className="text-muted-foreground text-xs">Recurring</div>
          </div>
        </div>
      </Card.Content>
      <Card.Footer compact className="mt-4">
        <Button size="sm" variant="secondary" fullWidth>
          View Full Report
        </Button>
      </Card.Footer>
    </Card>
  );
}
