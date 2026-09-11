import { Badge } from '../../components/badge';

const deployments = [
  { id: 'dpl_9fk2ax', branch: 'main', status: 'Ready', variant: 'success' },
  { id: 'dpl_7hs1qe', branch: 'feat/tree', status: 'Building', variant: 'info' },
  { id: 'dpl_4lm8zr', branch: 'fix/nav', status: 'Queued', variant: 'secondary' },
  { id: 'dpl_2pw6cn', branch: 'chore/deps', status: 'Failed', variant: 'destructive' },
] as const;

export function Statuses() {
  return (
    <div className="border-border bg-card divide-border w-full max-w-md divide-y rounded-xl border">
      {deployments.map((deployment) => (
        <div key={deployment.id} className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-mono text-sm">{deployment.id}</span>
            <span className="text-muted-foreground text-xs">{deployment.branch}</span>
          </div>
          <Badge variant={deployment.variant}>{deployment.status}</Badge>
        </div>
      ))}
    </div>
  );
}
