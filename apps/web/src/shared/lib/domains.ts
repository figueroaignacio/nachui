export const baseUrl = 'https://nachui.tech';

export const GITHUB_REPO_URL = 'https://github.com/figueroaignacio/ui';

/** Where the docs collection lives, relative to the repository root. */
const DOCS_CONTENT_ROOT = 'apps/web/src/content/docs';

/**
 * GitHub edit URL for a docs page.
 *
 * `sourceFilePath` comes from content-collections and is relative to the
 * collection directory, extension included ("en/concepts/cli.mdx"), so this
 * only prepends the repository path. Appending `.mdx` here would double it.
 */
export function getDocEditUrl(sourceFilePath: string): string {
  return `${GITHUB_REPO_URL}/edit/main/${DOCS_CONTENT_ROOT}/${sourceFilePath}`;
}

export const locales = ['en', 'es'] as const;
export type SupportedLocale = (typeof locales)[number];

export const defaultLocale: SupportedLocale = 'en';

export function getDomainForLocale(locale: string): string {
  return `${baseUrl}/${locale}`;
}

function normalizePath(path: string): string {
  const cleaned = path === '/' ? '/' : path.replace(/\/+$/, '');
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
}

/** Absolute URL of a *page*, which always lives under a locale segment. */
export function getAbsoluteUrl(locale: string, path = ''): string {
  return `${baseUrl}/${locale}${normalizePath(path)}`;
}

/**
 * Absolute URL of something that is not a page: a file in `public/` or a route
 * handler under `app/api/`. Neither lives under the locale segment, so passing
 * these through `getAbsoluteUrl` produces a 404 that only shows up when a
 * crawler tries to fetch the og:image.
 */
export function getAssetUrl(path: string): string {
  return `${baseUrl}${normalizePath(path)}`;
}

export function buildAlternates(path = '') {
  const cleaned = path === '/' ? '/' : path.replace(/\/+$/, '');
  const cleanPath = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;

  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = `${baseUrl}/${locale}${cleanPath}`;
  }
  languages['x-default'] = `${baseUrl}/${defaultLocale}${cleanPath}`;

  return languages;
}
