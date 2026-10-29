'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { GitHubIcon } from '@/components/common/github-icon';
import { LocaleSwitcher } from '@/components/common/locale-switcher';
import { Logo } from '@/components/common/logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { useChatStore } from '@/features/chat/store/chat-store';
import { MobileMenuPanel } from '@/features/docs/components/mobile-menu';
import { Searcher } from '@/features/docs/components/searcher';
import { useModKeyLabel } from '@/hooks/use-kbd-shortcut';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Link, usePathname } from '@/i18n/navigation';
import { GITHUB_REPO_URL } from '@/lib/domains';
import { isHiddenProductLink } from '@/lib/hidden-product-links';
import { Button } from '@repo/ui/components/button';
import { Kbd } from '@repo/ui/components/kbd';
import { MenuIcon } from '@repo/ui/icons/menu';
import { SearchIcon } from '@repo/ui/icons/search';
import { SparklesIcon } from '@repo/ui/icons/sparkles';
import { cn } from '@repo/ui/lib/cn';
import { springs, still } from '@repo/ui/lib/motion';
import { motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';

type NavItem = { title: string; href: string };

/** Scroll distance before the top row may hide, so short scrolls near the top never move it. */
const COLLAPSE_AFTER = 96;
/** Movement smaller than this is ignored, which keeps trackpad jitter from toggling the row. */
const SCROLL_DELTA = 6;

/**
 * Below lg, hides the top row while the user scrolls down and brings it back as
 * soon as they scroll up. `locked` keeps it expanded, for example while a menu
 * is open or on desktop, where the header is a single fixed row.
 */
function useHeaderCollapse(locked: boolean) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (locked) return;
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      if (y < COLLAPSE_AFTER) {
        setCollapsed(false);
        lastY = y;
      } else if (Math.abs(delta) > SCROLL_DELTA) {
        setCollapsed(delta > 0);
        lastY = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [locked]);

  return collapsed && !locked;
}

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
  const reduceMotion = useReducedMotion();
  const openChat = useChatStore((state) => state.openChat);

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const collapsed = useHeaderCollapse(menuOpen || searchOpen || isDesktop);

  const tabs = (t.raw('header.tabs') as NavItem[]).filter(
    (item) => !isHiddenProductLink(item.href),
  );
  const activeTab = findActiveTab(tabs, pathname);

  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strip = tabsRef.current;
    const current = strip?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!strip || !current) return;
    const start = current.offsetLeft;
    const end = start + current.offsetWidth;
    const visibleEnd = strip.scrollLeft + strip.clientWidth * 0.85;
    if (start < strip.scrollLeft) strip.scrollTo({ left: start, behavior: 'instant' });
    else if (end > visibleEnd) {
      strip.scrollTo({ left: end - strip.clientWidth * 0.85, behavior: 'instant' });
    }
  }, [activeTab]);

  const askButton = (
    <Button
      variant="ghost"
      size="icon"
      className="size-11 rounded-full"
      aria-label={t('header.ask')}
      onClick={openChat}
    >
      <SparklesIcon size={19} aria-hidden="true" />
    </Button>
  );

  const menuButton = (
    <Button
      variant="ghost"
      size="icon"
      className="size-11 rounded-full"
      aria-label={t('header.menu')}
      aria-haspopup="dialog"
      aria-expanded={menuOpen}
      aria-controls="mobile-menu"
      onClick={() => setMenuOpen((previous) => !previous)}
    >
      <MenuIcon size={20} aria-hidden="true" />
    </Button>
  );

  return (
    <>
      <header
        data-site-header
        data-collapsed={collapsed}
        className={cn(
          'site-header border-rule sticky top-0 z-40 border-b motion-reduce:transition-none max-lg:transition-transform max-lg:duration-300 max-lg:ease-out',
          collapsed && 'max-lg:-translate-y-14',
        )}
      >
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

            <div className="lg:hidden">
              <div
                inert={collapsed}
                className={cn(
                  'flex h-14 items-center gap-4 transition-opacity duration-200 motion-reduce:transition-none',
                  collapsed && 'opacity-0',
                )}
              >
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
                    className="border-input bg-card text-muted-foreground hover:border-border-interactive focus-visible:ring-ring dark:bg-input/30 flex h-9 w-full max-w-md items-center gap-2.5 rounded-md border pr-1.5 pl-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <SearchIcon size={15} aria-hidden="true" />
                    <span className="flex-1 truncate text-left">
                      {t('header.searchPlaceholder')}
                    </span>
                    <span className="flex items-center gap-0.5" aria-hidden="true">
                      <Kbd size="sm">{modKey}</Kbd>
                      <Kbd size="sm">K</Kbd>
                    </span>
                  </button>
                </div>
                <div className="ml-auto flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-11 rounded-full md:hidden"
                    aria-label={tSearch('label')}
                    onClick={() => setSearchOpen(true)}
                  >
                    <SearchIcon size={20} aria-hidden="true" />
                  </Button>
                  {askButton}
                  {menuButton}
                </div>
              </div>

              <div className="flex h-11 items-stretch">
                <Link
                  href="/"
                  aria-label={t('header.homeLink')}
                  inert={!collapsed}
                  className={cn(
                    'border-rule flex shrink-0 items-center overflow-hidden transition-[width,opacity,margin] duration-300 motion-reduce:transition-none',
                    collapsed
                      ? 'mr-2 w-10 border-r opacity-100'
                      : 'pointer-events-none w-0 opacity-0',
                  )}
                >
                  <Logo size={22} imageClassName="rounded-[5px]" />
                </Link>
                <nav
                  aria-label={t('header.sections')}
                  className="relative min-w-0 flex-1 mask-[linear-gradient(90deg,black_85%,transparent)]"
                >
                  <div
                    ref={tabsRef}
                    className="hide-scrollbar relative flex h-full overflow-x-auto"
                  >
                    {tabs.map((tab) => {
                      const active = tab.href === activeTab;
                      return (
                        <Link
                          key={tab.href}
                          href={tab.href}
                          aria-current={active ? 'page' : undefined}
                          className={cn(
                            'focus-visible:ring-ring relative flex shrink-0 items-center px-2.5 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
                            active
                              ? 'text-foreground'
                              : 'text-muted-foreground hover:text-foreground',
                          )}
                        >
                          {tab.title}
                          {active && (
                            <motion.span
                              layoutId="site-header-tab"
                              transition={reduceMotion ? still : springs.smooth}
                              className="bg-foreground absolute inset-x-2.5 bottom-0 h-0.5 rounded-full"
                            />
                          )}
                        </Link>
                      );
                    })}
                    <span className="w-8 shrink-0" aria-hidden="true" />
                  </div>
                </nav>
                {collapsed && (
                  <div className="ml-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setSearchOpen(true)}
                      aria-label={tSearch('label')}
                      className="border-input bg-card text-muted-foreground hover:text-foreground focus-visible:ring-ring dark:bg-input/30 hidden h-7 items-center gap-1.5 rounded-sm border px-2 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none md:flex"
                    >
                      <SearchIcon size={13} aria-hidden="true" />
                      <span className="font-mono text-[11px]">{modKey} K</span>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-10 rounded-full md:hidden"
                      aria-label={tSearch('label')}
                      onClick={() => setSearchOpen(true)}
                    >
                      <SearchIcon size={18} aria-hidden="true" />
                    </Button>
                    {askButton}
                    {menuButton}
                  </div>
                )}
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
