'use client';

import { useCallback, useEffect, useState } from 'react';
import { GitHubIcon } from '@/components/common/github-icon';
import { LocaleSwitcher } from '@/components/common/locale-switcher';
import { Logo } from '@/components/common/logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { useChatStore } from '@/features/chat/store/chat-store';
import { MobileMenuPanel } from '@/features/docs/components/mobile-menu';
import { Searcher } from '@/features/docs/components/searcher';
import type { SidebarPreview } from '@/features/docs/lib/sidebar-previews';
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

/**
 * Lets a control outside the header open the search dialog it owns, like the
 * sidebar of a component page, where the header itself is hidden.
 */
export const OPEN_SEARCH_EVENT = 'nachui:open-search';

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

/**
 * Every floating piece of the header shares this surface. The header itself is
 * transparent and lets clicks through, so only the pills take the pointer.
 */
const pill =
  'bg-popover text-popover-foreground border-border pointer-events-auto flex h-11 items-center rounded-full border shadow-md';

const focusRing =
  'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none';

const roundButton = cn(
  'text-muted-foreground hover:text-foreground hover:bg-muted inline-flex size-8 items-center justify-center rounded-full transition-colors',
  focusRing,
);

interface SiteHeaderProps {
  /** The first demo of every doc page, for the search preview. */
  previews?: Record<string, SidebarPreview>;
}

export function SiteHeader({ previews }: SiteHeaderProps) {
  const t = useTranslations('ui');
  const tSearch = useTranslations('components.searcher');
  const pathname = usePathname();
  const modKey = useModKeyLabel();
  const openChat = useChatStore((state) => state.openChat);

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const open = () => setSearchOpen(true);
    window.addEventListener(OPEN_SEARCH_EVENT, open);
    return () => window.removeEventListener(OPEN_SEARCH_EVENT, open);
  }, []);

  const tabs = (t.raw('header.tabs') as NavItem[]).filter(
    (item) => !isHiddenProductLink(item.href),
  );
  const activeTab = findActiveTab(tabs, pathname);

  return (
    <>
      <header data-site-header className="site-header pointer-events-none sticky top-0 z-40">
        <div className="page-frame-outer">
          <div className="page-frame">
            <div className="hidden h-(--site-header-height) items-center justify-center gap-2 lg:flex">
              <Link
                href="/"
                aria-label={t('header.homeLink')}
                className={cn(pill, focusRing, 'ps-2.5 pe-4')}
              >
                <Logo withText size={20} />
              </Link>

              <nav aria-label={t('header.sections')} className={cn(pill, 'gap-0.5 px-1')}>
                {tabs.map((tab) => {
                  const active = tab.href === activeTab;
                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex h-8.5 items-center rounded-full px-3 text-sm whitespace-nowrap transition-colors',
                        focusRing,
                        active
                          ? 'bg-secondary text-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                      )}
                    >
                      {tab.title}
                    </Link>
                  );
                })}
              </nav>

              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={cn(
                  pill,
                  focusRing,
                  'text-muted-foreground hover:border-border-interactive gap-2 ps-3.5 pe-2 text-[13px] transition-colors 2xl:w-64',
                )}
              >
                <SearchIcon size={15} aria-hidden="true" />
                <span className="sr-only 2xl:not-sr-only 2xl:flex-1 2xl:truncate 2xl:text-start">
                  {tSearch('placeholder')}
                </span>
                <span className="flex items-center gap-0.5" aria-hidden="true">
                  <Kbd size="sm">{modKey}</Kbd>
                  <Kbd size="sm">K</Kbd>
                </span>
              </button>

              <button
                type="button"
                onClick={openChat}
                className={cn(
                  'bg-primary text-primary-foreground hover:bg-primary/90 pointer-events-auto inline-flex h-11 items-center gap-2 rounded-full px-4 text-[13px] font-medium whitespace-nowrap shadow-md transition-colors',
                  focusRing,
                )}
              >
                <SparklesIcon size={15} aria-hidden="true" />
                {t('header.ask')}
              </button>

              <div className={cn(pill, 'gap-0.5 px-1.5')}>
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t('header.github')}
                  className={roundButton}
                >
                  <GitHubIcon size={16} />
                </a>
                <ThemeToggle />
                <LocaleSwitcher />
              </div>
            </div>

            <div className="flex h-(--site-header-height) items-center gap-2 lg:hidden">
              <Link
                href="/"
                aria-label={t('header.homeLink')}
                className={cn(pill, focusRing, 'me-auto ps-2.5 pe-4')}
              >
                <Logo withText size={20} />
              </Link>
              <div className={cn(pill, 'px-0')}>
                <button
                  type="button"
                  aria-label={tSearch('label')}
                  onClick={() => setSearchOpen(true)}
                  className={cn(roundButton, 'size-11')}
                >
                  <SearchIcon size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={t('header.ask')}
                  onClick={openChat}
                  className={cn(roundButton, 'size-11')}
                >
                  <SparklesIcon size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={t('header.menu')}
                  aria-haspopup="dialog"
                  aria-expanded={menuOpen}
                  aria-controls="mobile-menu"
                  onClick={() => setMenuOpen((previous) => !previous)}
                  className={cn(roundButton, 'text-foreground size-11')}
                >
                  <MenuIcon size={19} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <Searcher open={searchOpen} onOpenChange={setSearchOpen} previews={previews} />
      <MobileMenuPanel open={menuOpen} onClose={closeMenu} />
    </>
  );
}
