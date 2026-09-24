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
import { buildSectionFilters, sectionOf, visibleSections } from '../lib/section-filters';

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('docs');
  const docsNavigation = t.raw('navigation') as DocSection[];
  const shouldReduceMotion = useReducedMotion();

  const current = React.useMemo(
    () => sectionOf(docsNavigation, pathname),
    [docsNavigation, pathname],
  );
  const [filter, setFilter] = React.useState(current);

  React.useEffect(() => {
    setFilter(current);
  }, [current]);

  const chips = buildSectionFilters(docsNavigation, t('sidebar.all'));

  const visible = visibleSections(docsNavigation, filter);

  return (
    <aside className="hidden lg:block lg:pr-6">
      <div className="sticky top-10 grid h-[calc(100vh-9rem)] grid-cols-[2.25rem_minmax(0,1fr)] gap-3">
        <div
          className="flex flex-col gap-1"
          role="tablist"
          aria-orientation="vertical"
          aria-label={t('sidebar.filterLabel')}
        >
          {chips.map(({ id, label, Icon }) => {
            const isActive = id === filter;
            return (
              <Tooltip key={id} delayDuration={200}>
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={label}
                    onClick={() => setFilter(id)}
                    className={cn(
                      'relative flex size-9 items-center justify-center rounded-md transition-colors',
                      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="docs-sidebar-filter"
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

        <nav className="hide-scrollbar min-h-0 overflow-y-scroll mask-[linear-gradient(180deg,black_90%,transparent)] pb-20">
          {visible.map((section: DocSection) => (
            <div key={section.title} className="mb-6 last:mb-0">
              <p className="text-muted-foreground px-2.5 text-xs">{section.title}</p>
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
                          'flex items-center gap-2 rounded-md px-2.5 py-1 text-[13px] transition-colors',
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
        </nav>
      </div>
    </aside>
  );
}
