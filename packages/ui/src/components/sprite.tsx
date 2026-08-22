import type * as React from 'react';
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

export const SPRITE_CSS = `.sprite {
  display: block;
  overflow: visible;
}

.sprite-eye {
  transform-box: fill-box;
  transform-origin: center;
  animation: sprite-blink 3s infinite;
}

.sprite-eyes {
  animation: sprite-glance 9s infinite;
}

.sprite-breathe {
  animation: sprite-breathe 3.6s ease-in-out infinite;
}

.sprite-idle .sprite-legs-sit,
.sprite-walk .sprite-legs-sit {
  display: none;
}

.sprite-walk .sprite-gait {
  animation: sprite-bob 480ms steps(1, end) infinite;
}

.sprite-leg-frame {
  animation: sprite-frame 480ms steps(1, end) infinite;
}

.sprite-leg-frame + .sprite-leg-frame {
  animation-delay: 240ms;
}

.sprite-leg-dangle {
  animation: sprite-swing 2.4s ease-in-out infinite;
}

.sprite-leg-dangle + .sprite-leg-dangle {
  animation-delay: 320ms;
}

.sprite-work .sprite-laptop {
  animation: sprite-laptop-in 600ms cubic-bezier(0.25, 0.9, 0.35, 1) 500ms both;
}

.sprite-work .sprite-lid {
  transform-box: fill-box;
  transform-origin: bottom center;
  animation: sprite-lid 450ms ease-out 1000ms both;
}

.sprite-work .sprite-mark {
  animation: sprite-mark 400ms steps(1, end) 1450ms both;
}

.sprite-work .sprite-spill {
  opacity: 0;
  animation: sprite-spill 900ms ease-out 1450ms both;
}

.sprite-work .sprite-glow {
  opacity: 0;
  animation: sprite-lit 900ms ease-out 1450ms both;
}

.sprite-work .sprite-glint {
  opacity: 0;
  animation: sprite-on 300ms steps(1, end) 1450ms both;
}

.sprite-work .sprite-lean {
  animation: sprite-lean 500ms ease-out 1400ms both;
}

.sprite-work .sprite-hands {
  opacity: 0;
  animation: sprite-hands 350ms ease-out 1600ms both;
}

.sprite-work .sprite-eyes {
  animation: sprite-read 3.4s steps(1, end) infinite;
}

.sprite-hand {
  animation: sprite-tap 300ms steps(2, end) infinite;
}

.sprite-hand + .sprite-hand {
  animation-delay: 150ms;
}

.sprite-loop {
  --sprite-leg: 13s;
}

.sprite-loop .sprite-sit {
  animation: sprite-cycle-sit var(--sprite-leg) ease-out infinite;
}

.sprite-loop .sprite-gait {
  animation:
    sprite-bob 480ms steps(1, end) infinite,
    sprite-cycle-bob var(--sprite-leg) steps(1, end) infinite;
}

.sprite-loop .sprite-legs-walk {
  animation: sprite-cycle-walk var(--sprite-leg) steps(1, end) infinite;
}

.sprite-loop .sprite-legs-sit {
  animation: sprite-cycle-dangle var(--sprite-leg) steps(1, end) infinite;
}

.sprite-loop .sprite-laptop {
  animation: sprite-cycle-laptop var(--sprite-leg) ease-out infinite;
}

.sprite-loop .sprite-lid {
  transform-box: fill-box;
  transform-origin: bottom center;
  animation: sprite-cycle-lid var(--sprite-leg) ease-out infinite;
}

.sprite-loop .sprite-mark {
  animation: sprite-cycle-mark var(--sprite-leg) steps(1, end) infinite;
}

.sprite-loop .sprite-spill {
  animation: sprite-cycle-spill var(--sprite-leg) ease-out infinite;
}

.sprite-loop .sprite-glow {
  animation: sprite-cycle-glow var(--sprite-leg) ease-out infinite;
}

.sprite-loop .sprite-glint {
  animation: sprite-cycle-glint var(--sprite-leg) steps(1, end) infinite;
}

.sprite-loop .sprite-lean {
  animation: sprite-cycle-lean var(--sprite-leg) ease-out infinite;
}

.sprite-loop .sprite-hands {
  animation: sprite-cycle-hands var(--sprite-leg) ease-out infinite;
}

@keyframes sprite-blink {
  0%,
  80% {
    transform: scaleY(1);
  }
  82%,
  84% {
    transform: scaleY(0);
  }
  86%,
  100% {
    transform: scaleY(1);
  }
}

@keyframes sprite-glance {
  0%,
  60%,
  100% {
    translate: 0 0;
  }
  64%,
  70% {
    translate: 1.4px 0;
  }
  76%,
  82% {
    translate: -1.4px 0;
  }
}

@keyframes sprite-breathe {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 0.22px;
  }
}

@keyframes sprite-bob {
  0% {
    translate: 0 0;
  }
  50% {
    translate: 0 var(--sprite-bob, -1px);
  }
  100% {
    translate: 0 0;
  }
}

@keyframes sprite-frame {
  0% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

@keyframes sprite-swing {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -0.6px;
  }
}

@keyframes sprite-laptop-in {
  from {
    translate: 0 15px;
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    translate: 0 -0.8px;
  }
  to {
    translate: 0 0;
    opacity: 1;
  }
}

@keyframes sprite-lid {
  from {
    scale: 1 0;
  }
  70% {
    scale: 1 1.12;
  }
  to {
    scale: 1 1;
  }
}

@keyframes sprite-mark {
  from {
    fill: #2f2f2f;
  }
  20% {
    fill: #d8f5ec;
  }
  45%,
  to {
    fill: #a8e6d7;
  }
}

@keyframes sprite-spill {
  from {
    opacity: 0;
  }
  20% {
    opacity: 0.9;
  }
  55%,
  to {
    opacity: 0.45;
  }
}

@keyframes sprite-lit {
  from {
    opacity: 0;
  }
  20% {
    opacity: 0.5;
  }
  55%,
  to {
    opacity: 0.16;
  }
}

@keyframes sprite-on {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes sprite-lean {
  from {
    translate: 0 0;
  }
  to {
    translate: 0 0.55px;
  }
}

@keyframes sprite-hands {
  from {
    opacity: 0;
    translate: 0 3px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}

@keyframes sprite-tap {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -1px;
  }
}

@keyframes sprite-read {
  0% {
    translate: 0 1.2px;
  }
  15% {
    translate: -1.4px 1.2px;
  }
  35% {
    translate: 1.4px 1.2px;
  }
  55% {
    translate: -1.4px 1.2px;
  }
  75% {
    translate: 1.1px 1.2px;
  }
  90% {
    translate: -1.4px 1.2px;
  }
  100% {
    translate: 0 1.2px;
  }
}

@keyframes sprite-cycle-sit {
  0%,
  40% {
    translate: 0 0;
  }
  46%,
  93% {
    translate: 0 4px;
  }
  98%,
  100% {
    translate: 0 0;
  }
}

@keyframes sprite-cycle-bob {
  0%,
  39% {
    --sprite-bob: -1px;
  }
  40%,
  96% {
    --sprite-bob: 0px;
  }
  97%,
  100% {
    --sprite-bob: -1px;
  }
}

@keyframes sprite-cycle-walk {
  0%,
  40% {
    opacity: 1;
  }
  41%,
  92% {
    opacity: 0;
  }
  93%,
  100% {
    opacity: 1;
  }
}

@keyframes sprite-cycle-dangle {
  0%,
  40% {
    opacity: 0;
  }
  41%,
  92% {
    opacity: 1;
  }
  93%,
  100% {
    opacity: 0;
  }
}

@keyframes sprite-cycle-laptop {
  0%,
  55% {
    translate: 0 15px;
    opacity: 0;
  }
  58% {
    translate: 0 -0.8px;
    opacity: 1;
  }
  60%,
  87% {
    translate: 0 0;
    opacity: 1;
  }
  91%,
  100% {
    translate: 0 15px;
    opacity: 0;
  }
}

@keyframes sprite-cycle-lid {
  0%,
  61% {
    scale: 1 0;
  }
  65% {
    scale: 1 1.12;
  }
  67%,
  88% {
    scale: 1 1;
  }
  90%,
  100% {
    scale: 1 0;
  }
}

@keyframes sprite-cycle-mark {
  0%,
  65% {
    fill: #2f2f2f;
  }
  66% {
    fill: #d8f5ec;
  }
  68%,
  88% {
    fill: #a8e6d7;
  }
  89%,
  100% {
    fill: #2f2f2f;
  }
}

@keyframes sprite-cycle-spill {
  0%,
  65% {
    opacity: 0;
  }
  67% {
    opacity: 0.9;
  }
  70%,
  87% {
    opacity: 0.45;
  }
  90%,
  100% {
    opacity: 0;
  }
}

@keyframes sprite-cycle-glow {
  0%,
  65% {
    opacity: 0;
  }
  67% {
    opacity: 0.5;
  }
  70%,
  87% {
    opacity: 0.16;
  }
  90%,
  100% {
    opacity: 0;
  }
}

@keyframes sprite-cycle-glint {
  0%,
  65% {
    opacity: 0;
  }
  66%,
  88% {
    opacity: 1;
  }
  89%,
  100% {
    opacity: 0;
  }
}

@keyframes sprite-cycle-lean {
  0%,
  56% {
    translate: 0 0;
  }
  64%,
  87% {
    translate: 0 0.55px;
  }
  92%,
  100% {
    translate: 0 0;
  }
}

@keyframes sprite-cycle-hands {
  0%,
  67% {
    opacity: 0;
    translate: 0 3px;
  }
  70%,
  87% {
    opacity: 1;
    translate: 0 0;
  }
  90%,
  100% {
    opacity: 0;
    translate: 0 3px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sprite-loop .sprite-legs-walk {
    opacity: 0;
  }

  .sprite-loop .sprite-sit {
    translate: 0 4px;
  }

  .sprite-loop .sprite-mark {
    fill: #a8e6d7;
  }

  .sprite-loop .sprite-glow {
    opacity: 0.16;
  }

  .sprite-loop .sprite-spill,
  .sprite-loop .sprite-glint,
  .sprite-loop .sprite-hands {
    opacity: 1;
  }
}
`;

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

/*
 * The drawing is built as strings rather than JSX so the exact same markup can
 * come out of the React component and out of `spriteToSvg`, which servers call
 * without React. Two renderers over one drawing would drift; one drawing with
 * two thin wrappers cannot.
 */

const rect = (x: number, y: number, w: number, h: number, fill: string, cls?: string) =>
  `<rect${cls ? ` class="${cls}"` : ''} x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;

const path = (d: string, fill: string, opacity?: number) =>
  `<path d="${d}" fill="${fill}"${opacity ? ` opacity="${opacity}"` : ''}/>`;

function face(parts: SpriteParts, lit: boolean): string {
  const skin = SPRITE_SKINS[parts.skin];
  const outfit = SPRITE_OUTFITS[parts.outfit](parts.outfitMain, parts.outfitTrim);

  const eyes = SPRITE_EYES[parts.eyes]
    .map(([x, y, w, h]) => {
      const glint = lit
        ? rect(x + 1, y + h - 2, Math.max(2, w - 2), 1, '#A8E6D7', 'sprite-glint')
        : '';
      return `<g class="sprite-eye">${rect(x, y, w, h, parts.eyeFill ?? '#2C1810')}${glint}</g>`;
    })
    .join('');

  return [
    path('M4 4h16v12H4Z', skin.base),
    path('M2 8h2v5H2Zm18 0h2v5h-2Z', skin.shade),
    path('M10 16h4v2h-4Z', skin.base),
    ...outfit.map((p) => path(p.d, p.fill)),
    path(SPRITE_HAIR[parts.hair], SPRITE_HAIR_COLORS[parts.hairColor]),
    lit ? rect(4, 4, 16, 12, '#A8E6D7', 'sprite-glow') : '',
    `<g class="sprite-eyes">${eyes}</g>`,
    ...SPRITE_ACCESSORIES[parts.accessory].map((p) =>
      path(p.d, p.fill, 'opacity' in p ? (p.opacity as number) : undefined),
    ),
  ].join('');
}

function legs(parts: SpriteParts): string {
  const skin = SPRITE_SKINS[parts.skin];
  return (
    `<g class="sprite-legs-walk">` +
    `<g class="sprite-leg-frame">${rect(10, 24, 3, 3, skin.base)}${rect(19, 24, 3, 3, skin.base)}${rect(9, 27, 4, 1, skin.shade)}${rect(19, 27, 4, 1, skin.shade)}</g>` +
    `<g class="sprite-leg-frame">${rect(12, 24, 3, 3, skin.base)}${rect(17, 24, 3, 3, skin.base)}${rect(12, 27, 3, 1, skin.shade)}${rect(17, 27, 3, 1, skin.shade)}</g>` +
    `</g>` +
    `<g class="sprite-legs-sit">` +
    `<g class="sprite-leg-dangle">${rect(12, 24, 3, 5, skin.base)}${rect(11, 29, 4, 1, skin.shade)}</g>` +
    `<g class="sprite-leg-dangle">${rect(17, 24, 3, 5, skin.base)}${rect(17, 29, 4, 1, skin.shade)}</g>` +
    `</g>`
  );
}

function laptop(parts: SpriteParts): string {
  const skin = SPRITE_SKINS[parts.skin];
  return (
    `<g class="sprite-laptop">` +
    `<g class="sprite-lid">${rect(7, 17, 18, 8, '#444')}${rect(8, 18, 16, 6, '#3A3A3A')}${rect(14, 20, 4, 3, '#2F2F2F', 'sprite-mark')}${rect(8, 17, 16, 1, '#A8E6D7', 'sprite-spill')}</g>` +
    rect(5, 25, 22, 3, '#333') +
    rect(7, 26, 18, 1, '#555') +
    rect(4, 27, 24, 1, '#555') +
    `<g class="sprite-hands">` +
    `<g class="sprite-hand">${rect(9, 25, 4, 2, skin.base)}${rect(9, 25, 4, 1, skin.shade)}</g>` +
    `<g class="sprite-hand">${rect(19, 25, 4, 2, skin.base)}${rect(19, 25, 4, 1, skin.shade)}</g>` +
    `</g></g>`
  );
}

function drawing(parts: SpriteParts, state: SpriteState): string {
  if (state === 'bust') return face(parts, false);

  const lit = state === 'work' || state === 'loop';
  const body =
    `<g class="sprite-lean"><g class="sprite-breathe">` +
    `<g transform="translate(4 ${state === 'work' ? 1 : 0})">${face(parts, lit)}</g>` +
    `</g></g>`;

  if (state === 'loop') {
    return (
      `<g class="sprite-sit"><g class="sprite-gait">${body}${legs(parts)}</g>` +
      `<g transform="translate(0 -1)">${laptop(parts)}</g></g>`
    );
  }

  return (
    `<g class="sprite-gait">${body}${state === 'work' ? '' : legs(parts)}</g>` +
    (state === 'work' ? laptop(parts) : '')
  );
}

export interface SpriteToSvgOptions {
  seed?: string;
  parts?: Partial<SpriteParts>;
  state?: SpriteState;
  size?: number;
  /** Skip the inline stylesheet when the page already carries SPRITE_CSS. */
  withStyles?: boolean;
  label?: string;
}

/** The whole sprite as one standalone SVG string, ready to serve or save. */
export function spriteToSvg({
  seed = 'nachui',
  parts: override,
  state = 'idle',
  size = 48,
  withStyles = true,
  label,
}: SpriteToSvgOptions = {}): string {
  const parts = normalize({ ...partsFromSeed(seed), ...override });
  const height = Math.round(size * RATIO[state]);
  const style = withStyles ? `<style>${SPRITE_CSS}</style>` : '';
  const title = label ? `<title>${label}</title>` : '';

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEW_BOX[state]}" width="${size}" height="${height}" ` +
    `shape-rendering="crispEdges" class="sprite sprite-${state}"${label ? ' role="img"' : ''}>` +
    title +
    style +
    drawing(parts, state) +
    `</svg>`
  );
}

interface SpriteProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'children'> {
  /** Any string. The same string always builds the same sprite. */
  seed?: string;
  /** Overrides whatever the seed picked, slot by slot. */
  parts?: Partial<SpriteParts>;
  state?: SpriteState;
  size?: number;
  /**
   * Inline the animations inside the SVG itself. The registry ships this one
   * file and a standalone SVG has no stylesheet to lean on, so this is how the
   * sprite moves anywhere the page's CSS cannot reach it.
   */
  withStyles?: boolean;
  ref?: React.Ref<SVGSVGElement>;
}

function Sprite({
  seed = 'nachui',
  parts: override,
  state = 'idle',
  size = 48,
  withStyles = false,
  className,
  ref,
  ...props
}: SpriteProps) {
  const parts = normalize({ ...partsFromSeed(seed), ...override });
  const style = withStyles ? `<style>${SPRITE_CSS}</style>` : '';

  return (
    <svg
      ref={ref}
      viewBox={VIEW_BOX[state]}
      width={size}
      height={Math.round(size * RATIO[state])}
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={cn('sprite', `sprite-${state}`, className)}
      dangerouslySetInnerHTML={{ __html: style + drawing(parts, state) }}
      {...props}
    />
  );
}

Sprite.displayName = 'Sprite';

export { Sprite };
