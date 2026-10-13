import fs from 'node:fs';
import path from 'node:path';

import type { RegistryItem } from './api.js';
import { installPath, resolveInside } from './layout.js';

/**
 * - `create`: nothing on disk yet.
 * - `unchanged`: the file on disk already matches the registry.
 * - `conflict`: a different file is in the way; only written with consent.
 */
export type FileState = 'create' | 'unchanged' | 'conflict';

export interface PlannedFile {
  item: RegistryItem;
  relativePath: string;
  absolutePath: string;
  state: FileState;
}

function normalizeNewlines(text: string): string {
  return text.replace(/\r\n/g, '\n');
}

export function fileState(absolutePath: string, code: string): FileState {
  if (!fs.existsSync(absolutePath)) return 'create';
  const current = fs.readFileSync(absolutePath, 'utf8');
  return normalizeNewlines(current) === normalizeNewlines(code) ? 'unchanged' : 'conflict';
}

/** Where each item goes and whether something is already there. */
export function planFiles(items: RegistryItem[], cwd: string, baseDir: string): PlannedFile[] {
  return items.map((item) => {
    const relativePath = installPath(item, baseDir);
    const absolutePath = resolveInside(cwd, relativePath);
    return { item, relativePath, absolutePath, state: fileState(absolutePath, item.code) };
  });
}

export function writeFileSafely(absolutePath: string, contents: string): void {
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, contents);
}
