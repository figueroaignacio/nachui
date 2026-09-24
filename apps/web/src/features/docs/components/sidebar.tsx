'use client';

import { NavBadge } from '@/components/common/nav-badge';
import { Link, usePathname } from '@/i18n/navigation';
import type { DocItem, DocSection } from '@/lib/definitions';
import { cn } from '@repo/ui/lib/cn';
import { springs, still } from '@repo/ui/lib/motion';
import { motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import * as React from 'react';

const ALL = 'all';

function sectionOf(sections: DocSection[], pathname: string): string {
  const exact = sections.find((section) => section.items.some((item) => item.href === pathname));
  if (exact) return exact.title;
  const byPrefix = sections.find((section) =>
    section.items.some((item) => item.href !== '/docs' && pathname.startsWith(`${item.href}/`)),
  );
  return byPrefix?.title ?? ALL;
}

function chipLabel(section: DocSection, index: number): string {
  return index === 0 ? (section.items[0]?.title ?? section.title) : section.title;
}

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

  const chips = [
    { id: ALL, label: t('sidebar.all') },
    ...docsNavigation.map((section, index) => ({
      id: section.title,
      label: chipLabel(section, index),
    })),
  ];

  const visible =
    filter === ALL ? docsNavigation : docsNavigation.filter((section) => section.title === filter);

  return (
    <aside className="hidden lg:block lg:pr-8">
      <div className="sticky top-10 flex h-[calc(100vh-9rem)] flex-col">
        <div
          className="mb-3 flex flex-wrap gap-x-0.5 gap-y-1 px-1"
          role="tablist"
          aria-label={t('sidebar.filterLabel')}
        >
          {chips.map((chip) => {
            const isActive = chip.id === filter;
            return (
              <button
                key={chip.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilter(chip.id)}
                className={cn(
                  'relative rounded-md px-1.5 py-0.5 text-[11px] leading-5 transition-colors',
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
                <span className="relative">{chip.label}</span>
              </button>
            );
          })}
        </div>

        <nav className="hide-scrollbar min-h-0 flex-1 overflow-y-scroll mask-[linear-gradient(180deg,black_90%,transparent)] pb-20">
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
