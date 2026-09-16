import { Suspense } from 'react';
import { Separator } from '@repo/ui/components/separator';
import { getTranslations } from 'next-intl/server';
import { IconsBrowser } from '../components/icons-browser';
import { getIconCatalog } from '../lib/get-icon-catalog';

export async function IconsView() {
  const t = await getTranslations('sections.icons');
  const icons = await getIconCatalog();

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-muted-foreground mb-1 font-mono text-[0.68rem] tracking-widest uppercase">
          {t('eyebrow')}
        </p>
        <h1 className="font-serif text-[clamp(1.6rem,4vw,2.2rem)] leading-tight tracking-tight">
          {t('title')}
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
          {t('subtitle')}
        </p>
        <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
          {t('explainer', { count: icons.length })}
        </p>

        <Separator className="my-10" />

        <Suspense fallback={null}>
          <IconsBrowser icons={icons} />
        </Suspense>
      </div>
    </section>
  );
}
