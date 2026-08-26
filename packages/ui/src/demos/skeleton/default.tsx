import { Skeleton } from '../../components/skeleton';

// Two placeholder rows shaped like the members table: avatar, name, email,
// role badge and a row action.
const rows = ['first', 'second'];

export function Default() {
  return (
    <div className="border-border bg-card w-full max-w-md rounded-xl border p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium">Members</p>
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex flex-col gap-4">
        {rows.map((row) => (
          <div key={row} className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-3.5 w-full max-w-32" />
                <Skeleton className="h-3 w-full max-w-44" />
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Skeleton className="h-5 w-14 rounded-sm" />
              <Skeleton className="hidden h-8 w-20 rounded-md sm:block" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
