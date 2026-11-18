/**
 * Product entries that exist but are not linked from the navigation for now.
 * Their pages, code and copy stay in place; remove a path here to show it again.
 */
export const HIDDEN_PRODUCT_LINKS = ['/bricks/login'] as const;

export function isHiddenProductLink(href: string) {
  return (HIDDEN_PRODUCT_LINKS as readonly string[]).includes(href);
}

/**
 * Docs navigation sections that exist but are not shown in the sidebar, the
 * search or the catalog for now. Their pages stay published and reachable by
 * URL; remove an id here to show the section again.
 */
export const HIDDEN_DOC_SECTIONS = ['hybrids'] as const;

export function isHiddenDocSection(id: string) {
  return (HIDDEN_DOC_SECTIONS as readonly string[]).includes(id);
}
