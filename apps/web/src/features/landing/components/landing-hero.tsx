'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { HeroComponentPreview } from './hero-component-preview';

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
    <section className="w-full">
      <div className="mx-auto w-full pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-2xl">
          <h1 className="font-heading text-foreground text-[2rem] leading-[1.1] font-normal tracking-tight italic md:text-[2.75rem]">
            {t('subheading1')}
          </h1>
          <p className="text-muted-strong mt-5 text-[17px] leading-relaxed font-normal md:text-[18px]">
            {t('description')}
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Link
              href={actions[0]?.href ?? '/docs'}
              className="bg-foreground text-background inline-flex items-center gap-2 rounded-md px-4 py-2 font-mono text-sm transition-all hover:opacity-80 active:scale-[0.98]"
            >
              {actions[0]?.label ?? 'Get started'}
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href={actions[1]?.href ?? '/docs/components'}
              className="text-muted-foreground hover:text-foreground border-border rounded-md border px-4 py-2 font-mono text-sm transition-colors"
            >
              {actions[1]?.label ?? 'View components'} ↗
            </Link>
          </div>
        </div>
      </div>
      <div className="relative mx-auto mb-8 w-full">
        <div className="relative [zoom:0.65] overflow-hidden rounded-t-lg sm:[zoom:1]">
          <HeroComponentPreview />
        </div>
        <div
          aria-hidden="true"
          className="from-background pointer-events-none absolute inset-x-0 bottom-0 z-10 h-72 bg-linear-to-t to-transparent sm:hidden"
        />
      </div>
    </section>
  );
}
