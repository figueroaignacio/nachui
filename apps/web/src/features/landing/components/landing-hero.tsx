import { useTranslations } from 'next-intl';
import { HeroActions, type HeroAction } from './hero-actions';
import { PreviewWall } from './preview-wall';

export function LandingHero() {
  const t = useTranslations('sections.home');
  const actions: HeroAction[] = t.raw('actions');

  return (
    <>
      <section className="flex min-h-[calc(100svh-5rem)] w-full flex-col items-center justify-center py-16 text-center md:py-20">
        <h1 className="font-heading text-foreground text-[clamp(2.25rem,min(11vw,6vh),2.75rem)] leading-[0.95] font-bold tracking-[-0.04em] uppercase lg:text-[clamp(2.75rem,min(4.5vw,8vh),3.25rem)]">
          <span className="sr-only">{t('subheading1')}</span>
          <span aria-hidden="true" className="block">
            {t('headline1')}
          </span>
          <span aria-hidden="true" className="block">
            {t('headline2')}
            <span className="bg-brand ml-[0.05em] inline-block size-[0.16em]" />
          </span>
        </h1>

        <p className="text-muted-foreground mt-4 font-mono text-xs md:mt-5">{t('tagline')}</p>

        <p className="text-muted-strong mt-6 max-w-[56ch] text-[15px] leading-relaxed md:mt-7 md:text-[17px]">
          {t('description')}
        </p>

        <HeroActions actions={actions} />
      </section>

      <div className="w-full">
        <PreviewWall />
      </div>
    </>
  );
}
