'use client';

import { Searcher } from '@/features/docs/components/searcher';
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll';
import { Link, usePathname } from '@/i18n/navigation';
import type { DocSection, Navigation } from '@/lib/definitions';
import { getIcon } from '@/lib/get-icon';
import { Cancel01Icon, PanelLeftIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Typography } from '@repo/ui/components/typography';
import { cn } from '@repo/ui/lib/cn';
import { Flex } from '@repo/ui/src/layout/flex';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { LocaleSwitcher } from '../common/locale-switcher';
import { ThemeToggle } from '../common/theme-toggle';

export function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations();
  const pathname = usePathname();

  const docsNavigation = t.raw('docs.navigation') as DocSection[];
  const navigation = t.raw('ui.navigation') as Navigation[];

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useLockBodyScroll(isMenuOpen);

  return (
    <div className="frame-aligned relative flex w-full items-center justify-between py-5 lg:hidden">
      <Flex gap="4" align="center">
        <button
          className="flex items-center gap-x-2 text-sm font-medium"
          onClick={toggleMenu}
          title="Open menu"
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
          type="button"
        >
          <HugeiconsIcon icon={PanelLeftIcon} aria-hidden="true" />
        </button>{' '}
      </Flex>
      <div className="flex items-center gap-x-5">
        <Searcher />
        <LocaleSwitcher />
      </div>
      <nav
        className={cn(
          'bg-background fixed z-50 flex flex-col overflow-hidden shadow-2xl transition-all duration-300',
          'inset-0 h-lvh w-full sm:inset-2 sm:h-[calc(100svh-1rem)] sm:w-95 sm:rounded-lg sm:border',
          isMenuOpen
            ? 'translate-x-0'
            : '-translate-x-full opacity-0 sm:translate-x-[calc(-90%-2rem)]',
        )}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-x-3">
            <button
              title="Go to home page"
              aria-label="Go to home page"
              type="button"
              className="flex items-center gap-x-2 text-sm font-medium"
            >
              nachui
            </button>
          </div>
          <div className="flex items-center gap-x-3">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              title="Close menu"
              aria-label="Close menu"
              aria-expanded={isMenuOpen}
              type="button"
              className="hover:bg-card rounded-md p-2 transition-colors"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {navigation && navigation.length > 0 && (
            <div className="mb-8">
              <Typography className="text-muted-foreground mb-3 text-xs font-bold tracking-widest">
                Menu
              </Typography>
              <ul className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={toggleMenu}
                        className={cn(
                          'hover:bg-card hover:text-primary flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium transition-colors',
                          isActive && 'text-foreground bg-card',
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {getIcon(item.title, item.href)}
                          {item.title}
                        </div>
                        {isActive && <div className="bg-foreground size-1.5 rounded-full" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {docsNavigation.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6 last:mb-0">
              <Typography className="text-foreground font-heading mb-3 flex items-center gap-2 text-sm tracking-tight">
                {getIcon(section.title)}
                {section.title}
              </Typography>
              <ul className="ml-1.5 space-y-1 border-l pl-4">
                {section.items.map((item, itemIndex) => {
                  const isActive = pathname === item.href;

                  return (
                    <li key={itemIndex}>
                      <Link
                        href={item.href}
                        onClick={toggleMenu}
                        className={cn(
                          'text-muted-foreground hover:bg-card hover:text-primary flex items-center justify-between rounded-md px-2 py-1.5 text-xs transition-colors',
                          isActive && 'bg-card text-foreground font-medium',
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {getIcon(item.title, item.href)}
                          {item.title}
                        </div>
                        {isActive && <div className="bg-foreground size-1.5 rounded-full" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
