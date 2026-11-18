import { getSidebarPreviews } from '@/features/docs/lib/sidebar-previews';
import { ICON_CATALOG } from '@/features/icons/lib/icons';
import { ContentRepository } from '@/lib/content-repository';
import { getDocsSections } from '@/lib/docs-navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { CatalogBrowser } from '../components/catalog-browser';
import { buildCatalogGroups } from '../lib/catalog';

export async function CatalogView() {
  const locale = await getLocale();
  const tDocs = await getTranslations('docs');
  const previews = getSidebarPreviews(ContentRepository.getDocs(), locale);
  const groups = buildCatalogGroups(getDocsSections(tDocs), previews);

  return <CatalogBrowser groups={groups} iconCount={ICON_CATALOG.length} />;
}
