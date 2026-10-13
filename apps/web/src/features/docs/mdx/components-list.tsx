import { useDocsSections } from '@/hooks/use-docs-sections';
import { Empty } from '@repo/ui/components/empty';
import { useTranslations } from 'next-intl';
import { ComponentGrid } from '@/components/common/component-grid';

/**
 * Grid of every item in one docs navigation section. `section` is the
 * section's stable `id` from docs.json (case-insensitive), so it reads the same
 * in both locales.
 */
export function ComponentsList({ section = 'ui' }: { section?: string }) {
  const t = useTranslations('docs.componentsList');
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

  return <ComponentGrid items={match.items} className="mt-6" />;
}
