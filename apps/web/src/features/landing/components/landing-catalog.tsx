import { CatalogTile } from '@/features/catalog/components/catalog-tile';
import { IconsTile } from '@/features/catalog/components/icons-tile';
import { buildCatalogGroups, pickCatalogEntries } from '@/features/catalog/lib/catalog';
import { getSidebarPreviews } from '@/features/docs/lib/sidebar-previews';
import { ICON_CATALOG } from '@/features/icons/lib/icons';
import { Link } from '@/i18n/navigation';
import { ContentRepository } from '@/lib/content-repository';
import { getDocsSections } from '@/lib/docs-navigation';
import { ArrowRightIcon } from '@repo/ui/icons/arrow-right';
import { getLocale, getTranslations } from 'next-intl/server';

/** The five pieces shown on the landing, picked to cover both families. */
const PICKS = [
  '/docs/elements/ai/response',
  '/docs/elements/ai/terminal',
  '/docs/elements/ai/model-selector',
  '/docs/elements/ui/button',
  '/docs/elements/ui/input-otp',
] as const;

export async function LandingCatalog() {
  const locale = await getLocale();
  const t = await getTranslations('sections.home.catalog');
  const tDocs = await getTranslations('docs');
  const groups = buildCatalogGroups(
    getDocsSections(tDocs),
    getSidebarPreviews(ContentRepository.getDocs(), locale),
  );
  const count = (id: string) => groups.find((group) => group.id === id)?.entries.length ?? 0;
  const tagOf = (href: string) => (href.includes('/elements/ai/') ? t('tags.ai') : t('tags.ui'));

  return (
    <section className="mx-auto w-full max-w-[70rem] pt-16 md:pt-20">
      <h2 className="font-heading text-foreground text-2xl leading-tight font-normal tracking-[-0.025em] text-balance md:text-center md:text-3xl">
        {t('heading', { ai: count('ai'), ui: count('ui'), icons: ICON_CATALOG.length })}
      </h2>
      <p className="text-muted-foreground mt-2 md:text-center">{t('description')}</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pickCatalogEntries(groups, PICKS).map((entry) => (
          <CatalogTile key={entry.href} entry={entry} tag={tagOf(entry.href)} />
        ))}
        <IconsTile
          caption={t('iconsCaption')}
          limit={10}
          tag={String(ICON_CATALOG.length)}
          className="h-72"
        />
      </div>
      <div className="mt-6 flex md:justify-center">
        <Link
          href="/components"
          className="bg-popover border-border text-foreground hover:border-border-interactive focus-visible:ring-ring focus-visible:ring-offset-background inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:w-auto"
        >
          {t('action')}
          <ArrowRightIcon size={15} aria-hidden="true" className="rtl:-scale-x-100" />
        </Link>
      </div>
    </section>
  );
}
