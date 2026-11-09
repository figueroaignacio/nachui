'use client';

import { Button } from '@repo/ui/components/button';
import { cn } from '@repo/ui/lib/cn';
import { floatingOrigin, floatingVariants, reveal, springs, still, tap } from '@repo/ui/lib/motion';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';

import type { Locale } from './theme';

type SpringName = keyof typeof springs;

const SPRINGS: { name: SpringName; values: string }[] = [
  { name: 'snappy', values: '550 / 22 / 0.6' },
  { name: 'smooth', values: '380 / 24 / 0.8' },
  { name: 'gentle', values: '200 / 20 / 1' },
];

const springCopy = {
  en: {
    play: 'Play',
    all: 'Play all',
    reduced: 'Your system asks for reduced motion, so the boxes jump instead of springing.',
    uses: {
      snappy: 'Hover, press, toggles',
      smooth: 'Panels, menus, collapsibles',
      gentle: 'Dialogs, drawers, large surfaces',
    },
    legend: 'stiffness / damping / mass',
  },
  es: {
    play: 'Reproducir',
    all: 'Reproducir todos',
    reduced: 'Tu sistema pide menos movimiento, así que las cajas saltan en vez de rebotar.',
    uses: {
      snappy: 'Hover, press, toggles',
      smooth: 'Paneles, menús, colapsables',
      gentle: 'Diálogos, drawers, superficies grandes',
    },
    legend: 'rigidez / amortiguación / masa',
  },
} as const;

export function SpringDemo({ locale = 'en' }: { locale?: Locale }) {
  const t = springCopy[locale];
  const reduce = useReducedMotion();
  const [at, setAt] = useState<Record<SpringName, boolean>>({
    snappy: false,
    smooth: false,
    gentle: false,
  });

  const toggle = (name: SpringName) => setAt((prev) => ({ ...prev, [name]: !prev[name] }));
  const toggleAll = () =>
    setAt((prev) => {
      const next = !prev.snappy;
      return { snappy: next, smooth: next, gentle: next };
    });

  return (
    <div className="border-border my-8 overflow-hidden rounded-lg border">
      <div className="divide-border divide-y">
        {SPRINGS.map((spring) => (
          <div
            key={spring.name}
            className="grid items-center gap-4 p-4 sm:grid-cols-[9rem_1fr_auto] sm:gap-6"
          >
            <div className="min-w-0 space-y-0.5">
              <div className="text-foreground font-mono text-[13px] font-medium">
                springs.{spring.name}
              </div>
              <div className="text-muted-foreground font-mono text-[11px] tabular-nums">
                {spring.values}
              </div>
              <div className="text-muted-foreground text-xs">{t.uses[spring.name]}</div>
            </div>
            <div className="relative h-10 w-[12.5rem]" aria-hidden="true">
              <span className="bg-border absolute inset-x-5 top-1/2 h-px" />
              <span className="border-border-interactive absolute start-0 top-0 size-10 rounded-md border border-dashed" />
              <span className="border-border-interactive absolute start-40 top-0 size-10 rounded-md border border-dashed" />
              <motion.span
                className="bg-foreground absolute start-0 top-0 block size-10 rounded-md"
                animate={{ x: at[spring.name] ? '400%' : '0%' }}
                transition={reduce ? still : springs[spring.name]}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggle(spring.name)}
              aria-label={`${t.play} springs.${spring.name}`}
            >
              {t.play}
            </Button>
          </div>
        ))}
      </div>
      <div className="border-border bg-surface-muted flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
        <span className="text-muted-foreground font-mono text-[11px]">{t.legend}</span>
        <Button variant="secondary" size="sm" onClick={toggleAll}>
          {t.all}
        </Button>
      </div>
      <p className="text-muted-foreground border-border hidden border-t px-4 py-3 text-xs motion-reduce:block">
        {t.reduced}
      </p>
    </div>
  );
}

const floatCopy = {
  en: { show: 'Open', hide: 'Close', title: 'Share link', body: 'Anyone with the link can view.' },
  es: {
    show: 'Abrir',
    hide: 'Cerrar',
    title: 'Compartir enlace',
    body: 'Cualquiera con el enlace puede verlo.',
  },
} as const;

export function DepthOfFieldDemo({ locale = 'en' }: { locale?: Locale }) {
  const t = floatCopy[locale];
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-surface-muted border-border my-8 flex min-h-56 flex-col items-center rounded-lg border px-4 pt-10 pb-6">
      <Button variant="outline" size="sm" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {open ? t.hide : t.show}
      </Button>
      <div className="relative mt-2 h-24 w-64">
        <AnimatePresence>
          {open ? (
            <motion.div
              key="panel"
              variants={reduce ? reveal : floatingVariants.bottom}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                'bg-popover text-popover-foreground border-border absolute inset-x-0 top-0 rounded-md border p-4 shadow-md',
                floatingOrigin.bottom,
              )}
            >
              <div className="text-sm font-medium">{t.title}</div>
              <div className="text-muted-foreground mt-1 text-xs">{t.body}</div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

const pressCopy = {
  en: { label: 'Press and hold', note: 'whileTap={tap} with springs.snappy' },
  es: { label: 'Mantené presionado', note: 'whileTap={tap} con springs.snappy' },
} as const;

export function PressDemo({ locale = 'en' }: { locale?: Locale }) {
  const t = pressCopy[locale];
  const reduce = useReducedMotion();

  return (
    <div className="bg-surface-muted border-border my-8 flex flex-col items-center gap-3 rounded-lg border px-4 py-10">
      <motion.button
        type="button"
        whileTap={reduce ? undefined : tap}
        transition={springs.snappy}
        className="bg-primary text-primary-foreground focus-visible:ring-ring ring-offset-background h-10 rounded-md px-6 text-sm font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {t.label}
      </motion.button>
      <span className="text-muted-foreground font-mono text-[11px]">{t.note}</span>
    </div>
  );
}
