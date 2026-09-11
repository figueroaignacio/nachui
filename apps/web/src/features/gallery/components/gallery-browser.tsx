'use client';

import { Link } from '@/i18n/navigation';
import { ArrowUpRight01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Badge } from '@repo/ui/components/badge';
import { Frame } from '@repo/ui/components/frame';
import { Input } from '@repo/ui/components/input';
import { Grid } from '@repo/ui/layout/grid';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
  countGalleryExamples,
  getGalleryComponents,
  humanize,
  isFloating,
} from '../lib/gallery-registry';
import { useDocsItems } from '../lib/use-docs-items';

export function GalleryBrowser() {
  const t = useTranslations('sections.gallery');
  const docItems = useDocsItems();
  const [query, setQuery] = useState('');

  const entries = getGalleryComponents().map((entry) => ({
    ...entry,
    doc: docItems.find((item) => item.href === entry.docsHref),
  }));
  const normalized = query.trim().toLowerCase();
  const visible = entries.filter(({ slug, doc }) =>
    `${doc?.title ?? ''} ${slug} ${doc?.description ?? ''}`.toLowerCase().includes(normalized),
  );
  const total = countGalleryExamples();

  return (
    <div className="bg-background relative mx-auto min-h-svh w-full max-w-5xl pb-20">
      <section className="pt-6 pb-6 sm:pt-8">
        <p className="text-muted-foreground font-mono text-xs">{t('eyebrow')}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-foreground text-2xl leading-tight font-semibold tracking-tight md:text-3xl">
            {t('title')}
          </h1>
          <Badge variant="outline" className="font-mono text-xs tabular-nums">
            {total}
          </Badge>
        </div>
        <p className="text-muted-strong mt-2 max-w-xl text-sm leading-relaxed">
          {t('description', { count: total })}
        </p>
        <Input
          size="sm"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('search')}
          aria-label={t('search')}
          leftIcon={<HugeiconsIcon icon={Search01Icon} size={14} />}
          className="mt-4 max-w-xs"
        />
      </section>

      <Grid columns="1" gap="4" className="items-stretch sm:grid-cols-2 xl:grid-cols-3">
        {visible.map(({ slug, doc, examples, Preview }) => (
          <Frame key={slug} spacing="sm" className="h-full">
            <Frame.Panel
              className={cn(
                'flex h-56 items-center justify-center p-4',
                isFloating(slug) && 'overflow-visible',
              )}
            >
              <div className="flex w-full [zoom:0.8] justify-center *:min-w-0">
                <Preview />
              </div>
            </Frame.Panel>
            <Frame.Footer className="justify-between gap-3 px-2.5 py-1.5">
              <Link
                href={`/components/${slug}`}
                className="group/link focus-visible:ring-ring inline-flex min-w-0 items-center gap-1 rounded-sm text-[13px] font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <span className="truncate">{doc?.title ?? humanize(slug)}</span>
                <span className="text-muted-foreground group-hover/link:text-foreground -translate-x-0.5 transition-all group-hover/link:translate-x-0">
                  <HugeiconsIcon icon={ArrowUpRight01Icon} size={12} />
                </span>
              </Link>
              <span className="text-muted-foreground shrink-0 font-mono text-[11px] whitespace-nowrap">
                {t('examples', { count: examples.length })}
              </span>
            </Frame.Footer>
          </Frame>
        ))}
        {visible.length === 0 && (
          <p className="text-muted-foreground text-sm sm:col-span-2 xl:col-span-3">
            {t('noResults')}
          </p>
        )}
      </Grid>
    </div>
  );
}
