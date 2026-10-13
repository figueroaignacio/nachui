import path from 'node:path';

/**
 * Pure helpers behind `sync-registry.ts`. Nothing here touches the database or
 * the filesystem directly, so the import graph can be unit tested.
 *
 * Paths are POSIX and relative to `packages/ui/src`, for example
 * `components/button.tsx` or `lib/cn.ts`. The CLI writes every item at
 * `<baseDir>/<dir>/<file>`, so these are also the paths users end up with.
 */

/** Maps a catalog directory (`components`) to its registry family (`ui`). */
export type DirFamilies = ReadonlyMap<string, string>;

/** Families whose files are plain modules (`.ts`) rather than components (`.tsx`). */
export const MODULE_FAMILIES: ReadonlySet<string> = new Set(['lib', 'hooks']);

export interface CatalogItem {
  slug: string;
  name: string;
  family: string;
  file: string;
  dependencies: string[];
  registryDependencies: string[];
}

export interface CatalogGraph {
  items: CatalogItem[];
  errors: string[];
}

const STATIC_IMPORT = /^\s*(?:import|export)\b[^;'"]*?\bfrom\s*['"]([^'"\n]+)['"]/gm;
const SIDE_EFFECT_IMPORT = /^\s*import\s*['"]([^'"\n]+)['"]/gm;
const DYNAMIC_IMPORT = /\bimport\(\s*['"]([^'"\n]+)['"]\s*\)/g;

/** Every module specifier a file imports or re-exports, in source order, deduped. */
export function parseImportSpecifiers(code: string): string[] {
  const found: string[] = [];

  for (const pattern of [STATIC_IMPORT, SIDE_EFFECT_IMPORT, DYNAMIC_IMPORT]) {
    for (const match of code.matchAll(pattern)) {
      if (match[1]) found.push(match[1]);
    }
  }

  return [...new Set(found)];
}

export function isRelativeSpecifier(specifier: string): boolean {
  return specifier === '.' || specifier === '..' || /^\.\.?\//.test(specifier);
}

/**
 * The npm package a bare specifier belongs to, or null when it is relative or
 * a Node builtin. `motion/react` gives `motion`, `@scope/pkg/sub` gives
 * `@scope/pkg`.
 */
export function npmPackageName(specifier: string): string | null {
  if (isRelativeSpecifier(specifier) || specifier.startsWith('/')) return null;
  if (specifier.startsWith('node:')) return null;

  const parts = specifier.split('/');

  if (specifier.startsWith('@')) {
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : null;
  }

  return parts[0] || null;
}

/**
 * Resolves a relative import the way a bundler would: the exact path when it
 * has an extension, then `.ts`, `.tsx`, `/index.ts` and `/index.tsx`.
 * Returns null when nothing exists or the import leaves `src`.
 */
export function resolveRelativeImport(
  fromFile: string,
  specifier: string,
  exists: (file: string) => boolean,
): string | null {
  const base = path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), specifier));

  if (base === '..' || base.startsWith('../') || path.posix.isAbsolute(base)) return null;

  const candidates = /\.(t|j)sx?$/.test(base)
    ? [base]
    : [`${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`];

  return candidates.find(exists) ?? null;
}

/**
 * The registry slug for a catalog file. Only flat files directly inside a
 * known directory have one: `components/button.tsx` is `ui/button`.
 */
export function slugForFile(file: string, dirFamilies: DirFamilies): string | null {
  const segments = file.split('/');
  if (segments.length !== 2) return null;

  const [dir, fileName] = segments as [string, string];
  const family = dirFamilies.get(dir);
  if (!family) return null;

  const name = fileName.replace(/\.(t|j)sx?$/, '').toLowerCase();
  if (!/^[a-z0-9-]+$/.test(name)) return null;

  return `${family}/${name}`;
}

/**
 * The CLI cannot see file extensions, it derives them from the family. A file
 * that breaks the convention would install under the wrong name, so it is
 * reported instead of synced.
 */
export function extensionMatchesFamily(file: string, family: string): boolean {
  const wantsModule = MODULE_FAMILIES.has(family);
  return wantsModule ? file.endsWith('.ts') : file.endsWith('.tsx');
}

/**
 * Walks the catalog from the seed files (every component) through their
 * relative imports, so shared helpers such as `lib/cn` or a hook become
 * registry items as soon as one component reaches them. Each file is visited
 * once, so import cycles terminate.
 */
export function buildCatalogGraph(options: {
  seeds: string[];
  dirFamilies: DirFamilies;
  readFile: (file: string) => string;
  exists: (file: string) => boolean;
}): CatalogGraph {
  const { seeds, dirFamilies, readFile, exists } = options;
  const items = new Map<string, CatalogItem>();
  const errors: string[] = [];
  const queue = [...seeds];
  const seen = new Set<string>(seeds);

  while (queue.length > 0) {
    const file = queue.shift() as string;
    const slug = slugForFile(file, dirFamilies);

    if (!slug) {
      errors.push(`${file}: not a flat file inside a registry directory`);
      continue;
    }

    const [family, name] = slug.split('/') as [string, string];

    if (!extensionMatchesFamily(file, family)) {
      const expected = MODULE_FAMILIES.has(family) ? '.ts' : '.tsx';
      errors.push(`${file}: files in the ${family} family must use ${expected}`);
      continue;
    }

    const existing = items.get(slug);
    if (existing) {
      errors.push(`${file}: slug ${slug} is already taken by ${existing.file}`);
      continue;
    }

    const dependencies = new Set<string>();
    const registryDependencies = new Set<string>();

    for (const specifier of parseImportSpecifiers(readFile(file))) {
      if (!isRelativeSpecifier(specifier)) {
        const pkg = npmPackageName(specifier);
        if (!pkg) continue;
        if (pkg.startsWith('@repo/')) {
          errors.push(`${file}: imports the workspace package ${pkg}, which users cannot install`);
          continue;
        }
        dependencies.add(pkg);
        continue;
      }

      const target = resolveRelativeImport(file, specifier, exists);
      const targetSlug = target ? slugForFile(target, dirFamilies) : null;

      if (!target || !targetSlug) {
        errors.push(`${file}: cannot resolve '${specifier}' to a registry item`);
        continue;
      }

      if (targetSlug !== slug) registryDependencies.add(targetSlug);

      if (!seen.has(target)) {
        seen.add(target);
        queue.push(target);
      }
    }

    items.set(slug, {
      slug,
      name,
      family,
      file,
      dependencies: [...dependencies].sort(),
      registryDependencies: [...registryDependencies].sort(),
    });
  }

  return {
    items: [...items.values()].sort((a, b) => a.slug.localeCompare(b.slug)),
    errors,
  };
}

/** Rows in the database that no longer have a source file. */
export function findStaleSlugs(dbSlugs: string[], syncedSlugs: Iterable<string>): string[] {
  const synced = new Set(syncedSlugs);
  return dbSlugs.filter((slug) => !synced.has(slug)).sort();
}
