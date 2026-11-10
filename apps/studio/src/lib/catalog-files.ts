import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { CATALOG_DIRS, type CatalogDir } from '@repo/ai/studio-paths';

const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function uiSource(): string {
  return path.resolve(process.cwd(), '../../packages/ui/src');
}

export function isCatalogDir(value: string): value is CatalogDir {
  return (CATALOG_DIRS as readonly string[]).includes(value);
}

/** Source of `packages/ui/src/<dir>/<name>.tsx|ts`, the same files the registry ships. */
export async function readCatalogFile(
  dir: string,
  name: string,
): Promise<{ path: string; code: string } | null> {
  if (!isCatalogDir(dir) || !NAME.test(name)) return null;
  for (const extension of ['.tsx', '.ts']) {
    const relative = `${dir}/${name}${extension}`;
    try {
      const code = await readFile(path.join(uiSource(), relative), 'utf8');
      return { path: relative, code };
    } catch {
      continue;
    }
  }
  return null;
}

/** The NachUI stylesheet without the lines only a build step understands. */
export async function readPreviewCss(): Promise<string> {
  const css = await readFile(path.join(uiSource(), 'css/globals.css'), 'utf8');
  return css
    .split('\n')
    .filter((line) => !/^@(import|source)\b/.test(line.trim()))
    .join('\n');
}
