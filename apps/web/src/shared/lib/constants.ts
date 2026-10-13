/**
 * Site-wide constants. Routing, metadata, the content collection and the
 * route handlers all read the locales and the public URL from here.
 */

export const LOCALES = ['en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Public origin of the site, without a trailing slash. Set
 * `NEXT_PUBLIC_APP_URL` for previews; production falls back to the real domain.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://nachui.tech').replace(
  /\/+$/,
  '',
);
