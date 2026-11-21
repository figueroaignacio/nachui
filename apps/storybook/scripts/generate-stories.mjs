import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { stdout } from 'node:process';
import { fileURLToPath } from 'node:url';

import {
  BRICKS_DIR,
  DEMOS_DIR,
  EXAMPLES_DIR,
  FAMILIES,
  ICONS_DIR,
} from '../../../packages/ui/scripts/families.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const UI = join(ROOT, 'packages/ui');
const OUT = join(ROOT, 'apps/storybook/src/generated');

const FAMILY_LABELS = {
  ai: 'AI Elements',
  ui: 'Components',
  layout: 'Layout',
  hybrids: 'Hybrids',
};

const FAMILY_LAYOUT = {
  ai: 'padded',
  ui: 'centered',
  layout: 'padded',
  hybrids: 'padded',
};

const ACRONYMS = { ai: 'AI', ui: 'UI', otp: 'OTP', api: 'API', cta: 'CTA' };

const pascal = (slug) =>
  slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');

const titleCase = (slug) =>
  slug
    .split('-')
    .map((part) => ACRONYMS[part] ?? part[0].toUpperCase() + part.slice(1))
    .join(' ');

const sortVariants = (variants) =>
  [...variants].sort((a, b) => (a === 'default' ? -1 : b === 'default' ? 1 : a.localeCompare(b)));

function readNav() {
  const docs = JSON.parse(readFileSync(join(ROOT, 'apps/web/src/locales/en/docs.json'), 'utf8'));
  const entries = new Map();
  const walk = (node) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== 'object') return;
    if (typeof node.href === 'string' && typeof node.title === 'string') {
      entries.set(node.href, { title: node.title, description: node.description });
    }
    Object.values(node).forEach(walk);
  };
  walk(docs.navigation);
  return entries;
}

function exportsOf(file) {
  const source = readFileSync(file, 'utf8');
  const names = [...source.matchAll(/export\s+(?:function|const)\s+([A-Z]\w*)/g)].map((m) => m[1]);
  for (const [, list] of source.matchAll(/export\s+\{([^}]*)\}/g)) {
    for (const entry of list.split(',')) {
      const name = entry
        .trim()
        .split(/\s+as\s+/)
        .pop();
      if (name && /^[A-Z]/.test(name)) names.push(name);
    }
  }
  return { names, hasDefault: /export\s+default\s/.test(source) };
}

function importPath(fromFile, target) {
  const path = relative(dirname(fromFile), target).replace(/\.tsx?$/, '');
  return path.startsWith('.') ? path : `./${path}`;
}

function stringLiteral(value) {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function write(file, lines) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${lines.join('\n')}\n`);
}

function familyOf(slug) {
  return FAMILIES.find((family) => existsSync(join(UI, family.codeDir, `${slug}.tsx`)));
}

function storyFile({ file, title, layout, component, description, stories, docs = true }) {
  const lines = ["import type { Meta, StoryObj } from '@storybook/react-vite';", ''];
  if (component)
    lines.push(`import { ${component.name} } from '${importPath(file, component.path)}';`);
  for (const story of stories) {
    const clause = story.isDefault ? `${story.local}` : `{ ${story.exportName} as ${story.local} }`;
    lines.push(`import ${clause} from '${importPath(file, story.path)}';`);
  }
  lines.push('', 'const meta = {', `  title: ${stringLiteral(title)},`);
  if (component) lines.push(`  component: ${component.name},`);
  if (!docs) lines.push("  tags: ['!autodocs'],");
  lines.push(`  parameters: {`, `    layout: '${layout}',`);
  if (description) {
    lines.push(`    docs: { description: { component: ${stringLiteral(description)} } },`);
  }
  lines.push('  },', '} satisfies Meta;', '', 'export default meta;', '', 'type Story = StoryObj;');
  for (const story of stories) {
    lines.push(
      '',
      `export const ${story.name}: Story = {`,
      `  name: ${stringLiteral(story.label)},`,
      `  render: () => <${story.local} />,`,
      '};',
    );
  }
  write(file, lines);
}

function demoStories(nav) {
  const dir = join(UI, DEMOS_DIR);
  let count = 0;
  for (const slug of readdirSync(dir).sort()) {
    const family = familyOf(slug);
    if (!family) throw new Error(`generate-stories: no component file for demos/${slug}`);
    const componentPath = join(UI, family.codeDir, `${slug}.tsx`);
    const componentSource = readFileSync(componentPath, 'utf8');
    const componentName = exportsOf(componentPath).names.find(
      (name) =>
        name.toLowerCase() === pascal(slug).toLowerCase() &&
        !new RegExp(`const\\s+${name}\\s*=\\s*\\{`).test(componentSource),
    );
    const info = nav.get(`/docs/${family.docsSegment}/${slug}`);
    const file = join(OUT, family.id, `${slug}.stories.tsx`);
    const variants = sortVariants(
      readdirSync(join(dir, slug))
        .filter((name) => name.endsWith('.tsx'))
        .map((name) => name.replace(/\.tsx$/, '')),
    );
    const stories = variants.map((variant) => {
      const path = join(dir, slug, `${variant}.tsx`);
      const { names } = exportsOf(path);
      const wanted = pascal(variant);
      const exportName = names.includes(wanted) ? wanted : names[0];
      if (!exportName)
        throw new Error(`generate-stories: demos/${slug}/${variant}.tsx exports nothing`);
      const safe = /^\d/.test(wanted) ? `Variant${wanted}` : wanted;
      return {
        name: safe === componentName ? `${safe}Story` : safe,
        label: titleCase(variant),
        exportName,
        local: `Demo${wanted}`,
        path,
      };
    });
    storyFile({
      file,
      title: `${FAMILY_LABELS[family.id]}/${info?.title ?? titleCase(slug)}`,
      layout: FAMILY_LAYOUT[family.id],
      component: componentName ? { name: componentName, path: componentPath } : undefined,
      description: info?.description,
      stories,
    });
    count += stories.length;
  }
  return count;
}

function exampleStories() {
  const dir = join(UI, EXAMPLES_DIR);
  let count = 0;
  for (const slug of readdirSync(dir).sort()) {
    const variants = sortVariants(
      readdirSync(join(dir, slug))
        .filter((name) => name.endsWith('.tsx'))
        .map((name) => name.replace(/\.tsx$/, '')),
    );
    const stories = variants.map((variant) => {
      const path = join(dir, slug, `${variant}.tsx`);
      const { names, hasDefault } = exportsOf(path);
      const wanted = pascal(variant);
      const exportName = names.includes(wanted) ? wanted : names[0];
      if (!exportName && !hasDefault) {
        throw new Error(`generate-stories: examples/${slug}/${variant}.tsx exports nothing`);
      }
      return {
        name: /^\d/.test(wanted) ? `Example${wanted}` : wanted,
        label: titleCase(variant),
        exportName,
        isDefault: !exportName,
        local: `Example${wanted}`,
        path,
      };
    });
    storyFile({
      file: join(OUT, 'examples', `${slug}.stories.tsx`),
      title: `Examples/${titleCase(slug)}`,
      layout: 'centered',
      stories,
    });
    count += stories.length;
  }
  return count;
}

function brickStories() {
  const dir = join(UI, BRICKS_DIR);
  let count = 0;
  for (const category of readdirSync(dir).sort()) {
    const stories = readdirSync(join(dir, category))
      .sort()
      .map((id) => {
        const path = join(dir, category, id, 'app', category, 'page.tsx');
        if (!existsSync(path)) throw new Error(`generate-stories: missing ${relative(ROOT, path)}`);
        const name = pascal(id);
        return { name, label: titleCase(id), isDefault: true, local: `Brick${name}`, path };
      });
    storyFile({
      file: join(OUT, 'bricks', `${category}.stories.tsx`),
      title: `Bricks/${titleCase(category)}`,
      layout: 'fullscreen',
      stories,
      docs: false,
    });
    count += stories.length;
  }
  return count;
}

function iconStories() {
  const dir = join(UI, ICONS_DIR);
  const file = join(OUT, 'icons', 'all.stories.tsx');
  const icons = readdirSync(dir)
    .filter((name) => name.endsWith('.tsx') && !name.includes('.test.'))
    .sort()
    .map((name) => {
      const slug = name.replace(/\.tsx$/, '');
      const path = join(dir, name);
      const exportName = exportsOf(path).names.find((n) => n.endsWith('Icon'));
      if (!exportName) throw new Error(`generate-stories: icons/${name} has no *Icon export`);
      return { slug, exportName, path };
    });
  const lines = [
    "import type { Meta, StoryObj } from '@storybook/react-vite';",
    '',
    ...icons.map((icon) => `import { ${icon.exportName} } from '${importPath(file, icon.path)}';`),
    '',
    'const ICONS = [',
    ...icons.map((icon) => `  { name: '${icon.slug}', Icon: ${icon.exportName} },`),
    '];',
    '',
    'const meta = {',
    "  title: 'Icons/All Icons',",
    "  tags: ['!autodocs'],",
    "  parameters: { layout: 'padded' },",
    '  args: { size: 24, strokeWidth: 1.5 },',
    '  argTypes: {',
    "    size: { control: { type: 'range', min: 12, max: 64, step: 2 } },",
    "    strokeWidth: { control: { type: 'range', min: 0.5, max: 3, step: 0.25 } },",
    '  },',
    '} satisfies Meta;',
    '',
    'export default meta;',
    '',
    'type Story = StoryObj<{ size: number; strokeWidth: number }>;',
    '',
    'export const AllIcons: Story = {',
    "  name: 'All Icons',",
    '  render: ({ size, strokeWidth }) => (',
    '    <ul className="grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-2">',
    '      {ICONS.map(({ name, Icon }) => (',
    '        <li',
    '          key={name}',
    '          className="bg-surface-muted text-foreground flex flex-col items-center gap-3 rounded-xl px-2 py-4"',
    '        >',
    '          <Icon size={size} strokeWidth={strokeWidth} aria-hidden="true" />',
    '          <span className="text-muted-foreground font-mono text-[11px]">{name}</span>',
    '        </li>',
    '      ))}',
    '    </ul>',
    '  ),',
    '};',
  ];
  write(file, lines);
  return icons.length;
}

rmSync(OUT, { recursive: true, force: true });
const nav = readNav();
const demos = demoStories(nav);
const examples = exampleStories();
const bricks = brickStories();
const icons = iconStories();
stdout.write(
  `generate-stories: ${demos} demo stories, ${examples} examples, ${bricks} bricks, ${icons} icons\n`,
);
