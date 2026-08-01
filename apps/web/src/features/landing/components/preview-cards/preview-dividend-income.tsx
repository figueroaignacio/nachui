import { Card } from '@repo/ui/components/card';

const holdings = [
  { name: 'Index Fund', shares: '450 Shares', bars: [40, 55, 45, 85] },
  { name: 'Global ETF', shares: '112 Shares', bars: [35, 50, 75, 55] },
  { name: 'Tech Growth', shares: '85 Shares', bars: [30, 45, 60, 90] },
];

export function PreviewDividendIncome() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">Q2 Dividend Income</Card.Title>
        <Card.Description className="text-xs">
          Quarterly dividend payouts across your portfolio holdings.
        </Card.Description>
      </Card.Header>
      <Card.Content compact className="mt-4 space-y-2">
        {holdings.map((holding) => (
          <div
            key={holding.name}
            className="border-border flex items-center justify-between rounded-md border p-3"
          >
            <div>
              <div className="text-foreground text-xs font-semibold">{holding.name}</div>
              <div className="text-muted-foreground mt-0.5 text-[11px]">{holding.shares}</div>
            </div>
            <div
              className="flex h-8 items-end gap-1"
              role="img"
              aria-label={`${holding.name} quarterly payout chart`}
            >
              {holding.bars.map((bar, i) => (
                <div
                  key={i}
                  className="bg-muted w-2.5 rounded-xs"
                  style={{ height: `${bar}%` }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        ))}
      </Card.Content>
    </Card>
  );
}
