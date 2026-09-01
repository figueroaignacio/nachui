'use client';

import { AiAvatar } from '@/features/chat/ui/ai-avatar';
import { Button } from '@repo/ui/components/button';
import { Typography } from '@repo/ui/components/typography';
import { useEffect } from 'react';
import { Flex } from '@repo/ui/layout/flex';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Flex direction="column" align="center" justify="center" className="min-h-[50vh] space-y-4">
      <AiAvatar size="xl" expression="startled" follow />
      <Typography variant="h2" className="text-2xl font-bold tracking-tight">
        Something went wrong!
      </Typography>
      <Typography variant="p" className="text-muted-foreground max-w-md text-center">
        An unexpected error occurred. You can try recovering by clicking the button below.
      </Typography>
      <Button onClick={() => reset()}>Try again</Button>
    </Flex>
  );
}
