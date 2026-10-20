'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';
import { collapse } from '../lib/motion';
import { useControllableState } from '../lib/use-controllable-state';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function ChevronRightIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function MinusIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

type ToggleIcon = 'chevron' | 'plus-minus';

interface TreeSnapshot {
  expanded: ReadonlySet<string>;
  selected: string | undefined;
}

interface TreeStore {
  subscribe: (listener: () => void) => () => void;
  get: () => TreeSnapshot;
  set: (snapshot: TreeSnapshot) => void;
}

function createTreeStore(initial: TreeSnapshot): TreeStore {
  let snapshot = initial;
  const listeners = new Set<() => void>();
  return {
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    get: () => snapshot,
    set: (next) => {
      if (next.expanded === snapshot.expanded && next.selected === snapshot.selected) return;
      snapshot = next;
      for (const listener of listeners) listener();
    },
  };
}

interface TreeContextValue {
  store: TreeStore;
  toggleExpanded: (value: string) => void;
  select: (value: string) => void;
  indent: number;
  toggleIcon: ToggleIcon;
  showLines: boolean;
}

interface TreeProps {
  children: React.ReactNode;
  className?: string;
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (expanded: string[]) => void;
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

const TreeContext = React.createContext<TreeContextValue | null>(null);
const DepthContext = React.createContext(0);

const useTreeContext = (): TreeContextValue => {
  const context = React.use(TreeContext);
  if (!context) throw new Error('Tree components must be used within Tree');
  return context;
};

const EMPTY_EXPANDED: string[] = [];
const TYPEAHEAD_RESET_MS = 500;

function isHidden(item: HTMLElement, root: HTMLElement) {
  const inert = item.parentElement?.closest('[inert]');
  return inert ? root.contains(inert) : false;
}

function getVisibleItems(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  return Array.from(root.querySelectorAll<HTMLElement>('[role="treeitem"]')).filter(
    (item) => !isHidden(item, root),
  );
}

function getRow(item: HTMLElement) {
  return item.querySelector<HTMLElement>(':scope > [data-tree-row]');
}

function getLabelText(item: HTMLElement) {
  const label = item.querySelector(':scope > [data-tree-row] > [data-tree-label]');
  return (label?.textContent ?? '').trim().toLowerCase();
}

function getParentItem(item: HTMLElement, root: HTMLElement): HTMLElement | null {
  const parent = item.parentElement?.closest<HTMLElement>('[role="treeitem"]');
  return parent && root.contains(parent) ? parent : null;
}

const TreeRoot = ({
  children,
  className,
  expanded: controlledExpanded,
  defaultExpanded = EMPTY_EXPANDED,
  onExpandedChange,
  defaultSelected,
  selected: controlledSelected,
  onSelectedChange,
  indent = 16,
  toggleIcon = 'chevron',
  showLines = false,
  label = 'Tree',
}: TreeProps): React.JSX.Element => {
  const [expandedList, setExpandedList] = useControllableState<string[]>({
    value: controlledExpanded,
    defaultValue: defaultExpanded,
    onChange: onExpandedChange,
  });
  const [selected, select] = useControllableState<string | undefined>({
    value: controlledSelected,
    defaultValue: defaultSelected,
    onChange: (value) => {
      if (value !== undefined) onSelectedChange?.(value);
    },
  });
  const expanded = React.useMemo<ReadonlySet<string>>(() => new Set(expandedList), [expandedList]);
  const [store] = React.useState(() => createTreeStore({ expanded, selected }));
  const rootRef = React.useRef<HTMLDivElement>(null);
  const tabStopRef = React.useRef<HTMLElement | null>(null);
  const typeaheadRef = React.useRef({ query: '', at: 0 });
  const focusInsideRef = React.useRef(false);

  React.useLayoutEffect(() => {
    store.set({ expanded, selected });
  }, [store, expanded, selected]);

  const toggleExpanded = React.useCallback(
    (value: string) => {
      setExpandedList((previous) =>
        previous.includes(value) ? previous.filter((item) => item !== value) : [...previous, value],
      );
    },
    [setExpandedList],
  );

  const expandMany = React.useCallback(
    (values: string[]) => {
      setExpandedList((previous) => {
        const added = values.filter((value) => !previous.includes(value));
        return added.length > 0 ? [...previous, ...added] : previous;
      });
    },
    [setExpandedList],
  );

  const moveTabStop = React.useCallback((item: HTMLElement) => {
    const previous = tabStopRef.current;
    if (previous && previous !== item) previous.tabIndex = -1;
    item.tabIndex = 0;
    tabStopRef.current = item;
  }, []);

  const syncTabStop = React.useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = getVisibleItems(root);
    const active = document.activeElement;
    const stop =
      items.find((item) => item === active) ??
      items.find((item) => item.getAttribute('aria-selected') === 'true') ??
      items.find((item) => item === tabStopRef.current) ??
      items[0];
    for (const item of items) {
      if (item !== stop && item.tabIndex !== -1) item.tabIndex = -1;
    }
    const previous = tabStopRef.current;
    if (previous && previous !== stop) previous.tabIndex = -1;
    if (stop) stop.tabIndex = 0;
    tabStopRef.current = stop ?? null;
  }, []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const root = rootRef.current;
      const target = e.target as HTMLElement;
      if (!root || target.getAttribute('role') !== 'treeitem') return;

      const items = getVisibleItems(root);
      if (items.length === 0) return;
      const currentIndex = items.indexOf(target);
      const isDisabled = target.getAttribute('aria-disabled') === 'true';

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
        if (target.getAttribute('aria-expanded') === 'true' && !isDisabled) {
          e.preventDefault();
          getRow(target)?.click();
          return;
        }
        const parent = getParentItem(target, root);
        if (parent) {
          e.preventDefault();
          parent.focus();
        }
        return;
      } else if (e.key === 'ArrowRight') {
        if (target.getAttribute('aria-expanded') === 'false' && !isDisabled) {
          e.preventDefault();
          getRow(target)?.click();
          return;
        }
        if (target.getAttribute('aria-expanded') === 'true') {
          nextIndex = Math.min(currentIndex + 1, items.length - 1);
        }
      } else if (e.key === '*') {
        e.preventDefault();
        const siblings = Array.from(target.parentElement?.children ?? []).filter(
          (item): item is HTMLElement =>
            item instanceof HTMLElement &&
            item.getAttribute('role') === 'treeitem' &&
            item.getAttribute('aria-expanded') === 'false' &&
            item.getAttribute('aria-disabled') !== 'true',
        );
        expandMany(siblings.flatMap((item) => (item.dataset.value ? [item.dataset.value] : [])));
        return;
      } else if (e.key.length === 1 && e.key !== ' ' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const typeahead = typeaheadRef.current;
        const now = Date.now();
        const key = e.key.toLowerCase();
        typeahead.query = now - typeahead.at > TYPEAHEAD_RESET_MS ? key : typeahead.query + key;
        typeahead.at = now;
        const repeated = typeahead.query.split('').every((char) => char === key);
        const query = repeated ? key : typeahead.query;
        const start = repeated ? currentIndex + 1 : currentIndex;
        const ordered = [...items.slice(start), ...items.slice(0, start)];
        const match = ordered.find((item) => getLabelText(item).startsWith(query));
        if (match) {
          e.preventDefault();
          match.focus();
        }
        return;
      }

      if (nextIndex !== null && nextIndex !== currentIndex) {
        e.preventDefault();
        items[nextIndex]?.focus();
      }
    },
    [expandMany],
  );

  React.useLayoutEffect(() => {
    if (rootRef.current?.contains(document.activeElement)) return;
    syncTabStop();
  }, [selected, syncTabStop]);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof MutationObserver === 'undefined') return;
    const observer = new MutationObserver((records) => {
      const stop = tabStopRef.current;
      if (stop && !stop.isConnected) {
        const active = document.activeElement;
        if (focusInsideRef.current && (!active || active === document.body)) {
          const record = records.find((entry) =>
            Array.from(entry.removedNodes).some((node) => node.contains(stop)),
          );
          const owner =
            record?.target instanceof HTMLElement
              ? record.target.closest<HTMLElement>('[role="treeitem"]')
              : null;
          if (owner && root.contains(owner) && !isHidden(owner, root)) {
            owner.focus();
            return;
          }
        }
      }
      if (!stop || !stop.isConnected || isHidden(stop, root)) syncTabStop();
    });
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['inert'],
    });
    return () => observer.disconnect();
  }, [syncTabStop]);

  const contextValue = React.useMemo(
    () => ({ store, toggleExpanded, select, indent, toggleIcon, showLines }),
    [store, toggleExpanded, select, indent, toggleIcon, showLines],
  );

  return (
    <TreeContext value={contextValue}>
      <div
        ref={rootRef}
        role="tree"
        tabIndex={-1}
        aria-label={label}
        onKeyDown={handleKeyDown}
        onFocus={(e) => {
          focusInsideRef.current = true;
          const target = e.target as HTMLElement;
          if (target.getAttribute('role') === 'treeitem') moveTabStop(target);
          else if (!tabStopRef.current?.isConnected) syncTabStop();
        }}
        onBlur={(e) => {
          if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
          if ((e.target as Node).isConnected) focusInsideRef.current = false;
        }}
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
  const { store, toggleExpanded, select, indent, toggleIcon, showLines } = useTreeContext();
  const depth = React.use(DepthContext);
  const shouldReduceMotion = useReducedMotion();
  const labelId = React.useId();
  const itemRef = React.useRef<HTMLDivElement>(null);
  const groupRef = React.useRef<HTMLDivElement>(null);

  const hasChildren = React.Children.count(children) > 0;
  const getOpen = () => store.get().expanded.has(value);
  const getSelected = () => store.get().selected === value;
  const isOpen = React.useSyncExternalStore(store.subscribe, getOpen, getOpen);
  const isSelected = React.useSyncExternalStore(store.subscribe, getSelected, getSelected);
  const showSelected = !hasChildren && isSelected;

  React.useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    if (!isOpen && group.contains(document.activeElement)) itemRef.current?.focus();
    group.toggleAttribute('inert', !isOpen);
  }, [isOpen]);

  const handleActivate = () => {
    if (disabled) return;
    if (hasChildren) {
      toggleExpanded(value);
      return;
    }
    select(value);
    onSelect?.();
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const row = (e.target as Element).closest('[data-tree-row]');
    if (row?.parentElement !== e.currentTarget) return;
    handleActivate();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleActivate();
    }
  };

  const resolvedIcon = isOpen && iconOpen !== undefined ? iconOpen : icon;

  return (
    <div
      ref={itemRef}
      role="treeitem"
      tabIndex={-1}
      aria-labelledby={labelId}
      aria-expanded={hasChildren ? isOpen : undefined}
      aria-selected={hasChildren ? undefined : showSelected}
      aria-level={depth + 1}
      aria-disabled={disabled || undefined}
      data-tree-item=""
      data-value={value}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="[&:focus-visible>[data-tree-row]]:ring-ring focus-visible:outline-none [&:focus-visible>[data-tree-row]]:ring-1"
    >
      <div
        data-tree-row=""
        className={cn(
          'flex items-center gap-1.5 rounded-md px-1.5 py-1 select-none',
          'transition-colors motion-reduce:transition-none',
          disabled ? 'cursor-not-allowed opacity-40' : 'hover:bg-muted cursor-pointer',
          showSelected && 'bg-muted text-foreground font-medium',
          className,
        )}
      >
        {hasChildren ? (
          <span
            aria-hidden="true"
            className="text-muted-foreground flex size-4 shrink-0 items-center justify-center"
          >
            {toggleIcon === 'plus-minus' ? (
              isOpen ? (
                <MinusIcon size={12} />
              ) : (
                <PlusIcon size={12} />
              )
            ) : (
              <span
                className={cn(
                  'transition-transform duration-200 motion-reduce:transition-none',
                  isOpen && 'rotate-90',
                )}
              >
                <ChevronRightIcon size={16} />
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

        <span id={labelId} data-tree-label="" className="min-w-0 flex-1 truncate">
          {label}
        </span>
      </div>

      {hasChildren && (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              ref={groupRef}
              data-tree-group=""
              role="group"
              initial={shouldReduceMotion ? false : 'closed'}
              animate="open"
              exit={shouldReduceMotion ? undefined : 'closed'}
              variants={collapse}
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
