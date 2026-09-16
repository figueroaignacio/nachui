'use client';

import { Link } from '@/i18n/navigation';
import { Frame } from '@repo/ui/components/frame';
import { ArrowUpRightIcon } from '@repo/ui/icons/arrow-up-right';
import { ChevronLeftIcon } from '@repo/ui/icons/chevron-left';
import { Grid } from '@repo/ui/layout/grid';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';
import { getGalleryComponent, humanize, isFloating } from '../lib/gallery-registry';
import { useDocsItems } from '../lib/use-docs-items';

export function GalleryComponentView({ slug }: { slug: string }) {
  const t = useTranslations('sections.gallery');
  const docItems = useDocsItems();
  const entry = getGalleryComponent(slug);

  if (!entry) return null;

  const doc = docItems.find((item) => item.href === entry.docsHref);
  const title = doc?.title ?? humanize(slug);

  return (
    <div className="bg-background relative mx-auto min-h-svh w-full max-w-5xl pb-20">
      <section className="relative pt-6 pb-6 sm:pt-8">
        <Link
          href="/components"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1 rounded-sm font-mono text-[13px] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <ChevronLeftIcon size={14} />
          {t('back')}
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="font-heading text-foreground text-2xl leading-tight font-semibold tracking-tight md:text-3xl">
              {title}
            </h1>
            {doc?.description && (
              <p className="text-muted-strong mt-2 text-sm leading-relaxed">{doc.description}</p>
            )}
          </div>
          <Link
            href={entry.docsHref}
            className="border-border text-foreground hover:bg-muted focus-visible:ring-ring inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-[13px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {t('viewDocs')}
            <ArrowUpRightIcon size={14} />
          </Link>
        </div>
      </section>

      <Grid columns="1" gap="4" className="items-stretch lg:grid-cols-2">
        {entry.examples.map(({ name, label, Demo }) => (
          <Frame key={name} spacing="sm" className="h-full">
            <Frame.Header className="flex-row items-center justify-between px-2.5 py-1.5">
              <Frame.Title as="h2">{label}</Frame.Title>
              <span className="text-muted-foreground font-mono text-[11px]">
                {slug}/{name}
              </span>
            </Frame.Header>
            <Frame.Panel
              className={cn(
                'flex min-h-64 flex-1 items-center justify-center p-5 sm:p-8',
                isFloating(slug) && 'overflow-visible',
              )}
            >
              <Demo />
            </Frame.Panel>
          </Frame>
        ))}
      </Grid>
    </div>
  );
}
