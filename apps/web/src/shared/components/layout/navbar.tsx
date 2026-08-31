'use client';

import { AskAiButton } from '@/features/chat/ui/ask-ai-button';
import { Searcher } from '@/features/docs/components/searcher';
import { Link, usePathname } from '@/i18n/navigation';
import type { Navigation } from '@/lib/definitions';
import {
  DashboardSquare01Icon,
  File01Icon,
  Layout01Icon,
  PackageIcon,
  PuzzleIcon,
  ServerStack01Icon,
  SparklesIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Badge } from '@repo/ui/components/badge';
import { NavigationMenu } from '@repo/ui/components/navigation-menu';
import { Separator } from '@repo/ui/components/separator';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';
import { GitHubLink } from '../common/github-link';
import { LocaleSwitcher } from '../common/locale-switcher';
import { Logo } from '../common/logo';
import { ThemeToggle } from '../common/theme-toggle';

type ElementsMenu = {
  label: string;
  items: { title: string; description: string; href: string }[];
  comingSoon?: { title: string; description: string; badge: string };
};

type ResourcesMenu = {
  label: string;
  badge: string;
  items: { title: string; description: string }[];
};

const RESOURCE_ICONS = [File01Icon, ServerStack01Icon, SparklesIcon];

function ComingSoonRow({
  title,
  description,
  badge,
  icon,
}: {
  title: string;
  description: string;
  badge: string;
  icon: typeof SparklesIcon;
}) {
  return (
    <div className="flex cursor-default items-start gap-3 rounded-md px-2.5 py-2.5 opacity-60">
      <span className="border-border bg-background text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md border border-dashed">
        <HugeiconsIcon icon={icon} size={16} strokeWidth={1.6} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className="text-foreground text-sm font-medium">{title}</span>
          <Badge variant="outline" className="text-[10px]">
            {badge}
          </Badge>
        </span>
        <span className="text-muted-foreground mt-0.5 block truncate text-xs">{description}</span>
      </span>
    </div>
  );
}

const ELEMENT_ICONS = [DashboardSquare01Icon, Layout01Icon, PuzzleIcon, PackageIcon];

export function Navbar() {
  const t = useTranslations('ui');
  const navigation: Navigation[] = t.raw('navigation');
  const elementsMenu: ElementsMenu = t.raw('elementsMenu');
  const resourcesMenu: ResourcesMenu = t.raw('resourcesMenu');
  const pathname = usePathname();

  const isElementsActive =
    pathname.startsWith('/docs/elements') ||
    pathname.startsWith('/components') ||
    pathname.startsWith('/bricks');

  return (
    <div>
      <div className="relative z-50 hidden w-full lg:flex">
        <div className="flex h-14 w-full items-stretch">
          {/* Brand + search segment: mirrors the docs sidebar column (260px) so
              its right rule joins the sidebar's border on docs pages. */}
          <div className="flex w-65 shrink-0 items-center justify-between border-r pr-3">
            <Link
              href="/"
              className="group/brand focus-visible:ring-ring rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              aria-label="NachUI home"
            >
              <Logo
                withText
                priority
                imageClassName="transition-transform duration-300 ease-out group-hover/brand:scale-110 group-hover/brand:-rotate-12 group-hover/brand:shadow-md motion-reduce:transform-none"
              />
            </Link>
            <Searcher variant="icon" />
          </div>
          <NavigationMenu className="pl-8" aria-label="Main navigation">
            <NavigationMenu.Item className="flex items-center self-stretch">
              <NavigationMenu.Trigger
                className={cn('text-sm', isElementsActive && 'text-foreground')}
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
                  <ComingSoonRow
                    title={elementsMenu.comingSoon.title}
                    description={elementsMenu.comingSoon.description}
                    badge={elementsMenu.comingSoon.badge}
                    icon={SparklesIcon}
                  />
                )}
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item className="flex items-center self-stretch">
              <NavigationMenu.Trigger className="text-sm">
                {resourcesMenu.label}
              </NavigationMenu.Trigger>
              <NavigationMenu.Content>
                {resourcesMenu.items.map((item, index) => (
                  <ComingSoonRow
                    key={item.title}
                    title={item.title}
                    description={item.description}
                    badge={resourcesMenu.badge}
                    icon={RESOURCE_ICONS[index] ?? SparklesIcon}
                  />
                ))}
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.target}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'focus-visible:ring-ring rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </NavigationMenu>
          <div className="ml-auto flex items-center gap-3">
            <AskAiButton />
            <Separator orientation="vertical" className="h-4" />
            <GitHubLink />
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
