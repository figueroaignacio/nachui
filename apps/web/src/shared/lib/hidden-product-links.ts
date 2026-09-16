/**
 * Product entries that exist but are not linked from the navigation for now.
 * Their pages, code and copy stay in place; remove a path here to show it again.
 */
export const HIDDEN_PRODUCT_LINKS = ['/components', '/bricks/login'] as const;

export function isHiddenProductLink(href: string) {
  return (HIDDEN_PRODUCT_LINKS as readonly string[]).includes(href);
}
