import * as p from '@clack/prompts';
import kleur from 'kleur';
import fs from 'node:fs';

import { reportError } from '../lib/errors.js';
import { candidatePaths, resolveInside } from '../lib/layout.js';
import { confirmOrCancel, loadConfigOrExit } from '../lib/prompts.js';

export interface RemoveOptions {
  yes?: boolean;
}

export async function removeCommand(slug: string, options: RemoveOptions = {}) {
  const cwd = process.cwd();
  const config = loadConfigOrExit(cwd);
  if (!config) return;

  try {
    const candidates = candidatePaths(slug, config.baseDir);
    const found = candidates.filter((file) => fs.existsSync(resolveInside(cwd, file)));

    if (found.length === 0) {
      p.log.error(kleur.red(`${slug} is not installed. Looked in:\n${candidates.join('\n')}`));
      process.exitCode = 1;
      return;
    }

    if (found.length > 1) {
      p.log.error(
        kleur.red(
          `${slug} is installed in more than one place:\n${found.join('\n')}\nUse the full name, for example "ui/${slug}".`,
        ),
      );
      process.exitCode = 1;
      return;
    }

    const [file] = found as [string];
    const confirmed =
      options.yes ||
      (await confirmOrCancel(`Delete ${kleur.red(file)}? This cannot be undone.`, false));

    if (!confirmed) {
      p.outro(kleur.gray('Nothing was deleted.'));
      return;
    }

    fs.rmSync(resolveInside(cwd, file));
    p.log.success(`Deleted ${file}`);
    p.log.info('Shared files it used (like lib/cn.ts) were kept, other components may need them.');
    p.outro(`${kleur.bgRed().black(' NachUI ')} Clean up complete.`);
  } catch (error) {
    reportError(error);
  }
}
