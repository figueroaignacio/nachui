import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

export const CONFIG_FILE = 'nachui.json';
export const DEFAULT_BASE_DIR = 'src';

const configSchema = z.looseObject({
  $schema: z.string().optional(),
  style: z.string().optional(),
  baseDir: z.string().optional(),
  tailwind: z.looseObject({ css: z.string().optional() }).optional(),
  aliases: z.record(z.string(), z.string()).optional(),
});

export type NachuiConfig = z.infer<typeof configSchema> & { baseDir: string };

export class ConfigError extends Error {}

/**
 * `baseDir` is where the catalog folders (`components/`, `lib/`, ...) live,
 * relative to the project root. It must stay inside the project.
 */
export function normalizeBaseDir(value: string): string {
  const trimmed = value.trim().replace(/\\/g, '/');
  if (trimmed === '') return '.';

  if (path.posix.isAbsolute(trimmed) || /^[a-zA-Z]:/.test(trimmed)) {
    throw new ConfigError(`baseDir must be relative to the project root, got "${value}".`);
  }

  const normalized = path.posix.normalize(trimmed).replace(/\/+$/, '');
  if (normalized === '..' || normalized.startsWith('../')) {
    throw new ConfigError(`baseDir must stay inside the project, got "${value}".`);
  }

  return normalized || '.';
}

/**
 * Validates a parsed `nachui.json`. Files written by nachui 2.0.0 have no
 * `baseDir` and carry `aliases` instead; they read as `baseDir: "src"`.
 */
export function parseConfig(raw: unknown): NachuiConfig {
  const result = configSchema.safeParse(raw);

  if (!result.success) {
    const issue = result.error.issues[0];
    const where = issue?.path.length ? issue.path.join('.') : 'root';
    throw new ConfigError(`${CONFIG_FILE} is invalid at ${where}: ${issue?.message ?? 'unknown'}`);
  }

  return {
    ...result.data,
    baseDir: normalizeBaseDir(result.data.baseDir ?? DEFAULT_BASE_DIR),
  };
}

/** The project's config, or null when there is no `nachui.json`. */
export function readConfig(cwd: string): NachuiConfig | null {
  const file = path.join(cwd, CONFIG_FILE);
  if (!fs.existsSync(file)) return null;

  let raw: unknown;
  try {
    raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new ConfigError(`${CONFIG_FILE} is not valid JSON: ${reason}`);
  }

  return parseConfig(raw);
}
