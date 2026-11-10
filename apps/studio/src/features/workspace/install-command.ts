import { catalogSlug, resolveImport } from '@repo/ai/studio-paths';
import type { ProjectFiles } from '@/lib/types';

const IMPORT = /(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]/g;

/** `npx nachui add ...` with every NachUI file the project imports directly. */
export function installCommand(files: ProjectFiles): string | null {
  const slugs = new Set<string>();
  for (const [path, code] of Object.entries(files)) {
    for (const match of code.matchAll(IMPORT)) {
      const target = resolveImport(path, match[1] ?? '');
      if (target.kind === 'catalog') slugs.add(catalogSlug(target.dir, target.name));
    }
  }
  return slugs.size > 0 ? `npx nachui add ${[...slugs].sort().join(' ')}` : null;
}
