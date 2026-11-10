import { normalizeProjectPath, PROJECT_LIMITS } from './paths.js';

export type StudioFiles = Record<string, string>;

export type WriteResult =
  | { ok: true; path: string; lines: number; created: boolean }
  | { ok: false; message: string };

/**
 * The files of one project while a turn runs. Tools write here; the API saves
 * a new version from `snapshot()` when the turn changed something.
 */
export class StudioWorkspace {
  private readonly files: Map<string, string>;
  private dirty = false;

  constructor(initial: StudioFiles = {}) {
    this.files = new Map(Object.entries(initial));
  }

  get changed(): boolean {
    return this.dirty;
  }

  list(): string[] {
    return [...this.files.keys()].sort();
  }

  read(path: string): string | undefined {
    const normalized = normalizeProjectPath(path);
    return normalized.ok ? this.files.get(normalized.path) : undefined;
  }

  write(path: string, content: string): WriteResult {
    const normalized = normalizeProjectPath(path);
    if (!normalized.ok) return { ok: false, message: normalized.reason };

    if (content.length > PROJECT_LIMITS.maxFileChars) {
      return {
        ok: false,
        message: `Files are limited to ${PROJECT_LIMITS.maxFileChars} characters. Split it into parts.`,
      };
    }

    const created = !this.files.has(normalized.path);
    if (created && this.files.size >= PROJECT_LIMITS.maxFiles) {
      return { ok: false, message: `A project holds up to ${PROJECT_LIMITS.maxFiles} files.` };
    }

    if (this.files.get(normalized.path) !== content) this.dirty = true;
    this.files.set(normalized.path, content);

    return {
      ok: true,
      path: normalized.path,
      lines: content.split('\n').length,
      created,
    };
  }

  remove(path: string): boolean {
    const normalized = normalizeProjectPath(path);
    if (!normalized.ok || !this.files.has(normalized.path)) return false;
    this.files.delete(normalized.path);
    this.dirty = true;
    return true;
  }

  snapshot(): StudioFiles {
    return Object.fromEntries([...this.files.entries()].sort(([a], [b]) => a.localeCompare(b)));
  }
}
