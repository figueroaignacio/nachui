import { getTranslations } from 'next-intl/server';

import { ThemesStudio } from '../components/themes-studio';
import { THEME_PRESETS } from '../lib/presets';
import { presetScopeCss } from '../lib/scope';

const PRESET_SCOPE_CSS = presetScopeCss(THEME_PRESETS);

export async function ThemesView() {
  const t = await getTranslations('sections.themes');

  return (
    <section className="w-full pt-16 pb-10 md:pt-24">
      <style>{PRESET_SCOPE_CSS}</style>
      <h1 className="font-heading text-foreground text-[clamp(2.25rem,min(11vw,6vh),2.75rem)] leading-[0.95] font-bold tracking-[-0.04em] lg:text-[clamp(2.75rem,min(4.5vw,8vh),3.25rem)]">
        {t('title')}
        <span className="bg-brand ml-[0.05em] inline-block size-[0.16em]" />
      </h1>
      <p className="text-muted-foreground mt-5 max-w-2xl text-base leading-relaxed">
        {t('subtitle')}
      </p>
      <div className="mt-10 md:mt-12">
        <ThemesStudio presets={THEME_PRESETS} />
      </div>
    </section>
  );
}
