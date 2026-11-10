import { CATALOG_DIRS } from '@repo/ai/studio-paths';
import { init, parse } from 'es-module-lexer/js';
import { transform } from 'sucrase';

export type SourceFiles = Record<string, string>;

export type CatalogLoader = (
  dir: string,
  name: string,
) => Promise<{ path: string; code: string } | null>;

export type PreviewModule = { id: number; path: string; code: string };

export type PreviewBundle = {
  modules: PreviewModule[];
  entry: number;
  paths: Record<number, string>;
};

export class BundleError extends Error {
  constructor(
    readonly path: string,
    message: string,
    readonly line?: number,
  ) {
    super(message);
  }
}

export const MODULE_PREFIX = 'nachui-module:';

const EXTENSIONS = ['.tsx', '.ts', '/index.tsx', '/index.ts'];

function dirname(path: string): string {
  const index = path.lastIndexOf('/');
  return index === -1 ? '' : path.slice(0, index);
}

/** Joins a relative specifier onto the importing file, or null when it leaves the root. */
export function joinRelative(from: string, specifier: string): string | null {
  const parts = dirname(from).split('/').filter(Boolean);
  for (const segment of specifier.split('/')) {
    if (segment === '.' || segment === '') continue;
    if (segment === '..') {
      if (parts.length === 0) return null;
      parts.pop();
      continue;
    }
    parts.push(segment);
  }
  return parts.join('/').replace(/\.(tsx|ts|jsx|js)$/, '');
}

function compile(path: string, code: string): string {
  try {
    return transform(code, {
      transforms: path.endsWith('.tsx') ? ['typescript', 'jsx'] : ['typescript'],
      jsxRuntime: 'automatic',
      production: true,
      filePath: path,
    }).code;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const line = /\((\d+):\d+\)/.exec(message)?.[1];
    throw new BundleError(path, message, line ? Number(line) : undefined);
  }
}

/**
 * Turns the project and the NachUI files it reaches into ES modules the
 * preview frame can load one by one. Relative imports become placeholders the
 * frame swaps for blob URLs; packages stay bare for its import map.
 */
export async function bundleProject(
  files: SourceFiles,
  entryPath: string,
  loadCatalog: CatalogLoader,
): Promise<PreviewBundle> {
  await init;
  const sources = new Map<string, string>(Object.entries(files));
  const compiled = new Map<
    string,
    { code: string; imports: Array<{ start: number; end: number; path: string }> }
  >();
  const queue = [entryPath];

  const locate = async (from: string, specifier: string): Promise<string> => {
    const base = joinRelative(from, specifier);
    if (base === null) throw new BundleError(from, `${specifier} leaves the project.`);
    for (const extension of EXTENSIONS) {
      if (sources.has(`${base}${extension}`)) return `${base}${extension}`;
    }
    const [dir, name, ...rest] = base.split('/');
    if (dir && name && rest.length === 0 && (CATALOG_DIRS as readonly string[]).includes(dir)) {
      const file = await loadCatalog(dir, name);
      if (file) {
        sources.set(file.path, file.code);
        return file.path;
      }
    }
    throw new BundleError(from, `Cannot find ${specifier}.`);
  };

  while (queue.length > 0) {
    const path = queue.shift() as string;
    if (compiled.has(path)) continue;
    const source = sources.get(path);
    if (source === undefined) throw new BundleError(path, `Cannot find ${path}.`);

    const code = compile(path, source);
    const [imports] = parse(code);
    const local: Array<{ start: number; end: number; path: string }> = [];

    for (const entry of imports) {
      const specifier = entry.specifier;
      if (!specifier || !specifier.startsWith('.')) continue;
      const target = await locate(path, specifier);
      local.push({ start: entry.start, end: entry.end, path: target });
      queue.push(target);
    }

    compiled.set(path, { code, imports: local });
  }

  const ids = new Map<string, number>();
  const order: string[] = [];
  const state = new Map<string, 'visiting' | 'done'>();

  const visit = (path: string, chain: string[]) => {
    const current = state.get(path);
    if (current === 'done') return;
    if (current === 'visiting') {
      throw new BundleError(path, `Circular import: ${[...chain, path].join(' → ')}`);
    }
    state.set(path, 'visiting');
    for (const dependency of compiled.get(path)?.imports ?? [])
      visit(dependency.path, [...chain, path]);
    state.set(path, 'done');
    ids.set(path, order.length);
    order.push(path);
  };
  visit(entryPath, []);

  const modules = order.map((path) => {
    const unit = compiled.get(path) as {
      code: string;
      imports: Array<{ start: number; end: number; path: string }>;
    };
    let code = unit.code;
    for (const dependency of [...unit.imports].sort((a, b) => b.start - a.start)) {
      code = `${code.slice(0, dependency.start)}${MODULE_PREFIX}${ids.get(dependency.path)}${code.slice(dependency.end)}`;
    }
    return { id: ids.get(path) as number, path, code };
  });

  return {
    modules,
    entry: ids.get(entryPath) as number,
    paths: Object.fromEntries(modules.map((module) => [module.id, module.path])),
  };
}

/** The screen the preview renders: the first top-level file in screens/. */
export function pickEntry(files: SourceFiles): string | null {
  const screens = Object.keys(files)
    .filter((path) => /^screens\/[^/]+\.(tsx|ts)$/.test(path))
    .sort();
  return screens[0] ?? null;
}
