import type { NavigationSection, SearchResultItem } from '@/lib/definitions';

export function flattenNavigationItems(sections: NavigationSection[]): SearchResultItem[] {
  return sections.flatMap((section) =>
    section.items.map((item) => ({
      title: item.title,
      href: item.href,
      category: section.title,
      badge: item.badge,
    })),
  );
}
