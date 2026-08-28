'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { Book02Icon, Home01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@repo/ui/components/button';
import { Empty } from '@repo/ui/components/empty';
import { Frame } from '@repo/ui/components/frame';
import { Flex } from '@repo/ui/layout/flex';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('docs.notFound');
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Flex align="center" justify="center" className="min-h-[75vh] px-4 py-16">
      <Frame className="w-full max-w-md">
        <Frame.Panel>
          <Empty className="px-4 py-8">
            <Empty.Header>
              <Empty.Media>
                <span className="border-border text-muted-foreground rounded-md border px-2.5 py-1 font-mono text-sm tracking-widest">
                  404
                </span>
              </Empty.Media>
              <Empty.Title as="h2" className="text-xl">
                {t('title')}
              </Empty.Title>
              <Empty.Description>{t('description')}</Empty.Description>
            </Empty.Header>
            <Empty.Content>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<HugeiconsIcon icon={Home01Icon} className="size-4" />}
                onClick={() => router.push('/')}
              >
                {t('goHome')}
              </Button>
              <Button
                size="sm"
                leftIcon={<HugeiconsIcon icon={Book02Icon} className="size-4" />}
                onClick={() => router.push('/docs')}
              >
                {t('goDocs')}
              </Button>
            </Empty.Content>
          </Empty>
        </Frame.Panel>
        <Frame.Footer className="justify-center">
          <code className="text-muted-foreground max-w-full truncate font-mono text-xs">
            {pathname}
          </code>
        </Frame.Footer>
      </Frame>
    </Flex>
  );
}
