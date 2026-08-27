'use client';

import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';

interface ContextMenuContextValue {
  isOpen: boolean;
  point: { x: number; y: number };
  openAt: (x: number, y: number) => void;
  closeMenu: (options?: { restoreFocus?: boolean }) => void;
  rootRef: React.RefObject<HTMLDivElement | null>;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  triggerId: string;
  contentId: string;
}

interface ContextMenuProps {
  children: React.ReactNode;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

interface ContextMenuTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  disabled?: boolean;
}

interface ContextMenuContentProps {
  children: React.ReactNode;
  className?: string;
}

interface ContextMenuItemProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  disabled?: boolean;
  onSelect?: () => void;
  variant?: 'default' | 'destructive';
}

const CONTEXT_MENU_INITIAL = { opacity: 0, scale: 0.95, filter: 'blur(4px)' } as const;

const CONTEXT_MENU_ANIMATE = {
  opacity: 1,
  scale: 1,
  filter: 'blur(0px)',
  transition: {
    type: 'spring',
    duration: 0.25,
    bounce: 0,
    opacity: { duration: 0.15 },
  },
} as const;

const CONTEXT_MENU_EXIT = {
  opacity: 0,
  scale: 0.98,
  filter: 'blur(2px)',
  transition: { duration: 0.12 },
} as const;

const CONTEXT_MENU_STYLE = { willChange: 'opacity, transform, filter' } as const;

const LONG_PRESS_MS = 500;
const VIEWPORT_PADDING = 8;

const ContextMenuContext = React.createContext<ContextMenuContextValue | null>(null);

const useContextMenuContext = (): ContextMenuContextValue => {
  const context = React.use(ContextMenuContext);
  if (!context) throw new Error('ContextMenu components must be used within ContextMenu');
  return context;
};

function getMenuItems(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])'),
  );
}

const ContextMenuRoot = ({
  children,
  className,
  onOpenChange,
}: ContextMenuProps): React.JSX.Element => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [point, setPoint] = React.useState({ x: 0, y: 0 });
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const openAt = React.useCallback(
    (x: number, y: number) => {
      setPoint({ x, y });
      setIsOpen(true);
      onOpenChange?.(true);
    },
    [onOpenChange],
  );

  const closeMenu = React.useCallback(
    (options?: { restoreFocus?: boolean }) => {
      setIsOpen(false);
      onOpenChange?.(false);
      if (options?.restoreFocus !== false) {
        triggerRef.current?.focus();
      }
    },
    [onOpenChange],
  );

  const id = React.useId();
  const triggerId = `context-menu-trigger-${id}`;
  const contentId = `context-menu-content-${id}`;

  const contextValue = React.useMemo(
    () => ({ isOpen, point, openAt, closeMenu, rootRef, triggerRef, triggerId, contentId }),
    [isOpen, point, openAt, closeMenu, triggerId, contentId],
  );

  return (
    <ContextMenuContext value={contextValue}>
      <div ref={rootRef} className={cn('relative', className)}>
        {children}
      </div>
    </ContextMenuContext>
  );
};

const ContextMenuTrigger = ({
  children,
  className,
  disabled = false,
  onContextMenu,
  onKeyDown,
  ...props
}: ContextMenuTriggerProps): React.JSX.Element => {
  const { isOpen, openAt, triggerRef, triggerId, contentId } = useContextMenuContext();
  const longPressTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLongPress = React.useCallback(() => {
    if (longPressTimer.current !== null) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  React.useEffect(() => clearLongPress, [clearLongPress]);

  const handleContextMenu = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onContextMenu?.(e);
      if (disabled) return;
      e.preventDefault();
      openAt(e.clientX, e.clientY);
    },
    [disabled, openAt, onContextMenu],
  );

  const handleTouchStart = React.useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (disabled) return;
      const touch = e.touches[0];
      if (!touch) return;
      const { clientX, clientY } = touch;
      clearLongPress();
      longPressTimer.current = setTimeout(() => openAt(clientX, clientY), LONG_PRESS_MS);
    },
    [disabled, openAt, clearLongPress],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (disabled) return;
      if ((e.shiftKey && e.key === 'F10') || e.key === 'ContextMenu') {
        e.preventDefault();
        const rect = triggerRef.current?.getBoundingClientRect();
        if (rect) openAt(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    },
    [disabled, openAt, triggerRef, onKeyDown],
  );

  return (
    <div
      ref={triggerRef}
      id={triggerId}
      tabIndex={disabled ? undefined : 0}
      aria-haspopup="menu"
      aria-expanded={isOpen}
      aria-controls={isOpen ? contentId : undefined}
      data-state={isOpen ? 'open' : 'closed'}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchEnd={clearLongPress}
      onTouchMove={clearLongPress}
      onKeyDown={handleKeyDown}
      className={cn(
        'focus-visible:ring-ring select-none focus-visible:ring-1 focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const ContextMenuContent = ({
  children,
  className,
}: ContextMenuContentProps): React.JSX.Element | null => {
  const { isOpen, point, closeMenu, rootRef, contentId, triggerId } = useContextMenuContext();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [coords, setCoords] = React.useState<{ left: number; top: number } | null>(null);

  React.useLayoutEffect(() => {
    if (!isOpen) {
      setCoords(null);
      return;
    }
    const content = contentRef.current;
    const root = rootRef.current;
    if (!content || !root) return;

    const rootRect = root.getBoundingClientRect();
    let x = point.x;
    let y = point.y;
    x = Math.min(x, window.innerWidth - content.offsetWidth - VIEWPORT_PADDING);
    y = Math.min(y, window.innerHeight - content.offsetHeight - VIEWPORT_PADDING);
    x = Math.max(VIEWPORT_PADDING, x);
    y = Math.max(VIEWPORT_PADDING, y);

    setCoords({ left: x - rootRect.left, top: y - rootRect.top });
  }, [isOpen, point, rootRef]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (contentRef.current?.contains(event.target as Node)) return;
      closeMenu({ restoreFocus: false });
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen, closeMenu]);

  React.useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => {
      getMenuItems(contentRef.current)[0]?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key === 'Tab') {
        closeMenu();
        return;
      }

      const items = getMenuItems(contentRef.current);
      if (items.length === 0) return;

      const currentIndex = items.indexOf(document.activeElement as HTMLElement);

      let nextIndex: number | null = null;
      if (e.key === 'ArrowDown') {
        nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
      } else if (e.key === 'ArrowUp') {
        nextIndex =
          currentIndex < 0 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = items.length - 1;
      }

      if (nextIndex !== null) {
        e.preventDefault();
        items[nextIndex]?.focus();
      }
    },
    [closeMenu],
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={contentRef}
          id={contentId}
          role="menu"
          aria-labelledby={triggerId}
          onKeyDown={handleKeyDown}
          initial={CONTEXT_MENU_INITIAL}
          animate={CONTEXT_MENU_ANIMATE}
          exit={CONTEXT_MENU_EXIT}
          style={{
            left: coords?.left ?? 0,
            top: coords?.top ?? 0,
            visibility: coords ? undefined : 'hidden',
            ...CONTEXT_MENU_STYLE,
          }}
          className={cn(
            'border-border bg-background absolute z-50 min-w-48 origin-top-left overflow-hidden rounded-md border',
            className,
          )}
        >
          <div className="flex flex-col gap-0.5 p-1.5">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const itemClassName = (disabled: boolean, variant: 'default' | 'destructive') =>
  cn(
    'relative flex cursor-pointer items-center gap-2 rounded-sm px-3 py-1.5 text-sm outline-none select-none',
    'transition-colors duration-150',
    'hover:bg-muted focus-visible:bg-muted focus:bg-muted',
    disabled && 'pointer-events-none opacity-40',
    variant === 'destructive' && 'text-destructive focus:text-destructive',
  );

const ContextMenuItem = ({
  children,
  onClick,
  className,
  disabled = false,
  variant = 'default',
  onSelect,
}: ContextMenuItemProps): React.JSX.Element => {
  const { closeMenu } = useContextMenuContext();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.stopPropagation();
      onClick?.(e);
      onSelect?.();
      closeMenu();
    },
    [disabled, onClick, onSelect, closeMenu],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
        onSelect?.();
        closeMenu();
      }
    },
    [disabled, onClick, onSelect, closeMenu],
  );

  return (
    <div
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(itemClassName(disabled, variant), className)}
    >
      {children}
    </div>
  );
};

const ContextMenuLabel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      role="presentation"
      className={cn(
        'text-muted-foreground px-3 py-2 text-xs font-semibold tracking-wider uppercase',
        className,
      )}
    >
      {children}
    </div>
  );
};

const ContextMenuSeparator = ({ className }: { className?: string }) => {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn('bg-border/50 my-1 h-px', className)}
    />
  );
};

const ContextMenuShortcut = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span className={cn('text-muted-foreground ml-auto pl-6 text-xs tracking-widest', className)}>
      {children}
    </span>
  );
};

const ContextMenu = Object.assign(ContextMenuRoot, {
  Trigger: ContextMenuTrigger,
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  Label: ContextMenuLabel,
  Separator: ContextMenuSeparator,
  Shortcut: ContextMenuShortcut,
});

export { ContextMenu };
export type {
  ContextMenuContentProps,
  ContextMenuItemProps,
  ContextMenuProps,
  ContextMenuTriggerProps,
};
