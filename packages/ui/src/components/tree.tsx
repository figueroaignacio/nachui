'use client';

import { ArrowRight01Icon, MinusSignIcon, PlusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';

type ToggleIcon = 'chevron' | 'plus-minus';

interface TreeContextValue {
  expanded: Set<string>;
  toggleExpanded: (value: string) => void;
  selected: string | undefined;
  select: (value: string) => void;
  indent: number;
  toggleIcon: ToggleIcon;
  showLines: boolean;
}

interface TreeProps {
  children: React.ReactNode;
  className?: string;
  defaultExpanded?: string[];
  defaultSelected?: string;
  selected?: string;
  onSelectedChange?: (value: string) => void;
  indent?: number;
  toggleIcon?: ToggleIcon;
  showLines?: boolean;
  label?: string;
}

interface TreeItemProps {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  iconOpen?: React.ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const GROUP_VARIANTS = {
  open: { height: 'auto', opacity: 1 },
  closed: { height: 0, opacity: 0 },
} as const;

const GROUP_TRANSITION = { duration: 0.2, ease: 'easeOut' } as const;

const TreeContext = React.createContext<TreeContextValue | null>(null);
const DepthContext = React.createContext(0);

const useTreeContext = (): TreeContextValue => {
  const context = React.use(TreeContext);
  if (!context) throw new Error('Tree components must be used within Tree');
  return context;
};

function getVisibleItems(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>('[role="treeitem"]:not([aria-disabled="true"])'),
  );
}

function getParentItem(row: HTMLElement): HTMLElement | null {
  const group = row.closest('[data-tree-group]');
  const parent = group?.closest('[data-tree-item]');
  return parent?.querySelector<HTMLElement>(':scope > [role="treeitem"]') ?? null;
}

const TreeRoot = ({
  children,
  className,
  defaultExpanded = [],
  defaultSelected,
  selected: controlledSelected,
  onSelectedChange,
  indent = 16,
  toggleIcon = 'chevron',
  showLines = false,
  label = 'Tree',
}: TreeProps): React.JSX.Element => {
  const [expanded, setExpanded] = React.useState<Set<string>>(() => new Set(defaultExpanded));
  const [uncontrolledSelected, setUncontrolledSelected] = React.useState(defaultSelected);
  const rootRef = React.useRef<HTMLDivElement>(null);

  const isControlled = controlledSelected !== undefined;
  const selected = isControlled ? controlledSelected : uncontrolledSelected;

  const toggleExpanded = React.useCallback((value: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }, []);

  const select = React.useCallback(
    (value: string) => {
      if (!isControlled) setUncontrolledSelected(value);
      onSelectedChange?.(value);
    },
    [isControlled, onSelectedChange],
  );

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.getAttribute('role') !== 'treeitem') return;

    const items = getVisibleItems(rootRef.current);
    if (items.length === 0) return;
    const currentIndex = items.indexOf(target);

    let nextIndex: number | null = null;
    if (e.key === 'ArrowDown') {
      nextIndex = Math.min(currentIndex + 1, items.length - 1);
    } else if (e.key === 'ArrowUp') {
      nextIndex = Math.max(currentIndex - 1, 0);
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = items.length - 1;
    } else if (e.key === 'ArrowLeft') {
      if (target.getAttribute('aria-expanded') === 'true') {
        e.preventDefault();
        target.click();
        return;
      }
      const parent = getParentItem(target);
      if (parent) {
        e.preventDefault();
        parent.focus();
      }
      return;
    } else if (e.key === 'ArrowRight') {
      if (target.getAttribute('aria-expanded') === 'false') {
        e.preventDefault();
        target.click();
        return;
      }
      if (target.getAttribute('aria-expanded') === 'true') {
        nextIndex = Math.min(currentIndex + 1, items.length - 1);
      }
    }

    if (nextIndex !== null && nextIndex !== currentIndex) {
      e.preventDefault();
      items[nextIndex]?.focus();
    }
  }, []);

  const contextValue = React.useMemo(
    () => ({ expanded, toggleExpanded, selected, select, indent, toggleIcon, showLines }),
    [expanded, toggleExpanded, selected, select, indent, toggleIcon, showLines],
  );

  return (
    <TreeContext value={contextValue}>
      <div
        ref={rootRef}
        role="tree"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className={cn('w-full text-sm', className)}
      >
        {children}
      </div>
    </TreeContext>
  );
};

const TreeItem = ({
  value,
  label,
  icon,
  iconOpen,
  disabled = false,
  onSelect,
  children,
  className,
}: TreeItemProps): React.JSX.Element => {
  const { expanded, toggleExpanded, selected, select, indent, toggleIcon, showLines } =
    useTreeContext();
  const depth = React.use(DepthContext);
  const shouldReduceMotion = useReducedMotion();

  const hasChildren = React.Children.count(children) > 0;
  const isOpen = expanded.has(value);
  const isSelected = !hasChildren && selected === value;

  const handleActivate = () => {
    if (disabled) return;
    if (hasChildren) {
      toggleExpanded(value);
      return;
    }
    select(value);
    onSelect?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleActivate();
    }
  };

  const resolvedIcon = isOpen && iconOpen !== undefined ? iconOpen : icon;

  return (
    <div data-tree-item="">
      <div
        role="treeitem"
        tabIndex={disabled ? undefined : 0}
        aria-expanded={hasChildren ? isOpen : undefined}
        aria-selected={hasChildren ? undefined : isSelected}
        aria-level={depth + 1}
        aria-disabled={disabled || undefined}
        data-value={value}
        onClick={handleActivate}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 select-none',
          'hover:bg-muted focus-visible:ring-ring transition-colors focus-visible:ring-1 focus-visible:outline-none',
          isSelected && 'bg-muted text-foreground font-medium',
          disabled && 'pointer-events-none opacity-40',
          className,
        )}
      >
        {hasChildren ? (
          <span
            aria-hidden="true"
            className="text-muted-foreground flex size-4 shrink-0 items-center justify-center"
          >
            {toggleIcon === 'plus-minus' ? (
              <HugeiconsIcon icon={isOpen ? MinusSignIcon : PlusSignIcon} size={12} />
            ) : (
              <span className={cn('transition-transform duration-200', isOpen && 'rotate-90')}>
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </span>
            )}
          </span>
        ) : (
          <span aria-hidden="true" className="size-4 shrink-0" />
        )}

        {resolvedIcon !== undefined && (
          <span
            aria-hidden="true"
            className="text-muted-foreground flex shrink-0 items-center [&_svg]:size-4"
          >
            {resolvedIcon}
          </span>
        )}

        <span className="min-w-0 flex-1 truncate">{label}</span>
      </div>

      {hasChildren && (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              data-tree-group=""
              role="group"
              initial={shouldReduceMotion ? false : 'closed'}
              animate="open"
              exit={shouldReduceMotion ? undefined : 'closed'}
              variants={GROUP_VARIANTS}
              transition={GROUP_TRANSITION}
              className={cn('ml-3.5 overflow-hidden', showLines && 'border-border border-l')}
              style={{ paddingLeft: Math.max(indent - 8, 4) }}
            >
              <DepthContext value={depth + 1}>{children}</DepthContext>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

const Tree = Object.assign(TreeRoot, {
  Item: TreeItem,
});

export { Tree };
export type { TreeItemProps, TreeProps };
