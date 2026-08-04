import { cn } from '@repo/ui/lib/cn';

// Intensity ramp, faintest to boldest.
const GLYPHS = ['.', ':', '-', '=', '+', 'x', 'X', '#'] as const;

type Segment = {
  text: string;
  accent: boolean;
  twinkle: boolean;
  delay: number;
  duration: number;
};

type Cell = { char: string; accent: boolean; twinkle: boolean };

// Deterministic PRNG so server and client render the same field.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateField(rows: number, cols: number, seed: number): Segment[][] {
  const rand = mulberry32(seed);
  const half = Math.ceil(cols / 2);

  // Coarse block densities create the clustered, dithered look.
  const blockW = 7;
  const blockH = 3;
  const blockCols = Math.ceil(half / blockW);
  const blockRows = Math.ceil(rows / blockH);
  const density: number[][] = Array.from({ length: blockRows }, () =>
    Array.from({ length: blockCols }, () => rand() ** 2),
  );

  const field: Segment[][] = [];
  const emptyCell: Cell = { char: ' ', accent: false, twinkle: false };

  for (let r = 0; r < rows; r++) {
    const row: Cell[] = new Array<Cell>(cols).fill(emptyCell);

    // Denser toward the horizontal center and the top.
    const verticalFalloff = 1 - (r / rows) * 0.85;

    for (let c = 0; c < half; c++) {
      const centerWeight = 0.25 + 0.75 * (c / half);
      const blockDensity = density[Math.floor(r / blockH)]?.[Math.floor(c / blockW)] ?? 0;
      const on = rand() < blockDensity * centerWeight * verticalFalloff * 1.4;

      if (!on) continue;

      const intensity = rand() * (0.35 + blockDensity);
      const glyph = GLYPHS[Math.min(GLYPHS.length - 1, Math.floor(intensity * GLYPHS.length))]!;
      const accent = rand() < 0.07;
      const cell: Cell = { char: glyph, accent, twinkle: accent || rand() < 0.22 };

      // Mirror horizontally for the symmetric, mandala-like shape.
      row[c] = cell;
      row[cols - 1 - c] = cell;
    }

    // Merge consecutive cells with the same styling into segments.
    const segments: Segment[] = [];
    for (const cell of row) {
      const last = segments[segments.length - 1];
      if (last && last.accent === cell.accent && last.twinkle === cell.twinkle) {
        last.text += cell.char;
      } else {
        segments.push({
          text: cell.char,
          accent: cell.accent,
          twinkle: cell.twinkle,
          delay: rand() * 6,
          duration: 2.5 + rand() * 4,
        });
      }
    }
    field.push(segments);
  }

  return field;
}

const fieldCache = new Map<string, Segment[][]>();

type AsciiBackdropProps = {
  rows?: number;
  cols?: number;
  seed?: number;
  className?: string;
};

/**
 * Decorative ASCII glyph field, rendered behind page content and faded out
 * with a mask. Random glyphs twinkle via CSS (disabled for reduced motion).
 * Generation is seeded, so SSR and hydration always agree.
 */
export function AsciiBackdrop({ rows = 26, cols = 150, seed = 7, className }: AsciiBackdropProps) {
  const key = `${rows}:${cols}:${seed}`;
  let field = fieldCache.get(key);
  if (!field) {
    field = generateField(rows, cols, seed);
    fieldCache.set(key, field);
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden select-none',
        'mask-[radial-gradient(ellipse_75%_100%_at_50%_0%,black_30%,transparent_78%)]',
        className,
      )}
    >
      <pre className="text-muted-foreground/40 font-mono text-[8px] leading-[1.4] tracking-[0.3em] sm:text-[9px]">
        {field.map((segments, i) => (
          <div key={i}>
            {segments.map((segment, j) => {
              if (!segment.accent && !segment.twinkle) return segment.text;
              return (
                <span
                  key={j}
                  className={cn(
                    segment.accent && 'text-primary/70',
                    segment.twinkle && 'animate-ascii-twinkle motion-reduce:animate-none',
                  )}
                  style={
                    segment.twinkle
                      ? {
                          animationDelay: `${segment.delay.toFixed(2)}s`,
                          animationDuration: `${segment.duration.toFixed(2)}s`,
                        }
                      : undefined
                  }
                >
                  {segment.text}
                </span>
              );
            })}
          </div>
        ))}
      </pre>
    </div>
  );
}
