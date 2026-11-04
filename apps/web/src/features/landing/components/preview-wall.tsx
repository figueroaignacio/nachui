'use client';

import dynamic from 'next/dynamic';

import { useMediaQuery } from '@/hooks/use-media-query';
import { Skeleton } from '@repo/ui/components/skeleton';
import { cn } from '@repo/ui/lib/cn';

export type WallDensity = { columns: number; cards: number };

/*
 * At the desktop tilt the rotated plane overhangs the stage by several columns
 * on each side, so the full set stays at 10 x 6. The cards load in their own
 * chunk, and a phone only needs a lighter set.
 */
const FULL: WallDensity = { columns: 10, cards: 6 };
const LIGHT: WallDensity = { columns: 6, cards: 4 };

const SKELETON_HEIGHTS = ['h-56', 'h-72', 'h-44', 'h-64', 'h-52', 'h-80'];

/** Static stand-in columns while the cards chunk loads, so the stage is never blank. */
function WallSkeleton() {
  return Array.from({ length: FULL.columns }, (_, column) => (
    <div key={column} className="flex w-60 shrink-0 flex-col gap-3">
      {Array.from({ length: 4 }, (_, row) => (
        <Skeleton
          key={row}
          className={cn(
            'rounded-xl',
            SKELETON_HEIGHTS[(column * 5 + row * 7) % SKELETON_HEIGHTS.length],
          )}
        />
      ))}
    </div>
  ));
}

const PreviewPlane = dynamic(() => import('./preview-wall-plane').then((m) => m.PreviewPlane), {
  ssr: false,
  loading: WallSkeleton,
});

export function PreviewWall() {
  const density = useMediaQuery('(min-width: 40rem)') ? FULL : LIGHT;

  return (
    <div className="bleed-x relative mt-6 overflow-hidden md:mt-8">
      <div
        aria-hidden="true"
        inert
        className="preview-stage pointer-events-none relative mx-[calc(-1*var(--frame-bleed))] h-[34rem] overflow-hidden select-none md:h-[48rem] lg:h-[56rem]"
      >
        <div className="preview-plane absolute top-12 left-1/2 flex -translate-x-1/2 items-start gap-3 md:top-16">
          <PreviewPlane density={density} />
        </div>
      </div>
    </div>
  );
}
