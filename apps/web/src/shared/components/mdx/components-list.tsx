'use client';

import { useTranslations } from 'next-intl';
import { ComponentGrid, type ComponentGridItem } from '../common/component-grid';

type DocsNavigationSection = {
  title: string;
  items: ComponentGridItem[];
};

export function ComponentsList({ section }: { section?: string }) {
  const t = useTranslations('docs');
  const docsNavigation = t.raw('navigation') as DocsNavigationSection[];

  const componentsSection = docsNavigation.find((s) =>
    section
      ? s.title.toLowerCase() === section.toLowerCase()
      : s.title === 'Elementos UI' || s.title === 'UI Elements',
  );

  if (!componentsSection) {
    return <div>No components found for section "{section || 'Components'}"</div>;
  }

  return <ComponentGrid items={componentsSection.items} className="mt-6" />;
}
