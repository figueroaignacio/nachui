'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';
import { FloatingPortal, useFloating } from '../lib/floating';
import { floatingVariants, reveal } from '../lib/motion';
import { useLayer } from '../lib/overlay';
import { useControllableState } from '../lib/use-controllable-state';

interface ContextMenuContextValue {
  isOpen: boolean;
  point: { x: number; y: number } | null;
  openAt: (x: number, y: number) => void;
  closeMenu: (options?: { restoreFocus?: boolean }) => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  triggerId: string;
  contentId: string;
}

interface ContextMenuProps {
  children: React.ReactNode;
  className?: string;
  open?: boolean;
  defaultOpen?: boolean;
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

const CONTEXT_MENU_STYLE = { willChange: 'opacity, transform, filter' } as const;

const LONG_PRESS_MS = 500;
const LONG_PRESS_TOLERANCE = 10;
const TYPEAHEAD_RESET_MS = 500;

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

function useTypeahead() {
  const bufferRef = React.useRef('');
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  const isTyping = React.useCallback(() => bufferRef.current !== '', []);

  const search = React.useCallback((key: string, items: HTMLElement[], current: number) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      bufferRef.current = '';
    }, TYPEAHEAD_RESET_MS);
    const buffer = bufferRef.current + key.toLowerCase();
    bufferRef.current = buffer;
    const repeated = Array.from(buffer).every((char) => char === buffer[0]);
    const query = repeated ? buffer.charAt(0) : buffer;
    const start = repeated ? current + 1 : Math.max(current, 0);
    const ordered = [...items.slice(start), ...items.slice(0, start)];
    return ordered.find((item) => item.textContent?.trim().toLowerCase().startsWith(query));
  }, []);

  return React.useMemo(() => ({ search, isTyping }), [search, isTyping]);
}

const ContextMenuRoot = ({
  children,
  className,
  open,
  defaultOpen = false,
  onOpenChange,
}: ContextMenuProps): React.JSX.Element => {
  const [isOpen, setIsOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [point, setPoint] = React.useState<{ x: number; y: number } | null>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const openAt = React.useCallback(
    (x: number, y: number) => {
      setPoint({ x, y });
      setIsOpen(true);
    },
    [setIsOpen],
  );

  const closeMenu = React.useCallback(
    (options?: { restoreFocus?: boolean }) => {
      setIsOpen(false);
      if (options?.restoreFocus !== false) {
        triggerRef.current?.focus();
      }
    },
    [setIsOpen],
  );

  const id = React.useId();
  const triggerId = `context-menu-trigger-${id}`;
  const contentId = `context-menu-content-${id}`;

  const contextValue = React.useMemo(
    () => ({ isOpen, point, openAt, closeMenu, triggerRef, triggerId, contentId }),
    [isOpen, point, openAt, closeMenu, triggerId, contentId],
  );

  return (
    <ContextMenuContext value={contextValue}>
      <div className={cn('relative', className)}>{children}</div>
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
  const { isOpen, openAt, triggerRef, triggerId } = useContextMenuContext();
  const longPressTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressStart = React.useRef<{ x: number; y: number } | null>(null);

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
      longPressStart.current = { x: clientX, y: clientY };
      longPressTimer.current = setTimeout(() => openAt(clientX, clientY), LONG_PRESS_MS);
    },
    [disabled, openAt, clearLongPress],
  );

  const handleTouchMove = React.useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const start = longPressStart.current;
      const touch = e.touches[0];
      if (!start || !touch) return;
      const distance = Math.hypot(touch.clientX - start.x, touch.clientY - start.y);
      if (distance > LONG_PRESS_TOLERANCE) clearLongPress();
    },
    [clearLongPress],
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
      aria-keyshortcuts={disabled ? undefined : 'Shift+F10 ContextMenu'}
      data-state={isOpen ? 'open' : 'closed'}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchEnd={clearLongPress}
      onTouchCancel={clearLongPress}
      onTouchMove={handleTouchMove}
      onKeyDown={handleKeyDown}
      className={cn(
        'ring-offset-background focus-visible:ring-ring select-none [-webkit-touch-callout:none] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
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
  const { isOpen, point, closeMenu, triggerRef, contentId, triggerId } = useContextMenuContext();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const layer = useLayer(isOpen, false, contentRef);
  const typeahead = useTypeahead();
  const shouldReduceMotion = useReducedMotion();
  const { style: floatingStyle, side } = useFloating({
    open: isOpen,
    anchorRef: triggerRef,
    floatingRef: contentRef,
    point,
    side: 'bottom',
    align: 'start',
    sideOffset: point ? 0 : 4,
  });
  const verticalSide = side === 'top' ? 'top' : 'bottom';

  React.useEffect(() => {
    if (!isOpen) return;
    const dismiss = () => closeMenu({ restoreFocus: false });
    const handlePointerDown = (event: PointerEvent) => {
      if (contentRef.current?.contains(event.target as Node)) return;
      if (layer.isInsideUpperLayer(event.target)) return;
      dismiss();
    };
    const handleScroll = (event: Event) => {
      if (event.target instanceof Node && contentRef.current?.contains(event.target)) return;
      dismiss();
    };
    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    window.addEventListener('resize', dismiss);
    window.addEventListener('blur', dismiss);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('scroll', handleScroll, { capture: true });
      window.removeEventListener('resize', dismiss);
      window.removeEventListener('blur', dismiss);
    };
  }, [isOpen, closeMenu, layer]);

  React.useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => {
      getMenuItems(contentRef.current)[0]?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        if (!layer.isTopmost()) return;
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
      } else if (
        e.key.length === 1 &&
        !e.altKey &&
        !e.ctrlKey &&
        !e.metaKey &&
        (e.key !== ' ' || typeahead.isTyping())
      ) {
        e.preventDefault();
        e.stopPropagation();
        typeahead.search(e.key, items, currentIndex)?.focus();
        return;
      }

      if (nextIndex !== null) {
        e.preventDefault();
        items[nextIndex]?.focus();
      }
    },
    [closeMenu, layer, typeahead],
  );

  const style = React.useMemo(
    () => ({
      ...floatingStyle,
      ...(isOpen ? null : { visibility: undefined }),
      ...CONTEXT_MENU_STYLE,
    }),
    [floatingStyle, isOpen],
  );

  return (
    <FloatingPortal>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={contentRef}
            id={contentId}
            role="menu"
            tabIndex={-1}
            aria-labelledby={triggerId}
            onKeyDownCapture={handleKeyDown}
            onContextMenu={(event: React.MouseEvent) => event.preventDefault()}
            variants={shouldReduceMotion ? reveal : floatingVariants[verticalSide]}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={style}
            className={cn(
              'bg-popover text-popover-foreground border-border z-500 max-h-(--available-height) min-w-48 overflow-y-auto overscroll-contain rounded-md border shadow-md outline-none',
              verticalSide === 'top' ? 'origin-bottom-left' : 'origin-top-left',
              className,
            )}
          >
            <div className="flex flex-col gap-0.5 p-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </FloatingPortal>
  );
};

const itemClassName = (disabled: boolean, variant: 'default' | 'destructive') =>
  cn(
    'relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none',
    'transition-colors duration-150',
    'focus-visible:bg-muted focus:bg-muted pointer-coarse:py-2.5',
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

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || e.pointerType === 'touch') return;
      if (document.activeElement !== e.currentTarget) e.currentTarget.focus();
    },
    [disabled],
  );

  const handlePointerLeave = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (document.activeElement !== e.currentTarget) return;
    e.currentTarget.closest<HTMLElement>('[role="menu"]')?.focus();
  }, []);

  return (
    <div
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
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
        'text-muted-foreground px-2 py-2 text-xs font-semibold tracking-wider uppercase',
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
