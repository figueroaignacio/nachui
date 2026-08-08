'use client';

import { LayoutAlignBottomIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Drawer } from '@repo/ui/components/drawer';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { TocEntry, TocProps, Tree, useActiveItem } from './toc-tree';

export function MobileToc({ toc }: TocProps) {
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
  const t = useTranslations('components.mobileToc');
  const [open, setOpen] = useState(false);

  if (!toc || toc.length === 0) {
    return null;
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Drawer.Trigger
        variant="default"
        size="icon"
        className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full shadow-2xl xl:hidden"
        aria-label={t('label')}
      >
        <HugeiconsIcon icon={LayoutAlignBottomIcon} size={24} />
      </Drawer.Trigger>
      <Drawer.Content side="bottom" className="max-h-[80vh]">
        <Drawer.Header>
          <Drawer.Title className="text-sm font-semibold">{t('label')}</Drawer.Title>
        </Drawer.Header>
        <div className="mt-4 overflow-y-auto pb-8">
          <Tree tree={toc} activeItem={activeHeading} onItemClick={() => setOpen(false)} />
        </div>
      </Drawer.Content>
    </Drawer>
  );
}
