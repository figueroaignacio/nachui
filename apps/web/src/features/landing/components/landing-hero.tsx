'use client';

import { Link } from '@/i18n/navigation';
import { ArrowRight02Icon, ArrowUpRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { buttonVariants } from '@repo/ui/components/button';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';

import { PreviewMasonry } from './preview-masonry';

interface HomePageActions {
  href: string;
  label: string;
  description: string;
  variant?: 'default' | 'secondary';
}

export function LandingHero() {
  const t = useTranslations('sections.home');
  const actions: HomePageActions[] = t.raw('actions');

  return (
    <section className="flex w-full flex-col items-center pt-8 text-center md:pt-10 lg:pt-14">
      <p className="section-label">{t('badge')}</p>
      <h1 className="font-heading text-foreground mt-4 max-w-3xl text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.02em] md:text-[2rem] lg:text-[2.25rem]">
        {t('subheading1')}
      </h1>
      <p className="text-muted-strong mt-4 max-w-[54ch] text-[15px] leading-relaxed md:text-base">
        {t('description')}
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        <Link
          href={actions[0]?.href ?? '/docs'}
          className={cn(
            buttonVariants({ variant: actions[0]?.variant ?? 'default', size: 'sm' }),
            'font-mono',
          )}
        >
          {actions[0]?.label ?? 'Get started'}
          <HugeiconsIcon icon={ArrowRight02Icon} size={14} aria-hidden="true" />
        </Link>
        <Link
          href={actions[1]?.href ?? '/docs/elements/ui'}
          className={cn(
            buttonVariants({ variant: 'link', size: 'sm' }),
            'text-muted-foreground hover:text-foreground font-mono',
          )}
        >
          {actions[1]?.label ?? 'View UI elements'}
          <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-14 md:mt-20">
        <PreviewMasonry />
      </div>
    </section>
  );
}
