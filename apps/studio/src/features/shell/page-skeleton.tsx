import { Skeleton } from '@repo/ui/components/skeleton';

export function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading" className="flex min-h-dvh flex-col">
      <div className="border-border flex h-14 items-center gap-4 border-b px-5">
        <Skeleton className="size-6.5 rounded-md" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 pt-32">
        <Skeleton className="mx-auto h-9 w-80" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    </div>
  );
}
