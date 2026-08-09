import { Link } from '@/i18n/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@repo/ui/lib/cn';
import { getComponentIcon } from './component-icons';

export interface ComponentGridItem {
  href: string;
  title: string;
  description?: string;
}

interface ComponentGridProps {
  items: ComponentGridItem[];
  className?: string;
}

/**
 * Dense, hairline-ruled catalog of components: one icon + name per cell.
 * Cells carry their own right/bottom rule and pull it back by 1px so the
 * trailing column and row collapse into the container's border.
 */
export function ComponentGrid({ items, className }: ComponentGridProps) {
  return (
    <div
      className={cn(
        'border-rule grid grid-cols-2 overflow-hidden rounded-lg border sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
        className,
      )}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          title={item.description || undefined}
          className={cn(
            'group/cell border-rule relative -mr-px -mb-px flex items-center overflow-hidden border-r border-b px-3 py-2.5 sm:px-4',
            'hover:bg-surface-muted focus-visible:ring-ring transition-colors duration-200 focus-visible:z-10 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
          )}
        >
          <span className="flex min-w-0 origin-left items-center gap-2.5 transition-transform duration-200 ease-out group-hover/cell:scale-[1.03] motion-reduce:transform-none">
            <span className="group-hover/cell:border-rule group-hover/cell:bg-background flex size-8 shrink-0 items-center justify-center rounded-md border border-transparent transition-all duration-200 ease-out group-hover/cell:scale-110 group-hover/cell:-rotate-6 group-hover/cell:shadow-sm motion-reduce:transform-none">
              <HugeiconsIcon
                icon={getComponentIcon(item.href)}
                size={16}
                strokeWidth={1.6}
                className="text-muted-foreground group-hover/cell:text-foreground transition-colors duration-200"
              />
            </span>
            <span className="text-foreground/90 group-hover/cell:text-foreground truncate text-sm transition-colors duration-200">
              {item.title}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
