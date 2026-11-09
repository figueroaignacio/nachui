import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

interface TokenColor {
  colorSpace: 'oklch' | 'srgb';
  components: [number, number, number];
}

const here = path.dirname(fileURLToPath(import.meta.url));
const THEMES = path.join(here, '..', 'tokens', 'themes');

const TEXT_PAIRS: Array<[string, string]> = [
  ['foreground', 'background'],
  ['card-foreground', 'card'],
  ['popover-foreground', 'popover'],
  ['muted-foreground', 'background'],
  ['muted-foreground', 'muted'],
  ['primary-foreground', 'primary'],
  ['secondary-foreground', 'secondary'],
  ['accent-foreground', 'accent'],
  ['inverse-foreground', 'inverse'],
  ['destructive-foreground', 'destructive'],
  ['destructive-text', 'destructive-surface'],
  ['warning-text', 'warning-surface'],
  ['success-text', 'success-surface'],
  ['info-text', 'info-surface'],
  ['destructive-text', 'background'],
];

function toSrgb(color: TokenColor): [number, number, number] {
  if (color.colorSpace === 'srgb') return color.components;
  const [l, c, h] = color.components;
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l3 = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m3 = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s3 = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const linear = [
    4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
    -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
    -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3,
  ];
  return linear.map((channel) => {
    const value = Math.min(1, Math.max(0, channel));
    return value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055;
  }) as [number, number, number];
}

function luminance(color: TokenColor) {
  const [r, g, b] = toSrgb(color).map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  ) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a: TokenColor, b: TokenColor) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}

function readColors(theme: string, mode: 'light' | 'dark') {
  const file = path.join(THEMES, theme, `${mode}.tokens.json`);
  const tree = JSON.parse(readFileSync(file, 'utf8')) as {
    color: Record<string, Record<string, { $value: TokenColor }>>;
  };
  const colors: Record<string, TokenColor> = {};
  for (const group of Object.values(tree.color)) {
    for (const [name, token] of Object.entries(group)) colors[name] = token.$value;
  }
  return colors;
}

describe.each(readdirSync(THEMES))('theme %s', (theme) => {
  it.each(['light', 'dark'] as const)('keeps every text pair at AA in %s mode', (mode) => {
    const colors = readColors(theme, mode);
    const failures = TEXT_PAIRS.filter(([text, surface]) => colors[text] && colors[surface])
      .map(([text, surface]) => ({
        pair: `${text} on ${surface}`,
        value: ratio(colors[text] as TokenColor, colors[surface] as TokenColor),
      }))
      .filter(({ value }) => value < 4.5)
      .map(({ pair, value }) => `${pair}: ${value.toFixed(2)}`);
    expect(failures).toEqual([]);
  });

  it('measures black on white as 21:1', () => {
    const black: TokenColor = { colorSpace: 'srgb', components: [0, 0, 0] };
    const white: TokenColor = { colorSpace: 'oklch', components: [1, 0, 0] };
    expect(ratio(black, white)).toBeCloseTo(21, 0);
  });
});
