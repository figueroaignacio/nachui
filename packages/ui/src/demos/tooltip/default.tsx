'use client';

import { InformationCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tooltip } from '../../components/tooltip';

export function Default() {
  return (
    <div className="border-border bg-card w-full max-w-xs rounded-xl border p-4">
      <div className="flex items-center gap-1.5">
        <p className="text-muted-foreground text-xs">Net MRR</p>
        <Tooltip>
          <Tooltip.Trigger asChild>
            <button
              type="button"
              aria-label="How net MRR is calculated"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <HugeiconsIcon icon={InformationCircleIcon} size={14} />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content className="w-56 whitespace-normal">
            New and expansion revenue minus churn and downgrades. One time charges, taxes and
            refunds are left out.
          </Tooltip.Content>
        </Tooltip>
      </div>
      <p className="mt-1 text-xl font-semibold tracking-tight">$18,240</p>
      <p className="text-success-text mt-1 text-xs">+6.4% vs February</p>
    </div>
  );
}
