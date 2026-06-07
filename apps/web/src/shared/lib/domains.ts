export const baseUrl = 'https://nachui.tech';

export const locales = ['en', 'es'] as const;
export type SupportedLocale = (typeof locales)[number];

export const defaultLocale: SupportedLocale = 'en';

export function getDomainForLocale(locale: string): string {
  return `${baseUrl}/${locale}`;
}

export function getAbsoluteUrl(locale: string, path = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}/${locale}${cleanPath}`;
}

export function buildAlternates(path = '') {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = `${baseUrl}/${locale}${cleanPath}`;
  }
  languages['x-default'] = `${baseUrl}/${defaultLocale}${cleanPath}`;

  return languages;
}
