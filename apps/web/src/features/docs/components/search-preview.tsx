'use client';

import { FittedDemo, useDemo } from '@/components/common/live-demo';
import type { DocBadge } from '@/lib/definitions';
import { FileTextIcon } from '@repo/ui/icons/file-text';
import { useTranslations } from 'next-intl';
import type { SidebarPreview } from '../lib/sidebar-previews';

interface SearchPreviewProps {
  item?: { title: string; href: string; badge?: DocBadge };
  /** The section the result belongs to, when the search knows it. */
  category?: string;
  preview?: SidebarPreview;
}

function PreviewDemo({ component, demo }: { component: string; demo: string }) {
  const demoState = useDemo(component, demo);

  return (
    <div inert data-no-select className="relative min-h-0 flex-1 overflow-hidden">
      {demoState.status === 'ready' && <FittedDemo Demo={demoState.Demo} />}
      {demoState.status === 'loading' && (
        <div className="bg-secondary absolute inset-8 animate-pulse rounded-md motion-reduce:animate-none" />
      )}
    </div>
  );
}

/**
 * The page the search has selected, next to the results: its first live demo
 * when it has one, with its name and what it is for. It is a picture of the
 * destination, so nothing in it takes focus.
 */
export function SearchPreview({ item, category, preview }: SearchPreviewProps) {
  const t = useTranslations('components.searcher');
  const tBadges = useTranslations('docs.badges');

  if (!item) return <div aria-hidden="true" className="bg-island hidden rounded-lg md:block" />;

  return (
    <div aria-hidden="true" className="bg-island hidden min-h-0 flex-col rounded-lg md:flex">
      {preview ? (
        <PreviewDemo key={item.href} component={preview.component} demo={preview.demo} />
      ) : (
        <div className="text-muted-foreground flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-8 text-center text-[13px]">
          <span className="bg-secondary flex size-11 items-center justify-center rounded-full">
            <FileTextIcon size={18} />
          </span>
          {t('noPreview')}
        </div>
      )}
      <div className="flex flex-col gap-1.5 px-5 pt-2 pb-5">
        <span className="flex items-baseline gap-2.5">
          <span className="font-heading text-foreground text-xl leading-tight font-semibold tracking-[-0.02em]">
            {preview?.title ?? item.title}
          </span>
          {item.badge ? (
            <span className="text-brand text-xs font-medium">{tBadges(item.badge)}</span>
          ) : null}
        </span>
        {preview?.description ? (
          <span className="text-muted-foreground line-clamp-3 text-sm leading-snug">
            {preview.description}
          </span>
        ) : category ? (
          <span className="text-muted-foreground text-sm">{category}</span>
        ) : null}
      </div>
    </div>
  );
}
