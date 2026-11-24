import { cn } from '@repo/ui/lib/cn';

interface LogoProps {
  withText?: boolean;
  size?: number;
  className?: string;
}

export const SYMBOL_BLOCK =
  'M47 25H23A16 16 0 0 0 7 41V77A16 16 0 0 0 23 93H59A16 16 0 0 0 75 77V53H47Z';
export const SYMBOL_PIECE = 'M65 7H77A16 16 0 0 1 93 23V35H65Z';
const LOCKUP_BLOCK = 'M40 18H16A16 16 0 0 0 0 34V70A16 16 0 0 0 16 86H52A16 16 0 0 0 68 70V46H40Z';
const LOCKUP_PIECE = 'M58 0H70A16 16 0 0 1 86 16V28H58Z';
const WORDMARK = [
  'M0 100L0 0L23.2 0L57 64.01L57 0L76 0L76 100L52.8 100L19 35.99L19 100Z',
  'M147 28H101A16 16 0 0 0 85 44V84A16 16 0 0 0 101 100H147ZM128 44.5H110A6 6 0 0 0 104 50.5V77.5A6 6 0 0 0 110 83.5H128Z',
  'M211 28H171A16 16 0 0 0 155 44V84A16 16 0 0 0 171 100H211V83.5H180A6 6 0 0 1 174 77.5V50.5A6 6 0 0 1 180 44.5H211Z',
  'M221 0H240V28H267A16 16 0 0 1 283 44V100H264V50.5A6 6 0 0 0 258 44.5H240V100H221Z',
  'M296 0H315V77.5A6 6 0 0 0 321 83.5H339A6 6 0 0 0 345 77.5V0H364V84A16 16 0 0 1 348 100H312A16 16 0 0 1 296 84Z',
  'M377 0H396V100H377Z',
];

const LOCKUP_WIDTH = 552.47;
const LOCKUP_HEIGHT = 126.47;

const piece = cn(
  'fill-primary transition-[translate] duration-500 ease-[cubic-bezier(.3,1.45,.55,1)] motion-reduce:transition-none',
  '[a:focus-visible_&]:translate-x-[5px] [a:focus-visible_&]:-translate-y-[5px]',
  '[a:hover_&]:translate-x-[5px] [a:hover_&]:-translate-y-[5px]',
);

export function Logo({ withText = false, size = 28, className }: LogoProps) {
  if (withText) {
    return (
      <svg
        viewBox={`0 0 ${LOCKUP_WIDTH} ${LOCKUP_HEIGHT}`}
        width={Math.round((size * LOCKUP_WIDTH) / LOCKUP_HEIGHT)}
        height={size}
        aria-hidden="true"
        focusable="false"
        className={cn('text-foreground shrink-0 overflow-visible', className)}
      >
        <g transform="scale(1.47)">
          <path d={LOCKUP_BLOCK} className="fill-current" />
          <path d={LOCKUP_PIECE} className={piece} />
        </g>
        <g transform="translate(156.47 26.47)" className="fill-current" fillRule="evenodd">
          {WORDMARK.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={cn('text-foreground shrink-0 overflow-visible', className)}
    >
      <path d={SYMBOL_BLOCK} className="fill-current" />
      <path d={SYMBOL_PIECE} className={piece} />
    </svg>
  );
}
