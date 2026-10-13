/**
 * Pushes the component catalog into the registry table the API and CLI serve.
 *
 *   pnpm registry:sync                 upsert every item, report stale rows
 *   pnpm registry:sync --prune         also delete stale qualified rows
 *   pnpm registry:sync --dry-run       print the plan, touch nothing
 *
 * Items are every component under the family directories plus whatever they
 * reach through relative imports (`lib/cn`, `lib/motion`, hooks, sibling
 * components). Each item records those relative imports as
 * `registryDependencies`, which the CLI installs alongside it.
 *
 * Any error (an unresolvable import, a failed upsert) exits non-zero after
 * the run, so CI and humans notice.
 */

import type { ComponentFamily } from '@repo/db';
import fs from 'node:fs';
import path from 'node:path';
import { FAMILIES, ICONS_DIR } from '../packages/ui/src/lib/registry';
import { buildCatalogGraph, findStaleSlugs, type CatalogItem } from './lib/catalog-graph';

const PRUNE = process.argv.includes('--prune');
const DRY_RUN = process.argv.includes('--dry-run');

const UI_SRC = path.resolve(process.cwd(), 'packages/ui/src');

/** `src/components` becomes `components`, relative to `packages/ui/src`. */
function srcDir(codeDir: string): string {
  return codeDir.replace(/^src\//, '');
}

const SEED_FAMILIES: Array<{ family: string; dir: string }> = [
  ...FAMILIES.map((f) => ({ family: f.id as string, dir: srcDir(f.codeDir) })),
  { family: 'icons', dir: srcDir(ICONS_DIR) },
];

/** Support directories: synced only when a component imports from them. */
const SUPPORT_FAMILIES = [
  { family: 'lib', dir: 'lib' },
  { family: 'hooks', dir: 'hooks' },
];

const dirFamilies = new Map(
  [...SEED_FAMILIES, ...SUPPORT_FAMILIES].map(({ family, dir }) => [dir, family]),
);

function listSeeds(): string[] {
  const seeds: string[] = [];

  for (const { dir } of SEED_FAMILIES) {
    const absolute = path.join(UI_SRC, dir);
    if (!fs.existsSync(absolute)) {
      throw new Error(`Family directory not found: ${absolute}`);
    }

    for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      if (!entry.name.endsWith('.tsx') || entry.name.includes('.test.')) continue;
      seeds.push(`${dir}/${entry.name}`);
    }
  }

  return seeds.sort();
}

function describe(item: CatalogItem): string {
  const npm = item.dependencies.join(', ') || 'none';
  const registry = item.registryDependencies.join(', ') || 'none';
  return `${item.slug.padEnd(28)} npm: ${npm} | registry: ${registry}`;
}

async function main() {
  const graph = buildCatalogGraph({
    seeds: listSeeds(),
    dirFamilies,
    readFile: (file) => fs.readFileSync(path.join(UI_SRC, file), 'utf8'),
    exists: (file) => fs.existsSync(path.join(UI_SRC, file)),
  });

  if (graph.errors.length > 0) {
    console.error('The catalog has problems, nothing was synced:');
    for (const error of graph.errors) console.error(`  ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Resolved ${graph.items.length} registry items.\n`);

  if (DRY_RUN) {
    for (const item of graph.items) console.log(`  ${describe(item)}`);
    console.log('\nDry run. Nothing was written.');
    return;
  }

  const { components, db, inArray } = await import('@repo/db');

  let failed = 0;

  for (const item of graph.items) {
    const code = fs.readFileSync(path.join(UI_SRC, item.file), 'utf8');
    // The schema narrows `type` to the component families, but the column is
    // plain text and support items (lib, hooks) live in it too.
    const type = item.family as ComponentFamily;
    const values = {
      name: item.name,
      slug: item.slug,
      code,
      type,
      dependencies: item.dependencies,
      registryDependencies: item.registryDependencies,
    };

    try {
      await db
        .insert(components)
        .values(values)
        .onConflictDoUpdate({
          target: components.slug,
          set: { ...values, updatedAt: new Date() },
        });
      console.log(`  synced ${describe(item)}`);
    } catch (error) {
      failed++;
      console.error(`  failed ${item.slug}:`, error);
    }
  }

  const rows = await db.select({ slug: components.slug }).from(components);
  const stale = findStaleSlugs(
    rows.map((r) => r.slug),
    graph.items.map((i) => i.slug),
  );
  const staleQualified = stale.filter((slug) => slug.includes('/'));
  const staleBare = stale.filter((slug) => !slug.includes('/'));

  if (staleQualified.length > 0) {
    if (PRUNE) {
      await db.delete(components).where(inArray(components.slug, staleQualified));
      console.log(`\nPruned ${staleQualified.length} rows with no source file:`);
    } else {
      console.log(
        `\n${staleQualified.length} rows have no source file. Re-run with --prune to delete them:`,
      );
    }
    for (const slug of staleQualified) console.log(`  ${slug}`);
  }

  if (staleBare.length > 0) {
    console.log(`\n${staleBare.length} rows still use a bare slug and were left alone:`);
    for (const slug of staleBare) console.log(`  ${slug}`);
    console.log('  Run `pnpm registry:migrate-slugs` to qualify them.');
  }

  const synced = graph.items.length - failed;
  console.log(`\nSynced ${synced} of ${graph.items.length} items.`);

  if (failed > 0) {
    console.error(`${failed} items failed to sync.`);
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error('Registry sync failed:', error);
    process.exitCode = 1;
  })
  .finally(() => {
    process.exit();
  });
