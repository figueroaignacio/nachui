'use client';

import { Link } from '@/i18n/navigation';
import { ComponentGrid, type ComponentGridItem } from '@/shared/components/common/component-grid';
import { useTranslations } from 'next-intl';

type DocsNavigationSection = {
  title: string;
  items: ComponentGridItem[];
};

export function LandingCatalog() {
  const t = useTranslations('sections.home.catalog');
  const tDocs = useTranslations('docs');
  const docsNavigation = tDocs.raw('navigation') as DocsNavigationSection[];

  const components =
    docsNavigation.find((s) => s.title === 'Components' || s.title === 'Componentes')?.items ?? [];

  if (components.length === 0) return null;

  return (
    <section className="w-full pt-10 pb-4" aria-labelledby="catalog-title">
      <div className="rule-bleed" />
      <div className="flex flex-col gap-3 pt-6 pb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div className="max-w-xl">
          <p className="section-label">{t('label')}</p>
          <h2
            id="catalog-title"
            className="font-heading text-foreground mt-3 text-[1.375rem] font-semibold tracking-tight md:text-[1.625rem]"
          >
            {t('title', { count: components.length })}
          </h2>
          <p className="text-muted-strong mt-2 text-[15px] leading-relaxed">{t('description')}</p>
        </div>
        <Link
          href="/docs/components"
          className="text-muted-foreground hover:text-foreground shrink-0 font-mono text-sm transition-colors"
        >
          {t('cta')} ↗
        </Link>
      </div>

      <ComponentGrid items={components} />
    </section>
  );
}
