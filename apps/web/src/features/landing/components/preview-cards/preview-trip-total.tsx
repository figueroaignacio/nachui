import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';

const lines = [
  { label: '4 nights at $120', value: '$480' },
  { label: 'Cleaning fee', value: '$35' },
];

export function PreviewTripTotal() {
  return (
    <Card className="gap-3 p-4">
      <p className="text-foreground text-sm font-semibold">Your trip</p>
      <div className="space-y-2">
        {lines.map((line) => (
          <div key={line.label} className="text-muted-strong flex justify-between text-xs">
            <span>{line.label}</span>
            <span className="font-mono">{line.value}</span>
          </div>
        ))}
      </div>
      <div className="border-border flex items-baseline justify-between border-t pt-3">
        <span className="text-foreground text-sm font-semibold">Total</span>
        <span className="text-foreground text-2xl font-semibold tracking-tight">$515</span>
      </div>
      <Button size="sm" fullWidth>
        Confirm and pay
      </Button>
    </Card>
  );
}
