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
          <div className="mt-8 flex items-center gap-5">
            <Link
              href={actions[0]?.href ?? '/docs'}
              className="bg-foreground text-background inline-flex items-center gap-2 rounded-[4px] px-4 py-2 font-mono text-sm transition-all hover:opacity-80 active:scale-[0.98]"
            >
              {actions[0]?.label ?? 'Get started'}
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href={actions[1]?.href ?? '/docs/components'}
              className="text-muted-foreground hover:text-foreground font-mono text-sm transition-colors"
            >
              {actions[1]?.label ?? 'View components'} ↗
            </Link>
          </div>
        </div>
      </div>
      <div className="relative mx-6 mb-8 overflow-hidden sm:hidden" style={{ height: '420px' }}>
        <div
          style={{
            transform: 'scale(0.65)',
            transformOrigin: 'top left',
            width: `${(100 / 0.65).toFixed(4)}%`,
          }}
        >
          <HeroComponentPreview />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-36"
          style={{
            background: 'linear-gradient(to top, var(--background) 0%, transparent 100%)',
          }}
        />
      </div>

      <div className="relative mx-auto mb-0 hidden w-full sm:block">
        <div className="relative overflow-hidden rounded-t-lg">
          <HeroComponentPreview />
        </div>
      </div>
    </section>
  );
}
