'use client';

import { cn } from '@repo/ui/lib/cn';
import { motion } from 'motion/react';
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
      className={cn('m-0 list-none', {
        'ml-3': level !== 1,
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
              aria-current={isActive ? 'location' : undefined}
              className={cn(
                'focus-visible:ring-ring flex items-center rounded-md px-2.5 py-1.5 text-[13px] leading-snug no-underline transition-colors focus-visible:ring-2 focus-visible:outline-none',
                isActive
                  ? 'bg-muted text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground',
                level === 2 && 'text-xs',
              )}
            >
              <span className="line-clamp-2">{item.title}</span>
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
