import { SYMBOL_BLOCK, SYMBOL_PIECE } from '@/components/common/logo';

/**
 * The Lift mark as the backdrop of the hero: the block in gray with the edge
 * light, the piece in persimmon. Its size and place come from `--hero-mark`.
 */
export function HeroMark() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" className="hero-mark">
      <defs>
        <linearGradient id="hero-mark-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="hero-mark-rim-top" />
          <stop offset="0.5" className="hero-mark-rim-low" />
        </linearGradient>
        <linearGradient id="hero-mark-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <path
        d={SYMBOL_BLOCK}
        className="hero-mark-block"
        stroke="url(#hero-mark-rim)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={SYMBOL_PIECE}
        className="hero-mark-piece"
        stroke="url(#hero-mark-light)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
