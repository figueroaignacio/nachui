'use client';

import { Link } from '@/i18n/navigation';
import { buttonVariants } from '@repo/ui/components/button';
import { ArrowRightIcon } from '@repo/ui/icons/arrow-right';
import { cn } from '@repo/ui/lib/cn';

export interface HeroAction {
  href: string;
  label: string;
  variant: 'default' | 'secondary';
}

/** The hero's call-to-action row. A client island because the button styles live in a client module. */
export function HeroActions({ actions }: { actions: HeroAction[] }) {
  return (
    <div className="mt-6 flex flex-col gap-2 md:mt-7 md:flex-row md:justify-center">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className={cn(
            buttonVariants({ variant: action.variant }),
            'h-12 px-5 text-base md:h-11 md:text-[15px]',
          )}
        >
          {action.label}
          {action.variant === 'default' && (
            <ArrowRightIcon size={15} aria-hidden="true" className="rtl:-scale-x-100" />
          )}
        </Link>
      ))}
    </div>
  );
}
