/**
 * Fails the build when a demo would be copied out of the docs with an import
 * that does not resolve in the reader's project.
 *
 * The docs show demo source after rewriting its relative imports to the alias
 * the CLI installs into (see rewriteDemoImports in
 * src/features/docs/lib/get-component-code.ts). Any import the rewrite does not
 * match is shipped verbatim, so the snippet looks correct and fails on paste.
 *
 * That is how the three spinner demos went out with `@repo/ui/components/...`
 * and the four layout demos with an unrewritten `../../layout/...`.
 *
 * Runs on plain node with no dependencies.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DEMOS_ROOT = resolve(APP_ROOT, '../../packages/ui/src/demos');

// Must stay in sync with rewriteDemoImports. A new family directory in
// packages/ui has to be added in both places, and this check is what says so.
const REWRITTEN_FAMILIES = ['components', 'layout'];

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.name.endsWith('.tsx')) files.push(full);
  }
  return files;
}

function main() {
  const files = walk(DEMOS_ROOT);
  const problems = [];

  if (files.length === 0) {
    console.error(`check-demos: found no demos in ${DEMOS_ROOT}. Path is wrong.`);
    process.exit(1);
  }

  for (const file of files) {
    const rel = file.slice(DEMOS_ROOT.length + 1);
    const source = readFileSync(file, 'utf8');

    // A default export cannot be imported by the `{ Name as Alias }` form the
    // demo registry uses for every other demo.
    if (/^export default/m.test(source)) {
      problems.push(`${rel}: uses "export default", the registry expects a named export`);
    }

    for (const [, spec] of source.matchAll(/from ['"]([^'"]+)['"]/g)) {
      if (spec.startsWith('@repo/ui')) {
        problems.push(
          `${rel}: imports "${spec}". Workspace imports are not rewritten, ` +
            'use a relative path so the copied snippet resolves.',
        );
        continue;
      }

      if (!spec.startsWith('.')) continue; // third party, left as is on purpose

      const family = spec.match(/^\.\.\/\.\.\/([^/]+)\//)?.[1];
      if (!family || !REWRITTEN_FAMILIES.includes(family)) {
        problems.push(
          `${rel}: imports "${spec}", which rewriteDemoImports does not match. ` +
            `Known families: ${REWRITTEN_FAMILIES.join(', ')}.`,
        );
      }
    }
  }

  if (problems.length === 0) {
    console.log(`check-demos: ${files.length} demos ok`);
    return;
  }

  console.error('check-demos FAILED\n');
  console.error('Demos that would be copied with a broken import:');
  for (const problem of problems) console.error(`  ${problem}`);
  console.error('');
  process.exit(1);
}

main();
