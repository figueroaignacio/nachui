'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { ArrowRightIcon } from '@repo/ui/icons/arrow-right';

export type WallDensity = { columns: number; cards: number; loop: boolean };

/*
 * The drift loop needs two copies of each column, and at the desktop tilt the
 * rotated plane overhangs the stage by several columns on each side, so the
 * full set stays at 10 x 6. The cards themselves load in their own chunk once
 * the stage is near the viewport.
 */
const FULL: WallDensity = { columns: 10, cards: 6, loop: true };
const LIGHT: WallDensity = { columns: 6, cards: 4, loop: false };

const PreviewPlane = dynamic(
  () => import('./preview-wall-plane').then((m) => m.PreviewPlane),
  { ssr: false },
);

/**
 * Picks the density the first time the stage nears the viewport, then keeps
 * watching so the drift pauses (via `data-paused`) while it is offscreen.
 */
function useWallDensity(stage: React.RefObject<HTMLDivElement | null>) {
  const [density, setDensity] = useState<WallDensity | null>(null);

  useEffect(() => {
    const node = stage.current;
    if (!node) return;

    let picked = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        node.toggleAttribute('data-paused', !entry.isIntersecting);
        if (!entry.isIntersecting || picked) return;
        picked = true;
        const animated =
          window.matchMedia('(min-width: 40rem)').matches &&
          !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setDensity(animated ? FULL : LIGHT);
      },
      { rootMargin: '400px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [stage]);

  return density;
}

export function PreviewWall() {
  const t = useTranslations('sections.home.wall');
  const stage = useRef<HTMLDivElement>(null);
  const density = useWallDensity(stage);

  return (
    <section className="bleed-x relative overflow-hidden">
      <div className="relative z-10 flex flex-col gap-6 pt-16 md:flex-row md:items-end md:justify-between md:gap-12 md:pt-24">
        <div>
          <p className="text-muted-foreground font-mono text-xs">
            <span className="text-muted-foreground/60">./</span>
            {t('label')}
          </p>
          <h2 className="font-heading text-foreground mt-4 text-[clamp(2.75rem,11vw,5.25rem)] leading-[0.84] font-black tracking-[-0.07em] uppercase">
            <span className="block">{t('title1')}</span>
            <span className="text-muted-foreground/60 block">{t('title2')}</span>
          </h2>
        </div>
        <div className="flex max-w-sm flex-col gap-4">
          <p className="text-muted-strong text-[15px] leading-relaxed md:text-base">
            {t('description')}
          </p>
          <Link
            href="/docs/elements/ui"
            className="text-foreground hover:text-brand inline-flex w-fit items-center gap-2 font-mono text-xs transition-colors"
          >
            {t('browse')}
            <ArrowRightIcon size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div
        ref={stage}
        aria-hidden="true"
        inert
        className="preview-stage pointer-events-none relative mx-[calc(-1*var(--frame-bleed))] -mt-24 h-[34rem] overflow-hidden select-none md:-mt-40 md:h-[48rem] lg:h-[56rem]"
      >
        <div className="preview-plane absolute top-24 left-1/2 flex -translate-x-1/2 items-start gap-3 md:top-32">
          {density && <PreviewPlane density={density} />}
        </div>
      </div>
    </section>
  );
}
