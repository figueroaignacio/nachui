'use client';

import { NavBadge } from '@/components/common/nav-badge';
import { Link, usePathname } from '@/i18n/navigation';
import type { DocItem, DocSection } from '@/lib/definitions';
import { Tooltip } from '@repo/ui/components/tooltip';
import { cn } from '@repo/ui/lib/cn';
import { springs, still } from '@repo/ui/lib/motion';
import { motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import {
  buildSectionFilters,
  revealActiveLink,
  scrollToSection,
  sectionAtScroll,
  sectionOf,
} from '../lib/section-filters';

const SPY_LOCK_MS = 800;

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('docs');
  const docsNavigation = t.raw('navigation') as DocSection[];
  const shouldReduceMotion = useReducedMotion();

  const current = React.useMemo(
    () => sectionOf(docsNavigation, pathname),
    [docsNavigation, pathname],
  );
  const [anchor, setAnchor] = React.useState(current);
  const navRef = React.useRef<HTMLElement>(null);
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
    setAnchor(current);
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

  return (
    <aside className="hidden lg:block lg:pr-6">
      <div className="sticky top-10 grid h-[calc(100vh-9rem)] grid-cols-[2.25rem_minmax(0,1fr)] gap-3">
        <div className="flex flex-col gap-1" role="group" aria-label={t('sidebar.filterLabel')}>
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
          className="hide-scrollbar relative min-h-0 overflow-y-scroll mask-[linear-gradient(180deg,black_90%,transparent)] pb-20"
        >
          {docsNavigation.map((section: DocSection) => (
            <div key={section.title} data-section={section.title} className="mb-6 last:mb-0">
              <p className="text-muted-foreground px-2.5 font-mono text-[11px] lowercase">
                <span className="text-muted-foreground/50">./</span>
                {section.title}
              </p>
              <ul className="mt-2">
                {section.items.map((item: DocItem) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        target={item.target}
                        rel={item.target ? 'noopener noreferrer' : undefined}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'flex items-center gap-2.5 px-2.5 py-1 text-[13px] transition-colors',
                          isActive
                            ? 'text-foreground font-medium'
                            : 'text-muted-foreground hover:text-foreground',
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            'size-1.5 shrink-0',
                            isActive ? 'bg-brand' : 'bg-transparent',
                          )}
                        />
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
    </aside>
  );
}
