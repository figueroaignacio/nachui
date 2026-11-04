import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { IconsBrowser } from '../components/icons-browser';
import { getIconCatalog } from '../lib/get-icon-catalog';

export async function IconsView() {
  const t = await getTranslations('sections.icons');
  const icons = await getIconCatalog();

  return (
    <section className="w-full pt-16 pb-10 md:pt-24">
      <h1 className="font-heading text-foreground text-[clamp(2.25rem,min(11vw,6vh),2.75rem)] leading-[0.95] font-bold tracking-[-0.04em] lg:text-[clamp(2.75rem,min(4.5vw,8vh),3.25rem)]">
        {t('title')}
        <span className="bg-brand ml-[0.05em] inline-block size-[0.16em]" />
      </h1>
      <div className="mt-10 md:mt-12">
        <Suspense fallback={null}>
          <IconsBrowser icons={icons} />
        </Suspense>
      </div>
    </section>
  );
}
