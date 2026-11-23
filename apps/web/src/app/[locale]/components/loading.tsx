import { Skeleton } from '@repo/ui/components/skeleton';
import { cn } from '@repo/ui/lib/cn';

const FILTER_WIDTHS = ['w-20', 'w-36', 'w-36', 'w-28'];
const TILES = Array.from({ length: 6 }, (_, index) => index);

/** The catalog while it loads: its header, the filters and the first tiles. */
export default function CatalogLoading() {
  return (
    <div aria-busy="true" className="mx-auto w-full max-w-[70rem] pt-10 pb-24 sm:pt-14">
      <Skeleton className="h-9 w-44 lg:h-10" />
      <Skeleton className="mt-4 h-6 w-full max-w-[52ch]" />
      <div className="mt-7 flex flex-wrap items-center gap-2">
        <Skeleton className="h-9 w-full rounded-md sm:w-72" />
        {FILTER_WIDTHS.map((width, index) => (
          <Skeleton key={index} className={cn('h-9 rounded-full', width)} />
        ))}
      </div>
      <Skeleton className="mt-12 h-6 w-40" />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map((tile) => (
          <div key={tile} className="bg-island flex h-72 flex-col rounded-lg p-1.5 shadow-xs">
            <div className="relative min-h-0 flex-1 rounded-md">
              <Skeleton className="absolute inset-8 rounded-md" />
            </div>
            <div className="flex h-12 items-center px-3">
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
