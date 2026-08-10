'use client';

import { Searcher } from '@/features/docs/components/searcher';
import { Link, usePathname } from '@/i18n/navigation';
import type { Navigation } from '@/lib/definitions';
import { Separator } from '@repo/ui/components/separator';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from '../common/locale-switcher';
import { ThemeToggle } from '../common/theme-toggle';

export function Navbar() {
  const t = useTranslations('ui');
  const navigation: Navigation[] = t.raw('navigation');
  const pathname = usePathname();

  return (
    <div>
      <div className="relative z-50 hidden w-full lg:flex">
        <div className="mx-auto flex w-full items-center justify-between py-4">
          <nav className="flex items-center gap-6" aria-label="Main navigation">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.target}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'focus-visible:ring-ring rounded-sm font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <Searcher />
            <Separator orientation="vertical" className="h-4" />
            <LocaleSwitcher />
            <Separator orientation="vertical" className="h-4" />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
