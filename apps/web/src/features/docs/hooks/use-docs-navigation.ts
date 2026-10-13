import { useDocsSections } from '@/hooks/use-docs-sections';
import { useMemo } from 'react';

export function useDocsNavigation(currentPath: string) {
  const docsNavigation = useDocsSections();

  const { prev, next } = useMemo(() => {
    const allItems = docsNavigation.flatMap((section) => section.items);
    const currentIndex = allItems.findIndex((item) => item.href === currentPath);

    if (currentIndex === -1) return { prev: null, next: null };

    return {
      prev: currentIndex > 0 ? allItems[currentIndex - 1] : null,
      next: currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null,
    };
  }, [docsNavigation, currentPath]);

  return { prev, next };
}
