import { Badge } from '@repo/ui/components/badge';
import { Card } from '@repo/ui/components/card';
import { Separator } from '@repo/ui/components/separator';

const rows = [
  { label: 'Net Royalties', value: '$1,248.75' },
  { label: 'Processing Fee', value: '-$37.46' },
];

export function PreviewClaimableBalance() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Description className="text-xs">Claimable Balance</Card.Description>
        <Card.Title className="text-3xl font-bold tracking-tight">$1,211.29</Card.Title>
        <div>
          <Badge variant="outline" className="text-[10px]">
            Pending Setup
          </Badge>
        </div>
      </Card.Header>
      <Card.Content compact className="mt-4 space-y-4">
        <div className="border-border space-y-2.5 rounded-md border p-3.5 text-xs">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="text-foreground font-semibold">{row.value}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Ready to Claim</span>
            <span className="text-foreground font-bold">$1,211.29 USD</span>
          </div>
        </div>
        <p className="text-muted-foreground text-[11px] leading-relaxed">
          Once your bank is connected, balances over $10.00 are automatically eligible for monthly
          distribution on the 15th of each month.
        </p>
      </Card.Content>
    </Card>
  );
}
