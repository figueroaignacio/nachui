import * as p from '@clack/prompts';
import kleur from 'kleur';

import { ConfigError, readConfig, type NachuiConfig } from './config.js';
import { writeFileSafely, type PlannedFile } from './files.js';
import { installPackages, missingPackages, partitionPackageSpecs } from './package-manager.js';

export class CancelledError extends Error {}

/** Asks a yes/no question; a cancelled prompt (Ctrl+C) aborts the command. */
export async function confirmOrCancel(message: string, initialValue: boolean): Promise<boolean> {
  const answer = await p.confirm({ message, initialValue });
  if (p.isCancel(answer)) throw new CancelledError();
  return answer;
}

export function loadConfigOrExit(cwd: string): NachuiConfig | null {
  try {
    const config = readConfig(cwd);
    if (!config) {
      p.log.error(kleur.red("nachui.json not found. Run 'nachui init' first."));
      process.exitCode = 1;
    }
    return config;
  } catch (error) {
    if (!(error instanceof ConfigError)) throw error;
    p.log.error(kleur.red(error.message));
    process.exitCode = 1;
    return null;
  }
}

export interface WriteOptions {
  overwrite?: boolean;
  yes?: boolean;
}

export interface WriteSummary {
  written: string[];
  unchanged: string[];
  skipped: string[];
}

/**
 * Writes the planned files. A file that differs from the registry is only
 * replaced with `--overwrite` or an explicit yes; `--yes` alone keeps it.
 */
export async function writePlannedFiles(
  plan: PlannedFile[],
  options: WriteOptions,
): Promise<WriteSummary> {
  const summary: WriteSummary = { written: [], unchanged: [], skipped: [] };

  for (const file of plan) {
    if (file.state === 'unchanged') {
      summary.unchanged.push(file.relativePath);
      continue;
    }

    if (file.state === 'conflict') {
      const replace =
        options.overwrite ||
        (!options.yes &&
          (await confirmOrCancel(
            `${kleur.yellow(file.relativePath)} already exists and differs from the registry. Overwrite it?`,
            false,
          )));

      if (!replace) {
        summary.skipped.push(file.relativePath);
        continue;
      }
    }

    writeFileSafely(file.absolutePath, file.item.code);
    summary.written.push(file.relativePath);
  }

  return summary;
}

export function reportWrites(summary: WriteSummary): void {
  const lines = [
    ...summary.written.map((f) => `${kleur.green('+')} ${f}`),
    ...summary.unchanged.map((f) => `${kleur.gray('=')} ${f} ${kleur.gray('(up to date)')}`),
    ...summary.skipped.map((f) => `${kleur.yellow('!')} ${f} ${kleur.gray('(kept your version)')}`),
  ];
  if (lines.length > 0) p.note(lines.join('\n'), 'Files');

  if (summary.skipped.length > 0) {
    p.log.warn('Some files were kept as they are. Re-run with --overwrite to replace them.');
  }
}

/**
 * Checks the npm packages the installed files import and offers to install
 * the missing ones. Names that are not plain npm packages are never run.
 */
export async function ensurePackages(
  specs: string[],
  options: { yes?: boolean; cwd: string },
): Promise<void> {
  const { valid, invalid } = partitionPackageSpecs(specs);

  if (invalid.length > 0) {
    p.log.warn(`Ignoring invalid package names from the registry: ${invalid.join(', ')}`);
  }

  const missing = missingPackages(valid, options.cwd);
  if (missing.length === 0) {
    if (valid.length > 0) p.log.info(kleur.green('All dependencies are already installed.'));
    return;
  }

  p.log.warn(`Missing dependencies: ${kleur.yellow(missing.join(', '))}`);
  const install = options.yes || (await confirmOrCancel('Install them now?', true));

  if (!install) {
    p.log.info(`Install them later with your package manager: ${missing.join(' ')}`);
    return;
  }

  try {
    installPackages(missing, options.cwd);
    p.log.success(kleur.green('Dependencies installed.'));
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    p.log.error(`Failed to install dependencies: ${reason}`);
    p.log.info(`Install them manually: ${missing.join(' ')}`);
    process.exitCode = 1;
  }
}
