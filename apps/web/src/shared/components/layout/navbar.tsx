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
        <div className="flex h-14 w-full items-stretch">
          {/* Brand + search segment: mirrors the docs sidebar column (260px) so
              its right rule joins the sidebar's border on docs pages. */}
          <div className="flex w-[260px] shrink-0 items-center justify-between border-r pr-3">
            <Link
              href="/"
              className="text-foreground hover:text-muted-foreground font-mono text-sm font-medium transition-colors"
              aria-label="NachUI home"
            >
              nachui
            </Link>
            <Searcher variant="icon" />
          </div>
          <nav className="flex items-center gap-6 pl-8" aria-label="Main navigation">
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
          <div className="ml-auto flex items-center gap-3">
            <LocaleSwitcher />
            <Separator orientation="vertical" className="h-4" />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
