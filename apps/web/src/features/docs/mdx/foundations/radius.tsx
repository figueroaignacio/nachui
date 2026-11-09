import { cn } from '@repo/ui/lib/cn';

import { baseRadius, type Locale } from './theme';
import { radiusScale } from './tokens';

const radiusCopy = {
  en: {
    'rounded-sm': 'Menu items, tab pill, tooltip',
    'rounded-md': 'Buttons, inputs, popovers, toasts',
    'rounded-lg': 'Cards, dialogs',
    'rounded-xl': 'Prompt input and other composer shells',
    'rounded-2xl': 'Drawers and large sheets',
  },
  es: {
    'rounded-sm': 'Ítems de menú, pastilla de tabs, tooltip',
    'rounded-md': 'Botones, inputs, popovers, toasts',
    'rounded-lg': 'Cards, diálogos',
    'rounded-xl': 'Prompt input y otros contenedores de redacción',
    'rounded-2xl': 'Drawers y paneles grandes',
  },
} as const;

const classes = {
  'rounded-sm': 'rounded-sm',
  'rounded-md': 'rounded-md',
  'rounded-lg': 'rounded-lg',
  'rounded-xl': 'rounded-xl',
  'rounded-2xl': 'rounded-2xl',
} as const;

export function RadiusScale({ locale = 'en' }: { locale?: Locale }) {
  const t = radiusCopy[locale];
  const steps = radiusScale(baseRadius);

  return (
    <div className="my-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      {steps.map((step) => (
        <div key={step.utility} className="flex flex-col gap-3">
          <div className="bg-surface-muted border-border flex aspect-square items-center justify-center rounded-lg border p-4">
            <div
              className={cn('border-foreground/70 bg-card size-full border', classes[step.utility])}
            />
          </div>
          <div className="space-y-0.5">
            <div className="text-foreground font-mono text-[13px] font-medium">{step.utility}</div>
            <div className="text-muted-foreground font-mono text-[11px] tabular-nums">
              {step.factor}x · {Math.round(step.px)}px
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">{t[step.utility]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const nestingCopy = {
  en: {
    good: 'Inner radius smaller than the outer one',
    bad: 'Same radius inside and out',
    title: 'Plan',
    item: 'Pro',
  },
  es: {
    good: 'Radio interior menor que el exterior',
    bad: 'El mismo radio adentro y afuera',
    title: 'Plan',
    item: 'Pro',
  },
} as const;

function NestedCard({ inner, title, item }: { inner: string; title: string; item: string }) {
  return (
    <div className="bg-card border-border w-full max-w-64 rounded-lg border p-2">
      <div className="text-muted-foreground px-2 pt-1 pb-2 text-xs font-medium">{title}</div>
      <div className={cn('bg-muted text-foreground px-3 py-2 text-sm font-medium', inner)}>
        {item}
      </div>
    </div>
  );
}

export function RadiusNesting({ locale = 'en' }: { locale?: Locale }) {
  const t = nestingCopy[locale];

  return (
    <div className="my-8 grid gap-3 sm:grid-cols-2">
      <figure className="bg-surface-muted border-border flex flex-col items-center gap-4 rounded-lg border p-6">
        <NestedCard inner="rounded-sm" title={t.title} item={t.item} />
        <figcaption className="text-muted-foreground text-center text-xs">
          <span className="text-success-text font-medium">rounded-lg › rounded-sm</span>
          <br />
          {t.good}
        </figcaption>
      </figure>
      <figure className="bg-surface-muted border-border flex flex-col items-center gap-4 rounded-lg border p-6">
        <NestedCard inner="rounded-lg" title={t.title} item={t.item} />
        <figcaption className="text-muted-foreground text-center text-xs">
          <span className="text-destructive-text font-medium">rounded-lg › rounded-lg</span>
          <br />
          {t.bad}
        </figcaption>
      </figure>
    </div>
  );
}
