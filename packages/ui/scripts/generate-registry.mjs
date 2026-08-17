/**
 * Generates the three catalogs that describe packages/ui, from the filesystem.
 *
 *   packages/ui/src/lib/registry.ts                        paths
 *   apps/web/src/shared/components/mdx/demo-registry.tsx   React imports
 *
 * They used to be maintained by hand, with the same keys in the same nested
 * shape, so adding one demo meant three edits and forgetting one failed at
 * runtime instead of at compile time. It had already drifted: DEMO_REGISTRY
 * listed four textarea demos whose files do not exist, and three demo files on
 * disk were in neither catalog.
 *
 * Usage:
 *   node scripts/generate-registry.mjs            write the files
 *   node scripts/generate-registry.mjs --check    fail if they are stale
 *
 * Runs on plain node with no dependencies so it can go in front of a build.
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const UI_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = resolve(UI_ROOT, '../..');

const FAMILIES = [
  { id: 'ui', codeDir: 'src/components', docsSegment: 'elements/ui' },
  { id: 'layout', codeDir: 'src/layout', docsSegment: 'elements/layout' },
];

const DEMOS_DIR = 'src/demos';
const BRICKS_DIR = 'src/bricks';

const GENERATED_HEADER = [
  '// GENERATED FILE, DO NOT EDIT.',
  '// Run `pnpm --filter @repo/ui generate:registry` after adding a component,',
  '// a demo or a brick. The build fails if this file is out of date.',
  '',
].join('\n');

const REGISTRY_TARGET = 'packages/ui/src/lib/registry.ts';
const DEMO_COMPONENTS_TARGET = 'apps/web/src/shared/components/mdx/demo-registry.tsx';

function listDir(relPath) {
  try {
    return readdirSync(join(UI_ROOT, relPath), { withFileTypes: true });
  } catch {
    return [];
  }
}

function scanComponents() {
  const components = [];

  for (const family of FAMILIES) {
    for (const entry of listDir(family.codeDir)) {
      if (!entry.isFile() || !entry.name.endsWith('.tsx')) continue;
      if (entry.name.endsWith('.test.tsx')) continue;

      components.push({
        name: entry.name.replace(/\.tsx$/, ''),
        family: family.id,
        path: `packages/ui/${family.codeDir}/${entry.name}`,
      });
    }
  }

  return components.sort((a, b) => a.name.localeCompare(b.name));
}

function scanDemos() {
  const demos = [];

  for (const dir of listDir(DEMOS_DIR)) {
    if (!dir.isDirectory()) continue;

    const variants = listDir(`${DEMOS_DIR}/${dir.name}`)
      .filter((f) => f.isFile() && f.name.endsWith('.tsx') && !f.name.endsWith('.test.tsx'))
      .map((f) => f.name.replace(/\.tsx$/, ''))
      .sort((a, b) => a.localeCompare(b));

    if (variants.length > 0) demos.push({ component: dir.name, variants });
  }

  return demos.sort((a, b) => a.component.localeCompare(b.component));
}

function scanBricks() {
  const bricks = [];

  for (const dir of listDir(BRICKS_DIR)) {
    if (!dir.isDirectory()) continue;

    const items = listDir(`${BRICKS_DIR}/${dir.name}`)
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b));

    if (items.length > 0) bricks.push({ category: dir.name, items });
  }

  return bricks.sort((a, b) => a.category.localeCompare(b.category));
}

function key(name) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) ? name : `'${name}'`;
}

function pascal(value) {
  return value
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function demoAlias(component, variant) {
  return variant.startsWith(`${component}-`)
    ? `${pascal(variant)}Demo`
    : `${pascal(component)}${pascal(variant)}`;
}

function emitRegistry(components, demos, bricks) {
  const lines = [GENERATED_HEADER];

  lines.push('/** Families of components, and where each one lives. */');
  lines.push('export const FAMILIES = [');
  for (const family of FAMILIES) {
    lines.push(
      `  { id: '${family.id}', codeDir: '${family.codeDir}', docsSegment: '${family.docsSegment}' },`,
    );
  }
  lines.push('] as const;', '');

  lines.push('export const COMPONENT_REGISTRY = {');
  for (const component of components) {
    lines.push(`  ${key(component.name)}: '${component.path}',`);
  }
  lines.push('} as const;', '');

  lines.push('/** Which family each component belongs to. */');
  lines.push('export const COMPONENT_FAMILY = {');
  for (const component of components) {
    lines.push(`  ${key(component.name)}: '${component.family}',`);
  }
  lines.push('} as const;', '');

  lines.push('export const DEMO_REGISTRY = {');
  for (const demo of demos) {
    lines.push(`  ${key(demo.component)}: {`);
    for (const variant of demo.variants) {
      lines.push(
        `    ${key(variant)}: 'packages/ui/${DEMOS_DIR}/${demo.component}/${variant}.tsx',`,
      );
    }
    lines.push('  },');
  }
  lines.push('} as const;', '');

  lines.push('export const BRICK_REGISTRY = {');
  for (const brick of bricks) {
    lines.push(`  ${key(brick.category)}: {`);
    for (const item of brick.items) {
      lines.push(`    ${key(item)}: 'packages/ui/${BRICKS_DIR}/${brick.category}/${item}',`);
    }
    lines.push('  },');
  }
  lines.push('} as const;', '');

  lines.push("export type Family = (typeof FAMILIES)[number]['id'];");
  lines.push('export type ComponentName = keyof typeof COMPONENT_REGISTRY;');
  lines.push(
    'export type DemoName<T extends keyof typeof DEMO_REGISTRY> = keyof (typeof DEMO_REGISTRY)[T];',
  );
  lines.push('export type BrickCategory = keyof typeof BRICK_REGISTRY;');
  lines.push('export type BrickName<T extends BrickCategory> = keyof (typeof BRICK_REGISTRY)[T];');

  return `${lines.join('\n')}\n`;
}

function emitDemoComponents(demos) {
  const imports = [];
  const aliases = new Map();

  for (const demo of demos) {
    for (const variant of demo.variants) {
      const alias = demoAlias(demo.component, variant);
      const previous = aliases.get(alias);
      if (previous) {
        throw new Error(
          `generate-registry: alias "${alias}" collides between ` +
            `${previous} and ${demo.component}/${variant}. Rename one demo file.`,
        );
      }
      aliases.set(alias, `${demo.component}/${variant}`);

      imports.push({
        alias,
        statement: `import { ${pascal(variant)} as ${alias} } from '@repo/ui/${DEMOS_DIR}/${demo.component}/${variant}';`,
      });
    }
  }

  imports.sort((a, b) => a.statement.localeCompare(b.statement));

  const lines = [GENERATED_HEADER];
  for (const entry of imports) lines.push(entry.statement);
  lines.push('');
  lines.push(
    'export const DEMO_COMPONENTS: Record<string, Record<string, React.ComponentType>> = {',
  );
  for (const demo of demos) {
    lines.push(`  ${key(demo.component)}: {`);
    for (const variant of demo.variants) {
      lines.push(`    ${key(variant)}: ${demoAlias(demo.component, variant)},`);
    }
    lines.push('  },');
  }
  lines.push('};');

  return `${lines.join('\n')}\n`;
}

// ---------------------------------------------------------------- driver

function main() {
  const check = process.argv.includes('--check');

  const components = scanComponents();
  const demos = scanDemos();
  const bricks = scanBricks();

  if (components.length === 0 || demos.length === 0) {
    console.error('generate-registry: scanned nothing. The family paths are wrong.');
    process.exit(1);
  }

  const outputs = [
    { target: REGISTRY_TARGET, content: emitRegistry(components, demos, bricks) },
    { target: DEMO_COMPONENTS_TARGET, content: emitDemoComponents(demos) },
  ];

  const stale = [];
  for (const { target, content } of outputs) {
    const absolute = join(REPO_ROOT, target);

    if (check) {
      let current = '';
      try {
        current = readFileSync(absolute, 'utf8');
      } catch {
        current = '';
      }
      if (current !== content) stale.push(target);
      continue;
    }

    writeFileSync(absolute, content, 'utf8');
  }

  const summary =
    `${components.length} components, ` +
    `${demos.reduce((total, d) => total + d.variants.length, 0)} demos, ` +
    `${bricks.reduce((total, b) => total + b.items.length, 0)} bricks`;

  if (!check) {
    console.log(`generate-registry: wrote ${outputs.length} files (${summary})`);
    return;
  }

  if (stale.length === 0) {
    console.log(`generate-registry: registries up to date (${summary})`);
    return;
  }

  console.error('generate-registry FAILED: these files do not match the filesystem:\n');
  for (const target of stale) console.error(`  ${target}`);
  console.error('\nRun `pnpm --filter @repo/ui generate:registry` and commit the result.\n');
  process.exit(1);
}

main();
