/**
 * Where generated files may live and how their imports resolve.
 *
 * A Studio project mirrors the layout the installation guide recommends:
 * NachUI files sit in `components/`, `ai/`, `lib/` and friends, and the
 * generated screen lives in `screens/`, so `../components/card` resolves the
 * same way in the preview, in the checks and in the user's repo.
 */

export const SCREENS_DIR = 'screens';

export const CATALOG_DIRS = [
  'components',
  'layout',
  'ai',
  'hybrids',
  'icons',
  'lib',
  'hooks',
] as const;

export type CatalogDir = (typeof CATALOG_DIRS)[number];

/** Registry family of each catalog directory, as `registry:sync` names them. */
export const CATALOG_DIR_FAMILY: Record<CatalogDir, string> = {
  components: 'ui',
  layout: 'layout',
  ai: 'ai',
  hybrids: 'hybrids',
  icons: 'icons',
  lib: 'lib',
  hooks: 'hooks',
};

/** npm packages generated code may import. Everything a catalog file needs, plus React. */
export const ALLOWED_PACKAGES = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'clsx',
  'tailwind-merge',
  'motion',
  'motion/react',
  'class-variance-authority',
  'zod',
] as const;

export const PROJECT_LIMITS = {
  maxFiles: 12,
  maxFileChars: 60_000,
  maxPathLength: 120,
  maxDepth: 3,
} as const;

const SEGMENT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FILE = /^[a-z0-9]+(?:-[a-z0-9]+)*\.(tsx|ts)$/;

export type PathResult = { ok: true; path: string } | { ok: false; reason: string };

/** Accepts `screens/billing-page.tsx` and nested parts; rejects anything else. */
export function normalizeProjectPath(input: string): PathResult {
  const path = input.trim().replace(/^\.\//, '').replace(/^\/+/, '');

  if (path.length === 0) return { ok: false, reason: 'The path is empty.' };
  if (path.length > PROJECT_LIMITS.maxPathLength) {
    return {
      ok: false,
      reason: `Paths are limited to ${PROJECT_LIMITS.maxPathLength} characters.`,
    };
  }
  if (path.includes('\\')) return { ok: false, reason: 'Use forward slashes in paths.' };

  const segments = path.split('/');
  if (segments.some((segment) => segment === '..' || segment === '.')) {
    return { ok: false, reason: 'Paths cannot go up a folder.' };
  }
  if (segments[0] !== SCREENS_DIR) {
    return {
      ok: false,
      reason: `Generated files live in ${SCREENS_DIR}/. NachUI files come from the catalog and are never written.`,
    };
  }
  if (segments.length < 2 || segments.length > PROJECT_LIMITS.maxDepth) {
    return {
      ok: false,
      reason: `Use ${SCREENS_DIR}/<name>.tsx for the screen and ${SCREENS_DIR}/<name>/<part>.tsx for its parts.`,
    };
  }

  const file = segments[segments.length - 1] ?? '';
  const folders = segments.slice(1, -1);
  if (!FILE.test(file) || !folders.every((segment) => SEGMENT.test(segment))) {
    return { ok: false, reason: 'Use kebab-case names ending in .tsx or .ts.' };
  }

  return { ok: true, path };
}

/** A top-level file in `screens/` is a screen the preview can render. */
export function isScreenPath(path: string): boolean {
  const segments = path.split('/');
  return segments.length === 2 && segments[0] === SCREENS_DIR;
}

export type ImportTarget =
  | { kind: 'package'; name: string; allowed: boolean }
  | { kind: 'project'; base: string }
  | { kind: 'catalog'; dir: CatalogDir; name: string }
  | { kind: 'unknown'; reason: string };

function dirname(path: string): string {
  const index = path.lastIndexOf('/');
  return index === -1 ? '' : path.slice(0, index);
}

function stripExtension(path: string): string {
  return path.replace(/\.(tsx|ts|jsx|js)$/, '');
}

function isCatalogDir(value: string): value is CatalogDir {
  return (CATALOG_DIRS as readonly string[]).includes(value);
}

/** Resolves an import written in `from` the way a bundler would in the mirrored layout. */
export function resolveImport(from: string, specifier: string): ImportTarget {
  if (!specifier.startsWith('.')) {
    if (specifier.startsWith('next/') || specifier === 'next') {
      return {
        kind: 'unknown',
        reason: 'NachUI code runs in any React app, so it never imports next/*.',
      };
    }
    if (specifier.startsWith('@/') || specifier.startsWith('~/')) {
      return {
        kind: 'unknown',
        reason: 'Use relative imports like ../components/card, not path aliases.',
      };
    }
    return {
      kind: 'package',
      name: specifier,
      allowed: (ALLOWED_PACKAGES as readonly string[]).includes(specifier),
    };
  }

  const parts = [...dirname(from).split('/').filter(Boolean)];
  for (const segment of specifier.split('/')) {
    if (segment === '.' || segment === '') continue;
    if (segment === '..') {
      if (parts.length === 0) return { kind: 'unknown', reason: 'The import leaves the project.' };
      parts.pop();
      continue;
    }
    parts.push(segment);
  }

  const resolved = stripExtension(parts.join('/'));
  const [first, second, ...rest] = resolved.split('/');

  if (first && isCatalogDir(first)) {
    if (!second || rest.length > 0) {
      return {
        kind: 'unknown',
        reason: `Import a single file from ${first}/, like ../${first}/<name>.`,
      };
    }
    return { kind: 'catalog', dir: first, name: second };
  }

  if (first === SCREENS_DIR) return { kind: 'project', base: resolved };

  return { kind: 'unknown', reason: `Nothing lives at ${resolved}.` };
}

/** Registry slug of a catalog file, `components/card` → `ui/card`. */
export function catalogSlug(dir: CatalogDir, name: string): string {
  return `${CATALOG_DIR_FAMILY[dir]}/${name}`;
}

/** Project files that an import base can point at, in resolution order. */
export function projectCandidates(base: string): string[] {
  return [`${base}.tsx`, `${base}.ts`, `${base}/index.tsx`, `${base}/index.ts`];
}
