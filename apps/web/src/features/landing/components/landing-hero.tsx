import type { CSSProperties } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { HeroActions, type HeroAction } from './hero-actions';
import { HeroOrbit } from './hero-orbit';

export function LandingHero() {
  const t = useTranslations('sections.home');
  const actions: HeroAction[] = t.raw('actions');

  return (
    <section className="hero-stage bg-island rounded-lg shadow-xs sm:rounded-xl">
      <HeroOrbit />
      <div className="relative z-10 flex w-full flex-col items-center text-center">
        <Link
          href="/docs/elements/icons"
          className="hero-rise bg-brand-soft border-brand-line text-brand-text focus-visible:ring-ring mb-6 inline-flex min-h-8 items-center gap-2 rounded-full border py-1 pr-3.5 pl-1 text-[13px] font-medium focus-visible:ring-2 focus-visible:outline-none"
        >
          <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 font-mono text-xs">
            {t('announcement.badge')}
          </span>
          {t('announcement.text')}
        </Link>
        <h1
          style={{ '--e': '110ms' } as CSSProperties}
          className="hero-rise font-heading text-foreground mx-auto max-w-[24ch] text-4xl leading-[1.08] font-semibold tracking-[-0.035em] text-balance md:text-5xl lg:text-[3.25rem]"
        >
          <span className="sr-only">{t('subheading1')}</span>
          <span aria-hidden="true" className="block">
            {t('headline1')}
          </span>
          <span aria-hidden="true" className="block">
            {t('headline2')}{' '}
            <span className="bg-brand-highlight text-brand-highlight-foreground rounded-[0.22em] px-[0.18em]">
              {t('headline2Highlight')}
            </span>
            <span className="bg-brand ml-[0.05em] inline-block size-[0.16em]" />
          </span>
        </h1>

        <p
          style={{ '--e': '220ms' } as CSSProperties}
          className="hero-rise text-muted-strong mx-auto mt-5 max-w-[56ch] text-base leading-relaxed md:text-lg"
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
