import {
  darkColors,
  darkRelief,
  darkShadows,
  lightColors,
  lightRelief,
  lightShadows,
  type Locale,
} from './theme';
import { formatColor, formatShadow, type DtcgColor } from './tokens';

const levels = [
  { utility: 'shadow-xs', token: 'elevation-xs', group: 'elevation', name: 'xs', surface: 'card' },
  { utility: 'shadow-sm', token: 'elevation-sm', group: 'elevation', name: 'sm', surface: 'card' },
  {
    utility: 'shadow-md',
    token: 'elevation-md',
    group: 'elevation',
    name: 'md',
    surface: 'popover',
  },
  {
    utility: 'shadow-lg',
    token: 'elevation-lg',
    group: 'elevation',
    name: 'lg',
    surface: 'popover',
  },
  {
    utility: 'inset-shadow-xs',
    token: 'relief-fill',
    group: 'relief',
    name: 'fill',
    surface: 'primary',
  },
  {
    utility: 'inset-shadow-sm',
    token: 'relief-well',
    group: 'relief',
    name: 'well',
    surface: 'well',
  },
] as const;

type Level = (typeof levels)[number];
type Mode = 'light' | 'dark';

const copy = {
  en: {
    light: 'Light',
    dark: 'Dark',
    uses: {
      xs: 'Island, chip',
      sm: 'Card, active tab',
      md: 'Popover, menus, toast',
      lg: 'Dialog, sheet, drawer',
      fill: 'Primary button',
      well: 'Fields, tracks',
    },
  },
  es: {
    light: 'Claro',
    dark: 'Oscuro',
    uses: {
      xs: 'Isla, chip',
      sm: 'Card, tab activa',
      md: 'Popover, menús, toast',
      lg: 'Diálogo, sheet, drawer',
      fill: 'Botón primario',
      well: 'Campos, tracks',
    },
  },
} as const;

const css = (color: DtcgColor | undefined) => (color ? formatColor(color) : undefined);

function shadowOf(level: Level, mode: Mode) {
  const elevation = mode === 'light' ? lightShadows : darkShadows;
  const relief = mode === 'light' ? lightRelief : darkRelief;
  const value = (level.group === 'elevation' ? elevation : relief)[level.name];
  return value ? formatShadow(value) : undefined;
}

function Panel({ mode, locale }: { mode: Mode; locale: Locale }) {
  const t = copy[locale];
  const colors = mode === 'light' ? lightColors : darkColors;

  return (
    <div className="rounded-lg p-5" style={{ backgroundColor: css(colors['surface-muted']) }}>
      <div className="mb-5 font-mono text-xs" style={{ color: css(colors['muted-foreground']) }}>
        {mode === 'light' ? t.light : t.dark}
      </div>
      <div className="grid grid-cols-2 gap-5">
        {levels.map((level) => {
          const solid = level.surface === 'primary';
          const text = css(colors[solid ? 'primary-foreground' : 'foreground']);
          const note = css(colors[solid ? 'primary-foreground' : 'muted-foreground']);
          return (
            <div
              key={level.utility}
              className="flex min-h-24 min-w-0 flex-col justify-between gap-2 rounded-md p-3"
              style={{
                backgroundColor: css(colors[level.surface]),
                boxShadow: shadowOf(level, mode),
              }}
            >
              <span
                className="font-mono text-xs font-medium [overflow-wrap:anywhere]"
                style={{ color: text }}
              >
                {level.utility}
              </span>
              <span className="text-xs" style={{ color: note }}>
                {t.uses[level.name]}
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
    <div className="bg-card divide-border my-8 divide-y overflow-hidden rounded-lg shadow-sm">
      {levels.map((level) => (
        <div key={level.token} className="grid gap-1.5 px-4 py-3 sm:grid-cols-[8rem_1fr]">
          <span className="text-foreground font-mono text-[13px] font-medium">--{level.token}</span>
          <div className="text-muted-foreground min-w-0 space-y-0.5 font-mono text-xs [overflow-wrap:anywhere]">
            <div>
              <span className="text-foreground/70">{t.light}</span> {shadowOf(level, 'light')}
            </div>
            <div>
              <span className="text-foreground/70">{t.dark}</span> {shadowOf(level, 'dark')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
