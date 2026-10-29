'use client';

import { useCallback, useState } from 'react';
import { GitHubIcon } from '@/components/common/github-icon';
import { LocaleSwitcher } from '@/components/common/locale-switcher';
import { Logo } from '@/components/common/logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { useChatStore } from '@/features/chat/store/chat-store';
import { MobileMenuPanel } from '@/features/docs/components/mobile-menu';
import { Searcher } from '@/features/docs/components/searcher';
import { useModKeyLabel } from '@/hooks/use-kbd-shortcut';
import { Link, usePathname } from '@/i18n/navigation';
import { GITHUB_REPO_URL } from '@/lib/domains';
import { isHiddenProductLink } from '@/lib/hidden-product-links';
import { Kbd } from '@repo/ui/components/kbd';
import { MenuIcon } from '@repo/ui/icons/menu';
import { SearchIcon } from '@repo/ui/icons/search';
import { SparklesIcon } from '@repo/ui/icons/sparkles';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';

type NavItem = { title: string; href: string };

/** Docs tabs match on their full path; anything else matches its whole top-level section. */
function tabRoot(href: string) {
  return href.startsWith('/docs') ? href : `/${href.split('/')[1] ?? ''}`;
}

function findActiveTab(tabs: NavItem[], pathname: string) {
  let best: NavItem | undefined;
  for (const tab of tabs) {
    const root = tabRoot(tab.href);
    const matches = pathname === root || pathname.startsWith(`${root}/`);
    if (matches && (!best || root.length > tabRoot(best.href).length)) best = tab;
  }
  return best?.href;
}

export function SiteHeader() {
  const t = useTranslations('ui');
  const tSearch = useTranslations('components.searcher');
  const pathname = usePathname();
  const modKey = useModKeyLabel();
  const openChat = useChatStore((state) => state.openChat);

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const tabs = (t.raw('header.tabs') as NavItem[]).filter(
    (item) => !isHiddenProductLink(item.href),
  );
  const activeTab = findActiveTab(tabs, pathname);

  const iconButton =
    'text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring inline-flex size-11 items-center justify-center rounded-md focus-visible:ring-2 focus-visible:outline-none';

  return (
    <>
      <header data-site-header className="site-header border-rule sticky top-0 z-40 border-b">
        <div className="page-frame-outer">
          <div className="page-frame">
            <div className="hidden h-14 items-center gap-4 lg:flex">
              <Link
                href="/"
                aria-label={t('header.homeLink')}
                className="focus-visible:ring-ring flex shrink-0 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <Logo withText priority />
              </Link>
              <span className="bg-border h-5 w-px shrink-0" aria-hidden="true" />
              <nav aria-label={t('header.sections')} className="flex items-center gap-0.5">
                {tabs.map((tab) => {
                  const active = tab.href === activeTab;
                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'focus-visible:ring-ring flex h-8 items-center rounded-md px-2.5 text-sm whitespace-nowrap focus-visible:ring-2 focus-visible:outline-none',
                        active
                          ? 'bg-muted text-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {tab.title}
                    </Link>
                  );
                })}
              </nav>
              <div className="ml-auto flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="border-input bg-card text-muted-foreground hover:border-border-interactive focus-visible:ring-ring dark:bg-input/30 flex h-8 w-48 items-center gap-2 rounded-md border pr-1.5 pl-2.5 text-[13px] focus-visible:ring-2 focus-visible:outline-none xl:w-[22rem]"
                >
                  <SearchIcon size={14} aria-hidden="true" />
                  <span className="flex-1 truncate text-left xl:hidden">
                    {tSearch('placeholder')}
                  </span>
                  <span className="hidden flex-1 truncate text-left xl:inline">
                    {t('header.searchPlaceholder')}
                  </span>
                  <span className="flex items-center gap-0.5" aria-hidden="true">
                    <Kbd size="sm">{modKey}</Kbd>
                    <Kbd size="sm">K</Kbd>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={openChat}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring ring-offset-background inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[13px] font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <SparklesIcon size={14} aria-hidden="true" />
                  {t('header.ask')}
                </button>
                <span className="bg-border h-5 w-px" aria-hidden="true" />
                <div className="flex items-center gap-0.5">
                  <a
                    href={GITHUB_REPO_URL}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={t('header.github')}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring inline-flex size-8 items-center justify-center rounded-md focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <GitHubIcon size={16} />
                  </a>
                  <ThemeToggle />
                  <LocaleSwitcher />
                </div>
              </div>
            </div>

            <div className="flex h-14 items-center gap-3 lg:hidden">
              <Link
                href="/"
                aria-label={t('header.homeLink')}
                className="focus-visible:ring-ring flex shrink-0 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <Logo withText />
              </Link>
              <div className="hidden min-w-0 flex-1 justify-center md:flex">
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="border-input bg-card text-muted-foreground hover:border-border-interactive focus-visible:ring-ring dark:bg-input/30 flex h-9 w-full max-w-sm items-center gap-2 rounded-md border pr-1.5 pl-2.5 text-[13px] focus-visible:ring-2 focus-visible:outline-none"
                >
                  <SearchIcon size={14} aria-hidden="true" />
                  <span className="flex-1 truncate text-left">{t('header.searchPlaceholder')}</span>
                  <span className="flex items-center gap-0.5" aria-hidden="true">
                    <Kbd size="sm">{modKey}</Kbd>
                    <Kbd size="sm">K</Kbd>
                  </span>
                </button>
              </div>
              <div className="ml-auto flex shrink-0 items-center gap-0.5 md:ml-0">
                <button
                  type="button"
                  aria-label={tSearch('label')}
                  onClick={() => setSearchOpen(true)}
                  className={cn(iconButton, 'md:hidden')}
                >
                  <SearchIcon size={19} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={t('header.ask')}
                  onClick={openChat}
                  className={iconButton}
                >
                  <SparklesIcon size={18} aria-hidden="true" />
                </button>
                <span className="bg-border mx-1 h-5 w-px" aria-hidden="true" />
                <button
                  type="button"
                  aria-label={t('header.menu')}
                  aria-haspopup="dialog"
                  aria-expanded={menuOpen}
                  aria-controls="mobile-menu"
                  onClick={() => setMenuOpen((previous) => !previous)}
                  className={cn(iconButton, 'text-foreground')}
                >
                  <MenuIcon size={20} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <Searcher open={searchOpen} onOpenChange={setSearchOpen} />
      <MobileMenuPanel open={menuOpen} onClose={closeMenu} />
    </>
  );
}
