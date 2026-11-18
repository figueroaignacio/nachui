'use client';

import { LocaleSwitcher } from '@/components/common/locale-switcher';
import { Logo } from '@/components/common/logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { NavBadge } from '@/components/common/nav-badge';
import { useChatStore } from '@/features/chat/store/chat-store';
import { OPEN_SEARCH_EVENT } from '@/features/shell/components/site-header';
import { useModKeyLabel } from '@/hooks/use-kbd-shortcut';
import { Link, usePathname } from '@/i18n/navigation';
import type { DocItem, DocSection } from '@/lib/definitions';
import { getDocsSections } from '@/lib/docs-navigation';
import { Kbd } from '@repo/ui/components/kbd';
import { Tooltip } from '@repo/ui/components/tooltip';
import { SparklesIcon } from '@repo/ui/icons/sparkles';
import { cn } from '@repo/ui/lib/cn';
import { springs, still } from '@repo/ui/lib/motion';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import {
  buildSectionFilters,
  revealActiveLink,
  scrollToSection,
  sectionAtScroll,
  sectionOf,
} from '../lib/section-filters';
import type { SidebarPreview as SidebarPreviewData } from '../lib/sidebar-previews';
import { SidebarPreview } from './sidebar-preview';

const SPY_LOCK_MS = 800;
const PREVIEW_OPEN_DELAY = 350;
const PREVIEW_CLOSE_DELAY = 150;

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
  const modKey = useModKeyLabel();
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
  const shouldReduceMotion = useReducedMotion();

  const current = React.useMemo(
    () => sectionOf(docsNavigation, pathname),
    [docsNavigation, pathname],
  );
  const [anchor, setAnchor] = React.useState(current);
  const [renderedPath, setRenderedPath] = React.useState(pathname);

  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setAnchor(current);
    setHovered(null);
    setDrawer(false);
  }
  const anchors = buildSectionFilters(docsNavigation, t('sidebar.all')).slice(1);

  const spyLockedUntil = React.useRef(0);

  const jumpTo = React.useCallback((id: string, behavior: ScrollBehavior) => {
    setAnchor(id);
    const nav = navRef.current;
    if (!nav) return;
    spyLockedUntil.current = performance.now() + SPY_LOCK_MS;
    scrollToSection(nav, id, behavior);
  }, []);

  React.useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    spyLockedUntil.current = performance.now() + SPY_LOCK_MS;
    if (!revealActiveLink(nav, 0, 0.85)) scrollToSection(nav, current, 'instant');
  }, [current, pathname]);

  React.useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => {
      if (performance.now() < spyLockedUntil.current) return;
      const section = sectionAtScroll(nav);
      if (section) setAnchor(section);
    };
    nav.addEventListener('scroll', onScroll, { passive: true });
    return () => nav.removeEventListener('scroll', onScroll);
  }, []);

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
    <aside className="hidden lg:block lg:pr-6">
      <div data-sidebar-backdrop aria-hidden="true" onClick={() => setDrawer(false)} />
      <div
        data-sidebar-rail
        className="sticky top-[calc(var(--site-header-height)+2.5rem)] grid h-[calc(100vh-var(--site-header-height)-4.5rem)] grid-cols-[2.25rem_minmax(0,1fr)] gap-3 transition-[top] duration-300 motion-reduce:transition-none"
      >
        <div data-sidebar-head className="hidden flex-col gap-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label={t('sidebar.toggle')}
              aria-expanded={isDesktop ? !collapsed : drawer}
              onClick={toggleSidebar}
              className="bg-secondary text-muted-strong hover:text-foreground focus-visible:ring-ring inline-flex size-9 shrink-0 items-center justify-center rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <svg
                width="17"
                height="17"
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
            <div data-sidebar-extra className="ms-auto flex items-center">
              <button
                type="button"
                aria-label={tHeader('ask')}
                title={tHeader('ask')}
                onClick={() => {
                  setDrawer(false);
                  openChat();
                }}
                className="text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring inline-flex size-8 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <SparklesIcon size={16} aria-hidden="true" />
              </button>
              <ThemeToggle />
              <LocaleSwitcher />
            </div>
          </div>
          <div data-sidebar-extra className="flex items-center gap-2 ps-1 text-[15px]">
            <Link
              href="/"
              aria-label={tHeader('homeLink')}
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex items-center gap-2 rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <Logo size={20} />
              NachUI
            </Link>
            <span aria-hidden="true" className="text-muted-foreground">
              /
            </span>
            <Link
              href="/components"
              className="text-foreground focus-visible:ring-ring rounded-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
            >
              {t('sidebar.catalog')}
            </Link>
            <button
              type="button"
              aria-label={tHeader('search')}
              onClick={() => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT))}
              className="focus-visible:ring-ring ms-auto flex items-center gap-0.5 rounded-sm focus-visible:ring-2 focus-visible:outline-none"
            >
              <Kbd size="sm">{modKey}</Kbd>
              <Kbd size="sm">K</Kbd>
            </button>
          </div>
        </div>
        <div
          data-sidebar-anchors
          className="flex flex-col gap-1"
          role="group"
          aria-label={t('sidebar.filterLabel')}
        >
          {anchors.map(({ id, label, Icon }) => {
            const isActive = id === anchor;
            return (
              <Tooltip key={id} delayDuration={200}>
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    aria-pressed={isActive}
                    aria-label={label}
                    onClick={() => jumpTo(id, shouldReduceMotion ? 'instant' : 'smooth')}
                    className={cn(
                      'relative flex size-9 items-center justify-center rounded-md transition-colors',
                      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="docs-sidebar-anchor"
                        transition={shouldReduceMotion ? still : springs.smooth}
                        className="bg-card absolute inset-0 rounded-md"
                      />
                    )}
                    <span className="relative">
                      <Icon size={16} />
                    </span>
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Content side="right">{label}</Tooltip.Content>
              </Tooltip>
            );
          })}
        </div>

        <nav
          ref={navRef}
          data-sidebar-nav
          className="hide-scrollbar relative min-h-0 overflow-y-scroll mask-[linear-gradient(180deg,black_90%,transparent)] pb-20"
        >
          {docsNavigation.map((section: DocSection) => (
            <div key={section.id} data-section={section.id} className="mb-6 last:mb-0">
              <p className="section-label px-1 tracking-[0.08em] uppercase">{section.title}</p>
              <ul className="border-border ms-1.5 mt-2 border-s">
                {section.items.map((item: DocItem) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
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
                          'focus-visible:ring-ring -ms-px flex h-8 items-center gap-2 rounded-e-sm border-s ps-3.5 pe-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
                          isActive
                            ? 'border-brand text-foreground font-medium'
                            : 'text-muted-foreground hover:text-foreground border-transparent',
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
        </nav>
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
