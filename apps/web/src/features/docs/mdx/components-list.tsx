import { ComponentGrid } from '@/components/common/component-grid';
import { CatalogTile } from '@/features/catalog/components/catalog-tile';
import { CATALOG_FAMILIES, buildCatalogEntries } from '@/features/catalog/lib/catalog';
import { getSidebarPreviews } from '@/features/docs/lib/sidebar-previews';
import { useDocsSections } from '@/hooks/use-docs-sections';
import { ContentRepository } from '@/lib/content-repository';
import { Empty } from '@repo/ui/components/empty';
import { useLocale, useTranslations } from 'next-intl';

/**
 * Every item in one docs navigation section. `section` is the section's stable
 * `id` from docs.json (case-insensitive), so it reads the same in both locales.
 * The catalog families draw a live tile per component; any other section keeps
 * the dense name grid.
 */
export function ComponentsList({ section = 'ui' }: { section?: string }) {
  const t = useTranslations('docs.componentsList');
  const locale = useLocale();
  const sections = useDocsSections();
  const id = section.toLowerCase();
  const match = sections.find((candidate) => candidate.id === id);

  if (!match) {
    return (
      <Empty variant="outline" className="my-6">
        <Empty.Header>
          <Empty.Title>{t('emptyTitle')}</Empty.Title>
          <Empty.Description>{t('emptyDescription', { section })}</Empty.Description>
        </Empty.Header>
      </Empty>
    );
  }

  if (!(CATALOG_FAMILIES as readonly string[]).includes(id)) {
    return <ComponentGrid items={match.items} className="mt-6" />;
  }

  const previews = getSidebarPreviews(ContentRepository.getDocs(), locale);

  return (
    <div className="mt-6 grid gap-3 @xl:grid-cols-2 @5xl:grid-cols-3">
      {buildCatalogEntries(match, previews).map((entry) => (
        <CatalogTile key={entry.href} entry={entry} />
      ))}
    </div>
  );
}
