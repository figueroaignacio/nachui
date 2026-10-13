import { DEFAULT_LOCALE, LOCALES, SITE_URL } from './constants';

export const GITHUB_REPO_URL = 'https://github.com/figueroaignacio/ui';

export const GITHUB_ISSUES_URL = `${GITHUB_REPO_URL}/issues/new`;

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

function normalizePath(path: string): string {
  const cleaned = path === '/' ? '/' : path.replace(/\/+$/, '');
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
}

/** Absolute URL of a *page*, which always lives under a locale segment. */
export function getAbsoluteUrl(locale: string, path = ''): string {
  return `${SITE_URL}/${locale}${normalizePath(path)}`;
}

/**
 * Absolute URL of something that is not a page: a file in `public/` or a route
 * handler under `app/api/`. Neither lives under the locale segment, so passing
 * these through `getAbsoluteUrl` produces a 404 that only shows up when a
 * crawler tries to fetch the og:image.
 */
export function getAssetUrl(path: string): string {
  return `${SITE_URL}${normalizePath(path)}`;
}

export function buildAlternates(path = '') {
  const cleaned = path === '/' ? '/' : path.replace(/\/+$/, '');
  const cleanPath = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;

  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[locale] = `${SITE_URL}/${locale}${cleanPath}`;
  }
  languages['x-default'] = `${SITE_URL}/${DEFAULT_LOCALE}${cleanPath}`;

  return languages;
}
