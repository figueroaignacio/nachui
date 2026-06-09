'use client';

import { Skeleton } from '../../components/skeleton';

const lines = [{ className: 'h-5 w-3/4' }, { className: 'h-4 w-full' }, { className: 'h-4 w-5/6' }];

const actions = [{ className: 'h-9 w-24 rounded-md' }, { className: 'h-9 w-24 rounded-md' }];

export function Card() {
  return (
    <div className="border-border w-full max-w-sm space-y-4 rounded-xl border p-6">
      <Skeleton className="h-[140px] w-full rounded-lg" />
      <div className="space-y-2">
        {lines.map((line, i) => (
          <Skeleton key={i} className={line.className} />
        ))}
      </div>
      <div className="flex gap-2 pt-2">
        {actions.map((action, i) => (
          <Skeleton key={i} className={action.className} />
        ))}
      </div>
    </div>
  );
}
