'use client';

import { Searcher } from '@/features/docs/components/searcher';
import { Link, usePathname } from '@/i18n/navigation';
import type { Navigation } from '@/lib/definitions';
import { Container } from '@repo/ui/layout/container';
import { Flex } from '@repo/ui/layout/flex';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';
import { Logo } from '../common/logo';

export function Navbar() {
  const t = useTranslations('ui');
  const navigation: Navigation[] = t.raw('navigation');
  const pathname = usePathname();

  return (
    <Container
      as="div"
      className="relative z-50 hidden w-full items-center justify-between py-3 md:flex"
      size="fluid"
    >
      <Flex align="center" justify="between" gap="6">
        <Logo size="sm" />
        <Flex as="nav" align="center" gap="6" className="text-sm font-medium">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                className={cn(
                  'focus-visible:ring-foreground focus-visible:ring-offset-background text-muted-foreground hover:text-foreground rounded-sm transition-colors outline-none hover:underline focus-visible:ring-2 focus-visible:ring-offset-2',
                )}
                href={item.href}
                key={item.href}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.title}
              </Link>
            );
          })}
        </Flex>
      </Flex>
      <Flex align="center" gap="3">
        <Searcher />
      </Flex>
    </Container>
  );
}
