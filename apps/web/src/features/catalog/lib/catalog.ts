import type { SidebarPreview } from '@/features/docs/lib/sidebar-previews';
import type { DocBadge, DocSection } from '@/lib/definitions';

/** The docs sections the catalog shows, in display order. */
export const CATALOG_FAMILIES = ['ai', 'ui'] as const;

export type CatalogFamily = (typeof CATALOG_FAMILIES)[number];

export interface CatalogEntry {
  href: string;
  title: string;
  description?: string;
  badge?: DocBadge;
  /** Registry name and demo of the live preview drawn on the tile. */
  component: string;
  demo: string;
}

export interface CatalogGroup {
  id: CatalogFamily;
  title: string;
  entries: CatalogEntry[];
}

/**
 * One tile per page of a docs section. The preview is the first demo of the
 * page when it has one; otherwise the page slug with its `default` demo, which
 * is how every element page is named.
 */
export function buildCatalogEntries(
  section: DocSection,
  previews: Record<string, SidebarPreview>,
): CatalogEntry[] {
  return section.items.map((item) => {
    const preview = previews[item.href];
    return {
      href: item.href,
      title: item.title,
      description: item.description ?? preview?.description,
      badge: item.badge,
      component: preview?.component ?? item.href.split('/').at(-1) ?? '',
      demo: preview?.demo ?? 'default',
    };
  });
}

export function buildCatalogGroups(
  sections: DocSection[],
  previews: Record<string, SidebarPreview>,
): CatalogGroup[] {
  return CATALOG_FAMILIES.flatMap((id) => {
    const section = sections.find((candidate) => candidate.id === id);
    if (!section) return [];
    return [{ id, title: section.title, entries: buildCatalogEntries(section, previews) }];
  });
}

/** Picks entries by their docs href, keeping the order they were asked in. */
export function pickCatalogEntries(groups: CatalogGroup[], hrefs: readonly string[]) {
  const all = groups.flatMap((group) => group.entries);
  return hrefs.flatMap((href) => all.find((entry) => entry.href === href) ?? []);
}
