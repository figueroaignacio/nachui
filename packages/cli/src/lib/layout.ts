import path from 'node:path';

/**
 * Where each registry family lives under `baseDir`. This mirrors
 * `packages/ui/src`, which is what makes a component's relative imports
 * (`../lib/cn`, `../components/button`, `./label`) resolve after install.
 */
export const FAMILY_DIRS: Readonly<Record<string, string>> = {
  ui: 'components',
  layout: 'layout',
  ai: 'ai',
  hybrids: 'hybrids',
  icons: 'icons',
  lib: 'lib',
  hooks: 'hooks',
};

/** Shared helpers installed as dependencies, not components users pick. */
export const SUPPORT_FAMILIES: ReadonlySet<string> = new Set(['lib', 'hooks']);

const SEGMENT = /^[a-z0-9-]+$/;
const SLUG = /^[a-z0-9-]+(\/[a-z0-9-]+)?$/;

export class InvalidSlugError extends Error {}

export function isValidSlug(slug: string): boolean {
  return SLUG.test(slug);
}

/** `ui/button` gives `{ family: 'ui', name: 'button' }`, `button` gives no family. */
export function splitSlug(slug: string): { family: string | null; name: string } {
  const value = slug.trim().toLowerCase();
  if (!isValidSlug(value)) {
    throw new InvalidSlugError(
      `"${slug}" is not a valid component name. Try "button" or "ui/button".`,
    );
  }

  const [first, second] = value.split('/') as [string, string | undefined];
  return second === undefined ? { family: null, name: first } : { family: first, name: second };
}

function fileExtension(family: string): string {
  return SUPPORT_FAMILIES.has(family) ? '.ts' : '.tsx';
}

function familyDir(family: string): string {
  return FAMILY_DIRS[family] ?? family;
}

/**
 * Project-relative POSIX path an item installs to, for example
 * `src/components/button.tsx` or `src/lib/cn.ts`. Rows that predate qualified
 * slugs carry their family in `type`, and default to `ui`.
 */
export function installPath(item: { slug: string; type?: string | null }, baseDir: string): string {
  const { family: slugFamily, name } = splitSlug(item.slug);
  const family = slugFamily ?? item.type ?? 'ui';

  if (!SEGMENT.test(family)) {
    throw new InvalidSlugError(`"${item.slug}" has an invalid family "${family}".`);
  }

  return path.posix.join(baseDir, familyDir(family), `${name}${fileExtension(family)}`);
}

/**
 * Every path a slug could be installed at. A qualified slug has one; a bare
 * name could be in any family, which `remove` has to check on disk.
 */
export function candidatePaths(slug: string, baseDir: string): string[] {
  const { family, name } = splitSlug(slug);
  const families = family ? [family] : Object.keys(FAMILY_DIRS);
  return families.map((f) => installPath({ slug: `${f}/${name}` }, baseDir));
}

/** Resolves a project-relative path, refusing anything that escapes `cwd`. */
export function resolveInside(cwd: string, relative: string): string {
  const root = path.resolve(cwd);
  const absolute = path.resolve(root, relative);
  const fromRoot = path.relative(root, absolute);

  if (fromRoot === '' || fromRoot.startsWith('..') || path.isAbsolute(fromRoot)) {
    throw new InvalidSlugError(`Refusing to write outside the project: ${relative}`);
  }

  return absolute;
}
