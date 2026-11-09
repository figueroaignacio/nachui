import { useId } from 'react';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Slider } from '@repo/ui/components/slider';
import { useTranslations } from 'next-intl';

import { AA_NORMAL_TEXT } from '../lib/color';
import {
  type ModeAdjustments,
  pairContrast,
  readNeutral,
  readPrimary,
  readRadius,
  type ThemeAdjustments,
  type ThemeMode,
} from '../lib/customize';
import type { ThemePreset } from '../lib/presets';
import { findColor, formatColor, type ThemeTokens } from '../lib/tokens';

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
  onChange: (value: number) => void;
}

function SliderField({ label, value, min, max, step, format, onChange }: SliderFieldProps) {
  const labelId = useId();

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span id={labelId} className="text-foreground">
          {label}
        </span>
        <span className="text-muted-foreground font-mono tabular-nums">{format(value)}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(next) => onChange(next[0] ?? value)}
        min={min}
        max={max}
        step={step}
        getAriaValueText={format}
      >
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb aria-labelledby={labelId} />
      </Slider>
    </div>
  );
}

function ContrastRow({ label, ratio }: { label: string; ratio: number | null }) {
  const t = useTranslations('sections.themes.builder');
  if (ratio === null) return null;
  const passes = ratio >= AA_NORMAL_TEXT;

  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2">
        <span className="text-foreground font-mono tabular-nums">{ratio.toFixed(2)}:1</span>
        <Badge variant={passes ? 'success' : 'warning'}>{passes ? t('pass') : t('fail')}</Badge>
      </span>
    </div>
  );
}

const percent = (value: number) => `${(value * 100).toFixed(1)}%`;
const chroma = (value: number) => value.toFixed(3);
const degrees = (value: number) => `${Math.round(value)}°`;
const rem = (value: number) => `${Number(value.toFixed(3))}rem`;

interface BuilderPanelProps {
  preset: ThemePreset;
  theme: ThemeTokens;
  mode: ThemeMode;
  dirty: boolean;
  adjustments: ThemeAdjustments;
  onChange: (adjustments: ThemeAdjustments) => void;
  onReset: () => void;
}

export function BuilderPanel({
  preset,
  theme,
  mode,
  dirty,
  adjustments,
  onChange,
  onReset,
}: BuilderPanelProps) {
  const t = useTranslations('sections.themes');
  const tree = theme[mode];
  const modeAdjustments = adjustments[mode];
  const primary = modeAdjustments.primary ?? readPrimary(tree);
  const neutral = modeAdjustments.neutral ?? readNeutral(tree);
  const primaryColor = findColor(tree, 'primary');
  const primaryForeground = findColor(tree, 'primary-foreground');

  const updateMode = (patch: ModeAdjustments) =>
    onChange({ ...adjustments, [mode]: { ...modeAdjustments, ...patch } });

  return (
    <section
      aria-labelledby="themes-builder"
      className="border-border bg-card flex flex-col gap-6 rounded-lg border p-4 lg:sticky lg:top-20"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 id="themes-builder" className="section-label">
            {t('builder.heading')}
          </h2>
          <p className="text-foreground flex items-center gap-2 text-sm font-medium">
            {t('builder.basedOn', { name: preset.label })}
            {dirty && <Badge variant="outline">{t('builder.modified')}</Badge>}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset} disabled={!dirty}>
          {t('builder.reset')}
        </Button>
      </div>

      <SliderField
        label={t('builder.radius')}
        value={adjustments.radius ?? readRadius(theme)}
        min={0}
        max={1.5}
        step={0.0625}
        format={rem}
        onChange={(radius) => onChange({ ...adjustments, radius })}
      />

      <fieldset className="flex flex-col gap-4">
        <legend className="text-foreground mb-3 text-sm font-medium">{t('builder.primary')}</legend>
        {primaryColor && primaryForeground && (
          <div
            className="border-border flex h-14 items-center justify-between rounded-md border px-3"
            style={{ background: formatColor(primaryColor), color: formatColor(primaryForeground) }}
          >
            <span className="text-sm font-medium">Aa</span>
            <span className="font-mono text-[11px]">{formatColor(primaryColor)}</span>
          </div>
        )}
        <SliderField
          label={t('builder.lightness')}
          value={primary.l}
          min={0}
          max={1}
          step={0.005}
          format={percent}
          onChange={(l) => updateMode({ primary: { ...primary, l } })}
        />
        <SliderField
          label={t('builder.chroma')}
          value={primary.c}
          min={0}
          max={0.37}
          step={0.005}
          format={chroma}
          onChange={(c) => updateMode({ primary: { ...primary, c } })}
        />
        <SliderField
          label={t('builder.hue')}
          value={primary.h}
          min={0}
          max={360}
          step={1}
          format={degrees}
          onChange={(h) => updateMode({ primary: { ...primary, h } })}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-foreground mb-1 text-sm font-medium">{t('builder.neutral')}</legend>
        <p className="text-muted-foreground text-xs leading-relaxed">{t('builder.neutralHint')}</p>
        <SliderField
          label={t('builder.hue')}
          value={neutral.hue}
          min={0}
          max={360}
          step={1}
          format={degrees}
          onChange={(hue) => updateMode({ neutral: { ...neutral, hue } })}
        />
        <SliderField
          label={t('builder.chroma')}
          value={neutral.chroma}
          min={0}
          max={0.03}
          step={0.001}
          format={chroma}
          onChange={(value) => updateMode({ neutral: { ...neutral, chroma: value } })}
        />
      </fieldset>

      <p className="text-muted-foreground border-border border-t pt-4 text-xs leading-relaxed">
        {t('builder.modeNote', { mode: t(`preview.${mode}`).toLowerCase() })}
      </p>

      <div className="flex flex-col gap-2.5">
        <h3 className="text-foreground text-sm font-medium">{t('builder.contrast')}</h3>
        <ContrastRow
          label={t('builder.primaryPair')}
          ratio={pairContrast(tree, 'primary-foreground', 'primary')}
        />
        <ContrastRow
          label={t('builder.bodyPair')}
          ratio={pairContrast(tree, 'foreground', 'background')}
        />
      </div>
    </section>
  );
}
