import { useLocale } from 'next-intl';

export function useCopy<T>(copy: { en: T; es: T }): T {
  return useLocale() === 'es' ? copy.es : copy.en;
}
