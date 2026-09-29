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
      <section className="flex min-h-[calc(100svh-5rem)] w-full flex-col pt-14 pb-10 md:pt-24 md:pb-14">
        <p className="border-border text-muted-foreground inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] md:text-xs">
          <span aria-hidden="true" className="bg-brand size-1.5" />
          {t('badge')}
        </p>

        <h1 className="font-heading text-foreground mt-6 text-[16.5vw] leading-[0.82] font-black tracking-[-0.075em] uppercase md:mt-8 md:text-[10.5vw] min-[90rem]:text-[9.5rem]">
          <span className="sr-only">{t('subheading1')}</span>
          <span aria-hidden="true" className="block">
            {t('headline1')}
          </span>
          <span
            aria-hidden="true"
            className="bg-brand text-brand-foreground mt-[0.04em] inline-block px-[0.06em] pt-[0.06em]"
          >
            {t('headline2')}
          </span>
        </h1>

        <div className="border-foreground mt-auto flex flex-col gap-6 border-t-2 pt-6 md:flex-row md:items-start md:justify-between md:gap-12">
          <p className="text-foreground max-w-[36ch] text-[17px] leading-tight font-bold tracking-[-0.02em] text-pretty md:text-lg lg:text-xl">
            {t('description')}
          </p>

          <Button.Group
            attached
            className="w-full shrink-0 sm:w-auto [&>a:not(:first-child)]:-ml-px [&>a:not(:first-child)]:rounded-l-none [&>a:not(:last-child)]:rounded-r-none"
          >
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={cn(
                  buttonVariants({ variant: action.variant }),
                  'h-11 flex-1 rounded-[10px] px-2 font-mono text-xs sm:flex-none sm:px-4 sm:text-[13px] md:h-12 md:px-5 md:text-sm',
                )}
              >
                {action.label}
                {action.variant === 'default' && (
                  <ArrowRightIcon size={15} aria-hidden="true" className="hidden sm:block" />
                )}
              </Link>
            ))}
          </Button.Group>
        </div>
      </section>

      <div className="mt-10 w-full md:mt-16">
        <PreviewWall />
      </div>
    </>
  );
}
