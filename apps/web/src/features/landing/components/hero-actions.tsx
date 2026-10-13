'use client';

import { Link } from '@/i18n/navigation';
import { Button, buttonVariants } from '@repo/ui/components/button';
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
    <Button.Group
      attached
      className="mt-8 w-full sm:w-auto md:mt-9 [&>a:not(:first-child)]:-ml-px [&>a:not(:first-child)]:rounded-l-none [&>a:not(:last-child)]:rounded-r-none"
    >
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className={cn(
            buttonVariants({ variant: action.variant }),
            'h-11 flex-1 rounded-[10px] px-2 font-mono text-xs sm:flex-none sm:px-4 sm:text-[13px] md:px-5 md:text-sm',
          )}
        >
          {action.label}
          {action.variant === 'default' && (
            <ArrowRightIcon size={15} aria-hidden="true" className="hidden sm:block" />
          )}
        </Link>
      ))}
    </Button.Group>
  );
}
