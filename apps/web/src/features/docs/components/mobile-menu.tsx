'use client';

import { NavBadge } from '@/components/common/nav-badge';
import { useDialogBehavior } from '@/hooks/use-dialog-behavior';
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll';
import { Link, usePathname } from '@/i18n/navigation';
import { useDocsSections } from '@/hooks/use-docs-sections';
import type { Navigation } from '@/lib/definitions';
import { isHiddenProductLink } from '@/lib/hidden-product-links';
import { Button } from '@repo/ui/components/button';
import { Typography } from '@repo/ui/components/typography';
import { SparklesIcon } from '@repo/ui/icons/sparkles';
import { XIcon } from '@repo/ui/icons/x';
import { cn } from '@repo/ui/lib/cn';
import { springs, still } from '@repo/ui/lib/motion';
import { motion, useDragControls, useReducedMotion, type PanInfo } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  buildSectionFilters,
  revealActiveLink,
  scrollToSection,
  sectionAtScroll,
  sectionOf,
} from '../lib/section-filters';
import { LocaleSwitcher } from '@/components/common/locale-switcher';
import { GitHubIcon } from '@/components/common/github-icon';
import { useChatStore } from '@/features/chat/store/chat-store';
import { GITHUB_REPO_URL } from '@/lib/domains';
import { ThemeToggle } from '@/components/common/theme-toggle';

const SWIPE_CLOSE_THRESHOLD = 80;
const SWIPE_CLOSE_VELOCITY = 600;
const DRAG_CONSTRAINTS = { top: 0, bottom: 0 };
const DRAG_ELASTIC = { top: 0, bottom: 0.9 };
const SPY_LOCK_MS = 800;

type MobileMenuPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenuPanel({ open: isMenuOpen, onClose }: MobileMenuPanelProps) {
  const t = useTranslations();
  const openChat = useChatStore((state) => state.openChat);
  const pathname = usePathname();

  const docsNavigation = useDocsSections();
  const navigation = t.raw('ui.navigation') as Navigation[];
  const elementsMenuItems = t.raw('ui.elementsMenu.items') as Navigation[];
  const resourcesMenu = {
    label: t('ui.resourcesMenu.label'),
    items: t.raw('ui.resourcesMenu.items') as Navigation[],
  };
  const docsHrefs = new Set(
    docsNavigation.flatMap((section) => section.items.map((item) => item.href)),
  );
  const isExtraLink = (item: Navigation) =>
    !isHiddenProductLink(item.href) && !docsHrefs.has(item.href);
  const menuLinks = [...elementsMenuItems, ...navigation].filter(isExtraLink);
  const resourceLinks = resourcesMenu.items.filter(isExtraLink);

  const menuRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const anchorBarRef = useRef<HTMLDivElement>(null);
  const spyLockedUntil = useRef(0);
  const toggleMenu = onClose;
  const shouldReduceMotion = useReducedMotion();
  const dragControls = useDragControls();

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > SWIPE_CLOSE_THRESHOLD || info.velocity.y > SWIPE_CLOSE_VELOCITY) onClose();
  };

  const currentSection = sectionOf(docsNavigation, pathname);
  const [anchor, setAnchor] = useState(currentSection);
  const openPath = isMenuOpen ? pathname : null;
  const [syncedPath, setSyncedPath] = useState(openPath);

  if (syncedPath !== openPath) {
    setSyncedPath(openPath);
    if (openPath !== null) setAnchor(currentSection);
  }
  const anchors = buildSectionFilters(docsNavigation, t('docs.sidebar.all')).slice(1);

  const jumpTo = useCallback((id: string, behavior: ScrollBehavior) => {
    setAnchor(id);
    const container = scrollRef.current;
    if (!container) return;
    spyLockedUntil.current = performance.now() + SPY_LOCK_MS;
    scrollToSection(container, id, behavior, anchorBarRef.current?.offsetHeight ?? 0);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const container = scrollRef.current;
    if (!container) return;
    spyLockedUntil.current = performance.now() + SPY_LOCK_MS;
    const barHeight = anchorBarRef.current?.offsetHeight ?? 0;
    if (!revealActiveLink(container, barHeight)) {
      scrollToSection(container, currentSection, 'instant', barHeight);
    }
  }, [isMenuOpen, currentSection, pathname]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const onScroll = () => {
      if (performance.now() < spyLockedUntil.current) return;
      const section = sectionAtScroll(container, anchorBarRef.current?.offsetHeight ?? 0);
      if (section) setAnchor(section);
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  useLockBodyScroll(isMenuOpen);
  useDialogBehavior({ open: isMenuOpen, onClose, ref: menuRef });

  return (
    <div className="lg:hidden">
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          'bg-overlay fixed inset-0 z-50 backdrop-blur-xs transition-opacity duration-300',
          isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
      <motion.nav
        ref={menuRef}
        id="mobile-menu"
        aria-label={t('ui.header.label')}
        tabIndex={-1}
        inert={!isMenuOpen}
        initial={false}
        animate={isMenuOpen ? { y: 0 } : { y: '110%' }}
        transition={shouldReduceMotion ? still : springs.smooth}
        drag="y"
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={DRAG_CONSTRAINTS}
        dragElastic={DRAG_ELASTIC}
        dragMomentum={false}
        onDragEnd={onDragEnd}
        className={cn(
          'bg-background border-rule fixed inset-x-0 bottom-0 z-50 flex h-[85svh] flex-col overflow-hidden rounded-t-2xl border border-b-0 shadow-2xl',
          'sm:mx-auto sm:max-w-md',
          !isMenuOpen && 'pointer-events-none',
        )}
      >
        <div
          onPointerDown={(event) => dragControls.start(event)}
          className="flex shrink-0 cursor-grab touch-none items-center justify-center pt-2.5 pb-1 active:cursor-grabbing"
          aria-hidden="true"
        >
          <span className="bg-muted-foreground/30 h-1 w-10 rounded-full" />
        </div>
        <div
          onPointerDown={(event) => dragControls.start(event)}
          className="flex shrink-0 touch-none items-center justify-between pr-3 pl-6"
        >
          <span className="text-foreground text-[15px] font-semibold">{t('ui.header.menu')}</span>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              data-autofocus
              onClick={toggleMenu}
              title={t('ui.header.close')}
              aria-label={t('ui.header.close')}
            >
              <XIcon size={20} aria-hidden="true" />
            </Button>
          </div>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 pb-6">
          <div
            ref={anchorBarRef}
            className="bg-background border-rule hide-scrollbar sticky top-0 z-10 -mx-6 mb-4 flex items-center gap-1.5 overflow-x-auto border-b px-6 pt-1 pb-3"
            role="group"
            aria-label={t('docs.sidebar.filterLabel')}
          >
            {anchors.map(({ id, label }) => {
              const isActive = id === anchor;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => jumpTo(id, shouldReduceMotion ? 'instant' : 'smooth')}
                  className={cn(
                    'focus-visible:ring-ring flex h-9 shrink-0 items-center rounded-md border px-3 text-[13px] whitespace-nowrap focus-visible:ring-2 focus-visible:outline-none',
                    isActive
                      ? 'bg-muted border-muted text-foreground font-medium'
                      : 'border-border text-muted-foreground hover:text-foreground',
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {menuLinks.length > 0 && (
            <div className="mb-8">
              <Typography className="text-muted-foreground mb-2 px-2.5 text-xs">
                {t('ui.header.menu')}
              </Typography>
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
                          'flex items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors',
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
          {resourceLinks.length > 0 && (
            <div className="mb-8">
              <Typography className="text-muted-foreground mb-2 px-2.5 text-xs">
                {resourcesMenu.label}
              </Typography>
              <ul>
                {resourceLinks.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={toggleMenu}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'flex items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors',
                          isActive
                            ? 'bg-card text-foreground font-medium'
                            : 'text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {docsNavigation.map((section, sectionIndex) => (
            <div key={sectionIndex} data-section={section.id} className="mb-8 last:mb-0">
              <Typography className="text-muted-foreground mb-2 flex items-center gap-1.5 px-2.5 text-xs">
                {(() => {
                  const Icon = anchors.find((entry) => entry.id === section.id)?.Icon;
                  return Icon ? <Icon size={12} /> : null;
                })()}
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
                          'flex items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors',
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
        <div className="border-rule flex shrink-0 items-center gap-1 border-t px-4 pt-2.5 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <ThemeToggle />
          <LocaleSwitcher />
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={t('ui.header.github')}
            className="text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring inline-flex size-8 items-center justify-center rounded-md focus-visible:ring-2 focus-visible:outline-none"
          >
            <GitHubIcon size={16} />
          </a>
          <button
            type="button"
            onClick={() => {
              onClose();
              openChat();
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring ring-offset-background ml-auto inline-flex h-10 items-center gap-1.5 rounded-md px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <SparklesIcon size={14} aria-hidden="true" />
            {t('ui.header.ask')}
          </button>
        </div>
      </motion.nav>
    </div>
  );
}
