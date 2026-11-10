'use client';

import { Tooltip } from '@repo/ui/components/tooltip';
import type { Usage } from '@/lib/types';

function resetTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function UsageMeter({ usage }: { usage: Usage | null }) {
  if (!usage || usage.limit === 0) return null;
  const ratio = Math.min(usage.used / usage.limit, 1);
  const circumference = 2 * Math.PI * 7;
  const left = Math.max(usage.limit - usage.used, 0);

  return (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <button
          type="button"
          className="text-muted-strong focus-visible:ring-ring flex items-center gap-2 rounded-md px-1 text-xs focus-visible:ring-2 focus-visible:outline-none"
        >
          <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true" className="-rotate-90">
            <circle cx="9" cy="9" r="7" fill="none" className="stroke-muted" strokeWidth="2.5" />
            <circle
              cx="9"
              cy="9"
              r="7"
              fill="none"
              className={ratio >= 1 ? 'stroke-destructive-text' : 'stroke-foreground'}
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - ratio)}
              strokeLinecap="round"
            />
          </svg>
          <span className="font-mono tabular-nums">
            {usage.used} / {usage.limit}
            <span className="sr-only"> generations used today</span>
          </span>
        </button>
      </Tooltip.Trigger>
      <Tooltip.Content>{`${left} left today. Resets at ${resetTime(usage.resetsAt)}.`}</Tooltip.Content>
    </Tooltip>
  );
}
