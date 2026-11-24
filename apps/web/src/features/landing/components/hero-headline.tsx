import type { CSSProperties, ReactNode } from 'react';
import { CornerDownLeftIcon } from '@repo/ui/icons/corner-down-left';
import { SparklesIcon } from '@repo/ui/icons/sparkles';
import { useTranslations } from 'next-intl';
import { HeroThemeSwitch } from './hero-theme-switch';

const hidden = (chunks: ReactNode) => <span aria-hidden="true">{chunks}</span>;

const soft = (chunks: ReactNode) => (
  <span aria-hidden="true" className="text-hero-soft">
    {chunks}
  </span>
);

/**
 * The headline with real pieces inside the sentence. The `h1` carries the plain
 * text; the drawn line is hidden from assistive tech word by word, so the theme
 * switch inside it stays reachable.
 */
export function HeroHeadline() {
  const t = useTranslations('sections.home');

  return (
    <div className="hero-rise" style={{ '--e': '110ms' } as CSSProperties}>
      <h1 className="sr-only">{t('subheading1')}</h1>
      <div className="font-heading text-foreground text-4xl leading-[1.14] font-semibold tracking-[-0.04em] md:mx-auto md:max-w-[40rem] md:text-5xl md:leading-[1.1] md:text-balance lg:max-w-[52rem] lg:text-[3.5rem]">
        {t.rich('headline', {
          t: hidden,
          soft,
          theme: (chunks) => (
            <span className="whitespace-nowrap">
              {hidden(chunks)} <HeroThemeSwitch label={t('themeSwitch')} />
            </span>
          ),
          me: (chunks) => (
            <span aria-hidden="true" className="text-hero-soft whitespace-nowrap">
              {chunks}{' '}
              <span className="hero-key bg-secondary text-foreground">
                <CornerDownLeftIcon size="0.46em" strokeWidth={2} className="rtl:-scale-x-100" />
              </span>
            </span>
          ),
          agent: (chunks) => (
            <span aria-hidden="true" className="text-hero-soft whitespace-nowrap">
              {chunks}{' '}
              <span className="hero-chip bg-primary text-primary-foreground rounded-[0.24em] inset-shadow-xs">
                <SparklesIcon size="0.46em" strokeWidth={1.75} className="m-[0.14em] block" />
              </span>
            </span>
          ),
        })}
      </div>
    </div>
  );
}
