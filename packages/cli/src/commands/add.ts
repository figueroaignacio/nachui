import * as p from '@clack/prompts';
import kleur from 'kleur';

import { api } from '../lib/api.js';
import { reportError } from '../lib/errors.js';
import { planFiles } from '../lib/files.js';
import { splitSlug } from '../lib/layout.js';
import {
  ensurePackages,
  loadConfigOrExit,
  reportWrites,
  writePlannedFiles,
} from '../lib/prompts.js';
import { collectNpmDependencies, resolveTree } from '../lib/tree.js';

export interface AddOptions {
  overwrite?: boolean;
  yes?: boolean;
}

export async function addCommand(slugs: string[], options: AddOptions = {}) {
  const cwd = process.cwd();
  const config = loadConfigOrExit(cwd);
  if (!config) return;

  const s = p.spinner();

  try {
    for (const slug of slugs) splitSlug(slug);

    s.start(`Resolving ${kleur.cyan(slugs.join(', '))} with their dependencies...`);
    let items;
    try {
      items = await resolveTree(slugs, (slug) => api.getComponent(slug));
    } finally {
      s.stop('Registry lookup finished.');
    }

    const plan = planFiles(items, cwd, config.baseDir);
    const summary = await writePlannedFiles(plan, options);
    reportWrites(summary);

    await ensurePackages(collectNpmDependencies(items), { yes: options.yes, cwd });

    p.outro(`${kleur.bgGreen().black(' NachUI ')} Ready to use.`);
  } catch (error) {
    reportError(error);
  }
}
