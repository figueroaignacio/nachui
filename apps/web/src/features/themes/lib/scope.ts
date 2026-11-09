import type { ThemePreset } from './presets';
import { cssVariables } from './tokens';

export function presetScopeClass(name: string) {
  return `themes-preset-${name}`;
}

function declarations(variables: Record<string, string>) {
  return Object.entries(variables)
    .map(([name, value]) => `${name}:${value};`)
    .join('');
}

export function presetScopeCss(presets: ThemePreset[]) {
  return presets
    .map(({ name, tokens }) => {
      const scope = presetScopeClass(name);
      return `.${scope}{${declarations(cssVariables(tokens.light))}color-scheme:light;}.dark .${scope}{${declarations(cssVariables(tokens.dark))}color-scheme:dark;}`;
    })
    .join('\n');
}
