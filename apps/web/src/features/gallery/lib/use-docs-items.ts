'use client';

import { useTranslations } from 'next-intl';

export type DocsNavItem = {
  title: string;
  href: string;
  description?: string;
  badge?: 'new' | 'updated';
};
type DocsNavSection = { title: string; items: DocsNavItem[] };

export function useDocsItems(): DocsNavItem[] {
  const t = useTranslations('docs');
  const sections = t.raw('navigation') as DocsNavSection[];
  return sections.flatMap((section) => section.items);
}
