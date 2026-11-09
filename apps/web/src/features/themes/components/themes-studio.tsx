'use client';

import { useDeferredValue, useMemo, useState } from 'react';

import {
  applyAdjustments,
  EMPTY_ADJUSTMENTS,
  type ThemeAdjustments,
  type ThemeMode,
} from '../lib/customize';
import type { PresetName, ThemePreset } from '../lib/presets';
import { themeStylesheet } from '../lib/tokens';
import { BuilderPanel } from './builder-panel';
import { ExportPanel } from './export-panel';
import { PresetGrid } from './preset-grid';
import { ThemePreview } from './theme-preview';

export function ThemesStudio({ presets }: { presets: ThemePreset[] }) {
  const [presetName, setPresetName] = useState<PresetName>('nachui');
  const [adjustments, setAdjustments] = useState<ThemeAdjustments>(EMPTY_ADJUSTMENTS);
  const [mode, setMode] = useState<ThemeMode>('light');

  const preset = presets.find((entry) => entry.name === presetName) ?? presets[0];
  const presetTokens = preset?.tokens;

  const theme = useMemo(
    () => (presetTokens ? applyAdjustments(presetTokens, adjustments) : undefined),
    [presetTokens, adjustments],
  );
  const presetCss = useMemo(
    () => (presetTokens ? themeStylesheet(presetTokens) : ''),
    [presetTokens],
  );
  const deferredTheme = useDeferredValue(theme);
  const css = useMemo(() => (deferredTheme ? themeStylesheet(deferredTheme) : ''), [deferredTheme]);

  if (!preset || !theme) return null;

  const dirty = css !== presetCss;

  const selectPreset = (name: PresetName) => {
    setPresetName(name);
    setAdjustments(EMPTY_ADJUSTMENTS);
  };

  return (
    <div className="flex flex-col gap-14 md:gap-16">
      <PresetGrid presets={presets} selected={preset.name} onSelect={selectPreset} />

      <div className="grid gap-6 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start">
        <BuilderPanel
          preset={preset}
          theme={theme}
          mode={mode}
          dirty={dirty}
          adjustments={adjustments}
          onChange={setAdjustments}
          onReset={() => setAdjustments(EMPTY_ADJUSTMENTS)}
        />
        <ThemePreview theme={theme} label={preset.label} mode={mode} onModeChange={setMode} />
      </div>

      <ExportPanel preset={preset} theme={theme} css={css} dirty={dirty} />
    </div>
  );
}
