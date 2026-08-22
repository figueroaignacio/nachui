'use client';

import * as React from 'react';

import { cn } from '../../lib/cn';
import { Progress } from '../../components/progress';

const TOTAL_MB = 24.6;

export function WithValue() {
  const [percent, setPercent] = React.useState(12);

  React.useEffect(() => {
    if (percent >= 100) return;
    const timer = setTimeout(() => setPercent((current) => Math.min(current + 11, 100)), 700);
    return () => clearTimeout(timer);
  }, [percent]);

  const done = percent >= 100;
  const uploaded = ((TOTAL_MB * percent) / 100).toFixed(1);

  return (
    <div className="border-border bg-card w-full max-w-sm rounded-xl border p-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="truncate text-sm font-medium">q3-report.pdf</p>
        <p className="text-muted-foreground shrink-0 text-xs">{percent}%</p>
      </div>
      <Progress value={percent} max={100} className="mt-3" />
      <p className={cn('mt-3 text-xs', done ? 'text-success-text' : 'text-muted-foreground')}>
        {done ? 'Upload complete, ready to share' : `${uploaded} MB of ${TOTAL_MB} MB uploaded`}
      </p>
    </div>
  );
}
