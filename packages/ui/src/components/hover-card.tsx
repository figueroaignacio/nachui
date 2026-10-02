'use client';

import { AnimatePresence, type HTMLMotionProps, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';
import { floatingOrigin, floatingVariants, reveal } from '../lib/motion';

const HOVER_CARD_POSITION_CLASSES = {
  top: {
    start: 'bottom-full left-0 mb-2',
    center: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    end: 'bottom-full right-0 mb-2',
  },
  bottom: {
    start: 'top-full left-0 mt-2',
    center: 'top-full left-1/2 -translate-x-1/2 mt-2',
    end: 'top-full right-0 mt-2',
  },
  left: {
    start: 'right-full top-0 mr-2',
    center: 'right-full top-1/2 -translate-y-1/2 mr-2',
    end: 'right-full bottom-0 mr-2',
  },
  right: {
    start: 'left-full top-0 ml-2',
    center: 'left-full top-1/2 -translate-y-1/2 ml-2',
    end: 'left-full bottom-0 ml-2',
  },
} as const;

const HOVER_CARD_STYLE = { willChange: 'opacity, transform, filter' } as const;

const VIEWPORT_PADDING = 8;

function useViewportShift(ref: React.RefObject<HTMLElement | null>, open: boolean) {
  const [shift, setShift] = React.useState(0);

  React.useLayoutEffect(() => {
    if (!open) return;
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const { transform, translate } = el.style;
      el.style.transform = 'none';
      el.style.translate = '';
      const rect = el.getBoundingClientRect();
      el.style.transform = transform;
      el.style.translate = translate;
      const viewport = document.documentElement.clientWidth || window.innerWidth;
      if (!rect.width || !viewport) return;
      let next = 0;
      if (rect.right > viewport - VIEWPORT_PADDING) next = viewport - VIEWPORT_PADDING - rect.right;
      if (rect.left + next < VIEWPORT_PADDING) next = VIEWPORT_PADDING - rect.left;
      setShift(Math.round(next));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [open, ref]);

  return shift;
}

function shiftTranslate(shift: number, centeredX: boolean, centeredY: boolean) {
  if (!shift) return undefined;
  const x = centeredX ? `calc(-50% + ${shift}px)` : `${shift}px`;
  return centeredY ? `${x} -50%` : x;
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
  rootRef: React.RefObject<HTMLDivElement | null>;
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
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const id = React.useId();
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

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

  React.useEffect(() => clearTimer, [clearTimer]);

  React.useEffect(() => {
    if (!open) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeNow();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, closeNow]);

  const context = React.useMemo(
    () => ({ open, id, scheduleOpen, scheduleClose, openNow, closeNow, rootRef }),
    [open, id, scheduleOpen, scheduleClose, openNow, closeNow],
  );

  return (
    <HoverCardContext value={context}>
      <div ref={rootRef} className="relative inline-flex">
        {children}
      </div>
    </HoverCardContext>
  );
};
HoverCardRoot.displayName = 'HoverCard';

interface HoverCardTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

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
  ref,
  ...props
}: HoverCardTriggerProps & { ref?: React.Ref<HTMLElement> }) => {
  const { open, id, scheduleOpen, scheduleClose, openNow, rootRef } = useHoverCardContext();
  const lastPointerType = React.useRef<string | null>(null);

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
      if (lastPointerType.current === 'touch') openNow();
    },
    onFocus: (event: React.FocusEvent<HTMLElement>) => {
      onFocus?.(event);
      openNow();
    },
    onBlur: (event: React.FocusEvent<HTMLElement>) => {
      onBlur?.(event);
      const next = event.relatedTarget as Node | null;
      if (next && rootRef.current?.contains(next)) return;
      scheduleClose();
    },
  };

  const shared = {
    'data-slot': 'hover-card-trigger',
    'data-state': open ? 'open' : 'closed',
    'aria-describedby': open ? id : undefined,
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    const childProps = child.props as {
      onPointerEnter?: (event: React.PointerEvent<HTMLElement>) => void;
      onPointerLeave?: (event: React.PointerEvent<HTMLElement>) => void;
      onPointerDown?: (event: React.PointerEvent<HTMLElement>) => void;
      onClick?: (event: React.MouseEvent<HTMLElement>) => void;
      onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
      onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
      className?: string;
      tabIndex?: number;
    };

    return React.cloneElement(child, {
      ...props,
      ...shared,
      ref,
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
    });
  }

  return (
    <span
      ref={ref as React.Ref<HTMLSpanElement>}
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

const HoverCardContent = ({
  side = 'bottom',
  align = 'center',
  sideOffset = 4,
  className,
  children,
  onPointerEnter,
  onPointerLeave,
  onBlur,
  ...props
}: HoverCardContentProps) => {
  const { open, id, openNow, scheduleClose, rootRef } = useHoverCardContext();
  const shouldReduceMotion = useReducedMotion();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const shift = useViewportShift(contentRef, open);

  const offsetStyle = React.useMemo(
    () => ({
      ...(side === 'top' && { marginBottom: sideOffset }),
      ...(side === 'bottom' && { marginTop: sideOffset }),
      ...(side === 'left' && { marginRight: sideOffset }),
      ...(side === 'right' && { marginLeft: sideOffset }),
      ...HOVER_CARD_STYLE,
      translate: shiftTranslate(
        shift,
        align === 'center' && (side === 'top' || side === 'bottom'),
        align === 'center' && (side === 'left' || side === 'right'),
      ),
    }),
    [side, sideOffset, align, shift],
  );

  return (
    <AnimatePresence>
      {open && (
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
          style={offsetStyle}
          onPointerEnter={(event) => {
            onPointerEnter?.(event);
            openNow();
          }}
          onPointerLeave={(event) => {
            onPointerLeave?.(event);
            if (event.pointerType !== 'touch') scheduleClose();
          }}
          onBlur={(event) => {
            onBlur?.(event);
            const next = event.relatedTarget as Node | null;
            if (next && rootRef.current?.contains(next)) return;
            scheduleClose();
          }}
          className={cn(
            'bg-popover text-popover-foreground border-border absolute z-50 w-64 max-w-[calc(100vw-2rem)] rounded-md border p-4 shadow-md outline-none',
            HOVER_CARD_POSITION_CLASSES[side][align],
            floatingOrigin[side],
            className,
          )}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
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
