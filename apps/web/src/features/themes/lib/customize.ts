import { contrastRatio, type Oklch } from './color';
import {
  type ColorValue,
  colorToOklch,
  colorToRgb,
  fillHex,
  findColor,
  flatten,
  isToken,
  type ThemeTokens,
  type TokenGroup,
} from './tokens';

export type ThemeMode = 'light' | 'dark';

export interface NeutralTint {
  hue: number;
  chroma: number;
}

export interface ModeAdjustments {
  primary?: Oklch;
  neutral?: NeutralTint;
}

export interface ThemeAdjustments {
  radius?: number;
  light: ModeAdjustments;
  dark: ModeAdjustments;
}

export const EMPTY_ADJUSTMENTS: ThemeAdjustments = { light: {}, dark: {} };

export const NEUTRAL_CHROMA_LIMIT = 0.04;

const PRIMARY_TOKENS = new Set(['primary', 'primary-foreground', 'ring']);

const round = (value: number, digits: number) => Number(value.toFixed(digits));

export function oklchColor({ l, c, h }: Oklch, alpha?: number): ColorValue {
  return {
    colorSpace: 'oklch',
    components: [round(l, 3), round(c, 4), round(h, 1)],
    ...(alpha !== undefined && alpha !== 1 && { alpha }),
  };
}

function setColor(tree: TokenGroup, name: string, color: ColorValue) {
  for (const { tokens } of flatten(tree)) {
    for (const entry of tokens) {
      if (entry.name === name && entry.token.$type === 'color') entry.token.$value = color;
    }
  }
}

function tintNeutrals(tree: TokenGroup, tint: NeutralTint, skipPrimary: boolean) {
  for (const { group, tokens } of flatten(tree)) {
    if (!group.startsWith('color')) continue;
    for (const entry of tokens) {
      if (entry.token.$type !== 'color') continue;
      if (skipPrimary && PRIMARY_TOKENS.has(entry.name)) continue;
      const current = colorToOklch(entry.token.$value);
      if (current.c >= NEUTRAL_CHROMA_LIMIT) continue;
      entry.token.$value = oklchColor(
        { l: current.l, c: tint.chroma, h: tint.hue },
        entry.token.$value.alpha,
      );
    }
  }
}

export function readableForeground(tree: TokenGroup, background: ColorValue) {
  const candidates = [findColor(tree, 'background'), findColor(tree, 'foreground')].filter(
    (color): color is ColorValue => color !== undefined,
  );
  const target = colorToRgb(background);
  let best: ColorValue | undefined;
  let bestRatio = 0;
  for (const candidate of candidates) {
    const ratio = contrastRatio(colorToRgb(candidate), target);
    if (ratio > bestRatio) {
      best = candidate;
      bestRatio = ratio;
    }
  }
  return best;
}

function adjustMode(tree: TokenGroup, adjustments: ModeAdjustments) {
  if (adjustments.neutral) tintNeutrals(tree, adjustments.neutral, Boolean(adjustments.primary));
  if (adjustments.primary) {
    const primary = oklchColor(adjustments.primary);
    setColor(tree, 'primary', primary);
    setColor(tree, 'ring', { ...primary });
    const foreground = readableForeground(tree, primary);
    if (foreground) setColor(tree, 'primary-foreground', structuredClone(foreground));
  }
}

export function applyAdjustments(theme: ThemeTokens, adjustments: ThemeAdjustments): ThemeTokens {
  const light = structuredClone(theme.light);
  const dark = structuredClone(theme.dark);

  if (adjustments.radius !== undefined) {
    const radius = light.radius;
    if (isToken(radius) && radius.$type === 'dimension') {
      radius.$value = { ...radius.$value, value: adjustments.radius };
    }
  }
  adjustMode(light, adjustments.light);
  adjustMode(dark, adjustments.dark);

  return { light: fillHex(light), dark: fillHex(dark) };
}

export function readRadius(theme: ThemeTokens) {
  const radius = theme.light.radius;
  if (isToken(radius) && radius.$type === 'dimension') return radius.$value.value;
  return 0;
}

export function readPrimary(tree: TokenGroup): Oklch {
  const color = findColor(tree, 'primary');
  return color ? colorToOklch(color) : { l: 0.5, c: 0, h: 0 };
}

export function readNeutral(tree: TokenGroup): NeutralTint {
  const color = findColor(tree, 'background');
  if (!color) return { hue: 0, chroma: 0 };
  const { c, h } = colorToOklch(color);
  return { hue: round(h, 1), chroma: round(c, 4) };
}

export function pairContrast(tree: TokenGroup, foreground: string, background: string) {
  const fg = findColor(tree, foreground);
  const bg = findColor(tree, background);
  if (!fg || !bg) return null;
  return contrastRatio(colorToRgb(fg), colorToRgb(bg));
}
