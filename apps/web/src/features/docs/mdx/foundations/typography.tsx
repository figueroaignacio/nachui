import { cn } from '@repo/ui/lib/cn';

import type { Locale } from './theme';

const roles = [
  {
    key: 'sans',
    className: 'font-sans',
    variable: '--font-sans',
    family: 'Geist',
  },
  {
    key: 'heading',
    className: 'font-heading',
    variable: '--font-heading',
    family: 'Schibsted Grotesk',
  },
  {
    key: 'serif',
    className: 'font-serif',
    variable: '--font-serif',
    family: 'Geist',
  },
  {
    key: 'mono',
    className: 'font-mono',
    variable: '--font-mono',
    family: 'Geist Mono',
  },
] as const;

const roleCopy = {
  en: {
    family: 'On this site',
    sans: {
      title: 'Sans',
      use: 'Body text, labels, buttons and form fields.',
      sample: 'Save changes before you leave',
    },
    heading: {
      title: 'Heading',
      use: 'Every h1 to h6 and the titles of cards and dialogs.',
      sample: 'Billing and invoices',
    },
    serif: {
      title: 'Serif',
      use: 'Long reading text through .prose-reading. Falls back to sans.',
      sample: 'A page should read like a well set book, not a control panel.',
    },
    mono: {
      title: 'Mono',
      use: 'Code, keyboard keys and the small .section-label.',
      sample: 'pnpm dlx nachui add dialog',
    },
  },
  es: {
    family: 'En este sitio',
    sans: {
      title: 'Sans',
      use: 'Texto de cuerpo, etiquetas, botones y campos de formulario.',
      sample: 'Guardá los cambios antes de salir',
    },
    heading: {
      title: 'Heading',
      use: 'Todos los h1 a h6 y los títulos de cards y diálogos.',
      sample: 'Facturación y comprobantes',
    },
    serif: {
      title: 'Serif',
      use: 'Texto largo de lectura con .prose-reading. Si no está, usa sans.',
      sample: 'Una página debería leerse como un libro bien compuesto, no como un tablero.',
    },
    mono: {
      title: 'Mono',
      use: 'Código, teclas y el pequeño .section-label.',
      sample: 'pnpm dlx nachui add dialog',
    },
  },
} as const;

export function TypeRoles({ locale = 'en' }: { locale?: Locale }) {
  const t = roleCopy[locale];

  return (
    <div className="border-border divide-border my-8 divide-y overflow-hidden rounded-lg border">
      {roles.map((role) => {
        const text = t[role.key];
        return (
          <div key={role.key} className="grid gap-3 p-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
            <div className="min-w-0 space-y-1">
              <div className="text-foreground text-sm font-medium">{text.title}</div>
              <div className="text-muted-foreground font-mono text-[11px]">{role.className}</div>
              <div className="text-muted-foreground font-mono text-[11px]">{role.variable}</div>
            </div>
            <div className="min-w-0 space-y-2">
              <p
                className={cn(
                  'text-foreground text-2xl leading-snug',
                  role.key === 'heading' && 'font-semibold tracking-tight',
                  role.key === 'serif' && 'text-muted-strong text-xl',
                  role.key === 'mono' && 'text-lg',
                  role.className,
                )}
              >
                {text.sample}
              </p>
              <p className="text-muted-foreground text-[13px] leading-relaxed">
                {text.use}{' '}
                <span className="text-muted-foreground/80">
                  {t.family}: {role.family}.
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const scale = [
  { utility: 'text-xs', size: '0.75rem', px: 12, leading: '1rem', lpx: 16 },
  { utility: 'text-sm', size: '0.875rem', px: 14, leading: '1.25rem', lpx: 20 },
  { utility: 'text-base', size: '1rem', px: 16, leading: '1.5rem', lpx: 24 },
  { utility: 'text-lg', size: '1.125rem', px: 18, leading: '1.75rem', lpx: 28 },
  { utility: 'text-xl', size: '1.25rem', px: 20, leading: '1.75rem', lpx: 28 },
  { utility: 'text-2xl', size: '1.5rem', px: 24, leading: '2rem', lpx: 32 },
  { utility: 'text-3xl', size: '1.875rem', px: 30, leading: '2.25rem', lpx: 36 },
  { utility: 'text-4xl', size: '2.25rem', px: 36, leading: '2.5rem', lpx: 40 },
  { utility: 'text-5xl', size: '3rem', px: 48, leading: '1', lpx: 48 },
] as const;

const scaleCopy = {
  en: {
    sample: 'Quiet type, clear order',
    uses: {
      'text-xs': 'Badges, captions, small buttons',
      'text-sm': 'Default UI text: buttons, menus, fields',
      'text-base': 'Large controls, inputs on mobile',
      'text-lg': 'Lead paragraphs, h4',
      'text-xl': 'h3, dialog titles',
      'text-2xl': 'h2',
      'text-3xl': 'h1 on small screens',
      'text-4xl': 'h1, section titles',
      'text-5xl': 'Display only, never inside components',
    },
  },
  es: {
    sample: 'Tipografía calma, orden claro',
    uses: {
      'text-xs': 'Badges, leyendas, botones chicos',
      'text-sm': 'Texto de interfaz por defecto: botones, menús, campos',
      'text-base': 'Controles grandes, inputs en mobile',
      'text-lg': 'Párrafos destacados, h4',
      'text-xl': 'h3, títulos de diálogo',
      'text-2xl': 'h2',
      'text-3xl': 'h1 en pantallas chicas',
      'text-4xl': 'h1, títulos de sección',
      'text-5xl': 'Solo display, nunca dentro de componentes',
    },
  },
} as const;

export function TypeScale({ locale = 'en' }: { locale?: Locale }) {
  const t = scaleCopy[locale];

  return (
    <div className="border-border divide-border my-8 divide-y overflow-hidden rounded-lg border">
      {scale.map((step) => (
        <div key={step.utility} className="grid gap-2 px-5 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
          <div className="min-w-0 space-y-0.5">
            <div className="text-foreground font-mono text-[13px] font-medium">{step.utility}</div>
            <div className="text-muted-foreground font-mono text-[11px] tabular-nums">
              {step.px}px / {step.lpx}px
            </div>
            <div className="text-muted-foreground font-mono text-[11px] tabular-nums">
              {step.size} / {step.leading}
            </div>
          </div>
          <div className="min-w-0 space-y-1 overflow-hidden">
            <p
              className="text-foreground truncate font-medium tracking-tight"
              style={{ fontSize: step.size, lineHeight: step.leading }}
            >
              {t.sample}
            </p>
            <p className="text-muted-foreground text-xs">{t.uses[step.utility]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const weights = [
  { utility: 'font-normal', value: 400 },
  { utility: 'font-medium', value: 500 },
  { utility: 'font-semibold', value: 600 },
  { utility: 'font-bold', value: 700 },
] as const;

const weightCopy = {
  en: {
    sample: 'Ag',
    uses: {
      'font-normal': 'Body text and descriptions',
      'font-medium': 'Buttons, labels, menu items, badges. The most used weight in the catalog',
      'font-semibold': 'Headings, card and dialog titles',
      'font-bold': 'The h1 of a page and little else',
    },
  },
  es: {
    sample: 'Ag',
    uses: {
      'font-normal': 'Texto de cuerpo y descripciones',
      'font-medium': 'Botones, etiquetas, ítems de menú, badges. El peso más usado del catálogo',
      'font-semibold': 'Títulos, títulos de cards y diálogos',
      'font-bold': 'El h1 de una página y poco más',
    },
  },
} as const;

export function FontWeights({ locale = 'en' }: { locale?: Locale }) {
  const t = weightCopy[locale];

  return (
    <div className="my-8 grid gap-3 sm:grid-cols-2">
      {weights.map((weight) => (
        <div key={weight.utility} className="border-border flex gap-4 rounded-lg border p-4">
          <span
            className="text-foreground font-heading w-12 shrink-0 text-4xl leading-none"
            style={{ fontWeight: weight.value }}
          >
            {t.sample}
          </span>
          <div className="min-w-0 space-y-1">
            <div className="text-foreground font-mono text-[13px] font-medium">
              {weight.utility}{' '}
              <span className="text-muted-foreground tabular-nums">{weight.value}</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {t.uses[weight.utility]}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
