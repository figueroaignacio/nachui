import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'always',
});
