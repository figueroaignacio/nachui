'use client';

import { AiPerch } from '@/features/chat/ui/ai-perch';
import { usePathname, useRouter } from '@/i18n/navigation';
import { ArrowLeft01Icon, Home01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@repo/ui/components/button';
import { Typography } from '@repo/ui/components/typography';
import { Container } from '@repo/ui/layout/container';
import { Flex } from '@repo/ui/layout/flex';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('pages.notFound');
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  const cleanSegment = lastSegment ? lastSegment.replace(/[^a-zA-Z0-9-_]/g, '') : '';
  const query = cleanSegment || 'page';
  const filename = `${query}.tsx`;

  return (
    <Flex
      align="center"
      justify="center"
      className="relative min-h-[75vh] overflow-hidden px-4 py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in oklch, var(--border) 70%, transparent) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 50%, transparent 10%, var(--background) 100%)',
        }}
      />

      <Container size="md" className="relative z-10 flex flex-col items-center text-center">
        <div className="flex max-w-sm flex-col items-center space-y-6">
          <span className="font-heading text-foreground/10 text-[8rem] leading-none font-bold tracking-tighter select-none sm:text-[10rem]">
            404
          </span>

          <Typography
            variant="h1"
            className="text-foreground -mt-14 text-2xl font-bold tracking-tight sm:text-3xl"
          >
            {t('title')}
          </Typography>

          <Typography
            variant="p"
            className="text-muted-foreground max-w-xs text-sm leading-relaxed"
          >
            {t('description')}
          </Typography>

          <Flex align="center" justify="center" gap="3" className="w-full flex-wrap pt-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />}
              onClick={() => router.back()}
            >
              {t('actionBack')}
            </Button>
            <Button
              variant="default"
              size="sm"
              leftIcon={<HugeiconsIcon icon={Home01Icon} className="size-4" />}
              onClick={() => router.push('/')}
            >
              {t('actionHome')}
            </Button>
          </Flex>

          <div className="relative w-full pt-4">
            <AiPerch className="ai-edge-perch" expression="reading" />
            <div className="border-border/60 w-full overflow-hidden rounded-lg border bg-neutral-900/90 text-left font-mono text-[11px] shadow-lg backdrop-blur-md dark:bg-neutral-950/90">
              <div className="flex items-center gap-1.5 border-b border-white/5 bg-neutral-800/40 px-4 py-2.5">
                <div className="size-2 rounded-full bg-[#ff5f56]" />
                <div className="size-2 rounded-full bg-[#ffbd2e]" />
                <div className="size-2 rounded-full bg-[#27c93f]" />
                <span className="ml-2 text-[10px] text-neutral-500 select-none">
                  {t('codeBlockTitle')}
                </span>
              </div>
              <div className="p-4 leading-relaxed whitespace-pre-wrap text-neutral-400">
                {t('codeBlockContent', { filename, query })}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Flex>
  );
}
