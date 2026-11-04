'use client';

import { Link } from '@/i18n/navigation';
import { buttonVariants } from '@repo/ui/components/button';
import { ArrowRightIcon } from '@repo/ui/icons/arrow-right';
import { cn } from '@repo/ui/lib/cn';

export interface HeroAction {
  href: string;
  label: string;
  variant: 'default' | 'outline';
}

/** The hero's call-to-action row. A client island because the button styles live in a client module. */
export function HeroActions({ actions }: { actions: HeroAction[] }) {
  return (
    <div className="mt-8 flex flex-wrap gap-2">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className={cn(
            buttonVariants({ variant: action.variant }),
            'h-9 rounded-[10px] px-3 font-mono text-xs',
          )}
        >
          {action.label}
          {action.variant === 'default' && <ArrowRightIcon size={13} aria-hidden="true" />}
        </Link>
      ))}
    </div>
  );
}
