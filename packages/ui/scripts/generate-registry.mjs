/**
 * Generates the catalogs that describe packages/ui, from the filesystem.
 *
 *   packages/ui/src/lib/registry.ts                        paths
 *   apps/web/src/shared/components/mdx/demo-registry.tsx   lazy demo loaders
 *   apps/web/src/features/gallery/lib/example-registry.tsx lazy gallery examples
 *   apps/web/src/features/icons/lib/icon-registry.tsx      React imports
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
import { BRICKS_DIR, DEMOS_DIR, EXAMPLES_DIR, FAMILIES, ICONS_DIR } from './families.mjs';

const UI_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = resolve(UI_ROOT, '../..');

const GENERATED_HEADER = [
  '// GENERATED FILE, DO NOT EDIT.',
  '// Run `pnpm --filter @repo/ui generate:registry` after adding a component,',
  '// a demo, a brick or an icon. The build fails if this file is out of date.',
  '',
].join('\n');

const REGISTRY_TARGET = 'packages/ui/src/lib/registry.ts';
const DEMO_COMPONENTS_TARGET = 'apps/web/src/shared/components/mdx/demo-registry.tsx';
const EXAMPLE_COMPONENTS_TARGET = 'apps/web/src/features/gallery/lib/example-registry.tsx';
const ICON_COMPONENTS_TARGET = 'apps/web/src/features/icons/lib/icon-registry.tsx';

class ScanError extends Error {}

/**
 * Reads a directory under packages/ui. A missing or unreadable directory is
 * a wrong path, not an empty family, so it throws instead of returning [] and
 * quietly writing an empty registry.
 */
function listDir(relPath) {
  try {
    return readdirSync(join(UI_ROOT, relPath), { withFileTypes: true });
  } catch (error) {
    throw new ScanError(`cannot read packages/ui/${relPath} (${error.code ?? error.message})`);
  }
}

/** Every scan has to find something; an empty result means the layout moved. */
function nonEmpty(items, what) {
  if (items.length === 0) {
    throw new ScanError(`found no ${what}. Check the paths in scripts/families.mjs.`);
  }
  return items;
}

function scanComponents() {
  const components = [];

  for (const family of FAMILIES) {
    const found = listDir(family.codeDir)
      .filter((entry) => entry.isFile() && entry.name.endsWith('.tsx'))
      .filter((entry) => !entry.name.endsWith('.test.tsx'))
      .map((entry) => ({
        name: entry.name.replace(/\.tsx$/, ''),
        family: family.id,
        path: `packages/ui/${family.codeDir}/${entry.name}`,
      }));

    components.push(...nonEmpty(found, `components in ${family.codeDir} (family "${family.id}")`));
  }

  return components.sort((a, b) => a.name.localeCompare(b.name));
}

function scanVariants(rootDir) {
  const demos = [];

  for (const dir of listDir(rootDir)) {
    if (!dir.isDirectory()) continue;

    const variants = listDir(`${rootDir}/${dir.name}`)
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

function scanIcons() {
  return listDir(ICONS_DIR)
    .filter((f) => f.isFile() && f.name.endsWith('.tsx') && !f.name.endsWith('.test.tsx'))
    .map((f) => f.name.replace(/\.tsx$/, ''))
    .sort((a, b) => a.localeCompare(b));
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

function emitRegistry(components, demos, examples, bricks, icons) {
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

  lines.push(
    '/** Gallery examples: real compositions built with a component, never shown in docs. */',
  );
  lines.push('export const EXAMPLE_REGISTRY = {');
  for (const example of examples) {
    lines.push(`  ${key(example.component)}: {`);
    for (const variant of example.variants) {
      lines.push(
        `    ${key(variant)}: 'packages/ui/${EXAMPLES_DIR}/${example.component}/${variant}.tsx',`,
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

  lines.push(
    '/** The icon set: one self-contained file per icon, served as the `icons` family. */',
  );
  lines.push("export const ICONS_DIR = 'src/icons';");
  lines.push('export const ICON_REGISTRY = {');
  for (const icon of icons) {
    lines.push(`  ${key(icon)}: 'packages/ui/${ICONS_DIR}/${icon}.tsx',`);
  }
  lines.push('} as const;', '');

  lines.push("export type Family = (typeof FAMILIES)[number]['id'];");
  lines.push('export type ComponentName = keyof typeof COMPONENT_REGISTRY;');
  lines.push(
    'export type DemoName<T extends keyof typeof DEMO_REGISTRY> = keyof (typeof DEMO_REGISTRY)[T];',
  );
  lines.push(
    'export type ExampleName<T extends keyof typeof EXAMPLE_REGISTRY> = keyof (typeof EXAMPLE_REGISTRY)[T];',
  );
  lines.push('export type BrickCategory = keyof typeof BRICK_REGISTRY;');
  lines.push('export type BrickName<T extends BrickCategory> = keyof (typeof BRICK_REGISTRY)[T];');
  lines.push('export type IconName = keyof typeof ICON_REGISTRY;');

  return `${lines.join('\n')}\n`;
}

function variantImport(dir, component, variant) {
  return `import('@repo/ui/${dir}/${component}/${variant}').then((m) => m.${pascal(variant)})`;
}

/**
 * Demos render inside ComponentPreview, an async server component, so each
 * entry is a loader it awaits. A docs page only loads the demos it shows
 * instead of all of them, and a missing export still fails type-checking.
 */
function emitDemoComponents(demos) {
  const lines = [GENERATED_HEADER];
  lines.push('export type DemoLoader = () => Promise<React.ComponentType>;');
  lines.push('');
  lines.push('export const DEMO_COMPONENTS: Record<string, Record<string, DemoLoader>> = {');
  for (const demo of demos) {
    lines.push(`  ${key(demo.component)}: {`);
    for (const variant of demo.variants) {
      lines.push(
        `    ${key(variant)}: () => ${variantImport(DEMOS_DIR, demo.component, variant)},`,
      );
    }
    lines.push('  },');
  }
  lines.push('};');

  return `${lines.join('\n')}\n`;
}

/**
 * Gallery examples render from client components, so each one is wrapped in
 * next/dynamic: it still server-renders, and a gallery page only ships the
 * chunks of the examples it shows.
 */
function emitExampleComponents(examples) {
  const lines = [GENERATED_HEADER];
  lines.push("import dynamic from 'next/dynamic';");
  lines.push('');
  lines.push(
    'export const EXAMPLE_COMPONENTS: Record<string, Record<string, React.ComponentType>> = {',
  );
  for (const example of examples) {
    lines.push(`  ${key(example.component)}: {`);
    for (const variant of example.variants) {
      lines.push(
        `    ${key(variant)}: dynamic(() => ${variantImport(EXAMPLES_DIR, example.component, variant)}),`,
      );
    }
    lines.push('  },');
  }
  lines.push('};');

  return `${lines.join('\n')}\n`;
}

function emitIconComponents(icons) {
  const lines = [GENERATED_HEADER];
  for (const icon of icons) {
    lines.push(`import { ${pascal(icon)}Icon } from '@repo/ui/icons/${icon}';`);
  }
  lines.push('');
  lines.push(
    'export const ICON_COMPONENTS: Record<string, React.ComponentType<IconComponentProps>> = {',
  );
  for (const icon of icons) {
    lines.push(`  ${key(icon)}: ${pascal(icon)}Icon,`);
  }
  lines.push('};');
  lines.push('');
  lines.push('export type IconComponentProps = React.SVGProps<SVGSVGElement> & {');
  lines.push('  size?: number | string;');
  lines.push('};');

  return `${lines.join('\n')}\n`;
}

// ---------------------------------------------------------------- driver

function main() {
  const check = process.argv.includes('--check');

  let components, demos, examples, bricks, icons;
  try {
    components = scanComponents();
    demos = nonEmpty(scanVariants(DEMOS_DIR), `demos in ${DEMOS_DIR}`);
    examples = nonEmpty(scanVariants(EXAMPLES_DIR), `examples in ${EXAMPLES_DIR}`);
    bricks = nonEmpty(scanBricks(), `bricks in ${BRICKS_DIR}`);
    icons = nonEmpty(scanIcons(), `icons in ${ICONS_DIR}`);
  } catch (error) {
    if (!(error instanceof ScanError)) throw error;
    console.error(`generate-registry FAILED: ${error.message}`);
    process.exit(1);
  }

  const outputs = [
    { target: REGISTRY_TARGET, content: emitRegistry(components, demos, examples, bricks, icons) },
    {
      target: DEMO_COMPONENTS_TARGET,
      content: emitDemoComponents(demos),
    },
    {
      target: EXAMPLE_COMPONENTS_TARGET,
      content: emitExampleComponents(examples),
    },
    { target: ICON_COMPONENTS_TARGET, content: emitIconComponents(icons) },
  ];

  const stale = [];
  for (const { target, content } of outputs) {
    const absolute = join(REPO_ROOT, target);

    if (check) {
      let current;
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
    `${examples.reduce((total, e) => total + e.variants.length, 0)} examples, ` +
    `${bricks.reduce((total, b) => total + b.items.length, 0)} bricks, ` +
    `${icons.length} icons`;

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
