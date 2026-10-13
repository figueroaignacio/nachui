import { getDocsSections } from '@/lib/docs-navigation';
import { useTranslations } from 'next-intl';

/** The docs navigation for the current locale, typed. */
export function useDocsSections() {
  return getDocsSections(useTranslations('docs'));
}
