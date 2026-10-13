import type { DocItem, DocSection } from './definitions';

/**
 * Anything that can read the raw `docs` namespace: the translator returned by
 * `useTranslations('docs')` or `getTranslations({ namespace: 'docs' })`.
 */
export interface DocsTranslator {
  raw(key: 'navigation'): unknown;
}

/**
 * The docs navigation from `locales/{locale}/docs.json`. This is the one place
 * the raw message is cast; `scripts/check-navigation.mjs` keeps the JSON in
 * that shape.
 */
export function getDocsSections(t: DocsTranslator): DocSection[] {
  return t.raw('navigation') as DocSection[];
}

export function getDocItems(sections: DocSection[]): DocItem[] {
  return sections.flatMap((section) => section.items);
}

export function findDocItem(sections: DocSection[], href: string): DocItem | undefined {
  return sections.flatMap((section) => section.items).find((item) => item.href === href);
}
