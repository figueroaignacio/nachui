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
    <section className="flex w-full flex-col pt-8 md:pt-10 lg:pt-14">
      <p className="section-label">{t('badge')}</p>
      <h1 className="font-heading text-foreground mt-4 max-w-3xl text-[2rem] leading-[1.05] font-semibold tracking-[-0.02em] md:text-[2.5rem] lg:text-[3rem]">
        {t('subheading1')}
      </h1>
      <p className="text-muted-strong mt-4 max-w-[54ch] text-[15px] leading-relaxed md:text-base">
        {t('description')}
      </p>
      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link
          href={actions[0]?.href ?? '/docs'}
          className="bg-foreground text-background inline-flex items-center gap-2 rounded-md px-4 py-2.5 font-mono text-sm transition-all hover:opacity-80 active:scale-[0.98]"
        >
          {actions[0]?.label ?? 'Get started'}
          <span aria-hidden="true">→</span>
        </Link>
        <Link
          href={actions[1]?.href ?? '/docs/elements/ui'}
          className="text-muted-foreground hover:text-foreground font-mono text-sm transition-colors"
        >
          {actions[1]?.label ?? 'View UI elements'} ↗
        </Link>
      </div>

      <div className="rule-bleed mt-10 md:mt-14" />
      <div className="mt-10">
        <PreviewMasonry />
      </div>
    </section>
  );
}
