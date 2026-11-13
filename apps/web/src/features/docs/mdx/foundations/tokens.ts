export type DtcgColor = {
  colorSpace: string;
  components: number[];
  alpha?: number;
  hex?: string;
};

export type DtcgDimension = { value: number; unit: string };

export type DtcgShadow = {
  color: DtcgColor;
  offsetX: DtcgDimension;
  offsetY: DtcgDimension;
  blur: DtcgDimension;
  spread?: DtcgDimension;
};

type DtcgToken = { $type: string; $value: unknown; $description?: string };

export type TokenTree = {
  color: Record<string, Record<string, DtcgToken>>;
  elevation?: Record<string, DtcgToken>;
  radius?: DtcgToken;
};

export type ColorToken = { name: string; value: DtcgColor };
export type ColorGroup = { group: string; tokens: ColorToken[] };

const round = (value: number, digits: number) => Number(value.toFixed(digits));

const formatNumber = (value: number) => String(round(value, 4));

export function formatColor(color: DtcgColor): string {
  const alpha = color.alpha ?? 1;
  if (color.colorSpace === 'oklch') {
    const [l = 0, c = 0, h = 0] = color.components;
    const body = `${formatNumber(l * 100)}% ${formatNumber(c)} ${formatNumber(h)}`;
    return alpha === 1 ? `oklch(${body})` : `oklch(${body} / ${formatNumber(alpha)})`;
  }
  const [r = 0, g = 0, b = 0] = color.components.map((channel) => Math.round(channel * 255));
  return alpha === 1 ? `rgb(${r} ${g} ${b})` : `rgb(${r} ${g} ${b} / ${formatNumber(alpha)})`;
}

export function formatDimension({ value, unit }: DtcgDimension): string {
  return value === 0 ? '0' : `${formatNumber(value)}${unit}`;
}

export function formatShadow(shadow: DtcgShadow): string {
  const lengths = [shadow.offsetX, shadow.offsetY, shadow.blur];
  if (shadow.spread && shadow.spread.value !== 0) lengths.push(shadow.spread);
  return `${lengths.map(formatDimension).join(' ')} ${formatColor(shadow.color)}`;
}

export function colorGroups(tree: TokenTree): ColorGroup[] {
  return Object.entries(tree.color).map(([group, tokens]) => ({
    group,
    tokens: Object.entries(tokens)
      .filter(([, token]) => token.$type === 'color')
      .map(([name, token]) => ({ name, value: token.$value as DtcgColor })),
  }));
}

export function colorMap(tree: TokenTree): Record<string, DtcgColor> {
  const out: Record<string, DtcgColor> = {};
  for (const { tokens } of colorGroups(tree)) {
    for (const token of tokens) out[token.name] = token.value;
  }
  return out;
}

export function shadowMap(tree: TokenTree): Record<string, DtcgShadow> {
  const out: Record<string, DtcgShadow> = {};
  for (const [name, token] of Object.entries(tree.elevation ?? {})) {
    if (token.$type === 'shadow') out[name] = token.$value as DtcgShadow;
  }
  return out;
}

const WITHOUT_UTILITY = new Set(['grid-color']);

export function tailwindUtility(name: string): string | null {
  if (WITHOUT_UTILITY.has(name) || name.startsWith('code-')) return null;
  if (name.endsWith('foreground') || name.endsWith('-text') || name === 'muted-strong') {
    return `text-${name}`;
  }
  if (
    name.endsWith('-border') ||
    ['border', 'border-interactive', 'input', 'rule'].includes(name)
  ) {
    return name === 'border' ? 'border-border' : `border-${name}`;
  }
  if (name === 'ring') return 'ring-ring';
  return `bg-${name}`;
}

function srgbToLinear(channel: number) {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(channel: number) {
  const x = Math.min(1, Math.max(0, channel));
  return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
}

export function toSrgb(color: DtcgColor): [number, number, number] {
  if (color.colorSpace !== 'oklch') {
    const [r = 0, g = 0, b = 0] = color.components;
    return [r, g, b];
  }
  const [l = 0, c = 0, h = 0] = color.components;
  const hr = (h * Math.PI) / 180;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);
  const L = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const M = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const S = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    linearToSrgb(4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S),
    linearToSrgb(-1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S),
    linearToSrgb(-0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S),
  ];
}

export function relativeLuminance(color: DtcgColor): number {
  const [r, g, b] = toSrgb(color).map(srgbToLinear) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: DtcgColor, b: DtcgColor): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export type PairKind = 'text' | 'ui';
export type Grade = 'AAA' | 'AA' | 'AA large' | '3:1' | 'fail';

export function grade(ratio: number, kind: PairKind = 'text'): Grade {
  if (kind === 'ui') return ratio >= 3 ? '3:1' : 'fail';
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA large';
  return 'fail';
}

export function formatRatio(ratio: number): string {
  return `${(Math.floor(ratio * 100) / 100).toFixed(2)}:1`;
}

export type ContrastPair = { fg: string; bg: string; kind?: PairKind };

const FEEDBACK = ['destructive', 'warning', 'success', 'info'] as const;

export const CONTRAST_PAIRS: ContrastPair[] = [
  { fg: 'foreground', bg: 'background' },
  { fg: 'card-foreground', bg: 'card' },
  { fg: 'popover-foreground', bg: 'popover' },
  { fg: 'inverse-foreground', bg: 'inverse' },
  { fg: 'primary-foreground', bg: 'primary' },
  { fg: 'secondary-foreground', bg: 'secondary' },
  { fg: 'accent-foreground', bg: 'accent' },
  { fg: 'muted-strong', bg: 'background' },
  { fg: 'muted-foreground', bg: 'background' },
  { fg: 'muted-foreground', bg: 'card' },
  { fg: 'muted-foreground', bg: 'muted' },
  ...FEEDBACK.flatMap((hue): ContrastPair[] => [
    { fg: `${hue}-foreground`, bg: hue },
    { fg: `${hue}-text`, bg: `${hue}-surface` },
    { fg: `${hue}-text`, bg: 'background' },
  ]),
  { fg: 'border-interactive', bg: 'background', kind: 'ui' },
  { fg: 'ring', bg: 'background', kind: 'ui' },
];

export type MeasuredPair = ContrastPair & {
  kind: PairKind;
  light: { ratio: number; grade: Grade };
  dark: { ratio: number; grade: Grade };
};

export function measurePairs(
  light: Record<string, DtcgColor>,
  dark: Record<string, DtcgColor>,
  pairs: ContrastPair[] = CONTRAST_PAIRS,
): MeasuredPair[] {
  const out: MeasuredPair[] = [];
  for (const pair of pairs) {
    const kind = pair.kind ?? 'text';
    const lf = light[pair.fg];
    const lb = light[pair.bg];
    const df = dark[pair.fg];
    const db = dark[pair.bg];
    if (!lf || !lb || !df || !db) continue;
    const lightRatio = contrastRatio(lf, lb);
    const darkRatio = contrastRatio(df, db);
    out.push({
      ...pair,
      kind,
      light: { ratio: lightRatio, grade: grade(lightRatio, kind) },
      dark: { ratio: darkRatio, grade: grade(darkRatio, kind) },
    });
  }
  return out;
}

export function radiusScale(base: DtcgDimension, rootFontSize = 16) {
  const basePx = base.unit === 'rem' ? base.value * rootFontSize : base.value;
  const steps = [
    { utility: 'rounded-sm', factor: 0.66 },
    { utility: 'rounded-md', factor: 1 },
    { utility: 'rounded-lg', factor: 1.33 },
    { utility: 'rounded-xl', factor: 1.66 },
    { utility: 'rounded-2xl', factor: 2 },
  ] as const;
  return steps.map((step) => ({ ...step, px: round(basePx * step.factor, 2) }));
}

export function spacingStep(step: number, rootFontSize = 16) {
  const rem = step * 0.25;
  return { step, rem: `${formatNumber(rem)}rem`, px: round(rem * rootFontSize, 2) };
}
