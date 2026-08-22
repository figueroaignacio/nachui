/**
 * Fails the build when a demo would be copied out of the docs with an import
 * that does not resolve in the reader's project, or when it would render as
 * `undefined` because it reads a compound component across the server boundary.
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

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const UI_SRC = resolve(APP_ROOT, '../../packages/ui/src');
const DEMOS_ROOT = join(UI_SRC, 'demos');

// Must stay in sync with rewriteDemoImports. A new family directory in
// packages/ui has to be added in both places, and this check is what says so.
const REWRITTEN_FAMILIES = ['components', 'layout', 'lib'];

const hasClientDirective = (source) => /^\s*(['"])use client\1/.test(source);

/**
 * ComponentPreview builds `<DemoComponent />` on the server, so a demo with no
 * `'use client'` is a server component. Importing a client component from one
 * is fine, but reading a property off it is not: the import is a client
 * reference, `Tabs.List` on it is undefined, and React fails at prerender with
 * "Element type is invalid", naming neither the demo nor the component.
 *
 * Ten demos hit this at once when their directive was dropped as unnecessary.
 * A demo needs the directive whenever it reaches for a subcomponent.
 */
function findServerBoundaryReads(source) {
  if (hasClientDirective(source)) return [];

  const importedFrom = new Map();
  for (const [, names, dir, file] of source.matchAll(
    /import\s+\{([^}]+)\}\s+from\s+['"]\.\.\/\.\.\/(components|layout)\/([^'"]+)['"]/g,
  )) {
    for (const name of names.split(',')) {
      const local = name
        .trim()
        .split(/\s+as\s+/)
        .pop();
      if (local) importedFrom.set(local, join(UI_SRC, dir, `${file}.tsx`));
    }
  }

  const found = new Set();
  for (const [, local] of source.matchAll(/\b([A-Z][A-Za-z0-9]*)\.[A-Z][A-Za-z0-9]*/g)) {
    const path = importedFrom.get(local);
    if (path && existsSync(path) && hasClientDirective(readFileSync(path, 'utf8'))) {
      found.add(local);
    }
  }

  return [...found];
}

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

    for (const component of findServerBoundaryReads(source)) {
      problems.push(
        `${rel}: reads ${component}.* but has no "use client". ${component} is a client ` +
          'component, so its subcomponents are undefined here. Add the directive.',
      );
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
  console.error('Demos that would ship broken:');
  for (const problem of problems) console.error(`  ${problem}`);
  console.error('');
  process.exit(1);
}

main();
