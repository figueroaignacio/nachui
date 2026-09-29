'use client';

import { Link } from '@/i18n/navigation';
import { Button, buttonVariants } from '@repo/ui/components/button';
import { ArrowRightIcon } from '@repo/ui/icons/arrow-right';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';
import { PreviewWall } from './preview-wall';

interface HeroAction {
  href: string;
  label: string;
  variant: 'default' | 'outline';
}

export function LandingHero() {
  const t = useTranslations('sections.home');
  const actions: HeroAction[] = t.raw('actions');

  return (
    <>
      <section className="flex min-h-[calc(100svh-5rem)] w-full flex-col items-center justify-center py-16 text-center md:py-20">
        <h1 className="font-heading text-foreground text-[clamp(4rem,22vw,12.25rem)] leading-[0.8] font-black tracking-[-0.075em] uppercase">
          <span className="sr-only">{t('subheading1')}</span>
          <span aria-hidden="true" className="block">
            {t('headline1')}
          </span>
          <span aria-hidden="true" className="block">
            {t('headline2')}
            <span className="bg-brand ml-[0.05em] inline-block size-[0.16em]" />
          </span>
        </h1>

        <p className="text-muted-strong mt-7 max-w-[56ch] text-[15px] leading-relaxed md:mt-9 md:text-[17px]">
          {t('description')}
        </p>

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
      </section>

      <div className="w-full">
        <PreviewWall />
      </div>
    </>
  );
}
