import { lightColors, type Locale } from './theme';
import { formatColor } from './tokens';

const copy = {
  en: [
    { label: 'Token file', where: 'tokens/themes/nachui/light.tokens.json' },
    { label: 'CSS variable', where: 'globals.css, :root and .dark' },
    { label: 'Tailwind utility', where: '@theme inline' },
    { label: 'Component', where: 'Your markup' },
  ],
  es: [
    { label: 'Archivo de tokens', where: 'tokens/themes/nachui/light.tokens.json' },
    { label: 'Variable CSS', where: 'globals.css, :root y .dark' },
    { label: 'Utilidad de Tailwind', where: '@theme inline' },
    { label: 'Componente', where: 'Tu markup' },
  ],
} as const;

export function TokenFlow({ locale = 'en' }: { locale?: Locale }) {
  const steps = copy[locale];
  const muted = lightColors['muted-foreground'];
  const value = muted ? formatColor(muted) : '';

  const code = [
    `"muted-foreground": { "$value": { "colorSpace": "oklch", ... } }`,
    `--muted-foreground: ${value};`,
    `--color-muted-foreground: var(--muted-foreground);`,
    `<p className="text-muted-foreground">`,
  ];

  return (
    <ol className="border-border divide-border my-8 divide-y overflow-hidden rounded-lg border">
      {steps.map((step, index) => (
        <li key={step.label} className="grid gap-2 px-4 py-3.5 sm:grid-cols-[11rem_1fr] sm:gap-6">
          <div className="min-w-0">
            <div className="text-foreground flex items-baseline gap-2 text-sm font-medium">
              <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
                0{index + 1}
              </span>
              {step.label}
            </div>
            <div className="text-muted-foreground mt-0.5 font-mono text-[11px] [overflow-wrap:anywhere]">
              {step.where}
            </div>
          </div>
          <code className="text-muted-strong bg-surface-muted self-center rounded-sm px-2 py-1.5 font-mono text-xs [overflow-wrap:anywhere]">
            {code[index]}
          </code>
        </li>
      ))}
    </ol>
  );
}
