'use client';

import { Link } from '@/i18n/navigation';
import { PlusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { IconTile } from '@repo/ui/components/icon-tile';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { getComponentIcon } from './component-icons';

export interface ComponentGridItem {
  href: string;
  title: string;
  description?: string;
}

interface ComponentGridProps {
  items: ComponentGridItem[];
  className?: string;
}

const cascadeIndex = (index: number) => ({ '--cascade-i': index }) as React.CSSProperties;

/**
 * Dense catalog of components: one icon + name per tile on a muted surface,
 * separated by gaps instead of rules.
 */
export function ComponentGrid({ items, className }: ComponentGridProps) {
  const t = useTranslations('ui');
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'grid-cascade grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
        inView && 'grid-cascade-in',
        className,
      )}
    >
      {items.map((item, index) => (
        <Link
          key={item.href}
          href={item.href}
          title={item.description || undefined}
          style={cascadeIndex(index)}
          className={cn(
            'group/cell bg-surface-muted relative flex items-center overflow-hidden rounded-lg px-3 py-2.5 sm:px-4',
            'hover:bg-muted focus-visible:ring-ring transition-colors duration-200 focus-visible:z-10 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
          )}
        >
          <span className="flex min-w-0 origin-left items-center gap-2.5 transition-transform duration-200 ease-out group-hover/cell:scale-[1.03] motion-reduce:transform-none">
            <IconTile
              size="sm"
              tone="muted"
              className="group-hover/cell:bg-background border-transparent bg-transparent transition-all duration-200 ease-out group-hover/cell:scale-110 group-hover/cell:-rotate-6 group-hover/cell:shadow-sm motion-reduce:transform-none"
            >
              <HugeiconsIcon
                icon={getComponentIcon(item.href)}
                size={16}
                strokeWidth={1.6}
                className="text-muted-foreground group-hover/cell:text-foreground transition-colors duration-200"
              />
            </IconTile>
            <span className="text-foreground/90 group-hover/cell:text-foreground truncate text-sm transition-colors duration-200">
              {item.title}
            </span>
          </span>
        </Link>
      ))}
      <div
        aria-hidden="true"
        style={cascadeIndex(items.length)}
        className="bg-surface-muted [grid-column-end:-1] flex items-center gap-2.5 rounded-lg px-3 py-2.5 sm:px-4"
      >
        <IconTile
          size="sm"
          tone="muted"
          className="ring-border/60 border-transparent bg-transparent ring-1 ring-inset"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={1.6} />
        </IconTile>
        <span className="text-muted-foreground truncate font-mono text-xs italic">
          {t('componentGrid.wip')}
        </span>
      </div>
    </div>
  );
}
