/**
 * A registry slug is a bare name (`button`) or a qualified one (`ui/button`),
 * lowercase letters, digits and dashes only. Anything else is rejected before
 * it reaches SQL, which also keeps `%` and `_` out of the LIKE lookup.
 */
export const SLUG_PATTERN = /^[a-z0-9-]+(\/[a-z0-9-]+)?$/;

/** The normalized slug, or null when the input cannot be a registry slug. */
export function normalizeSlug(input: string): string | null {
  const value = input.trim().toLowerCase();
  return SLUG_PATTERN.test(value) ? value : null;
}
