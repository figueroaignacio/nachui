import { Badge } from '@repo/ui/components/badge';

import { darkColors, lightColors, type Locale } from './theme';
import { formatColor, formatRatio, measurePairs, type Grade, type MeasuredPair } from './tokens';

const copy = {
  en: {
    caption: 'Contrast of every foreground and background pair, measured from the token files',
    pair: 'Pair',
    light: 'Light',
    dark: 'Dark',
    on: 'on',
    ui: 'non-text',
  },
  es: {
    caption: 'Contraste de cada par de primer plano y fondo, medido desde los archivos de tokens',
    pair: 'Par',
    light: 'Claro',
    dark: 'Oscuro',
    on: 'sobre',
    ui: 'no textual',
  },
} as const;

const variants: Record<Grade, 'success' | 'info' | 'warning' | 'destructive'> = {
  AAA: 'success',
  AA: 'success',
  'AA large': 'warning',
  '3:1': 'info',
  fail: 'destructive',
};

function Sample({ pair, mode }: { pair: MeasuredPair; mode: 'light' | 'dark' }) {
  const colors = mode === 'light' ? lightColors : darkColors;
  const fg = colors[pair.fg];
  const bg = colors[pair.bg];
  if (!fg || !bg) return null;

  return (
    <span
      aria-hidden="true"
      className="inline-flex h-7 w-10 shrink-0 items-center justify-center rounded-sm border text-sm font-medium"
      style={{
        color: formatColor(fg),
        backgroundColor: formatColor(bg),
        borderColor: colors.border ? formatColor(colors.border) : undefined,
      }}
    >
      {pair.kind === 'ui' ? (
        <span
          className="block size-4 rounded-[3px] border-2"
          style={{ borderColor: formatColor(fg) }}
        />
      ) : (
        'Aa'
      )}
    </span>
  );
}

function Result({ pair, mode }: { pair: MeasuredPair; mode: 'light' | 'dark' }) {
  const { ratio, grade } = pair[mode];
  return (
    <div className="flex items-center gap-2.5">
      <Sample pair={pair} mode={mode} />
      <span className="text-foreground w-14 font-mono text-xs tabular-nums">
        {formatRatio(ratio)}
      </span>
      <Badge variant={variants[grade]}>{grade}</Badge>
    </div>
  );
}

export function ContrastTable({ locale = 'en' }: { locale?: Locale }) {
  const t = copy[locale];
  const pairs = measurePairs(lightColors, darkColors);

  return (
    <div className="border-border my-8 overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[34rem] text-start text-sm">
        <caption className="sr-only">{t.caption}</caption>
        <thead className="bg-surface-muted">
          <tr className="border-border border-b">
            <th scope="col" className="section-label px-4 py-2.5 text-start font-normal">
              {t.pair}
            </th>
            <th scope="col" className="section-label px-4 py-2.5 text-start font-normal">
              {t.light}
            </th>
            <th scope="col" className="section-label px-4 py-2.5 text-start font-normal">
              {t.dark}
            </th>
          </tr>
        </thead>
        <tbody className="divide-border divide-y">
          {pairs.map((pair) => (
            <tr key={`${pair.fg}/${pair.bg}`}>
              <th scope="row" className="px-4 py-2.5 text-start align-middle font-normal">
                <span className="text-foreground block font-mono text-xs">{pair.fg}</span>
                <span className="text-muted-foreground block font-mono text-[11px]">
                  {t.on} {pair.bg}
                  {pair.kind === 'ui' ? ` (${t.ui})` : null}
                </span>
              </th>
              <td className="px-4 py-2.5 align-middle">
                <Result pair={pair} mode="light" />
              </td>
              <td className="px-4 py-2.5 align-middle">
                <Result pair={pair} mode="dark" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
