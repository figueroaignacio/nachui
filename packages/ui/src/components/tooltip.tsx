'use client';

import { AnimatePresence, type HTMLMotionProps, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';
import { FloatingPortal, useFloating } from '../lib/floating';
import { floatingOrigin, floatingVariants, reveal } from '../lib/motion';
import { assignRef, getFocusable, useLayer } from '../lib/overlay';
import { useControllableState } from '../lib/use-controllable-state';

const TOOLTIP_ARROW_CLASSES = {
  top: '-bottom-1 left-1/2 -translate-x-1/2',
  bottom: '-top-1 left-1/2 -translate-x-1/2',
  left: '-right-1 top-1/2 -translate-y-1/2',
  right: '-left-1 top-1/2 -translate-y-1/2',
} as const;

const TOOLTIP_STYLE = { willChange: 'opacity, transform, filter' } as const;

const CLOSE_DELAY = 100;
const LONG_PRESS_DELAY = 500;
const ARROW_INSET = 8;

type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

interface TooltipContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  delayDuration: number;
  id: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  schedule: (open: boolean, delay: number) => void;
  cancel: () => void;
}

const TooltipContext = React.createContext<TooltipContextType | undefined>(undefined);

const useTooltip = () => {
  const context = React.use(TooltipContext);
  if (!context) {
    throw new Error('useTooltip must be used within a TooltipProvider');
  }
  return context;
};

interface TooltipProps {
  children: React.ReactNode;
  delayDuration?: number;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const TooltipRoot = ({
  children,
  delayDuration = 200,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: TooltipProps) => {
  const [open, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const id = React.useId();
  const triggerRef = React.useRef<HTMLElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const layer = useLayer(open, false, contentRef);

  const cancel = React.useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const schedule = React.useCallback(
    (next: boolean, delay: number) => {
      cancel();
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        setOpen(next);
      }, delay);
    },
    [cancel, setOpen],
  );

  React.useEffect(() => cancel, [cancel]);

  React.useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (triggerRef.current?.contains(target) || contentRef.current?.contains(target)) return;
      cancel();
      setOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented || !layer.isTopmost()) return;
      event.preventDefault();
      cancel();
      setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, setOpen, cancel, layer]);

  const contextValue = React.useMemo(
    () => ({ open, setOpen, delayDuration, id, triggerRef, contentRef, schedule, cancel }),
    [open, setOpen, delayDuration, id, schedule, cancel],
  );

  return (
    <TooltipContext value={contextValue}>
      <span className="relative inline-flex h-fit w-fit items-center justify-center">
        {children}
      </span>
    </TooltipContext>
  );
};

interface TooltipTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

type TriggerHandlers = {
  onPointerEnter?: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerLeave?: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerDown?: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerUp?: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerCancel?: (event: React.PointerEvent<HTMLElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
};

function joinIds(...ids: Array<string | undefined>) {
  return ids.filter(Boolean).join(' ') || undefined;
}

function TooltipTrigger({ children, asChild = false, className, ...props }: TooltipTriggerProps) {
  const { open, setOpen, delayDuration, id, triggerRef, schedule, cancel } = useTooltip();
  const pointerTypeRef = React.useRef<string | null>(null);
  const [nestedTarget, setNestedTarget] = React.useState<HTMLElement | null>(null);

  const wrapperRef = React.useCallback(
    (node: HTMLSpanElement | null) => {
      triggerRef.current = node;
      setNestedTarget(node ? (getFocusable(node)[0] ?? null) : null);
    },
    [triggerRef],
  );

  React.useEffect(() => {
    if (!open || !nestedTarget) return;
    const previous = nestedTarget.getAttribute('aria-describedby');
    nestedTarget.setAttribute('aria-describedby', previous ? `${previous} ${id}` : id);
    return () => {
      if (previous === null) nestedTarget.removeAttribute('aria-describedby');
      else nestedTarget.setAttribute('aria-describedby', previous);
    };
  }, [open, nestedTarget, id]);

  const slotted = asChild && React.isValidElement(children);
  const childProps = (slotted ? (children as React.ReactElement).props : {}) as TriggerHandlers & {
    className?: string;
    ref?: React.Ref<HTMLElement>;
    'aria-describedby'?: string;
  };

  const handlers: TriggerHandlers = {
    onPointerEnter: (event) => {
      if (event.pointerType !== 'touch') schedule(true, delayDuration);
      props.onPointerEnter?.(event);
      childProps.onPointerEnter?.(event);
    },
    onPointerLeave: (event) => {
      if (event.pointerType !== 'touch') schedule(false, CLOSE_DELAY);
      else if (!open) cancel();
      props.onPointerLeave?.(event);
      childProps.onPointerLeave?.(event);
    },
    onPointerDown: (event) => {
      pointerTypeRef.current = event.pointerType;
      if (event.pointerType === 'touch') schedule(true, LONG_PRESS_DELAY);
      props.onPointerDown?.(event);
      childProps.onPointerDown?.(event);
    },
    onPointerUp: (event) => {
      if (event.pointerType === 'touch' && !open) cancel();
      props.onPointerUp?.(event);
      childProps.onPointerUp?.(event);
    },
    onPointerCancel: (event) => {
      if (event.pointerType === 'touch' && !open) cancel();
      props.onPointerCancel?.(event);
      childProps.onPointerCancel?.(event);
    },
    onClick: (event) => {
      pointerTypeRef.current = null;
      props.onClick?.(event);
      childProps.onClick?.(event);
    },
    onFocus: (event) => {
      if (pointerTypeRef.current !== 'touch') {
        cancel();
        setOpen(true);
      }
      props.onFocus?.(event);
      childProps.onFocus?.(event);
    },
    onBlur: (event) => {
      cancel();
      setOpen(false);
      props.onBlur?.(event);
      childProps.onBlur?.(event);
    },
  };

  if (slotted) {
    const baseDescribedBy = childProps['aria-describedby'] ?? props['aria-describedby'];

    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      ...props,
      ...handlers,
      'aria-describedby': open ? joinIds(baseDescribedBy, id) : baseDescribedBy,
      className: cn(className, childProps.className),
      ref: (node: HTMLElement | null) => {
        triggerRef.current = node;
        assignRef(childProps.ref, node);
      },
    });
  }

  const describedBy =
    open && !nestedTarget ? joinIds(props['aria-describedby'], id) : props['aria-describedby'];

  return (
    <span
      tabIndex={nestedTarget ? undefined : 0}
      className={cn('cursor-pointer', className)}
      {...props}
      {...handlers}
      aria-describedby={describedBy}
      ref={wrapperRef}
    >
      {children}
    </span>
  );
}

interface TooltipContentProps extends HTMLMotionProps<'div'> {
  side?: TooltipSide;
  sideOffset?: number;
  children?: React.ReactNode;
}

const TooltipPanel = ({
  side: preferredSide = 'top',
  sideOffset = 4,
  className,
  children,
  style,
  onPointerEnter,
  onPointerLeave,
  ...props
}: TooltipContentProps) => {
  const { id, triggerRef, contentRef, schedule, cancel } = useTooltip();
  const shouldReduceMotion = useReducedMotion();
  const arrowRef = React.useRef<HTMLSpanElement>(null);
  const floating = useFloating({
    open: true,
    anchorRef: triggerRef,
    floatingRef: contentRef,
    side: preferredSide,
    sideOffset,
  });
  const side = floating.side;
  const top = floating.style.top;
  const left = floating.style.left;

  React.useLayoutEffect(() => {
    const arrow = arrowRef.current;
    const content = contentRef.current;
    const anchor = triggerRef.current;
    if (!arrow || !content || !anchor) return;
    const rect = anchor.getBoundingClientRect();
    const vertical = side === 'top' || side === 'bottom';
    const size = vertical ? content.offsetWidth : content.offsetHeight;
    const center = vertical
      ? rect.left + rect.width / 2 - Number(left)
      : rect.top + rect.height / 2 - Number(top);
    const offset = Math.min(
      Math.max(center, ARROW_INSET),
      Math.max(ARROW_INSET, size - ARROW_INSET),
    );
    arrow.style.left = vertical ? `${offset}px` : '';
    arrow.style.top = vertical ? '' : `${offset}px`;
  }, [side, top, left, contentRef, triggerRef]);

  return (
    <motion.div
      ref={contentRef}
      id={id}
      role="tooltip"
      data-side={side}
      variants={shouldReduceMotion ? reveal : floatingVariants[side]}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ ...TOOLTIP_STYLE, ...style, ...floating.style }}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        cancel();
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        if (event.pointerType !== 'touch') schedule(false, CLOSE_DELAY);
      }}
      className={cn(
        'bg-foreground text-background z-500 w-max max-w-[min(20rem,calc(100vw-2rem))] rounded-sm px-2.5 py-1 text-xs whitespace-normal',
        floatingOrigin[side],
        className,
      )}
      {...props}
    >
      <span
        ref={arrowRef}
        aria-hidden="true"
        className={cn(
          'bg-foreground absolute size-2 rotate-45 rounded-[1px]',
          TOOLTIP_ARROW_CLASSES[side],
        )}
      />
      {children as React.ReactNode}
    </motion.div>
  );
};

const TooltipContent = (props: TooltipContentProps) => {
  const { open } = useTooltip();

  return (
    <FloatingPortal>
      <AnimatePresence>{open && <TooltipPanel {...props} />}</AnimatePresence>
    </FloatingPortal>
  );
};

const Tooltip = Object.assign(TooltipRoot, {
  Trigger: TooltipTrigger,
  Content: TooltipContent,
});

const TooltipProvider = Tooltip;

export { Tooltip, TooltipProvider };
export type { TooltipProps, TooltipTriggerProps, TooltipContentProps, TooltipSide };
