import * as p from '@clack/prompts';
import { Command } from 'commander';
import kleur from 'kleur';
import { createRequire } from 'node:module';

import { addCommand } from './commands/add.js';
import { initCommand } from './commands/init.js';
import { listCommand } from './commands/list.js';
import { removeCommand } from './commands/remove.js';
import { updateCommand } from './commands/update.js';

const { version } = createRequire(import.meta.url)('../package.json') as { version: string };

function intro() {
  console.log('');
  p.intro(kleur.bgCyan().black(' NachUI CLI '));
}

const program = new Command();

program
  .name('nachui')
  .description('NachUI CLI: add, update, remove and list components')
  .version(version);

program
  .command('init')
  .description('Set up NachUI in your project: theme tokens, nachui.json and the cn helper')
  .option('-y, --yes', 'accept the defaults and skip prompts (never replaces existing files)')
  .action(async (options: { yes?: boolean }) => {
    intro();
    await initCommand(options);
  });

program
  .command('add')
  .description('Add components and everything they import')
  .argument('<components...>', 'component slugs, like button or ui/button')
  .option('-o, --overwrite', 'replace files that differ from the registry')
  .option('-y, --yes', 'skip prompts: install packages, keep files that differ')
  .action(async (components: string[], options: { overwrite?: boolean; yes?: boolean }) => {
    intro();
    await addCommand(components, options);
  });

program
  .command('list')
  .description('List all available components')
  .action(async () => {
    intro();
    await listCommand();
  });

program
  .command('update')
  .description('Update an installed component to the registry version')
  .argument('<component>', 'component slug, like button or ui/button')
  .option('-y, --yes', 'skip prompts and overwrite the component (shared files are kept)')
  .action(async (component: string, options: { yes?: boolean }) => {
    intro();
    await updateCommand(component, options);
  });

program
  .command('remove')
  .description('Remove an installed component')
  .argument('<component>', 'component slug, like button or ui/button')
  .option('-y, --yes', 'skip the confirmation prompt')
  .action(async (component: string, options: { yes?: boolean }) => {
    intro();
    await removeCommand(component, options);
  });

await program.parseAsync();
