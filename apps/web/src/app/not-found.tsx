'use client';

import { buttonVariants } from '@repo/ui/components/button';
import { Empty } from '@repo/ui/components/empty';
import { Flex } from '@repo/ui/layout/flex';
import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <Flex direction="column" align="center" justify="center" className="min-h-screen">
          <Empty>
            <Empty.Header>
              <Empty.Title as="h2" className="text-4xl font-bold">
                404
              </Empty.Title>
              <Empty.Description>Page not found</Empty.Description>
            </Empty.Header>
            <Empty.Content>
              <Link href="/" className={buttonVariants({ variant: 'default' })}>
                Go home
              </Link>
            </Empty.Content>
          </Empty>
        </Flex>
      </body>
    </html>
  );
}
