'use client';

import { Comment01Icon, Delete02Icon, HistoryIcon, Share01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tooltip } from '../../components/tooltip';

const actions = [
  {
    side: 'top',
    icon: Comment01Icon,
    label: 'Comment on selection',
    hint: 'Comment on selection (⇧⌘M)',
  },
  {
    side: 'bottom',
    icon: HistoryIcon,
    label: 'Version history',
    hint: 'Version history, last saved 4m ago',
  },
  {
    side: 'left',
    icon: Share01Icon,
    label: 'Share document',
    hint: 'Shared with 3 people in Northwind',
  },
  {
    side: 'right',
    icon: Delete02Icon,
    label: 'Move to trash',
    hint: 'Move to trash, recoverable for 30 days',
  },
] as const;

export function Positions() {
  return (
    <div className="border-border bg-card flex flex-col items-center gap-10 rounded-xl border px-6 py-4 md:flex-row">
      {actions.map((action) => (
        <Tooltip key={action.side}>
          <Tooltip.Trigger asChild>
            <button
              type="button"
              aria-label={action.label}
              className="text-muted-foreground hover:bg-muted hover:text-foreground flex size-9 items-center justify-center rounded-md transition-colors"
            >
              <HugeiconsIcon icon={action.icon} size={18} strokeWidth={1.6} />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content side={action.side}>{action.hint}</Tooltip.Content>
        </Tooltip>
      ))}
    </div>
  );
}
