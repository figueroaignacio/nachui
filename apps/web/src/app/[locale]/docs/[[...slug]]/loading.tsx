'use client';

import { usePathname } from '@/i18n/navigation';
import { Skeleton } from '@repo/ui/components/skeleton';
import { Container } from '@repo/ui/layout/container';
import { Stack } from '@repo/ui/layout/stack';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';

const PARAGRAPH_WIDTHS = ['w-full', 'w-11/12', 'w-4/5'];
const TOC_WIDTHS = ['w-24', 'w-32', 'w-28', 'w-20', 'w-28'];
const DEMO_WIDTHS = ['w-full', 'w-11/12', 'w-3/4'];

/** Same test the page uses to pick the stage: `/docs/elements/<family>/<name>`. */
const COMPONENT_PAGE = /^\/docs\/elements\/[^/]+\/[^/]+$/;

/**
 * A component page while it loads: the stage with its title and toolbar
 * in place, and the top of the doc under it. It carries `data-stage-shell`
 * so the header and the sidebar already sit where the real page puts them.
 */
function StageLoading({ label }: { label: string }) {
  return (
    <div data-stage-shell role="status" aria-busy="true" className="grid min-w-0 gap-2.5">
      <span className="sr-only">{label}</span>
      <div className="bg-island relative flex h-[min(34rem,72svh)] flex-col rounded-lg lg:h-[calc(100svh-1.25rem)]">
        <div className="flex justify-end p-3">
          <div className="bg-popover flex items-center gap-1.5 rounded-full p-1 shadow-md">
            <Skeleton className="h-8 w-16 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
          </div>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center p-6 sm:p-10">
          <div className="flex w-full max-w-lg flex-col gap-3">
            {DEMO_WIDTHS.map((width) => (
              <Skeleton key={width} className={cn('h-4', width)} />
            ))}
            <Skeleton className="mt-2 h-24 w-full rounded-md" />
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-3xl min-w-0 pt-6 xl:pt-10">
        <div className="mt-2 mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-4 h-5 w-full" />
          <Skeleton className="mt-2 h-5 w-2/3" />
          <Skeleton className="mt-5 h-8 w-64 rounded-full" />
        </div>
        <Skeleton className="h-6 w-36" />
        <Skeleton className="mt-5 h-8 w-40 rounded-full" />
        <Skeleton className="mt-5 h-44 w-full rounded-md" />
      </div>
    </div>
  );
}

export default function DocLoading() {
  const t = useTranslations('ui');
  const pathname = usePathname();

  if (COMPONENT_PAGE.test(pathname)) {
    return <StageLoading label={t('loading')} />;
  }

  return (
    <div className="lg:bg-island grid min-w-0 gap-8 lg:min-h-[calc(100svh-1.25rem)] lg:content-start lg:rounded-lg lg:px-10 lg:py-8 xl:grid-cols-[minmax(0,1fr)_13rem] xl:px-14">
      <Container size="md" className="px-0">
        <Stack role="status" aria-busy="true" className="w-full min-w-0">
          <span className="sr-only">{t('loading')}</span>
          <div className="mt-4 mb-10">
            <Skeleton className="h-8 w-56 lg:h-9" />
            <Skeleton className="mt-5 h-5 w-full max-w-[46ch]" />
            <Skeleton className="mt-2 h-5 w-2/3 max-w-[32ch]" />
          </div>
          <div className="flex flex-col gap-3">
            {PARAGRAPH_WIDTHS.map((width) => (
              <Skeleton key={width} className={cn('h-4', width)} />
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-3">
            <Skeleton className="h-6 w-40" />
            {PARAGRAPH_WIDTHS.map((width) => (
              <Skeleton key={width} className={cn('h-4', width)} />
            ))}
          </div>
        </Stack>
      </Container>
      <div aria-hidden="true" className="hidden flex-col gap-3 pt-6 xl:flex">
        {TOC_WIDTHS.map((width, index) => (
          <Skeleton key={index} className={cn('h-3', width)} />
        ))}
      </div>
    </div>
  );
}
