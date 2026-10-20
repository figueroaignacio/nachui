'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';
import { FloatingPortal, useFloating } from '../lib/floating';
import { floatingVariants, reveal, springs, tap } from '../lib/motion';
import { useLayer } from '../lib/overlay';
import { useControllableState } from '../lib/use-controllable-state';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function ChevronDownIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

type FocusEdge = 'first' | 'last';

interface DropdownContextValue {
  isOpen: boolean;
  toggleMenu: () => void;
  closeMenu: (options?: { restoreFocus?: boolean }) => void;
  openMenu: (focus?: FocusEdge) => void;
  initialFocusRef: React.RefObject<FocusEdge>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  triggerId: string;
  contentId: string;
}

interface DropdownMenuProps {
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  asChild?: boolean;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  disabled?: boolean;
  onSelect?: () => void;
  variant?: 'default' | 'destructive';
  asChild?: boolean;
}

const DROPDOWN_ICON_VARIANTS = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
} as const;

const DROPDOWN_ICON_STYLE = { willChange: 'transform' } as const;
const DROPDOWN_CONTENT_STYLE = { willChange: 'opacity, transform, filter' } as const;

const TYPEAHEAD_RESET_MS = 500;

const ORIGIN_CLASSES = {
  bottom: { start: 'origin-top-left', center: 'origin-top', end: 'origin-top-right' },
  top: { start: 'origin-bottom-left', center: 'origin-bottom', end: 'origin-bottom-right' },
} as const;

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

const useDropdownContext = (): DropdownContextValue => {
  const context = React.use(DropdownContext);
  if (!context) throw new Error('Dropdown components must be used within DropdownMenu');
  return context;
};

function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  triggerRef: React.RefObject<HTMLElement | null>,
  handler: () => void,
  enabled: boolean,
  isInsideUpperLayer: (target: EventTarget | null) => boolean,
) {
  React.useEffect(() => {
    if (!enabled) return;
    const handlePointerDownOutside = (event: PointerEvent) => {
      if (
        ref.current?.contains(event.target as Node) ||
        triggerRef.current?.contains(event.target as Node) ||
        isInsideUpperLayer(event.target)
      ) {
        return;
      }
      handler();
    };
    document.addEventListener('pointerdown', handlePointerDownOutside);
    return () => document.removeEventListener('pointerdown', handlePointerDownOutside);
  }, [ref, triggerRef, handler, enabled, isInsideUpperLayer]);
}

function getMenuItems(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])'),
  );
}

function focusEdge(container: HTMLElement | null, edge: FocusEdge) {
  const items = getMenuItems(container);
  (edge === 'last' ? items[items.length - 1] : items[0])?.focus();
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

const DropdownMenuRoot = ({
  children,
  className,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: DropdownMenuProps): React.JSX.Element => {
  const [isOpen, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const initialFocusRef = React.useRef<FocusEdge>('first');

  const openMenu = React.useCallback(
    (focus: FocusEdge = 'first') => {
      initialFocusRef.current = focus;
      setOpen(true);
    },
    [setOpen],
  );

  const closeMenu = React.useCallback(
    (options?: { restoreFocus?: boolean }) => {
      setOpen(false);
      if (options?.restoreFocus !== false) {
        triggerRef.current?.focus();
      }
    },
    [setOpen],
  );

  const toggleMenu = React.useCallback(() => {
    initialFocusRef.current = 'first';
    setOpen(!isOpen);
  }, [setOpen, isOpen]);

  const id = React.useId();
  const triggerId = `dropdown-trigger-${id}`;
  const contentId = `dropdown-content-${id}`;

  const contextValue = React.useMemo(
    () => ({
      isOpen,
      openMenu,
      closeMenu,
      toggleMenu,
      initialFocusRef,
      triggerRef,
      contentRef,
      triggerId,
      contentId,
    }),
    [isOpen, openMenu, closeMenu, toggleMenu, triggerId, contentId],
  );

  return (
    <DropdownContext value={contextValue}>
      <div className={cn('relative inline-block text-left', className)}>{children}</div>
    </DropdownContext>
  );
};

const DropdownMenuTrigger = ({
  children,
  onClick,
  className,
  asChild = false,
}: DropdownMenuTriggerProps): React.JSX.Element => {
  const { isOpen, toggleMenu, openMenu, triggerRef, contentRef, triggerId, contentId } =
    useDropdownContext();
  const shouldReduceMotion = useReducedMotion();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      toggleMenu();
      onClick?.(e);
    },
    [toggleMenu, onClick],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const edge = e.key === 'ArrowUp' ? 'last' : 'first';
        if (isOpen) focusEdge(contentRef.current, edge);
        else openMenu(edge);
      }
    },
    [isOpen, openMenu, contentRef],
  );

  const triggerA11yProps = {
    'aria-expanded': isOpen,
    'aria-haspopup': 'menu' as const,
    'aria-controls': isOpen ? contentId : undefined,
    id: triggerId,
  };

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as {
      onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
      onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
    };

    return React.cloneElement(children, {
      ref: triggerRef,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        childProps.onClick?.(e);
        handleClick(e);
      },
      onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
        childProps.onKeyDown?.(e);
        handleKeyDown(e);
      },
      ...triggerA11yProps,
    } as React.HTMLAttributes<HTMLElement>);
  }

  return (
    <motion.button
      ref={triggerRef}
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      whileTap={!shouldReduceMotion ? tap : undefined}
      transition={springs.snappy}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium',
        'text-foreground border-border border',
        'hover:bg-muted transition-colors',
        'ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      )}
      {...triggerA11yProps}
    >
      {children}
      <motion.span
        aria-hidden="true"
        variants={DROPDOWN_ICON_VARIANTS}
        animate={isOpen ? 'open' : 'closed'}
        transition={springs.snappy}
        style={DROPDOWN_ICON_STYLE}
      >
        <ChevronDownIcon className="h-4 w-4 opacity-50" size={16} />
      </motion.span>
    </motion.button>
  );
};

const DropdownMenuContent = ({
  children,
  className,
  align = 'start',
  sideOffset = 6,
}: DropdownMenuContentProps): React.JSX.Element | null => {
  const { isOpen, closeMenu, contentId, triggerId, triggerRef, contentRef, initialFocusRef } =
    useDropdownContext();
  const layer = useLayer(isOpen, false, contentRef);
  const typeahead = useTypeahead();
  const shouldReduceMotion = useReducedMotion();
  const { style: floatingStyle, side } = useFloating({
    open: isOpen,
    anchorRef: triggerRef,
    floatingRef: contentRef,
    side: 'bottom',
    align,
    sideOffset,
  });
  const verticalSide = side === 'top' ? 'top' : 'bottom';

  const closeWithoutFocus = React.useCallback(
    () => closeMenu({ restoreFocus: false }),
    [closeMenu],
  );

  useClickOutside(contentRef, triggerRef, closeWithoutFocus, isOpen, layer.isInsideUpperLayer);

  React.useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => {
      focusEdge(contentRef.current, initialFocusRef.current);
    });
    return () => cancelAnimationFrame(frame);
  }, [isOpen, contentRef, initialFocusRef]);

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
    [closeMenu, contentRef, layer, typeahead],
  );

  const style = React.useMemo(
    () => ({
      ...floatingStyle,
      ...(isOpen ? null : { visibility: undefined }),
      ...DROPDOWN_CONTENT_STYLE,
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
            variants={shouldReduceMotion ? reveal : floatingVariants[verticalSide]}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={style}
            className={cn(
              'bg-popover text-popover-foreground border-border z-500 max-h-(--available-height) min-w-48 overflow-y-auto overscroll-contain rounded-md border shadow-md outline-none',
              ORIGIN_CLASSES[verticalSide][align],
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

const DropdownMenuItem = ({
  children,
  onClick,
  className,
  disabled = false,
  variant = 'default',
  onSelect,
  asChild = false,
}: DropdownMenuItemProps): React.JSX.Element => {
  const { closeMenu } = useDropdownContext();

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
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.stopPropagation();
      const target = e.currentTarget as HTMLElement;
      if (target instanceof HTMLAnchorElement && target.hasAttribute('href')) {
        if (e.key === ' ') {
          e.preventDefault();
          target.click();
        }
        return;
      }
      e.preventDefault();
      onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
      onSelect?.();
      closeMenu();
    },
    [disabled, onClick, onSelect, closeMenu],
  );

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (disabled || e.pointerType === 'touch') return;
      if (document.activeElement !== e.currentTarget) e.currentTarget.focus();
    },
    [disabled],
  );

  const handlePointerLeave = React.useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (document.activeElement !== e.currentTarget) return;
    e.currentTarget.closest<HTMLElement>('[role="menu"]')?.focus();
  }, []);

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as Record<string, unknown>;
    const childOnClick = childProps.onClick as
      | ((e: React.MouseEvent<HTMLDivElement>) => void)
      | undefined;
    const childOnKeyDown = childProps.onKeyDown as
      | ((e: React.KeyboardEvent<HTMLDivElement>) => void)
      | undefined;
    const childOnPointerMove = childProps.onPointerMove as
      | ((e: React.PointerEvent<HTMLElement>) => void)
      | undefined;
    const childOnPointerLeave = childProps.onPointerLeave as
      | ((e: React.PointerEvent<HTMLElement>) => void)
      | undefined;

    return React.cloneElement(children, {
      onClick: (e: React.MouseEvent<HTMLDivElement>) => {
        childOnClick?.(e);
        handleClick(e);
      },
      onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
        childOnKeyDown?.(e);
        handleKeyDown(e);
      },
      onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
        childOnPointerMove?.(e);
        handlePointerMove(e);
      },
      onPointerLeave: (e: React.PointerEvent<HTMLElement>) => {
        childOnPointerLeave?.(e);
        handlePointerLeave(e);
      },
      role: 'menuitem',
      tabIndex: -1,
      'aria-disabled': disabled || undefined,
      className: cn(
        itemClassName(disabled, variant),
        className,
        childProps.className as string | undefined,
      ),
      style: childProps.style as React.CSSProperties | undefined,
    } as React.ComponentProps<'div'>);
  }

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

const DropdownLabel = ({
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

const DropdownSeparator = ({ className }: { className?: string }) => {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn('bg-border/50 my-1 h-px', className)}
    />
  );
};

const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  Label: DropdownLabel,
  Separator: DropdownSeparator,
});

export { DropdownMenu };
export type {
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuProps,
  DropdownMenuTriggerProps,
};
