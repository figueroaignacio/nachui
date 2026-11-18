'use client';

import { FittedDemo, useDemo } from '@/components/common/live-demo';
import { NavBadge } from '@/components/common/nav-badge';
import { Link } from '@/i18n/navigation';
import { cn } from '@repo/ui/lib/cn';
import * as React from 'react';
import type { CatalogEntry } from '../lib/catalog';
import { TileArrow, tileClassName, tileFooterClassName, tileStageClassName } from './tile-parts';

/** Starts loading a little before the tile scrolls into view. */
const NEAR_VIEWPORT = '240px';

function useNearViewport<T extends Element>() {
  const ref = React.useRef<T>(null);
  const [near, setNear] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node || near) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setNear(true);
      },
      { rootMargin: NEAR_VIEWPORT },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [near]);

  return [ref, near] as const;
}

interface CatalogTileProps {
  entry: CatalogEntry;
  /** Short family tag shown before the arrow, for mixed grids. */
  tag?: string;
  className?: string;
}

/**
 * One component of the catalog: its default demo running at a reduced scale on
 * a recessed stage, and its name. The whole tile is the link; the demo is a
 * picture here, so it is inert and hidden from assistive tech.
 */
export function CatalogTile({ entry, tag, className }: CatalogTileProps) {
  const [stageRef, near] = useNearViewport<HTMLDivElement>();
  const demo = useDemo(entry.component, entry.demo, near);

  return (
    <Link href={entry.href} className={cn(tileClassName, 'h-72', className)}>
      <div ref={stageRef} inert aria-hidden="true" data-no-select className={tileStageClassName}>
        {demo.status === 'ready' && (
          <FittedDemo Demo={demo.Demo} stageWidth={440} maxScale={1} padding={20} />
        )}
        {demo.status === 'loading' && (
          <div className="bg-muted/60 absolute inset-8 animate-pulse rounded-md motion-reduce:animate-none" />
        )}
      </div>
      <div className={tileFooterClassName}>
        <span className="truncate">{entry.title}</span>
        <NavBadge badge={entry.badge} />
        {tag && <span className="section-label ms-auto uppercase">{tag}</span>}
        <TileArrow className={tag ? undefined : 'ms-auto'} />
      </div>
    </Link>
  );
}
