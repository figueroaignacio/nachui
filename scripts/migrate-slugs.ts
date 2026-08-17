/**
 * Data migration between bare and qualified component slugs.
 *
 *   button -> ui/button      type 'ui'
 *   stack  -> layout/stack   type 'layout'
 *
 * There is no DDL here. `slug` and `type` are both `text` in Postgres; the
 * union in the schema only narrows them in TypeScript. This rewrites data, so
 * it refuses to touch anything unless you pass --apply.
 *
 *   pnpm registry:migrate-slugs                    print the plan, change nothing
 *   pnpm registry:migrate-slugs --apply            qualify the slugs
 *   pnpm registry:migrate-slugs --revert --apply   strip them back to bare names
 *
 * Order matters when deploying: an API that only does an exact slug lookup
 * cannot serve `button` once the row is `ui/button`, so it has to ship the
 * two-form resolver *before* this runs. --revert is the lever for when that
 * order gets inverted, and it puts the registry back the way the deployed API
 * expects it.
 *
 * Safe to run twice in either direction: rows already in the target shape are
 * skipped, so an interrupted run finishes by re-running.
 */

import { components, db, eq, type ComponentFamily } from '@repo/db';
import { COMPONENT_FAMILY } from '../packages/ui/src/lib/registry';

const APPLY = process.argv.includes('--apply');
const REVERT = process.argv.includes('--revert');

type Plan = {
  id: string;
  from: string;
  to: string;
  fromType: string | null;
  toType: ComponentFamily | null;
};

async function main() {
  const rows = await db.select().from(components);
  console.log(`Read ${rows.length} components.${REVERT ? '  (revert mode)' : ''}\n`);

  const plan: Plan[] = [];
  const skipped: string[] = [];
  const unknown: string[] = [];

  for (const row of rows) {
    const qualified = row.slug.includes('/');

    if (REVERT) {
      if (!qualified) {
        skipped.push(row.slug);
        continue;
      }

      // The family stays on the row. Nothing reads `type` yet, and keeping it
      // means a re-apply does not have to work it out again.
      plan.push({
        id: row.id,
        from: row.slug,
        to: row.slug.split('/').pop() as string,
        fromType: row.type,
        toType: null,
      });
      continue;
    }

    if (qualified) {
      skipped.push(row.slug);
      continue;
    }

    const family = COMPONENT_FAMILY[row.slug as keyof typeof COMPONENT_FAMILY] as
      | ComponentFamily
      | undefined;

    // A row with no component on disk cannot be classified. Renaming it to a
    // guessed family would invent a component that does not exist, so it is
    // reported instead.
    if (!family) {
      unknown.push(row.slug);
      continue;
    }

    plan.push({
      id: row.id,
      from: row.slug,
      to: `${family}/${row.slug}`,
      fromType: row.type,
      toType: family,
    });
  }

  if (skipped.length > 0) {
    console.log(`Already in the target shape, skipping ${skipped.length}.\n`);
  }

  if (unknown.length > 0) {
    console.log('No component on disk for these slugs, leaving them alone:');
    for (const slug of unknown) console.log(`  ${slug}`);
    console.log('  Decide whether they are stale rows to delete.\n');
  }

  if (plan.length === 0) {
    console.log('Nothing to do.');
    return;
  }

  console.log(`${plan.length} rows to rewrite:\n`);
  for (const entry of plan) {
    const typeChange =
      entry.toType && entry.fromType !== entry.toType
        ? `   type ${entry.fromType} -> ${entry.toType}`
        : '';
    console.log(`  ${entry.from.padEnd(24)} -> ${entry.to.padEnd(24)}${typeChange}`);
  }
  console.log('');

  if (!APPLY) {
    console.log('Dry run. Nothing was written. Re-run with --apply to commit these changes.');
    return;
  }

  let done = 0;
  for (const entry of plan) {
    await db
      .update(components)
      .set({
        slug: entry.to,
        ...(entry.toType ? { type: entry.toType } : {}),
        updatedAt: new Date(),
      })
      .where(eq(components.id, entry.id));
    done++;
  }

  console.log(`Applied ${done} updates.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
