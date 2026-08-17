import * as p from '@clack/prompts';
import kleur from 'kleur';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { AmbiguousComponentError, api } from '../lib/api.js';
import { detectPackageManager, getInstallCommand } from '../lib/package-manager.js';
import { componentFileName } from '../lib/slug.js';

export async function addCommand(componentSlug: string) {
  const s = p.spinner();

  const configPath = path.join(process.cwd(), 'nachui.json');

  if (!fs.existsSync(configPath)) {
    p.log.error(kleur.red("Error: nachui.json not found. Please run 'nachui init' first."));
    return;
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  s.start(`Searching for ${kleur.cyan(componentSlug)} in the registry...`);

  try {
    const component = await api.getComponent(componentSlug);
    s.stop(`Component ${kleur.green(componentSlug)} found.`);

    const targetBaseDir = config.aliases.components.replace('@/', 'src/');
    const targetDir = path.join(process.cwd(), targetBaseDir);
    // Never the raw slug: `ui/button` would write into a nested `ui/` folder.
    const targetPath = path.join(targetDir, `${componentFileName(componentSlug)}.tsx`);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.writeFileSync(targetPath, component.code);
    p.note(kleur.gray(`Location: ${targetPath}`), 'Component installed');

    if (component.dependencies && component.dependencies.length > 0) {
      const pkgPath = path.join(process.cwd(), 'package.json');

      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        const installedDeps = { ...pkg.dependencies, ...pkg.devDependencies };

        const missingDeps = component.dependencies.filter((dep) => !installedDeps[dep]);

        if (missingDeps.length > 0) {
          p.log.warn(`Missing dependencies: ${kleur.yellow(missingDeps.join(', '))}`);

          const shouldInstall = await p.confirm({
            message: `Do you want to install missing dependencies?`,
            initialValue: true,
          });

          if (shouldInstall && !p.isCancel(shouldInstall)) {
            const installSpinner = p.spinner();
            installSpinner.start('Installing dependencies...');

            try {
              const agent = detectPackageManager();
              const installCmd = getInstallCommand(agent, missingDeps);

              execSync(installCmd, { stdio: 'inherit' });

              installSpinner.stop(kleur.green('Dependencies installed successfully.'));
            } catch {
              installSpinner.stop(kleur.red('Failed to install dependencies.'));
              p.log.error('Please run the command manually.');
            }
          }
        } else {
          p.log.info(kleur.green('✓ All dependencies are already present.'));
        }
      }
    }

    p.outro(kleur.bgGreen().black(' NachUI ') + ' Component ready to use!');
  } catch (error) {
    if (error instanceof AmbiguousComponentError) {
      s.stop(kleur.yellow(`${componentSlug} exists in more than one family.`));
      p.log.error(error.message);
      return;
    }

    s.stop(kleur.red('Error getting the component.'));
    p.log.error('Make sure the slug is correct or the API is online.');
  }
}
