import { components, db, type ComponentFamily } from '@repo/db';
import fs from 'node:fs';
import path from 'node:path';
import { FAMILIES } from '../packages/ui/src/lib/registry';

const UI_PACKAGE_ROOT = path.resolve(process.cwd(), 'packages/ui');

function extractDependencies(code: string): string[] {
  const dependencies: string[] = [];
  const importRegex = /from\s+['"]([^'"]+)['"]/g;
  let match;

  while ((match = importRegex.exec(code)) !== null) {
    let dep = match[1];

    if (dep && !dep.startsWith('.') && !dep.startsWith('@repo/')) {
      const parts = dep.split('/');

      if (dep.startsWith('@')) {
        if (parts.length >= 2) {
          dep = `${parts[0]}/${parts[1]}`;
        }
      } else {
        dep = parts[0] as string;
      }

      if (dep === 'motion') {
        dependencies.push('motion');
      } else {
        dependencies.push(dep);
      }
    }
  }

  return [...new Set(dependencies)];
}

function toSlug(family: ComponentFamily, name: string): string {
  return `${family}/${name.toLowerCase()}`;
}

async function processFamily(family: ComponentFamily, codeDir: string) {
  const dirPath = path.join(UI_PACKAGE_ROOT, codeDir);

  if (!fs.existsSync(dirPath)) {
    console.error(`❌ Error: Root path not found: ${dirPath}`);
    return 0;
  }

  let synced = 0;

  for (const item of fs.readdirSync(dirPath)) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);

    let code = '',
      name = '';

    if (stats.isDirectory()) {
      const files = fs.readdirSync(itemPath);
      const componentFile = files.find((f: string) => f.endsWith('.tsx') && !f.includes('.test.'));
      if (!componentFile) continue;
      code = fs.readFileSync(path.join(itemPath, componentFile), 'utf8');
      name = item;
    } else if (item.endsWith('.tsx') && !item.includes('.test.')) {
      code = fs.readFileSync(itemPath, 'utf8');
      name = item.replace('.tsx', '');
    } else continue;

    const slug = toSlug(family, name);
    const deps = extractDependencies(code);
    console.log(`📦 Syncing: ${slug}...`);

    try {
      await db
        .insert(components)
        .values({
          name,
          slug,
          code,
          type: family,
          dependencies: deps,
          registryDependencies: [],
        })
        .onConflictDoUpdate({
          target: components.slug,
          set: {
            name,
            code,
            type: family,
            dependencies: deps,
            updatedAt: new Date(),
          },
        });

      synced++;
      console.log(`✅ ${slug} ready. (Deps: ${deps.join(', ') || 'none'})`);
    } catch (error) {
      console.error(`❌ Error syncing ${slug}:`, error);
    }
  }

  return synced;
}

async function syncRegistry() {
  console.log('🚀 Starting sync registry...');

  let total = 0;
  for (const family of FAMILIES) {
    console.log(`\n── ${family.id} (${family.codeDir})`);
    total += await processFamily(family.id, family.codeDir);
  }

  console.log(
    `\n✨ Syncing finished successfully. ${total} components across ${FAMILIES.length} families.`,
  );
  console.log('   Rows whose slug is not yet qualified are left untouched.');
  console.log('   Run `pnpm registry:migrate-slugs` once to convert them.');
  process.exit(0);
}

syncRegistry();
