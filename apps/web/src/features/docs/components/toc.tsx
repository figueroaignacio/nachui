'use client';

import { GitHubStarTocCta } from '@/components/common/github-star-cta';
import { useMounted } from '@/hooks/use-mounted';
import { Typography } from '@repo/ui/components/typography';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { TocEntry, TocProps, Tree, useActiveItem } from './toc-tree';

function SkeletonItem({ width, subitems }: { width: number; subitems?: number[] }) {
  return (
    <li>
      <div className="flex items-center gap-2.5 px-2 py-1.5">
        <div className="bg-secondary animate-pulse rounded-full" style={{ height: 9, width }} />
      </div>
      {subitems && (
        <ul className="m-0 mt-0.5 ml-3 list-none space-y-0.5">
          {subitems.map((subWidth, i) => (
            <li key={i}>
              <div className="flex items-center gap-2.5 px-2 py-1.5">
                <div
                  className="bg-secondary animate-pulse rounded-full"
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
    <div className="sticky top-24 h-[calc(100vh-5rem)] space-y-4">
      <div className="bg-secondary h-2 w-14 animate-pulse rounded-full" />
      <ul className="m-0 list-none space-y-0.5">
        <SkeletonItem width={88} />
        <SkeletonItem width={72} subitems={[96, 80]} />
        <SkeletonItem width={64} />
        <SkeletonItem width={104} subitems={[72, 88, 64, 80, 112]} />
        <SkeletonItem width={80} subitems={[96]} />
      </ul>
    </div>
  );
}

export function Toc({ toc }: TocProps) {
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
    return null;
  }

  if (!mounted) {
    return <TocSkeleton />;
  }

  return (
    <motion.div
      className="hide-scrollbar sticky top-24 h-[calc(100vh-5rem)] space-y-4 overflow-y-auto"
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Typography
        variant="p"
        className="text-muted-foreground/60 text-[10px] font-semibold tracking-[0.15em] uppercase"
      >
        {t('label')}
      </Typography>

      <Tree tree={toc} activeItem={activeHeading} />

      <GitHubStarTocCta />
    </motion.div>
  );
}
