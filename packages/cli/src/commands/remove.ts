import * as p from '@clack/prompts';
import fs from 'fs';
import kleur from 'kleur';
import path from 'path';
import { componentFileName } from '../lib/slug.js';

export const removeCommand = async (slug: string) => {
  const s = p.spinner();
  const componentsDir = path.resolve(process.cwd(), 'src', 'components', 'ui');

  // Accepts `button` and `ui/button`; only the last segment hits the disk.
  const name = componentFileName(slug).replace(/\.tsx$/, '');
  const filePath = path.join(componentsDir, `${name}.tsx`);
  const folderPath = path.join(componentsDir, name);

  s.start(`Searching for ${kleur.cyan(slug)}...`);

  try {
    let pathToRemove = '';
    let isFolder = false;

    if (fs.existsSync(filePath)) {
      pathToRemove = filePath;
    } else if (fs.existsSync(folderPath) && fs.lstatSync(folderPath).isDirectory()) {
      pathToRemove = folderPath;
      isFolder = true;
    }

    if (pathToRemove) {
      s.stop(kleur.yellow(`Found: ${pathToRemove}`));

      const confirm = await p.confirm({
        message: `Are you sure you want to delete ${kleur.red(slug)}?`,
      });

      if (p.isCancel(confirm) || !confirm) {
        p.outro(kleur.gray('Operation cancelled.'));
        return;
      }

      if (isFolder) {
        fs.rmSync(pathToRemove, { recursive: true, force: true });
      } else {
        fs.rmSync(pathToRemove, { force: true });
      }
      await new Promise((res) => setTimeout(res, 100));

      p.log.success(`${kleur.green('✓')} ${kleur.bold(slug)} deleted.`);
      p.outro(kleur.bgRed().black(' NachUI ') + ' Clean up complete.');
    } else {
      s.stop(kleur.red('Error: Component not found.'));
      p.outro('Check the name and try again.');
    }
  } catch (error) {
    s.stop(kleur.red('Failed to delete.'));
    p.log.error(`Detail: ${error instanceof Error ? error.message : String(error)}`);
  }
};
