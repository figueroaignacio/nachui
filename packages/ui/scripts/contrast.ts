/**
 * Reads the OKLCH tokens out of src/css/globals.css and measures WCAG 2.1
 * contrast between the pairs the components actually render together.
 *
 * Run directly for a report:  pnpm --filter @repo/ui exec tsx scripts/contrast.ts
 * It is also driven by scripts/contrast.test.ts, which is what keeps a
 * regression from landing.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export type Oklch = { l: number; c: number; h: number };

const here = path.dirname(fileURLToPath(import.meta.url));
const GLOBALS = path.join(here, '..', 'src', 'css', 'globals.css');

/** AA for normal-size text. */
export const AA = 4.5;
/** AA for non-text UI, e.g. the outline of a form control (WCAG 1.4.11). */
export const AA_NON_TEXT = 3;

function srgbToLinear(c: number) {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(c: number) {
  const x = Math.min(1, Math.max(0, c));
  return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
}

export function oklchToRgb({ l, c, h }: Oklch): [number, number, number] {
  const hr = (h * Math.PI) / 180;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);
  const L = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const M = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const S = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    linearToSrgb(4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S),
    linearToSrgb(-1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S),
    linearToSrgb(-0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S),
  ];
}

export function relativeLuminance(rgb: [number, number, number]) {
  const [r, g, b] = rgb.map(srgbToLinear) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: Oklch, b: Oklch) {
  const la = relativeLuminance(oklchToRgb(a));
  const lb = relativeLuminance(oklchToRgb(b));
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Tokens of one theme block, keyed without the leading dashes. */
export function readTokens(block: ':root' | '.dark', file = GLOBALS): Record<string, Oklch> {
  const css = readFileSync(file, 'utf8');
  // The page-frame layer declares a second :root; the token layer is the first.
  const start = css.indexOf(`${block} {`);
  const end = css.indexOf('\n}', start);
  const body = css.slice(start, end);
  const out: Record<string, Oklch> = {};
  for (const m of body.matchAll(/--([\w-]+):\s*oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)/g)) {
    out[m[1]!] = { l: Number(m[2]) / 100, c: Number(m[3]), h: Number(m[4]) };
  }
  return out;
}

export type Pair = { name: string; fg: string; bg: string; min: number };

/** Every foreground/background combination the components put on screen. */
export function pairsFor(tokens: Record<string, Oklch>): Pair[] {
  const pairs: Pair[] = [];
  const hues = ['destructive', 'warning', 'success', 'info'] as const;

  for (const hue of hues) {
    // Callout, Badge: text on its own soft surface.
    pairs.push({
      name: `${hue}-text on ${hue}-surface`,
      fg: `${hue}-text`,
      bg: `${hue}-surface`,
      min: AA,
    });
    // Toast, Spinner: text straight on the canvas.
    pairs.push({ name: `${hue}-text on background`, fg: `${hue}-text`, bg: 'background', min: AA });
    pairs.push({ name: `${hue}-text on card`, fg: `${hue}-text`, bg: 'card', min: AA });
    // Banner: the solid fill.
    pairs.push({ name: `${hue}-foreground on ${hue}`, fg: `${hue}-foreground`, bg: hue, min: AA });
  }

  // Body and secondary text on every surface it can land on.
  for (const surface of ['background', 'card', 'popover', 'muted', 'surface-muted', 'code']) {
    pairs.push({
      name: `muted-foreground on ${surface}`,
      fg: 'muted-foreground',
      bg: surface,
      min: AA,
    });
    pairs.push({ name: `foreground on ${surface}`, fg: 'foreground', bg: surface, min: AA });
  }

  // Syntax colours on the editor surface.
  for (const role of [
    'plain',
    'comment',
    'punctuation',
    'keyword',
    'string',
    'function',
    'number',
    'tag',
  ]) {
    pairs.push({ name: `code-${role} on code`, fg: `code-${role}`, bg: 'code', min: AA });
  }

  // Control outlines are non-text UI, so the bar is 3:1.
  pairs.push({
    name: 'border-interactive on card',
    fg: 'border-interactive',
    bg: 'card',
    min: AA_NON_TEXT,
  });
  pairs.push({
    name: 'border-interactive on background',
    fg: 'border-interactive',
    bg: 'background',
    min: AA_NON_TEXT,
  });

  return pairs.filter((p) => tokens[p.fg] && tokens[p.bg]);
}

export function measure(block: ':root' | '.dark') {
  const tokens = readTokens(block);
  return pairsFor(tokens).map((p) => ({
    ...p,
    ratio: contrast(tokens[p.fg]!, tokens[p.bg]!),
    get passes() {
      return this.ratio >= p.min;
    },
  }));
}

const invokedDirectly =
  process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  let failed = 0;
  for (const block of [':root', '.dark'] as const) {
    console.log(`\n${block === ':root' ? 'LIGHT' : 'DARK'}`);
    for (const r of measure(block)) {
      const ok = r.ratio >= r.min;
      if (!ok) failed++;
      console.log(
        `  ${ok ? 'ok  ' : 'FAIL'} ${r.ratio.toFixed(2).padStart(6)}  (min ${r.min})  ${r.name}`,
      );
    }
  }
  console.log(failed ? `\n${failed} pair(s) below target` : '\nall pairs pass');
  process.exit(failed ? 1 : 0);
}
