import { useTranslations } from 'next-intl';
import { HeroActions, type HeroAction } from './hero-actions';
import { PreviewWall } from './preview-wall';

export function LandingHero() {
  const t = useTranslations('sections.home');
  const actions: HeroAction[] = t.raw('actions');

  return (
    <>
      <section className="flex w-full flex-col items-center pt-12 text-center md:pt-24">
        <h1 className="font-heading text-foreground mx-auto max-w-[24ch] text-4xl leading-[1.08] font-extralight tracking-[-0.035em] text-balance md:text-5xl lg:text-[3.25rem]">
          <span className="sr-only">{t('subheading1')}</span>
          <span aria-hidden="true" className="block">
            {t('headline1')}
          </span>
          <span aria-hidden="true" className="block">
            {t('headline2')}
            <span className="bg-brand ml-[0.05em] inline-block size-[0.16em]" />
          </span>
        </h1>

        <p className="text-muted-strong mx-auto mt-5 max-w-[56ch] text-base leading-relaxed md:text-lg">
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
