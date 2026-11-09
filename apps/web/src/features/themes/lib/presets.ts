import defaultDark from '@repo/ui/tokens/themes/default/dark.tokens.json';
import defaultLight from '@repo/ui/tokens/themes/default/light.tokens.json';
import googleDark from '@repo/ui/tokens/themes/google/dark.tokens.json';
import googleLight from '@repo/ui/tokens/themes/google/light.tokens.json';
import microsoftDark from '@repo/ui/tokens/themes/microsoft/dark.tokens.json';
import microsoftLight from '@repo/ui/tokens/themes/microsoft/light.tokens.json';
import mrRobotDark from '@repo/ui/tokens/themes/mr-robot/dark.tokens.json';
import mrRobotLight from '@repo/ui/tokens/themes/mr-robot/light.tokens.json';
import nachuiDark from '@repo/ui/tokens/themes/nachui/dark.tokens.json';
import nachuiLight from '@repo/ui/tokens/themes/nachui/light.tokens.json';

import type { ThemeTokens, TokenGroup } from './tokens';

export const PRESET_NAMES = ['nachui', 'default', 'google', 'microsoft', 'mr-robot'] as const;

export type PresetName = (typeof PRESET_NAMES)[number];

export interface ThemePreset {
  name: PresetName;
  label: string;
  tokens: ThemeTokens;
}

const LABELS: Record<PresetName, string> = {
  nachui: 'NachUI',
  default: 'Default',
  google: 'Google',
  microsoft: 'Microsoft',
  'mr-robot': 'Mr. Robot',
};

const SOURCES: Record<PresetName, { light: unknown; dark: unknown }> = {
  nachui: { light: nachuiLight, dark: nachuiDark },
  default: { light: defaultLight, dark: defaultDark },
  google: { light: googleLight, dark: googleDark },
  microsoft: { light: microsoftLight, dark: microsoftDark },
  'mr-robot': { light: mrRobotLight, dark: mrRobotDark },
};

export const THEME_PRESETS: ThemePreset[] = PRESET_NAMES.map((name) => ({
  name,
  label: LABELS[name],
  tokens: {
    light: SOURCES[name].light as TokenGroup,
    dark: SOURCES[name].dark as TokenGroup,
  },
}));

export function initCommand(name: PresetName) {
  return `pnpm dlx nachui init --theme ${name}`;
}
