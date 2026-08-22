import { Skeleton } from '../../components/skeleton';

// Placeholder for a project card: preview image, title, two lines of summary,
// then the owner row and the deploy status at the bottom.
const summaryLines = ['h-3.5 w-full', 'h-3.5 w-4/5'];

export function Card() {
  return (
    <div className="border-border bg-card w-full max-w-sm rounded-xl border p-4">
      <Skeleton className="h-[140px] w-full rounded-lg" />
      <div className="mt-4 space-y-2">
        <Skeleton className="h-5 w-40" />
        {summaryLines.map((line) => (
          <Skeleton key={line} className={line} />
        ))}
      </div>
      <div className="border-border mt-4 flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-5 w-16 rounded-sm" />
      </div>
    </div>
  );
}
