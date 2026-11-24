import type { CSSProperties } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { HeroActions, type HeroAction } from './hero-actions';
import { HeroHeadline } from './hero-headline';
import { HeroMark } from './hero-mark';

export function LandingHero() {
  const t = useTranslations('sections.home');
  const actions: HeroAction[] = t.raw('actions');

  return (
    <section className="hero-stage bg-island rounded-lg shadow-xs sm:rounded-xl">
      <HeroMark />
      <div className="relative flex w-full flex-col md:items-center md:text-center">
        <Link
          href="/docs/elements/icons"
          className="hero-rise bg-secondary text-foreground focus-visible:ring-ring mb-5 hidden min-h-8 items-center gap-2 rounded-full py-1 ps-1 pe-3.5 text-[13px] font-medium shadow-xs focus-visible:ring-2 focus-visible:outline-none md:inline-flex"
        >
          <span className="bg-inverse text-inverse-foreground rounded-full px-2 py-0.5 font-mono text-xs">
            {t('announcement.badge')}
          </span>
          {t('announcement.text')}
        </Link>

        <HeroHeadline />

        <p
          style={{ '--e': '220ms' } as CSSProperties}
          className="hero-rise text-muted-strong mt-4 max-w-[60ch] text-base leading-relaxed md:mt-5 md:text-lg md:text-balance"
        >
          {t('description')}
        </p>

        <div className="hero-rise" style={{ '--e': '330ms' } as CSSProperties}>
          <HeroActions actions={actions} />
        </div>
      </div>
    </section>
  );
}
