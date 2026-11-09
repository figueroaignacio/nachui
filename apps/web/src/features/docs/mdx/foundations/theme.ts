import dark from '@repo/ui/tokens/themes/nachui/dark.tokens.json';
import light from '@repo/ui/tokens/themes/nachui/light.tokens.json';

import { colorGroups, colorMap, shadowMap, type DtcgDimension, type TokenTree } from './tokens';

export type Locale = 'en' | 'es';

export const lightTheme = light as unknown as TokenTree;
export const darkTheme = dark as unknown as TokenTree;

export const lightGroups = colorGroups(lightTheme);
export const darkColors = colorMap(darkTheme);
export const lightColors = colorMap(lightTheme);

export const lightShadows = shadowMap(lightTheme);
export const darkShadows = shadowMap(darkTheme);

export const baseRadius = (lightTheme.radius?.$value as DtcgDimension | undefined) ?? {
  value: 0.75,
  unit: 'rem',
};

export function paint(mode: 'light' | 'dark') {
  return mode === 'light' ? lightColors : darkColors;
}
