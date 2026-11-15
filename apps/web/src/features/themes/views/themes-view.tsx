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
      <h1 className="font-heading text-foreground text-3xl leading-[1.1] font-light tracking-[-0.03em] lg:text-4xl">
        {t('title')}
        <span className="bg-brand ml-[0.05em] inline-block size-[0.16em]" />
      </h1>
      <p className="text-muted-strong mt-5 max-w-2xl text-lg leading-relaxed md:text-xl">
        {t('subtitle')}
      </p>
      <div className="mt-10 md:mt-12">
        <ThemesStudio presets={THEME_PRESETS} />
      </div>
    </section>
  );
}
