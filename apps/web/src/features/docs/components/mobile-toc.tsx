'use client';

import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@repo/ui/lib/cn';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { TocEntry, TocProps, Tree, useActiveItem } from './toc-tree';

/** Flattens the tree to `{ id, title }`, so the bar can name the active one. */
function flatten(toc: TocEntry[]): { id: string; title: string }[] {
  return toc.flatMap((item) => {
    const id = item.url.split('#')[1];
    return [...(id ? [{ id, title: item.title }] : []), ...(item.items ? flatten(item.items) : [])];
  });
}

/**
 * Sticky heading bar: names the section you are reading and expands into the
 * full table of contents. Docked under the site header rather than floating,
 * so it never covers the prose.
 */
export function MobileToc({ toc }: TocProps) {
  const t = useTranslations('components.mobileToc');
  const [open, setOpen] = useState(false);

  const entries = useMemo(() => (toc ? flatten(toc) : []), [toc]);
  const activeHeading = useActiveItem(entries.map((entry) => entry.id));

  // Closing on scroll keeps the bar from hiding the section it just jumped to.
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, { passive: true });
    return () => window.removeEventListener('scroll', close);
  }, [open]);

  if (!toc || toc.length === 0) return null;

  const activeTitle = entries.find((entry) => entry.id === activeHeading)?.title ?? t('label');
  const progress = activeHeading
    ? (entries.findIndex((entry) => entry.id === activeHeading) + 1) / entries.length
    : 0;

  return (
    <div className="bg-background/90 border-rule sticky top-14 z-40 -mx-4 mb-8 border-b backdrop-blur-md xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        className="flex h-11 w-full items-center gap-2.5 px-4 text-left"
      >
        <ProgressRing progress={progress} />
        <span className="text-foreground/90 min-w-0 flex-1 truncate text-xs">{activeTitle}</span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={14}
          aria-hidden="true"
          className={cn(
            'text-muted-foreground shrink-0 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="border-rule max-h-[50vh] overflow-y-auto border-t px-3 py-3">
              <Tree tree={toc} activeItem={activeHeading} onItemClick={() => setOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Reading progress through the headings, as a ring around the bar's dot. */
function ProgressRing({ progress }: { progress: number }) {
  const radius = 6;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0 -rotate-90" aria-hidden="true">
      <circle cx="8" cy="8" r={radius} fill="none" stroke="var(--border)" strokeWidth="1.5" />
      <motion.circle
        cx="8"
        cy="8"
        r={radius}
        fill="none"
        stroke="var(--foreground)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        animate={{ strokeDashoffset: circumference * (1 - progress) }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </svg>
  );
}
