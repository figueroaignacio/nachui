'use client';

import { useMounted } from '@/hooks/use-mounted';
import { Separator } from '@repo/ui/components/separator';
import { Skeleton } from '@repo/ui/components/skeleton';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { TocEntry, TocProps, Tree, useActiveItem } from './toc-tree';

function SkeletonItem({ width, subitems }: { width: number; subitems?: number[] }) {
  return (
    <li>
      <div className="flex items-center gap-2.5 px-2 py-2">
        <Skeleton className="bg-secondary rounded-full" style={{ height: 9, width }} />
      </div>
      {subitems && (
        <ul className="m-0 ml-3 list-none">
          {subitems.map((subWidth, i) => (
            <li key={i}>
              <div className="flex items-center gap-2.5 px-2 py-2">
                <Skeleton
                  className="bg-secondary rounded-full"
                  style={{ height: 8, width: subWidth }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function TocSkeleton() {
  return (
    <div className="sticky top-10 h-[calc(100vh-9rem)]">
      <Skeleton className="bg-secondary mx-2 mb-3 h-2 w-14 rounded-full" />
      <ul className="m-0 list-none">
        <SkeletonItem width={88} />
        <SkeletonItem width={72} subitems={[96, 80]} />
        <SkeletonItem width={64} />
        <SkeletonItem width={104} subitems={[72, 88, 64, 80, 112]} />
        <SkeletonItem width={80} subitems={[96]} />
      </ul>
    </div>
  );
}

type TocPanelProps = TocProps & {
  /** Rendered under the tree, inside the sticky rail. */
  footer?: React.ReactNode;
};

export function Toc({ toc, footer }: TocPanelProps) {
  const itemIds = useMemo(() => {
    if (!toc) return [];
    const ids: string[] = [];
    const extractIds = (items: TocEntry[]) => {
      items.forEach((item) => {
        if (item.url) {
          const id = item.url.split('#')[1];
          if (id) ids.push(id);
        }
        if (item.items) extractIds(item.items);
      });
    };
    extractIds(toc);
    return ids;
  }, [toc]);
  const activeHeading = useActiveItem(itemIds);
  const mounted = useMounted();
  const t = useTranslations('components.toc');

  if (!toc || toc.length === 0) {
    return footer ? <div className="sticky top-10">{footer}</div> : null;
  }

  if (!mounted) {
    return <TocSkeleton />;
  }

  return (
    <motion.div
      className="hide-scrollbar sticky top-10 h-[calc(100vh-9rem)] overflow-y-auto"
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <p className="text-muted-foreground mb-2 px-2 font-mono text-[11px] lowercase">
        <span className="text-muted-foreground/50">./</span>
        {t('label')}
      </p>

      <Tree tree={toc} activeItem={activeHeading} />

      {footer && (
        <div className="mt-5">
          <Separator className="bg-border/40 mx-2 mb-4 w-auto" />
          {footer}
        </div>
      )}
    </motion.div>
  );
}
