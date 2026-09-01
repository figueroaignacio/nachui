'use client';
import { Button } from '@repo/ui/components/button';
import { Typography } from '@repo/ui/components/typography';
import { Flex } from '@repo/ui/layout/flex';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <Flex
          direction="column"
          align="center"
          justify="center"
          className="min-h-screen p-4 text-center"
        >
          <Typography variant="h2" className="mb-2 text-3xl font-bold">
            Critical Application Error
          </Typography>
          <Typography variant="p" className="text-muted-foreground mb-6">
            A critical error occurred that could not be handled gracefully.
          </Typography>
          <Button onClick={() => reset()}>Try again</Button>
        </Flex>
      </body>
    </html>
  );
}
