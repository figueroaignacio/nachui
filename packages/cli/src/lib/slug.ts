/**
 * Component slugs come in two forms: the bare name (`button`) and the qualified
 * one (`ui/button`). The API resolves both, but the filesystem only ever gets
 * the last segment, because a slash in a filename would silently create a
 * directory instead.
 */

/** File-safe component name. `ui/button` and `button` both give `button`. */
export function componentFileName(slug: string): string {
  const segments = slug.split('/').filter(Boolean);
  return segments[segments.length - 1] ?? slug;
}

/** Whether the user already qualified the slug with its family. */
export function isQualified(slug: string): boolean {
  return slug.includes('/');
}
