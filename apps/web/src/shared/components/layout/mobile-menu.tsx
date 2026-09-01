'use client';

import { NavBadge } from '@/components/common/nav-badge';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Searcher } from '@/features/docs/components/searcher';
import { useDialogBehavior } from '@/hooks/use-dialog-behavior';
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll';
import { Link, usePathname } from '@/i18n/navigation';
import type { DocSection, Navigation } from '@/lib/definitions';
import { Cancel01Icon, PanelLeftIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Separator } from '@repo/ui/components/separator';
import { Typography } from '@repo/ui/components/typography';
import { cn } from '@repo/ui/lib/cn';
import { Flex } from '@repo/ui/src/layout/flex';
import { useTranslations } from 'next-intl';
import { useCallback, useRef, useState } from 'react';
import { LocaleSwitcher } from '../common/locale-switcher';
import { Logo } from '../common/logo';
import { ThemeToggle } from '../common/theme-toggle';

export function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations();
  const pathname = usePathname();

  const docsNavigation = t.raw('docs.navigation') as DocSection[];
  const navigation = t.raw('ui.navigation') as Navigation[];
  const elementsMenu = t.raw('ui.elementsMenu') as { items: Navigation[] };
  const resourcesMenu = t.raw('ui.resourcesMenu') as {
    label: string;
    badge: string;
    items: { title: string; description: string }[];
  };
  const menuLinks = [...elementsMenu.items, ...navigation];

  const menuRef = useRef<HTMLElement>(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  useLockBodyScroll(isMenuOpen);
  useDialogBehavior({ open: isMenuOpen, onClose: closeMenu, ref: menuRef });

  // The 56px row matches the desktop navbar, so the header is one known height
  // at every breakpoint and the sticky offsets below it line up.
  return (
    <div className="relative flex h-14 w-full items-center justify-between lg:hidden">
      <Flex gap="3" align="center">
        <Link href="/" aria-label="NachUI home">
          <Logo />
        </Link>
        <Separator orientation="vertical" className="h-4" />
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={toggleMenu}
          title={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <HugeiconsIcon icon={PanelLeftIcon} aria-hidden="true" />
        </Button>
      </Flex>
      <div className="flex items-center gap-x-5">
        <Searcher />
        <LocaleSwitcher />
      </div>
      <nav
        ref={menuRef}
        id="mobile-menu"
        aria-label="Site"
        tabIndex={-1}
        inert={!isMenuOpen}
        className={cn(
          'bg-background fixed z-50 flex flex-col overflow-hidden shadow-2xl transition-all duration-300',
          'border-rule inset-0 h-lvh w-full sm:inset-2 sm:h-[calc(100svh-1rem)] sm:w-95 sm:rounded-lg sm:border',
          isMenuOpen
            ? 'translate-x-0'
            : '-translate-x-full opacity-0 sm:translate-x-[calc(-90%-2rem)]',
        )}
      >
        <div className="border-rule flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-x-3">
            <Link href="/" onClick={toggleMenu} aria-label="NachUI home">
              <Logo withText />
            </Link>
          </div>
          <div className="flex items-center gap-x-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              data-autofocus
              onClick={toggleMenu}
              title="Close menu"
              aria-label="Close menu"
              aria-expanded={isMenuOpen}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={20} aria-hidden="true" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {menuLinks.length > 0 && (
            <div className="mb-8">
              <Typography className="text-muted-foreground mb-2 px-2.5 text-xs">Menu</Typography>
              <ul>
                {menuLinks.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={toggleMenu}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors',
                          isActive
                            ? 'bg-card text-foreground font-medium'
                            : 'text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {item.title}
                        <NavBadge badge={item.badge} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          <div className="mb-8">
            <Typography className="text-muted-foreground mb-2 px-2.5 text-xs">
              {resourcesMenu.label}
            </Typography>
            <ul>
              {resourcesMenu.items.map((item) => (
                <li
                  key={item.title}
                  className="text-muted-foreground flex items-center gap-2 px-2.5 py-1.5 text-sm opacity-60"
                >
                  {item.title}
                  <Badge variant="outline" className="text-[10px]">
                    {resourcesMenu.badge}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
          {docsNavigation.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-8 last:mb-0">
              <Typography className="text-muted-foreground mb-2 px-2.5 text-xs">
                {section.title}
              </Typography>
              <ul>
                {section.items.map((item, itemIndex) => {
                  const isActive = pathname === item.href;

                  return (
                    <li key={itemIndex}>
                      <Link
                        href={item.href}
                        onClick={toggleMenu}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors',
                          isActive
                            ? 'bg-card text-foreground font-medium'
                            : 'text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {item.title}
                        <NavBadge badge={item.badge} />
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
