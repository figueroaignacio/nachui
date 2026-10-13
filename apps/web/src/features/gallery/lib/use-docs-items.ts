'use client';

import { useDocsSections } from '@/hooks/use-docs-sections';
import type { DocItem } from '@/lib/definitions';
import { getDocItems } from '@/lib/docs-navigation';

export function useDocsItems(): DocItem[] {
  return getDocItems(useDocsSections());
}
