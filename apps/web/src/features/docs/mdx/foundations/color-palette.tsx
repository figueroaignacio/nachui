import { cn } from '@repo/ui/lib/cn';

import { darkColors, lightColors, lightGroups, type Locale } from './theme';
import { formatColor, tailwindUtility, type DtcgColor } from './tokens';

const copy = {
  en: {
    light: 'Light',
    dark: 'Dark',
    token: 'Token',
    cssOnly: 'CSS variable only',
    groups: {
      surface: 'Surface',
      interactive: 'Interactive',
      structure: 'Structure',
      feedback: 'Feedback',
      code: 'Code',
    },
  },
  es: {
    light: 'Claro',
    dark: 'Oscuro',
    token: 'Token',
    cssOnly: 'Solo variable CSS',
    groups: {
      surface: 'Superficie',
      interactive: 'Interacción',
      structure: 'Estructura',
      feedback: 'Feedback',
      code: 'Código',
    },
  },
} as const;

type Mode = 'light' | 'dark';

function Swatch({ mode, value }: { mode: Mode; value: DtcgColor }) {
  const page = mode === 'light' ? lightColors : darkColors;
  const css = formatColor(value);

  return (
    <div
      className="flex min-w-0 items-center gap-2.5 rounded-md border p-2"
      style={{
        backgroundColor: page.background ? formatColor(page.background) : undefined,
        borderColor: page.border ? formatColor(page.border) : undefined,
      }}
    >
      <span
        aria-hidden="true"
        className="size-8 shrink-0 rounded-sm border"
        style={{
          backgroundColor: css,
          borderColor: page.input ? formatColor(page.input) : undefined,
        }}
      />
      <span className="flex min-w-0 flex-col font-mono text-[11px] leading-snug">
        <span
          className="[overflow-wrap:anywhere]"
          style={{ color: page.foreground ? formatColor(page.foreground) : undefined }}
        >
          {css}
        </span>
        {value.hex ? (
          <span
            className="[overflow-wrap:anywhere]"
            style={{
              color: page['muted-foreground'] ? formatColor(page['muted-foreground']) : undefined,
            }}
          >
            {value.hex}
            {value.alpha !== undefined && value.alpha !== 1 ? ` @ ${value.alpha}` : null}
          </span>
        ) : null}
      </span>
    </div>
  );
}

export function ColorPalette({ locale = 'en' }: { locale?: Locale }) {
  const t = copy[locale];

  return (
    <div className="my-8 space-y-10">
      {lightGroups.map(({ group, tokens }) => (
        <section key={group} aria-label={t.groups[group as keyof typeof t.groups] ?? group}>
          <div className="border-border mb-1 grid gap-2 border-b pb-2 sm:grid-cols-3 sm:items-end">
            <span className="section-label">
              {t.groups[group as keyof typeof t.groups] ?? group}
            </span>
            <span className="text-muted-foreground grid grid-cols-2 gap-2 font-mono text-[11px] sm:col-span-2">
              <span>{t.light}</span>
              <span>{t.dark}</span>
            </span>
          </div>
          <ul className="divide-border divide-y">
            {tokens.map((token) => {
              const dark = darkColors[token.name];
              const utility = tailwindUtility(token.name);
              return (
                <li
                  key={token.name}
                  className="grid gap-2 py-2.5 sm:grid-cols-3 sm:items-center sm:gap-2"
                >
                  <div className="min-w-0">
                    <div className="text-foreground truncate font-mono text-[13px] font-medium">
                      --{token.name}
                    </div>
                    <div
                      className={cn(
                        'truncate font-mono text-[11px]',
                        utility ? 'text-muted-foreground' : 'text-muted-foreground/70 italic',
                      )}
                    >
                      {utility ?? t.cssOnly}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:col-span-2">
                    <Swatch mode="light" value={token.value} />
                    {dark ? <Swatch mode="dark" value={dark} /> : <span />}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
