import { darkColors, darkShadows, lightColors, lightShadows, type Locale } from './theme';
import { formatColor, formatShadow, type DtcgColor } from './tokens';

const levels = ['sm', 'md', 'lg'] as const;

const copy = {
  en: {
    light: 'Light',
    dark: 'Dark',
    flat: 'Card',
    flatNote: 'no shadow',
    uses: {
      sm: 'Tab pill, switch thumb',
      md: 'Popover, menus, toast',
      lg: 'Dialog, sheet, drawer',
    },
  },
  es: {
    light: 'Claro',
    dark: 'Oscuro',
    flat: 'Card',
    flatNote: 'sin sombra',
    uses: {
      sm: 'Pastilla de tabs, thumb del switch',
      md: 'Popover, menús, toast',
      lg: 'Diálogo, sheet, drawer',
    },
  },
} as const;

const css = (color: DtcgColor | undefined) => (color ? formatColor(color) : undefined);

function Panel({ mode, locale }: { mode: 'light' | 'dark'; locale: Locale }) {
  const t = copy[locale];
  const colors = mode === 'light' ? lightColors : darkColors;
  const shadows = mode === 'light' ? lightShadows : darkShadows;

  return (
    <div
      className="rounded-lg border p-5"
      style={{ backgroundColor: css(colors.background), borderColor: css(colors.border) }}
    >
      <div
        className="mb-5 font-mono text-[11px]"
        style={{ color: css(colors['muted-foreground']) }}
      >
        {mode === 'light' ? t.light : t.dark}
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div
          className="flex min-h-24 flex-col justify-between rounded-md border p-3"
          style={{ backgroundColor: css(colors.card), borderColor: css(colors.border) }}
        >
          <span className="font-mono text-xs font-medium" style={{ color: css(colors.foreground) }}>
            {t.flat}
          </span>
          <span className="text-[11px]" style={{ color: css(colors['muted-foreground']) }}>
            {t.flatNote}
          </span>
        </div>
        {levels.map((level) => {
          const shadow = shadows[level];
          return (
            <div
              key={level}
              className="flex min-h-24 flex-col justify-between rounded-md border p-3"
              style={{
                backgroundColor: css(level === 'sm' ? colors.card : colors.popover),
                borderColor: css(colors.border),
                boxShadow: shadow ? formatShadow(shadow) : undefined,
              }}
            >
              <span
                className="font-mono text-xs font-medium"
                style={{ color: css(colors.foreground) }}
              >
                shadow-{level}
              </span>
              <span className="text-[11px]" style={{ color: css(colors['muted-foreground']) }}>
                {t.uses[level]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ElevationScale({ locale = 'en' }: { locale?: Locale }) {
  return (
    <div className="my-8 grid gap-3 md:grid-cols-2">
      <Panel mode="light" locale={locale} />
      <Panel mode="dark" locale={locale} />
    </div>
  );
}

export function ElevationValues({ locale = 'en' }: { locale?: Locale }) {
  const t = copy[locale];
  return (
    <div className="border-border divide-border my-8 divide-y overflow-hidden rounded-lg border">
      {levels.map((level) => {
        const light = lightShadows[level];
        const dark = darkShadows[level];
        return (
          <div key={level} className="grid gap-1.5 px-4 py-3 sm:grid-cols-[8rem_1fr]">
            <span className="text-foreground font-mono text-[13px] font-medium">
              --elevation-{level}
            </span>
            <div className="text-muted-foreground min-w-0 space-y-0.5 font-mono text-[11px] [overflow-wrap:anywhere]">
              <div>
                <span className="text-foreground/70">{t.light}</span>{' '}
                {light ? formatShadow(light) : null}
              </div>
              <div>
                <span className="text-foreground/70">{t.dark}</span>{' '}
                {dark ? formatShadow(dark) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
