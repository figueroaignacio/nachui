import * as p from '@clack/prompts';
import kleur from 'kleur';
import fs from 'node:fs';
import path from 'node:path';

import { api } from '../lib/api.js';
import { reportError } from '../lib/errors.js';
import { planFiles, writeFileSafely } from '../lib/files.js';
import { splitSlug } from '../lib/layout.js';
import {
  confirmOrCancel,
  ensurePackages,
  loadConfigOrExit,
  reportWrites,
  writePlannedFiles,
} from '../lib/prompts.js';
import { collectNpmDependencies, resolveTree } from '../lib/tree.js';

export interface UpdateOptions {
  yes?: boolean;
}

export async function updateCommand(slug: string, options: UpdateOptions = {}) {
  const cwd = process.cwd();
  const config = loadConfigOrExit(cwd);
  if (!config) return;

  const s = p.spinner();

  try {
    const { name } = splitSlug(slug);

    s.start(`Fetching the latest ${kleur.cyan(slug)}...`);
    let items;
    try {
      items = await resolveTree([slug], (value) => api.getComponent(value));
    } finally {
      s.stop('Registry lookup finished.');
    }

    const [root, ...dependencies] = planFiles(items, cwd, config.baseDir);
    if (!root) throw new Error(`The registry returned nothing for ${slug}.`);

    if (root.state === 'create') {
      p.log.error(kleur.red(`${root.relativePath} does not exist, so there is nothing to update.`));
      const legacy = path.join(cwd, config.baseDir, 'components', 'ui', `${name}.tsx`);
      if (fs.existsSync(legacy)) {
        p.log.info(
          `nachui 2.0 installed it at ${path.relative(cwd, legacy)}. Components now live in ${path.posix.dirname(root.relativePath)}.`,
        );
      }
      p.log.info(`Install it with ${kleur.cyan(`nachui add ${root.item.slug}`)}.`);
      process.exitCode = 1;
      return;
    }

    if (root.state === 'unchanged') {
      p.log.info(`${root.relativePath} is already up to date.`);
    } else {
      const replace =
        options.yes ||
        (await confirmOrCancel(
          `Update ${kleur.bold(root.relativePath)}? Your local changes to it will be ${kleur.red('overwritten')}.`,
          false,
        ));

      if (!replace) {
        p.outro(kleur.yellow('Update cancelled.'));
        return;
      }
      writeFileSafely(root.absolutePath, root.item.code);
      p.log.success(`Updated ${root.relativePath}`);
    }

    // Missing dependencies are written; shared files that differ (lib/cn,
    // a sibling component) are only replaced on request, since other
    // components use them too.
    const changed = dependencies.filter((file) => file.state === 'conflict');
    let replaceShared = false;
    if (changed.length > 0 && !options.yes) {
      p.log.warn(
        `These dependencies differ from the registry:\n${changed.map((f) => `  ${f.relativePath}`).join('\n')}`,
      );
      replaceShared = await confirmOrCancel('Update them too?', false);
    }

    const summary = await writePlannedFiles(dependencies, { overwrite: replaceShared, yes: true });
    reportWrites(summary);

    await ensurePackages(collectNpmDependencies(items), { yes: options.yes, cwd });

    p.outro(
      `${kleur.bgBlue().white(' NachUI ')} ${root.item.slug} is on the latest registry version.`,
    );
  } catch (error) {
    reportError(error);
  }
}
