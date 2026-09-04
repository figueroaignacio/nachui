import { Card } from '@repo/ui/components/card';
import { Progress } from '@repo/ui/components/progress';

const targets = [
  { name: 'Retirement', amount: '$420,000', progress: 65, saved: '$273,000' },
  { name: 'Real Estate', amount: '$85,000', progress: 32, saved: '$27,200' },
];

export function PreviewSavingsTargets() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">Savings Targets</Card.Title>
        <Card.Description className="text-xs">
          Active milestones for 2024 across your portfolio. Monitor how close you are to each
          savings goal.
        </Card.Description>
      </Card.Header>
      <Card.Content compact className="mt-4 space-y-3">
        {targets.map((target) => (
          <div key={target.name} className="bg-surface-muted space-y-2 rounded-md p-3.5">
            <span className="text-muted-foreground text-[9px] font-semibold tracking-wider uppercase">
              {target.name}
            </span>
            <div className="text-foreground text-2xl font-bold tracking-tight">{target.amount}</div>
            <Progress value={target.progress} aria-label={`${target.name} savings progress`} />
            <div className="text-muted-foreground flex justify-between text-[10px]">
              <span>{target.progress}% achieved</span>
              <span>{target.saved}</span>
            </div>
          </div>
        ))}
      </Card.Content>
    </Card>
  );
}
