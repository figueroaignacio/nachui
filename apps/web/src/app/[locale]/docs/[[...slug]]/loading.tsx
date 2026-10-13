'use client';

import { Skeleton } from '@repo/ui/components/skeleton';
import { cn } from '@repo/ui/lib/cn';
import { Container } from '@repo/ui/layout/container';
import { Stack } from '@repo/ui/layout/stack';
import { useTranslations } from 'next-intl';

const PARAGRAPH_WIDTHS = ['w-full', 'w-11/12', 'w-4/5'];
const TOC_WIDTHS = ['w-24', 'w-32', 'w-28', 'w-20', 'w-28'];

export default function DocLoading() {
  const t = useTranslations('ui');

  return (
    <>
      <Container size="md" className="px-0">
        <Stack role="status" aria-busy="true" className="w-full min-w-0">
          <span className="sr-only">{t('loading')}</span>
          <div className="mt-4 mb-10">
            <Skeleton className="h-8 w-56 lg:h-9" />
            <Skeleton className="mt-5 h-5 w-full max-w-[46ch]" />
            <Skeleton className="mt-2 h-5 w-2/3 max-w-[32ch]" />
          </div>
          <Skeleton className="h-72 w-full rounded-xl" />
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
    </>
  );
}
