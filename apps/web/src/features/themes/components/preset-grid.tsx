import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';

import type { PresetName, ThemePreset } from '../lib/presets';
import { presetScopeClass } from '../lib/scope';

const SWATCHES = [
  'bg-background',
  'bg-surface-muted',
  'bg-primary',
  'bg-secondary',
  'bg-destructive',
  'bg-warning',
  'bg-success',
  'bg-info',
] as const;

interface PresetGridProps {
  presets: ThemePreset[];
  selected: PresetName;
  onSelect: (name: PresetName) => void;
}

export function PresetGrid({ presets, selected, onSelect }: PresetGridProps) {
  const t = useTranslations('sections.themes');

  return (
    <section aria-labelledby="themes-presets">
      <h2 id="themes-presets" className="section-label">
        {t('presetsHeading')}
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {presets.map((preset) => {
          const active = preset.name === selected;
          return (
            <li
              key={preset.name}
              className={cn(
                'bg-card relative flex flex-col rounded-lg border p-2 transition-colors',
                active ? 'border-foreground' : 'border-border hover:border-border-interactive',
              )}
            >
              <div
                inert
                className={cn(
                  presetScopeClass(preset.name),
                  'bg-background text-foreground flex flex-col gap-3 rounded-md border p-3',
                )}
              >
                <div className="flex gap-1">
                  {SWATCHES.map((swatch) => (
                    <span
                      key={swatch}
                      className={cn('size-4 shrink-0 rounded-full border', swatch)}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm">{t('preview.sample.buttons.primary')}</Button>
                  <Input size="sm" readOnly defaultValue={t('preview.sample.profile.nameValue')} />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-1 px-1.5 pt-3 pb-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-foreground text-sm font-medium">
                    <button
                      type="button"
                      aria-pressed={active}
                      aria-label={t('use', { name: preset.label })}
                      onClick={() => onSelect(preset.name)}
                      className="focus-visible:after:ring-ring after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:ring-2"
                    >
                      {preset.label}
                    </button>
                  </h3>
                  {active && (
                    <span className="text-muted-foreground font-mono text-[10px]">
                      {t('selected')}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {t(`presets.${preset.name}`)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
