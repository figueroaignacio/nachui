import fs from 'node:fs';
import path from 'node:path';

const WORKSPACE_MARKER = 'pnpm-workspace.yaml';

/**
 * Walks up from `start` to the directory holding pnpm-workspace.yaml. Falls
 * back to two levels above `start` (apps/web -> repo root) when the marker is
 * not on disk, as in a traced serverless bundle.
 */
export function findRepoRoot(start: string, exists: (file: string) => boolean = fs.existsSync) {
  let dir = path.resolve(start);
  for (;;) {
    if (exists(path.join(dir, WORKSPACE_MARKER))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return path.resolve(start, '..', '..');
    dir = parent;
  }
}

let repoRoot: string | undefined;

/**
 * Absolute path of a file given relative to the monorepo root, which is how
 * the generated `@repo/ui/registry` records component, demo, brick and icon
 * paths. Server only.
 */
export function fromRepoRoot(relativePath: string): string {
  repoRoot ??= findRepoRoot(process.cwd());
  return path.join(repoRoot, relativePath);
}
