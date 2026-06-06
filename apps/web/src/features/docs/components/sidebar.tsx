'use client';

import { Link, usePathname } from '@/i18n/navigation';
import type { DocItem, DocSection } from '@/lib/definitions';
import { getIcon } from '@/lib/get-icon';
import { ChevronDown } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@repo/ui/lib/cn';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

const sectionVariants = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
} as const;

const sectionTransition = { duration: 0.2, ease: 'easeOut' as const };

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('docs');
  const shouldReduceMotion = useReducedMotion();
  const docsNavigation = t.raw('navigation') as DocSection[];

  const [openSections, setOpenSections] = useState<string[]>(
    docsNavigation.map((section: DocSection) => section.title),
  );

  const toggleSection = useCallback((title: string) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  }, []);

  return (
    <aside>
      <nav className="hide-scrollbar sticky top-24 hidden h-[calc(100vh-5rem)] shrink-0 space-y-8 overflow-y-scroll mask-[linear-gradient(180deg,black_90%,transparent)] pb-20 lg:block">
        {docsNavigation.map((section: DocSection) => {
          const isOpen = openSections.includes(section.title);
          return (
            <div key={section.title} className="space-y-3">
              <button
                onClick={() => toggleSection(section.title)}
                aria-expanded={isOpen}
                className="hover:text-foreground text-muted-foreground flex w-full items-center justify-between text-xs font-semibold transition-colors"
              >
                <div className="flex items-center gap-2">
                  {getIcon(section.title)}
                  {section.title}
                </div>
                <HugeiconsIcon
                  icon={ChevronDown}
                  size={16}
                  className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    isOpen && 'rotate-180',
                  )}
                  aria-hidden="true"
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.ul
                    key="content"
                    variants={sectionVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={shouldReduceMotion ? { duration: 0 } : sectionTransition}
                    className="ml-1.5 space-y-1 overflow-hidden pl-3"
                  >
                    {section.items.map((item: DocItem) => {
                      const isActive = pathname === item.href;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={cn(
                              'flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs transition-colors',
                              isActive
                                ? 'bg-secondary text-foreground font-medium'
                                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {getIcon(item.title, item.href)}
                              <span>{item.title}</span>
                            </div>
                            {isActive && <div className="bg-foreground size-1.5 rounded-full" />}
                          </Link>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
