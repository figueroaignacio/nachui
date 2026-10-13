'use client';

import { AiAvatar } from '@/features/chat/ui/ai-avatar';
import { Button } from '@repo/ui/components/button';
import { Typography } from '@repo/ui/components/typography';
import { Flex } from '@repo/ui/layout/flex';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('pages.error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Flex direction="column" align="center" justify="center" className="min-h-[50vh] space-y-4">
      <AiAvatar size="xl" expression="startled" follow />
      <Typography variant="h2" className="text-2xl font-bold tracking-tight">
        {t('title')}
      </Typography>
      <Typography variant="p" className="text-muted-foreground max-w-md text-center">
        {t('description')}
      </Typography>
      <Button onClick={() => reset()}>{t('retry')}</Button>
    </Flex>
  );
}
