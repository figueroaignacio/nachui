import { describe, expect, it } from 'vitest';

import { darkColors, darkTheme, lightColors, lightGroups, lightTheme } from './theme';
import {
  CONTRAST_PAIRS,
  colorGroups,
  contrastRatio,
  formatColor,
  formatRatio,
  formatShadow,
  grade,
  measurePairs,
  radiusScale,
  spacingStep,
  tailwindUtility,
} from './tokens';

const white = { colorSpace: 'oklch', components: [1, 0, 0] };
const black = { colorSpace: 'oklch', components: [0, 0, 0] };

describe('formatColor', () => {
  it('prints oklch the way globals.css does', () => {
    expect(formatColor({ colorSpace: 'oklch', components: [0.991, 0.003, 85] })).toBe(
      'oklch(99.1% 0.003 85)',
    );
  });

  it('adds the alpha channel when the token has one', () => {
    expect(formatColor({ colorSpace: 'oklch', components: [0.145, 0.004, 75], alpha: 0.5 })).toBe(
      'oklch(14.5% 0.004 75 / 0.5)',
    );
  });

  it('prints srgb colors as rgb()', () => {
    expect(formatColor({ colorSpace: 'srgb', components: [1, 0, 0.5] })).toBe('rgb(255 0 128)');
  });
});

describe('formatShadow', () => {
  it('leaves out a zero spread and keeps a negative one', () => {
    const color = { colorSpace: 'oklch', components: [0, 0, 0], alpha: 0.5 };
    const px = (value: number) => ({ value, unit: 'px' });
    expect(
      formatShadow({ color, offsetX: px(0), offsetY: px(1), blur: px(2), spread: px(0) }),
    ).toBe('0 1px 2px oklch(0% 0 0 / 0.5)');
    expect(
      formatShadow({ color, offsetX: px(0), offsetY: px(8), blur: px(24), spread: px(-8) }),
    ).toBe('0 8px 24px -8px oklch(0% 0 0 / 0.5)');
  });
});

describe('contrastRatio', () => {
  it('is 21:1 between black and white in either order', () => {
    expect(contrastRatio(white, black)).toBeCloseTo(21, 1);
    expect(contrastRatio(black, white)).toBeCloseTo(21, 1);
  });

  it('is 1:1 for the same color', () => {
    expect(contrastRatio(white, white)).toBe(1);
  });
});

describe('grade', () => {
  it('maps text ratios to WCAG levels', () => {
    expect(grade(7.2)).toBe('AAA');
    expect(grade(4.5)).toBe('AA');
    expect(grade(3.4)).toBe('AA large');
    expect(grade(2.9)).toBe('fail');
  });

  it('uses the 3:1 bar for non-text UI', () => {
    expect(grade(3.1, 'ui')).toBe('3:1');
    expect(grade(2.5, 'ui')).toBe('fail');
  });
});

describe('formatRatio', () => {
  it('rounds down so a pair never looks better than it is', () => {
    expect(formatRatio(4.499)).toBe('4.49:1');
    expect(formatRatio(21)).toBe('21.00:1');
  });
});

describe('tailwindUtility', () => {
  it('names the utility a component would write', () => {
    expect(tailwindUtility('background')).toBe('bg-background');
    expect(tailwindUtility('muted-foreground')).toBe('text-muted-foreground');
    expect(tailwindUtility('destructive-text')).toBe('text-destructive-text');
    expect(tailwindUtility('border')).toBe('border-border');
    expect(tailwindUtility('success-border')).toBe('border-success-border');
    expect(tailwindUtility('ring')).toBe('ring-ring');
    expect(tailwindUtility('code')).toBe('bg-code');
  });

  it('returns null for tokens that have no utility', () => {
    expect(tailwindUtility('grid-color')).toBeNull();
    expect(tailwindUtility('code-keyword')).toBeNull();
  });
});

describe('radiusScale', () => {
  it('derives every step from the base radius', () => {
    expect(radiusScale({ value: 0.75, unit: 'rem' }).map((step) => step.px)).toEqual([
      6, 12, 15.96, 19.92, 24,
    ]);
  });
});

describe('spacingStep', () => {
  it('uses the 4px base of the Tailwind scale', () => {
    expect(spacingStep(1.5)).toEqual({ step: 1.5, rem: '0.375rem', px: 6 });
    expect(spacingStep(11).px).toBe(44);
  });
});

describe('nachui theme', () => {
  it('has the same groups and tokens in both modes', () => {
    const dark = colorGroups(darkTheme).map(({ group, tokens }) => [
      group,
      tokens.map((t) => t.name),
    ]);
    const light = colorGroups(lightTheme).map(({ group, tokens }) => [
      group,
      tokens.map((t) => t.name),
    ]);
    expect(dark).toEqual(light);
    expect(lightGroups.map((g) => g.group)).toEqual([
      'surface',
      'interactive',
      'structure',
      'feedback',
      'code',
    ]);
  });

  it('measures every listed pair and none of them fails', () => {
    const measured = measurePairs(lightColors, darkColors);
    expect(measured).toHaveLength(CONTRAST_PAIRS.length);
    for (const pair of measured) {
      expect(pair.light.grade, `${pair.fg} on ${pair.bg} (light)`).not.toBe('fail');
      expect(pair.dark.grade, `${pair.fg} on ${pair.bg} (dark)`).not.toBe('fail');
    }
  });
});
