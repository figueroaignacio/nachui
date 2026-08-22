import { Progress } from '../../components/progress';

export function Indeterminate() {
  return (
    <div className="border-border bg-card w-full max-w-sm rounded-xl border p-5">
      <p className="text-sm font-medium">Importing contacts from HubSpot</p>
      <p className="text-muted-foreground mt-1 text-xs">
        We do not know the total yet, so this bar keeps moving until the import finishes.
      </p>
      <Progress className="mt-4" />
      <p className="text-muted-foreground mt-3 text-xs">
        You can close this page, we will email you when it is done.
      </p>
    </div>
  );
}
