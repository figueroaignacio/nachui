'use client';

import { NavBadge } from '@/components/common/nav-badge';
import { useDialogBehavior } from '@/hooks/use-dialog-behavior';
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll';
import { Link, usePathname } from '@/i18n/navigation';
import type { DocSection, Navigation } from '@/lib/definitions';
import { isHiddenProductLink } from '@/lib/hidden-product-links';
import { Button } from '@repo/ui/components/button';
import { Typography } from '@repo/ui/components/typography';
import { XIcon } from '@repo/ui/icons/x';
import { cn } from '@repo/ui/lib/cn';
import { springs, still } from '@repo/ui/lib/motion';
import { motion, useDragControls, useReducedMotion, type PanInfo } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  buildSectionFilters,
  revealActiveLink,
  scrollToSection,
  sectionAtScroll,
  sectionOf,
} from '@/features/docs/lib/section-filters';
import { LocaleSwitcher } from '../common/locale-switcher';
import { Logo } from '../common/logo';
import { ThemeToggle } from '../common/theme-toggle';

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
  const pathname = usePathname();

  const docsNavigation = t.raw('docs.navigation') as DocSection[];
  const navigation = t.raw('ui.navigation') as Navigation[];
  const elementsMenu = t.raw('ui.elementsMenu') as { items: Navigation[] };
  const resourcesMenu = t.raw('ui.resourcesMenu') as { label: string; items: Navigation[] };
  const docsHrefs = new Set(
    docsNavigation.flatMap((section) => section.items.map((item) => item.href)),
  );
  const isExtraLink = (item: Navigation) =>
    !isHiddenProductLink(item.href) && !docsHrefs.has(item.href);
  const menuLinks = [...elementsMenu.items, ...navigation].filter(isExtraLink);
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

  const currentSection = useMemo(
    () => sectionOf(docsNavigation, pathname),
    [docsNavigation, pathname],
  );
  const [anchor, setAnchor] = useState(currentSection);
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
    setAnchor(currentSection);
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
        aria-label={t('ui.dock.label')}
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
          className="border-rule flex touch-none items-center justify-between border-b px-6 pt-2 pb-4"
        >
          <div className="flex items-center gap-x-3">
            <Link href="/" onClick={toggleMenu} aria-label={t('ui.dock.homeLink')}>
              <Logo withText />
            </Link>
          </div>
          <div className="flex items-center gap-x-3">
            <LocaleSwitcher />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              data-autofocus
              onClick={toggleMenu}
              title={t('ui.dock.close')}
              aria-label={t('ui.dock.close')}
            >
              <XIcon size={20} aria-hidden="true" />
            </Button>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-6 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
        >
          {menuLinks.length > 0 && (
            <div className="mb-8">
              <Typography className="text-muted-foreground mb-2 px-2.5 text-xs">
                {t('ui.dock.menu')}
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
          <div
            ref={anchorBarRef}
            className="bg-background/90 sticky -top-6 z-10 -mx-6 mb-4 flex items-center gap-1 px-6 py-2 backdrop-blur-md"
            role="group"
            aria-label={t('docs.sidebar.filterLabel')}
          >
            {anchors.map(({ id, label, Icon }) => {
              const isActive = id === anchor;
              return (
                <button
                  key={id}
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
                      layoutId="mobile-menu-anchor"
                      transition={shouldReduceMotion ? still : springs.smooth}
                      className="bg-card absolute inset-0 rounded-md"
                    />
                  )}
                  <span className="relative">
                    <Icon size={16} />
                  </span>
                </button>
              );
            })}
          </div>
          {docsNavigation.map((section, sectionIndex) => (
            <div key={sectionIndex} data-section={section.title} className="mb-8 last:mb-0">
              <Typography className="text-muted-foreground mb-2 flex items-center gap-1.5 px-2.5 text-xs">
                {(() => {
                  const Icon = anchors.find((entry) => entry.id === section.title)?.Icon;
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
      </motion.nav>
    </div>
  );
}
