/**
 * Builds every stylesheet that carries theme tokens from the DTCG files in
 * packages/ui/tokens/themes/<theme>/{light,dark}.tokens.json:
 *
 *   - the token blocks and the Tailwind mapping in src/css/globals.css (theme
 *     "nachui", the one the docs site and the components are designed on)
 *   - one complete stylesheet per theme in apps/api/src/modules/themes/css,
 *     which `nachui init` writes into the user's project
 *   - the stylesheet the installation guide asks readers to paste, in both
 *     locales
 *
 * It also fills in the `hex` fallback of every color, so tools that only read
 * sRGB (Figma variables, Tokens Studio) import the same values.
 *
 *   node scripts/build-tokens.mjs           write everything
 *   node scripts/build-tokens.mjs --check   exit 1 if anything is stale
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const UI_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = join(UI_ROOT, '../..');
const THEMES_DIR = join(UI_ROOT, 'tokens/themes');
const GLOBALS = join(UI_ROOT, 'src/css/globals.css');
const API_THEMES = join(REPO_ROOT, 'apps/api/src/modules/themes/css');
const INSTALL_GUIDES = ['en', 'es'].map((locale) =>
  join(REPO_ROOT, `apps/web/src/content/docs/${locale}/installation.mdx`),
);
const SITE_THEME = 'nachui';

const check = process.argv.includes('--check');

const round = (value, digits) => Number(value.toFixed(digits));

function oklchToSrgb([l, c, h]) {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const linear = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
  return linear.map((channel) => {
    const encoded = channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055;
    return Math.min(1, Math.max(0, encoded));
  });
}

function toHex(color) {
  const rgb = color.colorSpace === 'oklch' ? oklchToSrgb(color.components) : color.components;
  return `#${rgb
    .map((channel) =>
      Math.round(channel * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
}

function formatNumber(value) {
  return String(round(value, 4));
}

function formatColor(color) {
  const alpha = color.alpha ?? 1;
  if (color.colorSpace === 'oklch') {
    const [l, c, h] = color.components;
    const body = `${formatNumber(l * 100)}% ${formatNumber(c)} ${formatNumber(h)}`;
    return alpha === 1 ? `oklch(${body})` : `oklch(${body} / ${formatNumber(alpha)})`;
  }
  if (color.colorSpace === 'srgb') {
    if (alpha === 1) return color.hex ?? toHex(color);
    const [r, g, b] = color.components.map((channel) => Math.round(channel * 255));
    return `rgba(${r}, ${g}, ${b}, ${formatNumber(alpha)})`;
  }
  throw new Error(`Unsupported color space "${color.colorSpace}"`);
}

function formatDimension({ value, unit }) {
  return value === 0 ? '0' : `${formatNumber(value)}${unit}`;
}

function formatShadow(shadow) {
  const lengths = [shadow.offsetX, shadow.offsetY, shadow.blur];
  if (shadow.spread && shadow.spread.value !== 0) lengths.push(shadow.spread);
  return `${lengths.map(formatDimension).join(' ')} ${formatColor(shadow.color)}`;
}

function formatValue(token) {
  switch (token.$type) {
    case 'color':
      return formatColor(token.$value);
    case 'dimension':
      return formatDimension(token.$value);
    case 'shadow':
      return formatShadow(token.$value);
    default:
      throw new Error(`Unsupported token type "${token.$type}"`);
  }
}

function cssName(path) {
  if (path[0] === 'color') return path[path.length - 1];
  return path.join('-');
}

function flatten(tree, path = [], groups = []) {
  for (const [key, node] of Object.entries(tree)) {
    if (key.startsWith('$')) continue;
    if (node && typeof node === 'object' && '$value' in node) {
      const group = path.join('.');
      let bucket = groups.find((entry) => entry.group === group);
      if (!bucket) {
        bucket = { group, tokens: [] };
        groups.push(bucket);
      }
      bucket.tokens.push({ name: cssName([...path, key]), token: node });
    } else if (node && typeof node === 'object') {
      flatten(node, [...path, key], groups);
    }
  }
  return groups;
}

function fillHex(tree) {
  let changed = false;
  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if (node.$type === 'color' && node.$value) {
      const hex = toHex(node.$value);
      if (node.$value.hex !== hex) {
        node.$value.hex = hex;
        changed = true;
      }
    }
    if (node.$type === 'shadow' && node.$value?.color) {
      const hex = toHex(node.$value.color);
      if (node.$value.color.hex !== hex) {
        node.$value.color.hex = hex;
        changed = true;
      }
    }
    for (const [key, child] of Object.entries(node)) {
      if (!key.startsWith('$')) visit(child);
    }
  };
  visit(tree);
  return changed;
}

function block(selector, groups) {
  const body = groups
    .map(({ tokens }) =>
      tokens.map(({ name, token }) => `  --${name}: ${formatValue(token)};`).join('\n'),
    )
    .join('\n\n');
  return `${selector} {\n${body}\n}`;
}

function tailwindMapping(groups) {
  const colors = groups
    .filter(({ group }) => group.startsWith('color'))
    .map(({ tokens }) =>
      tokens
        .filter(({ name }) => name !== 'grid-color' && !name.startsWith('code-'))
        .map(({ name }) => `  --color-${name}: var(--${name});`)
        .join('\n'),
    )
    .filter(Boolean)
    .join('\n\n');
  const radius = [
    '  --radius-sm: calc(var(--radius) * 0.66);',
    '  --radius-md: var(--radius);',
    '  --radius-lg: calc(var(--radius) * 1.33);',
    '  --radius-xl: calc(var(--radius) * 1.66);',
    '  --radius-2xl: calc(var(--radius) * 2);',
  ].join('\n');
  const shadow = [
    '  --shadow-sm: var(--elevation-sm);',
    '  --shadow-md: var(--elevation-md);',
    '  --shadow-lg: var(--elevation-lg);',
  ].join('\n');
  return `${colors}\n\n${radius}\n\n${shadow}`;
}

function themeStylesheet(theme) {
  return `@import 'tailwindcss';
@custom-variant dark (&:where(.dark, .dark *));

${block(':root', theme.light)}

${block('.dark', theme.dark)}

@theme inline {
${tailwindMapping(theme.light)}
}

@utility hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  button:not(:disabled),
  [role='button']:not([aria-disabled='true']) {
    cursor: pointer;
  }

  body {
    @apply bg-background text-foreground antialiased;
  }
}
`;
}

function replaceBetween(source, start, end, content, file) {
  const from = source.indexOf(start);
  const to = source.indexOf(end);
  if (from === -1 || to === -1 || to < from) {
    throw new Error(`${file} is missing the "${start}" and "${end}" markers.`);
  }
  return `${source.slice(0, from + start.length)}\n${content}\n${source.slice(to)}`;
}

const stale = [];

function emit(file, next) {
  const current = (() => {
    try {
      return readFileSync(file, 'utf8');
    } catch {
      return null;
    }
  })();
  if (current === next) return;
  if (check) stale.push(relative(REPO_ROOT, file));
  else writeFileSync(file, next);
}

const themes = new Map();

for (const name of readdirSync(THEMES_DIR).sort()) {
  const theme = {};
  for (const mode of ['light', 'dark']) {
    const file = join(THEMES_DIR, name, `${mode}.tokens.json`);
    const tree = JSON.parse(readFileSync(file, 'utf8'));
    if (fillHex(tree)) emit(file, `${JSON.stringify(tree, null, 2)}\n`);
    theme[mode] = flatten(tree);
  }
  const lightNames = theme.light.flatMap(({ tokens }) => tokens.map((entry) => entry.name));
  const darkNames = theme.dark.flatMap(({ tokens }) => tokens.map((entry) => entry.name));
  const missing = lightNames.filter((token) => token !== 'radius' && !darkNames.includes(token));
  if (missing.length > 0) {
    throw new Error(`Theme "${name}" has no dark value for: ${missing.join(', ')}`);
  }
  themes.set(name, theme);
}

const site = themes.get(SITE_THEME);
if (!site)
  throw new Error(`Missing the "${SITE_THEME}" theme in ${relative(REPO_ROOT, THEMES_DIR)}`);

let globals = readFileSync(GLOBALS, 'utf8');
globals = replaceBetween(
  globals,
  '/* tokens:start */',
  '/* tokens:end */',
  `${block(':root', site.light)}\n\n${block('.dark', site.dark)}`,
  'globals.css',
);
globals = replaceBetween(
  globals,
  '/* tokens:theme:start */',
  '  /* tokens:theme:end */',
  tailwindMapping(site.light),
  'globals.css',
);
emit(GLOBALS, globals);

for (const [name, theme] of themes) {
  emit(join(API_THEMES, `${name}.css`), themeStylesheet(theme));
}

for (const guide of INSTALL_GUIDES) {
  const source = readFileSync(guide, 'utf8');
  emit(
    guide,
    replaceBetween(
      source,
      '{/* tokens:install:start */}',
      '{/* tokens:install:end */}',
      `\n\`\`\`css\n${themeStylesheet(site)}\`\`\`\n`,
      relative(REPO_ROOT, guide),
    ),
  );
}

if (stale.length > 0) {
  console.error('Token outputs are out of date. Run `pnpm --filter @repo/ui tokens` and commit:');
  for (const file of stale) console.error(`  ${file}`);
  process.exit(1);
}

console.log(
  check
    ? `build-tokens: ${themes.size} themes up to date.`
    : `build-tokens: built ${themes.size} themes.`,
);
