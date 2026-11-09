import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { contrastRatio } from './color';
import {
  applyAdjustments,
  EMPTY_ADJUSTMENTS,
  pairContrast,
  readNeutral,
  readRadius,
} from './customize';
import { THEME_PRESETS } from './presets';
import { colorToOklch, cssVariables, findColor, modeVariables, themeStylesheet } from './tokens';

const apiStylesheet = (name: string) =>
  readFileSync(
    fileURLToPath(
      new URL(`../../../../../api/src/modules/themes/css/${name}.css`, import.meta.url),
    ),
    'utf8',
  );

const preset = (name: string) => {
  const found = THEME_PRESETS.find((entry) => entry.name === name);
  if (!found) throw new Error(`Missing preset ${name}`);
  return found;
};

describe('themeStylesheet', () => {
  it('matches the stylesheet build-tokens writes for the nachui preset', () => {
    expect(themeStylesheet(preset('nachui').tokens)).toBe(apiStylesheet('nachui'));
  });

  it('stays identical after applying no adjustments', () => {
    const { tokens } = preset('nachui');
    expect(themeStylesheet(applyAdjustments(tokens, EMPTY_ADJUSTMENTS))).toBe(
      themeStylesheet(tokens),
    );
  });

  it.each(THEME_PRESETS.map((entry) => entry.name))('matches the API stylesheet for %s', (name) => {
    expect(themeStylesheet(preset(name).tokens)).toBe(apiStylesheet(name));
  });
});

describe('applyAdjustments', () => {
  it('changes the base radius and nothing else in dark mode', () => {
    const { tokens } = preset('nachui');
    const next = applyAdjustments(tokens, { ...EMPTY_ADJUSTMENTS, radius: 0.25 });
    expect(readRadius(next)).toBe(0.25);
    expect(themeStylesheet(next)).toContain('  --radius: 0.25rem;');
    expect(cssVariables(next.dark)).toEqual(cssVariables(tokens.dark));
  });

  it('sets primary and ring and picks a readable foreground', () => {
    const { tokens } = preset('nachui');
    const next = applyAdjustments(tokens, {
      light: { primary: { l: 0.55, c: 0.2, h: 260 } },
      dark: {},
    });
    const variables = cssVariables(next.light);
    expect(variables['--primary']).toBe('oklch(55% 0.2 260)');
    expect(variables['--ring']).toBe('oklch(55% 0.2 260)');
    expect(pairContrast(next.light, 'primary-foreground', 'primary')).toBeGreaterThan(4.5);

    const pale = applyAdjustments(tokens, {
      light: { primary: { l: 0.9, c: 0.1, h: 100 } },
      dark: {},
    });
    expect(findColor(pale.light, 'primary-foreground')).toEqual(
      findColor(pale.light, 'foreground'),
    );
  });

  it('tints neutrals but leaves saturated colors alone', () => {
    const { tokens } = preset('google');
    const next = applyAdjustments(tokens, {
      light: { neutral: { hue: 200, chroma: 0.01 } },
      dark: {},
    });
    expect(readNeutral(next.light)).toEqual({ hue: 200, chroma: 0.01 });
    expect(findColor(next.light, 'primary')).toEqual(findColor(tokens.light, 'primary'));
    const border = findColor(next.light, 'border');
    expect(border && colorToOklch(border).h).toBe(200);
  });

  it('does not mutate the preset', () => {
    const { tokens } = preset('nachui');
    const before = themeStylesheet(tokens);
    applyAdjustments(tokens, {
      radius: 0,
      light: { primary: { l: 0.5, c: 0.2, h: 30 }, neutral: { hue: 10, chroma: 0.02 } },
      dark: { neutral: { hue: 10, chroma: 0.02 } },
    });
    expect(themeStylesheet(tokens)).toBe(before);
  });
});

describe('modeVariables', () => {
  it('keeps the light radius in dark mode', () => {
    const variables = modeVariables(preset('nachui').tokens, 'dark');
    expect(variables['--radius']).toBe('0.75rem');
    expect(variables['--background']).toBe('oklch(14.5% 0 0)');
  });
});

describe('contrastRatio', () => {
  it('follows the WCAG formula', () => {
    expect(contrastRatio([1, 1, 1], [0, 0, 0])).toBeCloseTo(21, 5);
    expect(contrastRatio([1, 1, 1], [1, 1, 1])).toBe(1);
  });
});
