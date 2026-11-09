import { type Oklch, oklchToSrgb, type Rgb, rgbToHex, srgbToOklch } from './color';

export interface ColorValue {
  colorSpace: 'oklch' | 'srgb';
  components: Rgb;
  alpha?: number;
  hex?: string;
}

export interface DimensionValue {
  value: number;
  unit: string;
}

export interface ShadowValue {
  color: ColorValue;
  offsetX: DimensionValue;
  offsetY: DimensionValue;
  blur: DimensionValue;
  spread?: DimensionValue;
}

export type Token =
  | { $type: 'color'; $value: ColorValue; $description?: string }
  | { $type: 'dimension'; $value: DimensionValue; $description?: string }
  | { $type: 'shadow'; $value: ShadowValue; $description?: string };

export interface TokenGroup {
  [key: string]: TokenGroup | Token | string;
}

export interface ThemeTokens {
  light: TokenGroup;
  dark: TokenGroup;
}

export interface FlatToken {
  name: string;
  token: Token;
}

export interface TokenBucket {
  group: string;
  tokens: FlatToken[];
}

export function isToken(node: unknown): node is Token {
  return typeof node === 'object' && node !== null && '$value' in node;
}

const round = (value: number, digits: number) => Number(value.toFixed(digits));

export function colorToRgb(color: ColorValue): Rgb {
  if (color.colorSpace === 'oklch') {
    const [l, c, h] = color.components;
    return oklchToSrgb({ l, c, h });
  }
  return color.components;
}

export function colorToOklch(color: ColorValue): Oklch {
  if (color.colorSpace === 'oklch') {
    const [l, c, h] = color.components;
    return { l, c, h };
  }
  return srgbToOklch(color.components);
}

export function toHex(color: ColorValue) {
  return rgbToHex(colorToRgb(color));
}

function formatNumber(value: number) {
  return String(round(value, 4));
}

export function formatColor(color: ColorValue) {
  const alpha = color.alpha ?? 1;
  if (color.colorSpace === 'oklch') {
    const [l, c, h] = color.components;
    const body = `${formatNumber(l * 100)}% ${formatNumber(c)} ${formatNumber(h)}`;
    return alpha === 1 ? `oklch(${body})` : `oklch(${body} / ${formatNumber(alpha)})`;
  }
  if (alpha === 1) return color.hex ?? toHex(color);
  const [r, g, b] = color.components.map((channel) => Math.round(channel * 255));
  return `rgba(${r}, ${g}, ${b}, ${formatNumber(alpha)})`;
}

function formatDimension({ value, unit }: DimensionValue) {
  return value === 0 ? '0' : `${formatNumber(value)}${unit}`;
}

function formatShadow(shadow: ShadowValue) {
  const lengths = [shadow.offsetX, shadow.offsetY, shadow.blur];
  if (shadow.spread && shadow.spread.value !== 0) lengths.push(shadow.spread);
  return `${lengths.map(formatDimension).join(' ')} ${formatColor(shadow.color)}`;
}

export function formatValue(token: Token) {
  switch (token.$type) {
    case 'color':
      return formatColor(token.$value);
    case 'dimension':
      return formatDimension(token.$value);
    case 'shadow':
      return formatShadow(token.$value);
  }
}

function cssName(path: string[]) {
  if (path[0] === 'color') return path[path.length - 1] ?? '';
  return path.join('-');
}

export function flatten(tree: TokenGroup, path: string[] = [], groups: TokenBucket[] = []) {
  for (const [key, node] of Object.entries(tree)) {
    if (key.startsWith('$') || typeof node !== 'object') continue;
    if (isToken(node)) {
      const group = path.join('.');
      let bucket = groups.find((entry) => entry.group === group);
      if (!bucket) {
        bucket = { group, tokens: [] };
        groups.push(bucket);
      }
      bucket.tokens.push({ name: cssName([...path, key]), token: node });
    } else {
      flatten(node, [...path, key], groups);
    }
  }
  return groups;
}

export function findToken(tree: TokenGroup, name: string) {
  for (const bucket of flatten(tree)) {
    const found = bucket.tokens.find((entry) => entry.name === name);
    if (found) return found.token;
  }
  return undefined;
}

export function findColor(tree: TokenGroup, name: string) {
  const token = findToken(tree, name);
  return token?.$type === 'color' ? token.$value : undefined;
}

export function fillHex(tree: TokenGroup) {
  const visit = (node: TokenGroup | Token | string) => {
    if (typeof node !== 'object') return;
    if (isToken(node)) {
      if (node.$type === 'color') node.$value.hex = toHex(node.$value);
      if (node.$type === 'shadow') node.$value.color.hex = toHex(node.$value.color);
      return;
    }
    for (const [key, child] of Object.entries(node)) {
      if (!key.startsWith('$')) visit(child);
    }
  };
  visit(tree);
  return tree;
}

function block(selector: string, groups: TokenBucket[]) {
  const body = groups
    .map(({ tokens }) =>
      tokens.map(({ name, token }) => `  --${name}: ${formatValue(token)};`).join('\n'),
    )
    .join('\n\n');
  return `${selector} {\n${body}\n}`;
}

function tailwindMapping(groups: TokenBucket[]) {
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
    '  --radius-sm: calc(var(--radius) * 0.5);',
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

export function themeStylesheet(theme: ThemeTokens) {
  const light = flatten(theme.light);
  const dark = flatten(theme.dark);

  return `@import 'tailwindcss';
@custom-variant dark (&:where(.dark, .dark *));

${block(':root', light)}

${block('.dark', dark)}

@theme inline {
${tailwindMapping(light)}
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

export type CssVariables = Record<`--${string}`, string>;

export function cssVariables(tree: TokenGroup): CssVariables {
  const variables: CssVariables = {};
  for (const { tokens } of flatten(tree)) {
    for (const { name, token } of tokens) variables[`--${name}`] = formatValue(token);
  }
  return variables;
}

export function modeVariables(theme: ThemeTokens, mode: 'light' | 'dark'): CssVariables {
  const light = cssVariables(theme.light);
  return mode === 'light' ? light : { ...light, ...cssVariables(theme.dark) };
}

export function serializeTokens(tree: TokenGroup) {
  return `${JSON.stringify(tree, null, 2)}\n`;
}
