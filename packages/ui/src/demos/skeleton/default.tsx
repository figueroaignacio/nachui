'use client';

import { Skeleton } from '../../components/skeleton';

const lines = [{ className: 'h-4 w-[200px]' }, { className: 'h-4 w-[160px]' }];

export function Default() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        {lines.map((line, i) => (
          <Skeleton key={i} className={line.className} />
        ))}
      </div>
    </div>
  );
}
