'use client';

import { Searcher } from '@/features/docs/components/searcher';
import { Link, usePathname } from '@/i18n/navigation';
import type { Navigation } from '@/lib/definitions';
import { DashboardSquare01Icon, Layout01Icon, SparklesIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Badge } from '@repo/ui/components/badge';
import { NavigationMenu } from '@repo/ui/components/navigation-menu';
import { Separator } from '@repo/ui/components/separator';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { LocaleSwitcher } from '../common/locale-switcher';
import { ThemeToggle } from '../common/theme-toggle';

type ElementsMenu = {
  label: string;
  items: { title: string; description: string; href: string }[];
  comingSoon?: { title: string; description: string; badge: string };
};

const ELEMENT_ICONS = [DashboardSquare01Icon, Layout01Icon];

export function Navbar() {
  const t = useTranslations('ui');
  const navigation: Navigation[] = t.raw('navigation');
  const elementsMenu: ElementsMenu = t.raw('elementsMenu');
  const pathname = usePathname();

  const isElementsActive = pathname.startsWith('/docs/elements');

  return (
    <div>
      <div className="relative z-50 hidden w-full lg:flex">
        <div className="flex h-14 w-full items-stretch">
          {/* Brand + search segment: mirrors the docs sidebar column (260px) so
              its right rule joins the sidebar's border on docs pages. */}
          <div className="flex w-65 shrink-0 items-center justify-between border-r pr-3">
            <Link
              href="/"
              className="focus-visible:ring-ring flex items-center gap-2.5 rounded-md transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              aria-label="NachUI home"
            >
              <Image
                src="/icon-192.png"
                alt=""
                width={28}
                height={28}
                priority
                className="rounded-md"
              />
              <span className="text-foreground font-mono text-sm font-medium">NachUI</span>
            </Link>
            <Searcher variant="icon" />
          </div>
          <NavigationMenu className="pl-8" aria-label="Main navigation">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const link = (
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

              if (item.href !== '/docs') return link;

              return (
                <div key={item.href} className="contents">
                  {link}
                  <NavigationMenu.Item className="flex items-center self-stretch">
                    <NavigationMenu.Trigger
                      className={cn('font-mono text-xs', isElementsActive && 'text-foreground')}
                    >
                      {elementsMenu.label}
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content>
                      {elementsMenu.items.map((menuItem, index) => (
                        <NavigationMenu.Link
                          key={menuItem.href}
                          asChild
                          title={menuItem.title}
                          description={menuItem.description}
                          icon={
                            <HugeiconsIcon
                              icon={ELEMENT_ICONS[index] ?? DashboardSquare01Icon}
                              size={16}
                              strokeWidth={1.6}
                              aria-hidden="true"
                            />
                          }
                        >
                          <Link href={menuItem.href} />
                        </NavigationMenu.Link>
                      ))}
                      {elementsMenu.comingSoon && (
                        <div className="flex cursor-default items-start gap-3 rounded-md px-2.5 py-2.5 opacity-60">
                          <span className="border-border bg-background text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md border border-dashed">
                            <HugeiconsIcon
                              icon={SparklesIcon}
                              size={16}
                              strokeWidth={1.6}
                              aria-hidden="true"
                            />
                          </span>
                          <span className="min-w-0">
                            <span className="flex items-center gap-2">
                              <span className="text-foreground text-sm font-medium">
                                {elementsMenu.comingSoon.title}
                              </span>
                              <Badge variant="outline" className="text-[10px]">
                                {elementsMenu.comingSoon.badge}
                              </Badge>
                            </span>
                            <span className="text-muted-foreground mt-0.5 block truncate text-xs">
                              {elementsMenu.comingSoon.description}
                            </span>
                          </span>
                        </div>
                      )}
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>
                </div>
              );
            })}
          </NavigationMenu>
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
