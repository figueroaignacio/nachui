'use client';

import { Link } from '@/i18n/navigation';
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
    <section className="flex w-full flex-col pt-12 pb-12 md:pt-16 lg:pt-24 lg:pb-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h1 className="font-heading text-foreground text-[2rem] leading-[1.1] font-semibold tracking-tight md:text-[2.75rem] lg:text-[3.25rem]">
          {t('subheading1')}
        </h1>
        <p className="text-muted-strong mt-5 max-w-2xl text-[17px] leading-relaxed font-normal md:text-[18px]">
          {t('description')}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <Link
            href={actions[0]?.href ?? '/docs'}
            className="bg-foreground text-background inline-flex items-center gap-2 rounded-md px-4 py-2 font-mono text-sm transition-all hover:opacity-80 active:scale-[0.98]"
          >
            {actions[0]?.label ?? 'Get started'}
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href={actions[1]?.href ?? '/docs/elements/ui'}
            className="text-muted-foreground hover:text-foreground font-mono text-sm transition-colors"
          >
            {actions[1]?.label ?? 'View components'} ↗
          </Link>
        </div>
      </div>
      <div className="mt-12 w-full md:mt-16">
        <PreviewMasonry />
      </div>
    </section>
  );
}
