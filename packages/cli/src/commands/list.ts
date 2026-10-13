import * as p from '@clack/prompts';
import kleur from 'kleur';

import { api } from '../lib/api.js';
import { reportError } from '../lib/errors.js';
import { SUPPORT_FAMILIES } from '../lib/layout.js';

function familyOf(entry: { slug: string; type?: string | null }): string {
  const [family, name] = entry.slug.split('/');
  return name === undefined ? (entry.type ?? 'ui') : (family ?? 'ui');
}

export async function listCommand() {
  const s = p.spinner();
  s.start('Loading the NachUI registry...');

  try {
    const entries = await api.getComponents();
    s.stop('Registry loaded.');

    const components = entries
      .filter((entry) => !SUPPORT_FAMILIES.has(familyOf(entry)))
      .sort((a, b) => a.slug.localeCompare(b.slug));

    if (components.length === 0) {
      p.log.warn('There are no components in the registry yet.');
      return;
    }

    p.log.step(kleur.cyan('Available components:'));

    for (const c of components) {
      console.log(`  ${kleur.green('→')} ${kleur.bold(c.name)} ${kleur.gray(`(${c.slug})`)}`);
      if (c.dependencies.length > 0) {
        console.log(`    ${kleur.dim(`npm: ${c.dependencies.join(', ')}`)}`);
      }
    }
    console.log('');

    p.note(`To install one, run:\n${kleur.cyan('npx nachui add <slug>')}`, 'Tip');
  } catch (error) {
    s.stop(kleur.red('Could not load the registry.'));
    reportError(error);
  }
}
