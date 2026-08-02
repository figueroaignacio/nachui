'use client';

import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';

// --- Interfaces ---

interface DropdownContextValue {
  isOpen: boolean;
  toggleMenu: () => void;
  closeMenu: (options?: { restoreFocus?: boolean }) => void;
  openMenu: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
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

// --- Animation constants (module level) ---

const DROPDOWN_ICON_VARIANTS = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
} as const;

const DROPDOWN_ICON_TRANSITION = { type: 'spring', stiffness: 300, damping: 20 } as const;
const DROPDOWN_ICON_STYLE = { willChange: 'transform' } as const;
const DROPDOWN_CONTENT_STYLE = { willChange: 'opacity, transform, filter' } as const;

const ALIGN_CLASSES = {
  start: 'left-0',
  center: 'left-1/2 -translate-x-1/2',
  end: 'right-0',
} as const;

const DROPDOWN_INITIAL = {
  bottom: { opacity: 0, scale: 0.95, y: -8, filter: 'blur(4px)' },
  top: { opacity: 0, scale: 0.95, y: 8, filter: 'blur(4px)' },
} as const;

const DROPDOWN_ANIMATE = {
  opacity: 1,
  scale: 1,
  y: 0,
  filter: 'blur(0px)',
  transition: {
    type: 'spring',
    duration: 0.3,
    bounce: 0,
    opacity: { duration: 0.2 },
  },
} as const;

const DROPDOWN_EXIT = {
  bottom: {
    opacity: 0,
    scale: 0.98,
    y: -4,
    filter: 'blur(2px)',
    transition: { duration: 0.15 },
  },
  top: {
    opacity: 0,
    scale: 0.98,
    y: 4,
    filter: 'blur(2px)',
    transition: { duration: 0.15 },
  },
} as const;

// --- Context ---

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

const useDropdownContext = (): DropdownContextValue => {
  const context = React.use(DropdownContext);
  if (!context) throw new Error('Dropdown components must be used within DropdownMenu');
  return context;
};

// --- Helpers ---

function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  triggerRef: React.RefObject<HTMLElement | null>,
  handler: () => void,
  enabled: boolean,
) {
  React.useEffect(() => {
    if (!enabled) return;
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        ref.current?.contains(event.target as Node) ||
        triggerRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      handler();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref, triggerRef, handler, enabled]);
}

function getMenuItems(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])'),
  );
}

// --- Components ---

const DropdownMenuRoot = ({
  children,
  className,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: DropdownMenuProps): React.JSX.Element => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const openMenu = React.useCallback(() => setOpen(true), [setOpen]);

  const closeMenu = React.useCallback(
    (options?: { restoreFocus?: boolean }) => {
      setOpen(false);
      if (options?.restoreFocus !== false) {
        triggerRef.current?.focus();
      }
    },
    [setOpen],
  );

  const toggleMenu = React.useCallback(() => setOpen(!isOpen), [setOpen, isOpen]);

  const id = React.useId();
  const triggerId = `dropdown-trigger-${id}`;
  const contentId = `dropdown-content-${id}`;

  const contextValue = React.useMemo(
    () => ({
      isOpen,
      openMenu,
      closeMenu,
      toggleMenu,
      triggerRef,
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
  const { isOpen, toggleMenu, openMenu, triggerRef, triggerId, contentId } = useDropdownContext();
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
        openMenu();
      }
    },
    [openMenu],
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
      whileTap={!shouldReduceMotion ? { scale: 0.98 } : undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium',
        'text-foreground border-border border',
        'hover:bg-muted transition-colors',
        'focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none',
        className,
      )}
      {...triggerA11yProps}
    >
      {children}
      <motion.span
        aria-hidden="true"
        variants={DROPDOWN_ICON_VARIANTS}
        animate={isOpen ? 'open' : 'closed'}
        transition={DROPDOWN_ICON_TRANSITION}
        style={DROPDOWN_ICON_STYLE}
      >
        <HugeiconsIcon icon={ArrowDown01Icon} className="h-4 w-4 opacity-50" size={16} />
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
  const { isOpen, closeMenu, contentId, triggerId, triggerRef } = useDropdownContext();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState<'bottom' | 'top'>('bottom');

  const closeWithoutFocus = React.useCallback(
    () => closeMenu({ restoreFocus: false }),
    [closeMenu],
  );

  useClickOutside(contentRef, triggerRef, closeWithoutFocus, isOpen);

  React.useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    let ticking = false;

    const updatePosition = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (!triggerRef.current) return;
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const contentHeight = contentRef.current?.offsetHeight || 200;
        const windowHeight = window.innerHeight;
        const spaceBelow = windowHeight - triggerRect.bottom;

        const newPosition = spaceBelow < contentHeight + 20 ? 'top' : 'bottom';
        setPosition(newPosition);
        ticking = false;
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, triggerRef]);

  // Move focus to the first item when the menu opens.
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

  const transformOriginClass =
    position === 'bottom'
      ? align === 'start'
        ? 'origin-top-left'
        : align === 'end'
          ? 'origin-top-right'
          : 'origin-top'
      : align === 'start'
        ? 'origin-bottom-left'
        : align === 'end'
          ? 'origin-bottom-right'
          : 'origin-bottom';

  const verticalStyle =
    position === 'bottom'
      ? { top: `calc(100% + ${sideOffset}px)` }
      : { bottom: `calc(100% + ${sideOffset}px)` };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={contentRef}
          id={contentId}
          role="menu"
          aria-labelledby={triggerId}
          onKeyDown={handleKeyDown}
          initial={DROPDOWN_INITIAL[position]}
          animate={DROPDOWN_ANIMATE}
          exit={DROPDOWN_EXIT[position]}
          style={{ ...verticalStyle, ...DROPDOWN_CONTENT_STYLE }}
          className={cn(
            'border-border absolute z-50 min-w-48 overflow-hidden rounded-md border',
            'bg-background',
            ALIGN_CLASSES[align],
            transformOriginClass,
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
    'relative flex cursor-pointer items-center rounded-sm px-3 py-1.5 text-sm outline-none select-none',
    'transition-colors duration-150',
    'hover:bg-muted focus-visible:bg-muted focus:bg-muted',
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

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as Record<string, unknown>;
    const childOnClick = childProps.onClick as
      | ((e: React.MouseEvent<HTMLDivElement>) => void)
      | undefined;
    const childOnKeyDown = childProps.onKeyDown as
      | ((e: React.KeyboardEvent<HTMLDivElement>) => void)
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
        'text-muted-foreground px-3 py-2 text-xs font-semibold tracking-wider uppercase',
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
