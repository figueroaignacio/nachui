'use client';

import { cn } from '@repo/ui/lib/cn';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

export interface TocEntry {
  items?: TocEntry[];
  url: string;
  title: string;
}

export interface TocProps {
  toc: TocEntry[];
}

export function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0% 0% -70% 0%' },
    );

    itemIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [itemIds]);

  return activeId;
}

interface TreeProps {
  tree: TocEntry[];
  level?: number;
  activeItem?: string | null;
  onItemClick?: (url: string) => void;
}

export function Tree({ tree, level = 1, activeItem, onItemClick }: TreeProps) {
  if (!tree.length || level >= 3) return null;

  return (
    <ul
      className={cn('m-0 list-none space-y-0.5', {
        'mt-0.5 ml-3': level !== 1,
      })}
    >
      {tree.map((item, index) => {
        const id = item.url.split('#')[1];
        const isActive = activeItem === id;

        return (
          <motion.li
            key={item.url}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.04,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="relative"
          >
            <a
              href={item.url}
              onClick={() => onItemClick?.(item.url)}
              className={cn(
                'group relative flex items-center gap-2.5 rounded-md px-2 py-1.5 text-xs leading-snug no-underline transition-colors duration-200 outline-none focus-visible:ring-1',
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80',
                level === 2 && 'text-[11px]',
              )}
            >
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.span
                    layoutId="toc-active-bg"
                    className="bg-muted absolute inset-0 rounded-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
              <span className="relative z-10 flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                <AnimatePresence mode="wait">
                  {isActive ? (
                    <motion.span
                      key="active"
                      className="bg-foreground block rounded-full"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'backOut' }}
                      style={{ width: level === 1 ? 5 : 3.5, height: level === 1 ? 5 : 3.5 }}
                    />
                  ) : null}
                </AnimatePresence>
              </span>

              <span className="relative z-10 line-clamp-2">{item.title}</span>
            </a>

            {item.items?.length ? (
              <Tree
                tree={item.items}
                level={level + 1}
                activeItem={activeItem}
                onItemClick={onItemClick}
              />
            ) : null}
          </motion.li>
        );
      })}
    </ul>
  );
}
