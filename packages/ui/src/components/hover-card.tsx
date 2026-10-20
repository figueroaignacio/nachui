'use client';

import { AnimatePresence, type HTMLMotionProps, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';
import { FloatingPortal, useFloating } from '../lib/floating';
import { floatingOrigin, floatingVariants, reveal } from '../lib/motion';
import { assignRef, getFocusable, useLayer } from '../lib/overlay';
import { useControllableState } from '../lib/use-controllable-state';

const HOVER_CARD_STYLE = { willChange: 'opacity, transform, filter' } as const;

function nextFocusableAfter(anchor: HTMLElement, skip: HTMLElement) {
  return getFocusable(document.body).find(
    (element) =>
      !skip.contains(element) &&
      !anchor.contains(element) &&
      Boolean(anchor.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING),
  );
}

type HoverCardSide = 'top' | 'bottom' | 'left' | 'right';
type HoverCardAlign = 'start' | 'center' | 'end';

interface HoverCardContextValue {
  open: boolean;
  id: string;
  scheduleOpen: () => void;
  scheduleClose: () => void;
  openNow: () => void;
  closeNow: () => void;
  toggle: () => void;
  isInside: (node: Node | null) => boolean;
  rootRef: React.RefObject<HTMLElement | null>;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const HoverCardContext = React.createContext<HoverCardContextValue | null>(null);

function useHoverCardContext(): HoverCardContextValue {
  const context = React.use(HoverCardContext);
  if (!context) throw new Error('HoverCard parts must be used within HoverCard');
  return context;
}

interface HoverCardProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
}

const HoverCardRoot = ({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  openDelay = 500,
  closeDelay = 200,
}: HoverCardProps) => {
  const [open, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const id = React.useId();
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = React.useRef<HTMLSpanElement>(null);
  const triggerRef = React.useRef<HTMLElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const layer = useLayer(open, false, contentRef);

  const clearTimer = React.useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const scheduleOpen = React.useCallback(() => {
    clearTimer();
    timer.current = setTimeout(() => setOpen(true), openDelay);
  }, [clearTimer, openDelay, setOpen]);

  const scheduleClose = React.useCallback(() => {
    clearTimer();
    timer.current = setTimeout(() => setOpen(false), closeDelay);
  }, [clearTimer, closeDelay, setOpen]);

  const openNow = React.useCallback(() => {
    clearTimer();
    setOpen(true);
  }, [clearTimer, setOpen]);

  const closeNow = React.useCallback(() => {
    clearTimer();
    setOpen(false);
  }, [clearTimer, setOpen]);

  const toggle = React.useCallback(() => {
    clearTimer();
    setOpen((current) => !current);
  }, [clearTimer, setOpen]);

  const isInside = React.useCallback(
    (node: Node | null) =>
      Boolean(node && (rootRef.current?.contains(node) || contentRef.current?.contains(node))),
    [],
  );

  React.useEffect(() => clearTimer, [clearTimer]);

  React.useEffect(() => {
    if (!open) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented || !layer.isTopmost()) return;
      event.preventDefault();
      closeNow();
    };
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (isInside(target) || layer.isInsideUpperLayer(target)) return;
      closeNow();
    };
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [open, closeNow, isInside, layer]);

  const context = React.useMemo(
    () => ({
      open,
      id,
      scheduleOpen,
      scheduleClose,
      openNow,
      closeNow,
      toggle,
      isInside,
      rootRef,
      triggerRef,
      contentRef,
    }),
    [open, id, scheduleOpen, scheduleClose, openNow, closeNow, toggle, isInside],
  );

  return (
    <HoverCardContext value={context}>
      <span ref={rootRef} className="relative inline-flex">
        {children}
      </span>
    </HoverCardContext>
  );
};
HoverCardRoot.displayName = 'HoverCard';

interface HoverCardTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

type TriggerChildProps = {
  onPointerEnter?: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerLeave?: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerDown?: (event: React.PointerEvent<HTMLElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  className?: string;
  tabIndex?: number;
  ref?: React.Ref<HTMLElement>;
};

const HoverCardTrigger = ({
  asChild = false,
  children,
  className,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  onPointerDown,
  onClick,
  onKeyDown,
  ref,
  ...props
}: HoverCardTriggerProps & { ref?: React.Ref<HTMLElement> }) => {
  const {
    open,
    id,
    scheduleOpen,
    scheduleClose,
    openNow,
    toggle,
    isInside,
    triggerRef,
    contentRef,
  } = useHoverCardContext();
  const lastPointerType = React.useRef<string | null>(null);
  const childRef = React.isValidElement(children)
    ? (children.props as TriggerChildProps).ref
    : undefined;

  const mergedRef = React.useCallback(
    (node: HTMLElement | null) => {
      triggerRef.current = node;
      assignRef(ref, node);
      assignRef(childRef, node);
    },
    [ref, childRef, triggerRef],
  );

  const handlers = {
    onPointerEnter: (event: React.PointerEvent<HTMLElement>) => {
      onPointerEnter?.(event);
      if (event.pointerType !== 'touch') scheduleOpen();
    },
    onPointerLeave: (event: React.PointerEvent<HTMLElement>) => {
      onPointerLeave?.(event);
      if (event.pointerType !== 'touch') scheduleClose();
    },
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
      onPointerDown?.(event);
      lastPointerType.current = event.pointerType;
    },
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      onClick?.(event);
      if (lastPointerType.current === 'touch') toggle();
      lastPointerType.current = null;
    },
    onFocus: (event: React.FocusEvent<HTMLElement>) => {
      onFocus?.(event);
      if (lastPointerType.current !== 'touch') openNow();
    },
    onBlur: (event: React.FocusEvent<HTMLElement>) => {
      onBlur?.(event);
      if (isInside(event.relatedTarget as Node | null)) return;
      scheduleClose();
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || event.key !== 'Tab' || event.shiftKey || !open) return;
      const first = contentRef.current ? getFocusable(contentRef.current)[0] : undefined;
      if (!first) return;
      event.preventDefault();
      first.focus();
    },
  };

  const shared = {
    'data-slot': 'hover-card-trigger',
    'data-state': open ? 'open' : 'closed',
    'aria-describedby': open ? id : undefined,
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    const childProps = child.props as TriggerChildProps;

    return React.cloneElement(child, {
      ...props,
      ...shared,
      ref: mergedRef,
      tabIndex: childProps.tabIndex ?? props.tabIndex ?? 0,
      className: cn(className, childProps.className),
      onPointerEnter: (event: React.PointerEvent<HTMLElement>) => {
        childProps.onPointerEnter?.(event);
        handlers.onPointerEnter(event);
      },
      onPointerLeave: (event: React.PointerEvent<HTMLElement>) => {
        childProps.onPointerLeave?.(event);
        handlers.onPointerLeave(event);
      },
      onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
        childProps.onPointerDown?.(event);
        handlers.onPointerDown(event);
      },
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        childProps.onClick?.(event);
        handlers.onClick(event);
      },
      onFocus: (event: React.FocusEvent<HTMLElement>) => {
        childProps.onFocus?.(event);
        handlers.onFocus(event);
      },
      onBlur: (event: React.FocusEvent<HTMLElement>) => {
        childProps.onBlur?.(event);
        handlers.onBlur(event);
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
        childProps.onKeyDown?.(event);
        handlers.onKeyDown(event);
      },
    });
  }

  return (
    <span
      ref={mergedRef as React.Ref<HTMLSpanElement>}
      tabIndex={0}
      className={cn('inline-flex cursor-default', className)}
      {...shared}
      {...handlers}
      {...props}
    >
      {children}
    </span>
  );
};
HoverCardTrigger.displayName = 'HoverCardTrigger';

interface HoverCardContentProps extends HTMLMotionProps<'div'> {
  side?: HoverCardSide;
  align?: HoverCardAlign;
  sideOffset?: number;
  children?: React.ReactNode;
}

const HoverCardPanel = ({
  side: preferredSide = 'bottom',
  align = 'center',
  sideOffset = 4,
  className,
  children,
  style,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  onKeyDown,
  ...props
}: HoverCardContentProps) => {
  const { id, openNow, scheduleClose, isInside, triggerRef, contentRef } = useHoverCardContext();
  const shouldReduceMotion = useReducedMotion();
  const floating = useFloating({
    open: true,
    anchorRef: triggerRef,
    floatingRef: contentRef,
    side: preferredSide,
    align,
    sideOffset,
  });
  const side = floating.side;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.key !== 'Tab') return;
    const content = contentRef.current;
    const trigger = triggerRef.current;
    if (!content || !trigger) return;
    const focusable = getFocusable(content);
    const active = document.activeElement;

    if (event.shiftKey) {
      if (active === focusable[0]) {
        event.preventDefault();
        trigger.focus();
      }
      return;
    }

    if (active === focusable[focusable.length - 1]) {
      const next = nextFocusableAfter(trigger, content);
      if (!next) return;
      event.preventDefault();
      next.focus();
    }
  };

  return (
    <motion.div
      ref={contentRef}
      id={id}
      data-slot="hover-card-content"
      data-side={side}
      data-align={align}
      variants={shouldReduceMotion ? reveal : floatingVariants[side]}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ ...HOVER_CARD_STYLE, ...style, ...floating.style }}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (event.pointerType !== 'touch') openNow();
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        if (event.pointerType !== 'touch') scheduleClose();
      }}
      onFocus={(event) => {
        onFocus?.(event);
        openNow();
      }}
      onBlur={(event) => {
        onBlur?.(event);
        if (isInside(event.relatedTarget as Node | null)) return;
        scheduleClose();
      }}
      onKeyDown={handleKeyDown}
      className={cn(
        'bg-popover text-popover-foreground border-border z-500 max-h-(--available-height) w-64 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-md border p-4 shadow-md outline-none',
        floatingOrigin[side],
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const HoverCardContent = (props: HoverCardContentProps) => {
  const { open } = useHoverCardContext();

  return (
    <FloatingPortal>
      <AnimatePresence>{open && <HoverCardPanel {...props} />}</AnimatePresence>
    </FloatingPortal>
  );
};
HoverCardContent.displayName = 'HoverCardContent';

const HoverCard = Object.assign(HoverCardRoot, {
  Trigger: HoverCardTrigger,
  Content: HoverCardContent,
});

export { HoverCard, useHoverCardContext };
export type {
  HoverCardProps,
  HoverCardTriggerProps,
  HoverCardContentProps,
  HoverCardSide,
  HoverCardAlign,
};
