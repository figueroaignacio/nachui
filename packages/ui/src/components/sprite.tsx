import * as React from 'react';
import { cn } from '../lib/cn';

export const SPRITE_SKINS = {
  terracotta: { base: '#E8845A', shade: '#D4704A' },
  umber: { base: '#8A5A3C', shade: '#6E4630' },
  sand: { base: '#F0B589', shade: '#D99A6E' },
  clay: { base: '#C96F4E', shade: '#A85639' },
} as const;

export const SPRITE_HAIR = {
  crop: 'M6 1h12v4H6ZM5 2h14v4H5Z',
  buzz: 'M6 3h12v2H6ZM5 4h14v1H5Z',
  bowl: 'M5 1h14v3H5ZM4 3h16v3H4Z',
  long: 'M6 1h12v4H6ZM5 2h14v4H5ZM4 5h2v10H4Zm14 0h2v10h-2Z',
  bun: 'M9 0h6v3H9ZM6 1h12v4H6ZM5 2h14v4H5Z',
  spikes: 'M5 3h2v2H5Zm3-1h2v3H8Zm3-1h2v4h-2Zm3 1h2v3h-2Zm3 1h2v2h-2ZM5 4h14v1H5Z',
} as const;

export const SPRITE_HAIR_COLORS = {
  ink: '#2C1810',
  chestnut: '#5A3A2E',
  copper: '#B8763F',
  ash: '#D8D2C8',
  dye: '#3B4F6B',
} as const;

export const SPRITE_EYES = {
  square: [
    [5, 8, 5, 5],
    [14, 8, 5, 5],
  ],
  slit: [
    [6, 9, 5, 2],
    [13, 9, 5, 2],
  ],
  dot: [
    [7, 9, 3, 3],
    [14, 9, 3, 3],
  ],
  wide: [
    [5, 8, 6, 4],
    [13, 8, 6, 4],
  ],
  visor: [[5, 8, 14, 4]],
} as const;

export const SPRITE_OUTFITS = {
  tee: (main: string, trim: string) => [
    { d: 'M4 18h16v6H4Z', fill: main },
    { d: 'M9 18h6v2H9Z', fill: trim },
    { d: 'M2 19h2v5H2Zm18 0h2v5h-2Z', fill: trim },
  ],
  slab: (main: string, trim: string) => [
    { d: 'M4 18h16v6H4Z', fill: main },
    { d: 'M9 18h6v6H9Z', fill: trim },
    { d: 'M2 19h2v5H2Zm18 0h2v5h-2Z', fill: trim },
  ],
  hoodie: (main: string, trim: string) => [
    { d: 'M6 16h12v3H6Z', fill: trim },
    { d: 'M4 18h16v6H4Z', fill: main },
    { d: 'M11 19h2v5h-2Z', fill: trim },
    { d: 'M2 19h2v5H2Zm18 0h2v5h-2Z', fill: trim },
  ],
  overalls: (main: string, trim: string) => [
    { d: 'M4 18h16v6H4Z', fill: trim },
    { d: 'M6 20h12v4H6Z', fill: main },
    { d: 'M7 18h2v3H7Zm8 0h2v3h-2Z', fill: main },
    { d: 'M2 19h2v5H2Zm18 0h2v5h-2Z', fill: trim },
  ],
} as const;

export const SPRITE_ACCESSORIES = {
  none: [],
  headset: [
    { d: 'M5 2h14v2H5ZM3 3h2v6H3Zm16 0h2v6h-2Z', fill: '#222' },
    { d: 'M2 8h4v5H2Zm16 0h4v5h-4Z', fill: '#444' },
    { d: 'M2 9h2v3H2Zm18 0h2v3h-2Z', fill: '#333' },
    { d: 'M21 12h1v4h-1Z', fill: '#333' },
    { d: 'M20 15h3v2h-3Z', fill: '#444' },
  ],
  glasses: [
    { d: 'M4 8h7v1H4Zm0 4h7v1H4Zm0-4h1v5H4Zm6 0h1v5h-1Z', fill: '#2C1810' },
    { d: 'M13 8h7v1h-7Zm0 4h7v1h-7Zm0-4h1v5h-1Zm6 0h1v5h-1Z', fill: '#2C1810' },
    { d: 'M11 9h2v1h-2Z', fill: '#2C1810' },
    { d: 'M5 9h5v3H5Zm9 0h5v3h-5Z', fill: '#A8E6D7', opacity: 0.22 },
  ],
  cap: [
    { d: 'M5 1h14v4H5ZM4 3h16v2H4Z', fill: '#3B4F6B' },
    { d: 'M2 5h9v1H2Z', fill: '#2F3F57' },
    { d: 'M11 2h2v2h-2Z', fill: '#E8E0D5' },
  ],
  band: [
    { d: 'M4 4h16v2H4Z', fill: '#A8E6D7' },
    { d: 'M4 4h16v1H4Z', fill: '#8FD3C2' },
  ],
} as const;

export type SpriteSkin = keyof typeof SPRITE_SKINS;
export type SpriteHair = keyof typeof SPRITE_HAIR;
export type SpriteHairColor = keyof typeof SPRITE_HAIR_COLORS;
export type SpriteEyes = keyof typeof SPRITE_EYES;
export type SpriteOutfit = keyof typeof SPRITE_OUTFITS;
export type SpriteAccessory = keyof typeof SPRITE_ACCESSORIES;
export type SpriteState = 'bust' | 'idle' | 'walk' | 'work' | 'loop';

export interface SpriteParts {
  skin: SpriteSkin;
  hair: SpriteHair;
  hairColor: SpriteHairColor;
  eyes: SpriteEyes;
  outfit: SpriteOutfit;
  outfitMain: string;
  outfitTrim: string;
  accessory: SpriteAccessory;
  eyeFill?: string;
}

const OUTFIT_COLORS = [
  ['#F5F0E8', '#D4704A'],
  ['#1A1A1A', '#2A2A2A'],
  ['#5B6B8C', '#46536E'],
  ['#E5C24A', '#C9A227'],
  ['#4E6E58', '#3C5645'],
  ['#8E7BA8', '#74628C'],
] as const;

function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(list: readonly T[], n: number): T {
  return list[n % list.length] as T;
}

export function partsFromSeed(seed: string): SpriteParts {
  const h = hash(seed);
  const colors = pick(OUTFIT_COLORS, h >>> 18);
  return {
    skin: pick(Object.keys(SPRITE_SKINS) as SpriteSkin[], h),
    hair: pick(Object.keys(SPRITE_HAIR) as SpriteHair[], h >>> 3),
    hairColor: pick(Object.keys(SPRITE_HAIR_COLORS) as SpriteHairColor[], h >>> 6),
    eyes: pick(Object.keys(SPRITE_EYES) as SpriteEyes[], h >>> 9),
    outfit: pick(Object.keys(SPRITE_OUTFITS) as SpriteOutfit[], h >>> 12),
    outfitMain: colors[0],
    outfitTrim: colors[1],
    accessory: pick(Object.keys(SPRITE_ACCESSORIES) as SpriteAccessory[], h >>> 15),
  };
}

const VISOR_GLOW = '#A8E6D7';

function normalize(parts: SpriteParts): SpriteParts {
  if (parts.eyes !== 'visor') return parts;
  return {
    ...parts,
    eyeFill: parts.eyeFill ?? VISOR_GLOW,
    accessory: parts.accessory === 'glasses' ? 'none' : parts.accessory,
  };
}

const VIEW_BOX: Record<SpriteState, string> = {
  bust: '0 0 24 24',
  idle: '0 0 32 28',
  walk: '0 0 32 28',
  work: '0 0 32 30',
  loop: '0 0 32 28',
};

const RATIO: Record<SpriteState, number> = {
  bust: 24 / 24,
  idle: 28 / 32,
  walk: 28 / 32,
  work: 30 / 32,
  loop: 28 / 32,
};

function Face({ parts, lit }: { parts: SpriteParts; lit: boolean }) {
  const skin = SPRITE_SKINS[parts.skin];
  const outfit = SPRITE_OUTFITS[parts.outfit](parts.outfitMain, parts.outfitTrim);

  return (
    <>
      <path fill={skin.base} d="M4 4h16v12H4Z" />
      <path fill={skin.shade} d="M2 8h2v5H2Zm18 0h2v5h-2Z" />
      <path fill={skin.base} d="M10 16h4v2h-4Z" />
      {outfit.map((p) => (
        <path key={p.d} d={p.d} fill={p.fill} />
      ))}
      <path fill={SPRITE_HAIR_COLORS[parts.hairColor]} d={SPRITE_HAIR[parts.hair]} />
      {lit && <rect className="sprite-glow" x="4" y="4" width="16" height="12" fill="#A8E6D7" />}
      <g className="sprite-eyes">
        {SPRITE_EYES[parts.eyes].map(([x, y, w, h]) => (
          <g className="sprite-eye" key={`${x}-${y}`}>
            <rect x={x} y={y} width={w} height={h} fill={parts.eyeFill ?? '#2C1810'} />
            {lit && (
              <rect
                className="sprite-glint"
                x={x + 1}
                y={y + h - 2}
                width={Math.max(2, w - 2)}
                height={1}
                fill="#A8E6D7"
              />
            )}
          </g>
        ))}
      </g>
      {SPRITE_ACCESSORIES[parts.accessory].map((p) => (
        <path key={p.d} d={p.d} fill={p.fill} opacity={'opacity' in p ? p.opacity : undefined} />
      ))}
    </>
  );
}

function Legs({ parts }: { parts: SpriteParts }) {
  const skin = SPRITE_SKINS[parts.skin];
  return (
    <>
      <g className="sprite-legs-walk">
        <g className="sprite-leg-frame">
          <rect x="10" y="24" width="3" height="3" fill={skin.base} />
          <rect x="19" y="24" width="3" height="3" fill={skin.base} />
          <rect x="9" y="27" width="4" height="1" fill={skin.shade} />
          <rect x="19" y="27" width="4" height="1" fill={skin.shade} />
        </g>
        <g className="sprite-leg-frame">
          <rect x="12" y="24" width="3" height="3" fill={skin.base} />
          <rect x="17" y="24" width="3" height="3" fill={skin.base} />
          <rect x="12" y="27" width="3" height="1" fill={skin.shade} />
          <rect x="17" y="27" width="3" height="1" fill={skin.shade} />
        </g>
      </g>
      <g className="sprite-legs-sit">
        <g className="sprite-leg-dangle">
          <rect x="12" y="24" width="3" height="5" fill={skin.base} />
          <rect x="11" y="29" width="4" height="1" fill={skin.shade} />
        </g>
        <g className="sprite-leg-dangle">
          <rect x="17" y="24" width="3" height="5" fill={skin.base} />
          <rect x="17" y="29" width="4" height="1" fill={skin.shade} />
        </g>
      </g>
    </>
  );
}

function Laptop({ parts }: { parts: SpriteParts }) {
  const skin = SPRITE_SKINS[parts.skin];
  return (
    <g className="sprite-laptop">
      <g className="sprite-lid">
        <rect x="7" y="17" width="18" height="8" fill="#444" />
        <rect x="8" y="18" width="16" height="6" fill="#3A3A3A" />
        <rect className="sprite-mark" x="14" y="20" width="4" height="3" fill="#2F2F2F" />
        <rect className="sprite-spill" x="8" y="17" width="16" height="1" fill="#A8E6D7" />
      </g>
      <rect x="5" y="25" width="22" height="3" fill="#333" />
      <rect x="7" y="26" width="18" height="1" fill="#555" />
      <rect x="4" y="27" width="24" height="1" fill="#555" />
      <g className="sprite-hands">
        <g className="sprite-hand">
          <rect x="9" y="25" width="4" height="2" fill={skin.base} />
          <rect x="9" y="25" width="4" height="1" fill={skin.shade} />
        </g>
        <g className="sprite-hand">
          <rect x="19" y="25" width="4" height="2" fill={skin.base} />
          <rect x="19" y="25" width="4" height="1" fill={skin.shade} />
        </g>
      </g>
    </g>
  );
}

interface SpriteProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'children'> {
  /** Any string. The same string always builds the same sprite. */
  seed?: string;
  /** Overrides whatever the seed picked, slot by slot. */
  parts?: Partial<SpriteParts>;
  state?: SpriteState;
  size?: number;
  ref?: React.Ref<SVGSVGElement>;
}

function Sprite({
  seed = 'nachui',
  parts: override,
  state = 'idle',
  size = 48,
  className,
  ref,
  ...props
}: SpriteProps) {
  const parts = normalize({ ...partsFromSeed(seed), ...override });
  const lit = state === 'work' || state === 'loop';

  const body = (
    <g className="sprite-lean">
      <g className="sprite-breathe">
        <g transform={state === 'work' ? 'translate(4 1)' : 'translate(4 0)'}>
          <Face parts={parts} lit={lit} />
        </g>
      </g>
    </g>
  );

  return (
    <svg
      ref={ref}
      viewBox={VIEW_BOX[state]}
      width={size}
      height={Math.round(size * RATIO[state])}
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={cn('sprite', `sprite-${state}`, className)}
      {...props}
    >
      {state === 'bust' ? (
        <g transform="translate(0 0)">
          <Face parts={parts} lit={false} />
        </g>
      ) : state === 'loop' ? (
        <g className="sprite-sit">
          <g className="sprite-gait">
            {body}
            <Legs parts={parts} />
          </g>
          <g transform="translate(0 -1)">
            <Laptop parts={parts} />
          </g>
        </g>
      ) : (
        <>
          <g className="sprite-gait">
            {body}
            {state !== 'work' && <Legs parts={parts} />}
          </g>
          {state === 'work' && <Laptop parts={parts} />}
        </>
      )}
    </svg>
  );
}

Sprite.displayName = 'Sprite';

export { Sprite };
