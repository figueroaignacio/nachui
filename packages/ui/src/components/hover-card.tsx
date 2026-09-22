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

type HoverCardSide = 'top' | 'bottom' | 'left' | 'right';
type HoverCardAlign = 'start' | 'center' | 'end';

interface HoverCardContextValue {
  open: boolean;
  id: string;
  scheduleOpen: () => void;
  scheduleClose: () => void;
  openNow: () => void;
  closeNow: () => void;
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
    () => ({ open, id, scheduleOpen, scheduleClose, openNow, closeNow }),
    [open, id, scheduleOpen, scheduleClose, openNow, closeNow],
  );

  return (
    <HoverCardContext value={context}>
      <div className="relative inline-flex">{children}</div>
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
  ref,
  ...props
}: HoverCardTriggerProps & { ref?: React.Ref<HTMLElement> }) => {
  const { open, id, scheduleOpen, scheduleClose, openNow, closeNow } = useHoverCardContext();

  const handlers = {
    onPointerEnter: (event: React.PointerEvent<HTMLElement>) => {
      onPointerEnter?.(event);
      if (event.pointerType !== 'touch') scheduleOpen();
    },
    onPointerLeave: (event: React.PointerEvent<HTMLElement>) => {
      onPointerLeave?.(event);
      scheduleClose();
    },
    onFocus: (event: React.FocusEvent<HTMLElement>) => {
      onFocus?.(event);
      openNow();
    },
    onBlur: (event: React.FocusEvent<HTMLElement>) => {
      onBlur?.(event);
      closeNow();
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
      onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
      onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
      className?: string;
    };

    return React.cloneElement(child, {
      ...props,
      ...shared,
      ref,
      className: cn(className, childProps.className),
      onPointerEnter: (event: React.PointerEvent<HTMLElement>) => {
        childProps.onPointerEnter?.(event);
        handlers.onPointerEnter(event);
      },
      onPointerLeave: (event: React.PointerEvent<HTMLElement>) => {
        childProps.onPointerLeave?.(event);
        handlers.onPointerLeave(event);
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
  ...props
}: HoverCardContentProps) => {
  const { open, id, openNow, scheduleClose } = useHoverCardContext();
  const shouldReduceMotion = useReducedMotion();

  const offsetStyle = React.useMemo(
    () => ({
      ...(side === 'top' && { marginBottom: sideOffset }),
      ...(side === 'bottom' && { marginTop: sideOffset }),
      ...(side === 'left' && { marginRight: sideOffset }),
      ...(side === 'right' && { marginLeft: sideOffset }),
      ...HOVER_CARD_STYLE,
    }),
    [side, sideOffset],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
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
            scheduleClose();
          }}
          className={cn(
            'bg-popover text-popover-foreground absolute z-50 w-64 rounded-md border p-4 shadow-md outline-none',
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
