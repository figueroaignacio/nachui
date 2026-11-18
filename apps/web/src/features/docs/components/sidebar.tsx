'use client';

import { LocaleSwitcher } from '@/components/common/locale-switcher';
import { Logo } from '@/components/common/logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { useChatStore } from '@/features/chat/store/chat-store';
import { OPEN_SEARCH_EVENT } from '@/features/shell/components/site-header';
import { Link, usePathname } from '@/i18n/navigation';
import type { DocItem, DocSection } from '@/lib/definitions';
import { getDocsSections } from '@/lib/docs-navigation';
import { ChevronRightIcon } from '@repo/ui/icons/chevron-right';
import { LayoutGridIcon } from '@repo/ui/icons/layout-grid';
import { SearchIcon } from '@repo/ui/icons/search';
import { SparklesIcon } from '@repo/ui/icons/sparkles';
import { cn } from '@repo/ui/lib/cn';
import { AnimatePresence } from 'motion/react';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { revealActiveLink, sectionOf } from '../lib/section-filters';
import type { SidebarPreview as SidebarPreviewData } from '../lib/sidebar-previews';
import { SidebarPreview } from './sidebar-preview';

const PREVIEW_OPEN_DELAY = 350;
const PREVIEW_CLOSE_DELAY = 150;

const iconButton =
  'text-muted-foreground hover:text-foreground hover:bg-secondary focus-visible:ring-ring inline-flex size-9.5 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none';
const sectionRow =
  'text-foreground hover:bg-secondary focus-visible:ring-ring flex h-11 items-center rounded-md px-2.5 text-base font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset';

interface SidebarProps {
  previews?: Record<string, SidebarPreviewData>;
}

interface HoveredItem {
  item: DocItem;
  preview: SidebarPreviewData;
  rect: DOMRect;
  edge: number;
}

export function Sidebar({ previews = {} }: SidebarProps) {
  const pathname = usePathname();
  const [hovered, setHovered] = React.useState<HoveredItem | null>(null);
  const previewTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPreviewOpen = React.useRef(false);
  const navRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    isPreviewOpen.current = hovered !== null;
  }, [hovered]);

  const clearPreviewTimer = React.useCallback(() => {
    if (previewTimer.current) clearTimeout(previewTimer.current);
    previewTimer.current = null;
  }, []);

  const showPreview = React.useCallback(
    (item: DocItem, rect: DOMRect) => {
      const preview = previews[item.href];
      const nav = navRef.current;
      clearPreviewTimer();
      if (!preview || !nav) {
        previewTimer.current = setTimeout(() => setHovered(null), PREVIEW_CLOSE_DELAY);
        return;
      }
      const next = { item, preview, rect, edge: nav.getBoundingClientRect().right };
      if (isPreviewOpen.current) {
        setHovered(next);
        return;
      }
      previewTimer.current = setTimeout(() => setHovered(next), PREVIEW_OPEN_DELAY);
    },
    [previews, clearPreviewTimer],
  );

  const hidePreview = React.useCallback(() => {
    clearPreviewTimer();
    previewTimer.current = setTimeout(() => setHovered(null), PREVIEW_CLOSE_DELAY);
  }, [clearPreviewTimer]);

  React.useEffect(() => clearPreviewTimer, [pathname, clearPreviewTimer]);

  const t = useTranslations('docs');
  const tHeader = useTranslations('ui.header');
  const tBadges = useTranslations('docs.badges');
  const openChat = useChatStore((state) => state.openChat);
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    if (collapsed) document.body.dataset.docsSidebar = 'collapsed';
    else delete document.body.dataset.docsSidebar;
    return () => {
      delete document.body.dataset.docsSidebar;
    };
  }, [collapsed]);

  const [drawer, setDrawer] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(true);

  React.useEffect(() => {
    const query = window.matchMedia('(min-width: 64rem)');
    const sync = () => {
      setIsDesktop(query.matches);
      if (query.matches) setDrawer(false);
    };
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  React.useEffect(() => {
    if (drawer) document.body.dataset.docsDrawer = 'open';
    else delete document.body.dataset.docsDrawer;
    return () => {
      delete document.body.dataset.docsDrawer;
    };
  }, [drawer]);

  React.useEffect(() => {
    if (!drawer) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawer(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [drawer]);

  const toggleSidebar = () => {
    if (window.matchMedia('(min-width: 64rem)').matches) setCollapsed((current) => !current);
    else setDrawer((current) => !current);
  };
  const docsNavigation = getDocsSections(t);

  const current = React.useMemo(
    () => sectionOf(docsNavigation, pathname),
    [docsNavigation, pathname],
  );
  const [openSection, setOpenSection] = React.useState<string | null>(current);
  const [renderedPath, setRenderedPath] = React.useState(pathname);

  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setOpenSection(current);
    setHovered(null);
    setDrawer(false);
  }
  React.useEffect(() => {
    const nav = navRef.current;
    if (nav) revealActiveLink(nav, 0, 0.85);
  }, [current, pathname]);

  React.useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const close = () => {
      clearPreviewTimer();
      setHovered(null);
    };
    nav.addEventListener('scroll', close, { passive: true });
    return () => nav.removeEventListener('scroll', close);
  }, [clearPreviewTimer]);

  return (
    <aside className="hidden lg:block">
      <div data-sidebar-backdrop aria-hidden="true" onClick={() => setDrawer(false)} />
      <div
        data-sidebar-rail
        className="sticky top-[calc(var(--site-header-height)+2.5rem)] grid h-[calc(100vh-var(--site-header-height)-4.5rem)] gap-3"
      >
        <div data-sidebar-head className="flex items-center gap-2">
          <button
            type="button"
            aria-label={t('sidebar.toggle')}
            aria-expanded={isDesktop ? !collapsed : drawer}
            onClick={toggleSidebar}
            className="bg-secondary text-muted-strong hover:text-foreground focus-visible:ring-ring inline-flex size-9.5 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <line
                x1="9"
                y1="4"
                x2="9"
                y2="20"
                className={cn(!collapsed && 'lg:hidden', drawer && 'max-lg:hidden')}
              />
              <path
                d="M5 4h4v16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
                fill="currentColor"
                className={cn(collapsed && 'lg:hidden', !drawer && 'max-lg:hidden')}
              />
            </svg>
          </button>
          <div data-sidebar-extra className="flex min-w-0 flex-1 items-center gap-1">
            <Link
              href="/"
              aria-label={tHeader('homeLink')}
              className="text-foreground focus-visible:ring-ring flex min-w-0 items-center gap-2.5 rounded-sm ps-1 text-[17px] font-semibold tracking-tight focus-visible:ring-2 focus-visible:outline-none"
            >
              <Logo size={22} />
              NachUI
            </Link>
            <button
              type="button"
              aria-label={tHeader('search')}
              title={tHeader('search')}
              onClick={() => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT))}
              className={cn(iconButton, 'ms-auto')}
            >
              <SearchIcon size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <nav
          ref={navRef}
          data-sidebar-nav
          className="hide-scrollbar relative flex min-h-0 flex-col gap-1 overflow-y-scroll mask-[linear-gradient(180deg,black_94%,transparent)] pb-6"
        >
          <Link
            href="/components"
            aria-current={pathname === '/components' ? 'page' : undefined}
            className={cn(sectionRow, 'gap-2.5')}
          >
            <LayoutGridIcon size={17} aria-hidden="true" className="text-muted-foreground" />
            {t('sidebar.catalog')}
          </Link>
          {docsNavigation.map((section: DocSection) => {
            const isOpen = openSection === section.id;
            const panelId = `docs-sidebar-${section.id}`;
            return (
              <div key={section.id} data-section={section.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenSection(isOpen ? null : section.id)}
                  className={cn(sectionRow, 'w-full cursor-pointer gap-2.5 text-start')}
                >
                  <span className="min-w-0 flex-1 truncate">{section.title}</span>
                  <span className="text-muted-foreground font-mono text-xs font-normal tabular-nums">
                    {section.items.length}
                  </span>
                  <ChevronRightIcon
                    size={16}
                    aria-hidden="true"
                    className={cn(
                      'text-muted-foreground transition-transform duration-200 motion-reduce:transition-none rtl:-scale-x-100',
                      isOpen && 'rotate-90 rtl:rotate-90',
                    )}
                  />
                </button>
                <div
                  id={panelId}
                  inert={!isOpen}
                  className={cn(
                    'grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <ul className="flex min-h-0 flex-col gap-0.5 overflow-hidden">
                    {section.items.map((item: DocItem) => {
                      const isActive = pathname === item.href;
                      return (
                        <li key={item.href} className="last:pb-2">
                          <Link
                            href={item.href}
                            target={item.target}
                            rel={item.target ? 'noopener noreferrer' : undefined}
                            aria-current={isActive ? 'page' : undefined}
                            onPointerEnter={(event) => {
                              if (event.pointerType !== 'mouse') return;
                              showPreview(item, event.currentTarget.getBoundingClientRect());
                            }}
                            onPointerLeave={hidePreview}
                            onClick={() => {
                              clearPreviewTimer();
                              setHovered(null);
                            }}
                            className={cn(
                              'focus-visible:ring-ring flex h-9.5 items-center gap-2.5 rounded-md px-2.5 text-[15px] transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
                              isActive
                                ? 'bg-secondary text-foreground font-medium'
                                : 'text-muted-foreground hover:text-foreground',
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={cn(
                                'size-1.5 shrink-0 rounded-full',
                                isActive ? 'bg-brand' : 'bg-transparent',
                              )}
                            />
                            <span className="min-w-0 flex-1 truncate">{item.title}</span>
                            {item.badge ? (
                              <span className="text-brand text-xs font-medium">
                                {tBadges(item.badge)}
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </nav>

        <div
          data-sidebar-extra
          data-sidebar-foot
          className="bg-secondary flex items-center gap-0.5 rounded-lg p-1"
        >
          <button
            type="button"
            onClick={() => {
              setDrawer(false);
              openChat();
            }}
            className="text-foreground hover:bg-muted focus-visible:ring-ring flex h-9.5 min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-[15px] transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <SparklesIcon size={17} aria-hidden="true" />
            <span className="truncate">{tHeader('ask')}</span>
          </button>
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
      </div>
      <AnimatePresence>
        {hovered && (
          <SidebarPreview
            key="sidebar-preview"
            preview={hovered.preview}
            badge={hovered.item.badge}
            anchor={hovered.rect}
            edge={hovered.edge}
            onPointerEnter={clearPreviewTimer}
            onPointerLeave={hidePreview}
          />
        )}
      </AnimatePresence>
    </aside>
  );
}
