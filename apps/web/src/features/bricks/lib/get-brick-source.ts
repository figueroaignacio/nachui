import fs from 'fs/promises';
import path from 'path';

import { fromRepoRoot } from '@/lib/repo-root';
import { BRICK_REGISTRY } from '@repo/ui/registry';

type BrickCategoryKey = keyof typeof BRICK_REGISTRY;

type BrickRegistryValue =
  | string
  | readonly string[]
  | Record<string, string>
  | Record<string, readonly string[]>;

export type BrickSourceFile = {
  filePath: string;
  code: string;
};

export async function getBrickSourceCode(
  category: string,
  brickId: string,
): Promise<{ files: BrickSourceFile[] | null; error?: string }> {
  const categoryBricks = BRICK_REGISTRY[category as BrickCategoryKey] as BrickRegistryValue;

  if (!categoryBricks) {
    return { files: null, error: `Unknown brick category "${category}".` };
  }

  const relativePath = (categoryBricks as Record<string, unknown>)[brickId];

  if (!relativePath) {
    return { files: null, error: `Brick "${brickId}" not found in category "${category}".` };
  }

  const readOneFile = async (rel: string): Promise<BrickSourceFile> => {
    const absolutePath = fromRepoRoot(rel);
    const code = await fs.readFile(absolutePath, 'utf-8');
    return { filePath: rel, code };
  };

  const readDirectory = async (relDir: string): Promise<BrickSourceFile[]> => {
    const absoluteDir = fromRepoRoot(relDir);

    const results: BrickSourceFile[] = [];

    const walk = async (subdir: string) => {
      const entries = await fs.readdir(path.join(absoluteDir, subdir), { withFileTypes: true });
      for (const entry of entries) {
        const entryRel = path.join(subdir, entry.name);
        if (entry.isDirectory()) {
          await walk(entryRel);
          continue;
        }

        // Only show code-like files in the viewer.
        if (!/\.(ts|tsx|css|mdx)$/.test(entry.name)) continue;

        const absoluteFile = path.join(absoluteDir, entryRel);
        const code = await fs.readFile(absoluteFile, 'utf-8');
        results.push({ filePath: path.join(relDir, entryRel), code });
      }
    };

    await walk('');

    return results.sort((a, b) => a.filePath.localeCompare(b.filePath));
  };

  try {
    if (Array.isArray(relativePath)) {
      const files = await Promise.all(relativePath.map((rel) => readOneFile(rel)));
      return { files };
    }

    if (typeof relativePath !== 'string') {
      return { files: null, error: `Invalid registry entry for brick "${brickId}".` };
    }

    const absolutePath = fromRepoRoot(relativePath);
    const stat = await fs.stat(absolutePath);

    if (stat.isDirectory()) {
      const files = await readDirectory(relativePath);
      return { files };
    }

    const files = [await readOneFile(relativePath)];
    return { files };
  } catch {
    return { files: null, error: `Could not read source for brick "${brickId}".` };
  }
}
