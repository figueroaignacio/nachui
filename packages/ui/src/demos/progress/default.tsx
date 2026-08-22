import { Progress } from '../../components/progress';

export function Default() {
  return (
    <div className="border-border bg-card w-full max-w-sm rounded-xl border p-5">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium">Storage</p>
        <p className="text-muted-foreground text-xs">6.4 GB of 10 GB</p>
      </div>
      <Progress value={64} className="mt-3" />
      <p className="text-muted-foreground mt-3 text-xs">
        Backups and build artifacts count toward this limit.
      </p>
    </div>
  );
}
