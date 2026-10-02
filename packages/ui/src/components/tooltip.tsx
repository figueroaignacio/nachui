'use client';

import { AnimatePresence, type HTMLMotionProps, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';
import { floatingOrigin, floatingVariants, reveal } from '../lib/motion';

// --- Animation constants (module level) ---

const TOOLTIP_POSITION_CLASSES = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
} as const;

const TOOLTIP_ARROW_CLASSES = {
  top: '-bottom-1 left-1/2 -translate-x-1/2',
  bottom: '-top-1 left-1/2 -translate-x-1/2',
  left: '-right-1 top-1/2 -translate-y-1/2',
  right: '-left-1 top-1/2 -translate-y-1/2',
} as const;

const TOOLTIP_STYLE = { willChange: 'opacity, transform, filter' } as const;

// --- Context ---

interface TooltipContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  delayDuration: number;
  id: string;
  rootRef: React.RefObject<HTMLDivElement | null>;
}

const TooltipContext = React.createContext<TooltipContextType | undefined>(undefined);

const useTooltip = () => {
  const context = React.use(TooltipContext);
  if (!context) {
    throw new Error('useTooltip must be used within a TooltipProvider');
  }
  return context;
};

// --- Components ---

interface TooltipProps {
  children: React.ReactNode;
  delayDuration?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const TooltipRoot = ({
  children,
  delayDuration = 200,
  open: controlledOpen,
  onOpenChange,
}: TooltipProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = React.useCallback(
    (newState: boolean) => {
      if (isControlled) {
        onOpenChange?.(newState);
      } else {
        setInternalOpen(newState);
      }
    },
    [isControlled, onOpenChange],
  );

  const id = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open, setOpen]);

  const contextValue = React.useMemo(
    () => ({ open, setOpen, delayDuration, id, rootRef }),
    [open, setOpen, delayDuration, id],
  );

  return (
    <TooltipContext value={contextValue}>
      <div ref={rootRef} className="relative flex h-fit w-fit items-center justify-center">
        {children}
      </div>
    </TooltipContext>
  );
};

interface TooltipTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

function TooltipTrigger({ children, asChild = false, className, ...props }: TooltipTriggerProps) {
  const { open, setOpen, delayDuration, id } = useTooltip();
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // WCAG 1.4.13: the tooltip must be dismissible without moving the pointer.
  React.useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, setOpen]);

  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setOpen(true);
    }, delayDuration);
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(false);
  };

  const handleFocus = () => {
    setOpen(true);
  };

  const handleBlur = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(false);
  };

  const {
    onPointerEnter: propsPointerEnter,
    onPointerLeave: propsPointerLeave,
    onFocus: propsFocus,
    onBlur: propsBlur,
    ...restProps
  } = props;

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as {
      onPointerEnter?: (e: React.PointerEvent) => void;
      onPointerLeave?: (e: React.PointerEvent) => void;
      onFocus?: (e: React.FocusEvent) => void;
      onBlur?: (e: React.FocusEvent) => void;
      className?: string;
    };

    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      ...restProps,
      'aria-describedby': open ? id : undefined,
      onPointerEnter: (e: React.PointerEvent<HTMLElement>) => {
        handlePointerEnter(e);
        propsPointerEnter?.(e);
        childProps.onPointerEnter?.(e);
      },
      onPointerLeave: (e: React.PointerEvent<HTMLElement>) => {
        handlePointerLeave(e);
        propsPointerLeave?.(e);
        childProps.onPointerLeave?.(e);
      },
      onFocus: (e: React.FocusEvent<HTMLElement>) => {
        handleFocus();
        propsFocus?.(e);
        childProps.onFocus?.(e);
      },
      onBlur: (e: React.FocusEvent<HTMLElement>) => {
        handleBlur();
        propsBlur?.(e);
        childProps.onBlur?.(e);
      },
      className: cn(className, childProps.className),
    });
  }

  return (
    <div
      aria-describedby={open ? id : undefined}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- the wrapper must be focusable so keyboard users can summon the tooltip when the child isn't interactive
      tabIndex={0}
      className={cn('cursor-pointer', className)}
      {...restProps}
      onPointerEnter={(e) => {
        handlePointerEnter(e);
        propsPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        handlePointerLeave(e);
        propsPointerLeave?.(e);
      }}
      onFocus={(e) => {
        handleFocus();
        propsFocus?.(e);
      }}
      onBlur={(e) => {
        handleBlur();
        propsBlur?.(e);
      }}
    >
      {children}
    </div>
  );
}

interface TooltipContentProps extends HTMLMotionProps<'div'> {
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  children?: React.ReactNode;
}

const TooltipContent = ({
  side = 'top',
  sideOffset = 4,
  className,
  children,
  ...props
}: TooltipContentProps) => {
  const { open, id } = useTooltip();
  const shouldReduceMotion = useReducedMotion();

  const sideOffsetStyle = React.useMemo(
    () => ({
      ...(side === 'top' && { marginBottom: sideOffset }),
      ...(side === 'bottom' && { marginTop: sideOffset }),
      ...(side === 'left' && { marginRight: sideOffset }),
      ...(side === 'right' && { marginLeft: sideOffset }),
      ...TOOLTIP_STYLE,
    }),
    [side, sideOffset],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id={id}
          role="tooltip"
          variants={shouldReduceMotion ? reveal : floatingVariants[side]}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={sideOffsetStyle}
          className={cn(
            'bg-foreground text-background absolute z-50 w-max max-w-[min(20rem,calc(100vw-2rem))] rounded-sm px-2.5 py-1 text-xs whitespace-normal',
            TOOLTIP_POSITION_CLASSES[side],
            floatingOrigin[side],
            className,
          )}
          {...props}
        >
          <span
            aria-hidden="true"
            className={cn(
              'bg-foreground absolute size-2 rotate-45 rounded-[1px]',
              TOOLTIP_ARROW_CLASSES[side],
            )}
          />
          {children as React.ReactNode}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Tooltip = Object.assign(TooltipRoot, {
  Trigger: TooltipTrigger,
  Content: TooltipContent,
});

const TooltipProvider = Tooltip;

export { Tooltip, TooltipProvider };
