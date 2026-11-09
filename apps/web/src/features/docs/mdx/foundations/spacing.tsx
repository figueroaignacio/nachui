import { cn } from '@repo/ui/lib/cn';

import type { Locale } from './theme';
import { spacingStep } from './tokens';

const STEPS = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16];

const usage: Record<Locale, Partial<Record<number, string>>> = {
  en: {
    0.5: 'Icon to label nudges, badge padding',
    1: 'Menu padding (p-1), tight icon groups',
    1.5: 'Menu item rows (py-1.5), label to field gap',
    2: 'The default gap: button icon and label, menu items (px-2)',
    3: 'Control padding (px-3), small stacks',
    4: 'Popover and hover card padding (p-4), button padding',
    6: 'Dialog and card padding (p-6)',
    8: 'Small control height (h-8)',
    10: 'Large control height (h-10)',
  },
  es: {
    0.5: 'Ajustes entre ícono y texto, padding de badges',
    1: 'Padding de menús (p-1), grupos de íconos ajustados',
    1.5: 'Filas de ítems de menú (py-1.5), espacio entre label y campo',
    2: 'El gap por defecto: ícono y texto de botón, ítems de menú (px-2)',
    3: 'Padding de controles (px-3), pilas chicas',
    4: 'Padding de popover y hover card (p-4), padding de botones',
    6: 'Padding de diálogos y cards (p-6)',
    8: 'Altura de control chico (h-8)',
    10: 'Altura de control grande (h-10)',
  },
};

export function SpacingScale({ locale = 'en' }: { locale?: Locale }) {
  const notes = usage[locale];

  return (
    <div className="border-border divide-border my-8 divide-y overflow-hidden rounded-lg border">
      {STEPS.map((value) => {
        const step = spacingStep(value);
        const note = notes[value];
        return (
          <div
            key={value}
            className="grid grid-cols-[3.5rem_5.5rem_1fr] items-center gap-3 px-4 py-2.5 sm:grid-cols-[4rem_6rem_9rem_1fr]"
          >
            <span className="text-foreground font-mono text-[13px] font-medium">{value}</span>
            <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
              {step.rem} · {step.px}px
            </span>
            <span className="flex h-3 items-center">
              <span
                aria-hidden="true"
                className={cn('block h-3 rounded-[2px]', note ? 'bg-foreground' : 'bg-input')}
                style={{ width: step.px }}
              />
            </span>
            <span
              className={cn(
                'text-muted-foreground col-span-3 text-xs sm:col-span-1',
                !note && 'hidden sm:block',
              )}
            >
              {note}
            </span>
          </div>
        );
      })}
    </div>
  );
}

const controls = [
  { utility: 'h-8', px: 32, size: 'sm' },
  { utility: 'h-9', px: 36, size: 'default' },
  { utility: 'h-10', px: 40, size: 'lg' },
] as const;

const controlCopy = {
  en: { label: 'Button', target: 'Touch target', targetNote: '44px hit area on coarse pointers' },
  es: { label: 'Botón', target: 'Área táctil', targetNote: 'Área de 44px con puntero grueso' },
} as const;

export function ControlSizes({ locale = 'en' }: { locale?: Locale }) {
  const t = controlCopy[locale];

  return (
    <div className="bg-surface-muted border-border my-8 flex flex-wrap items-end gap-6 rounded-lg border p-6">
      {controls.map((control) => (
        <div key={control.utility} className="flex flex-col items-start gap-2">
          <span
            className="border-input bg-background text-foreground inline-flex items-center rounded-md border px-4 text-sm font-medium"
            style={{ height: control.px }}
          >
            {t.label}
          </span>
          <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
            {control.utility} · {control.px}px · {control.size}
          </span>
        </div>
      ))}
      <div className="flex flex-col items-start gap-2">
        <span className="relative inline-flex size-11 items-center justify-center">
          <span
            aria-hidden="true"
            className="border-border-interactive absolute inset-0 rounded-md border border-dashed"
          />
          <span className="bg-foreground size-4 rounded-[4px]" aria-hidden="true" />
        </span>
        <span className="text-muted-foreground font-mono text-[11px]">
          {t.target} · 44px
          <span className="sr-only"> {t.targetNote}</span>
        </span>
      </div>
    </div>
  );
}
