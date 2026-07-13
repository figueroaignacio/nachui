'use client';

import { AnimatePresence, type HTMLMotionProps, motion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';

// --- Animation constants (module level) ---

const TOOLTIP_POSITION_CLASSES = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
} as const;

const TOOLTIP_ANIMATION_VARIANTS = {
  top: {
    initial: { opacity: 0, y: 5, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  },
  bottom: {
    initial: { opacity: 0, y: -5, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  },
  left: {
    initial: { opacity: 0, x: 5, filter: 'blur(4px)' },
    animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
  },
  right: {
    initial: { opacity: 0, x: -5, filter: 'blur(4px)' },
    animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
  },
} as const;

const TOOLTIP_TRANSITION = { duration: 0.2, ease: 'easeOut' } as const;

const TOOLTIP_STYLE = { willChange: 'opacity, transform, filter' } as const;

// --- Context ---

interface TooltipContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  delayDuration: number;
  id: string;
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

  return (
    <TooltipContext value={{ open, setOpen, delayDuration, id }}>
      <div className="relative flex h-fit w-fit items-center justify-center">{children}</div>
    </TooltipContext>
  );
};

interface TooltipTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

function TooltipTrigger({ children, asChild = false, className, ...props }: TooltipTriggerProps) {
  const { setOpen, delayDuration, id } = useTooltip();
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(true);
    }, delayDuration);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(false);
  };

  const handleFocus = () => {
    setOpen(true);
  };

  const handleBlur = () => {
    setOpen(false);
  };

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as {
      onMouseEnter?: (e: React.MouseEvent) => void;
      onMouseLeave?: (e: React.MouseEvent) => void;
      onFocus?: (e: React.FocusEvent) => void;
      onBlur?: (e: React.FocusEvent) => void;
      className?: string;
    };

    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      ...props,
      'aria-describedby': id,
      onMouseEnter: (e: React.MouseEvent) => {
        handleMouseEnter();
        childProps.onMouseEnter?.(e);
      },
      onMouseLeave: (e: React.MouseEvent) => {
        handleMouseLeave();
        childProps.onMouseLeave?.(e);
      },
      onFocus: (e: React.FocusEvent) => {
        handleFocus();
        childProps.onFocus?.(e);
      },
      onBlur: (e: React.FocusEvent) => {
        handleBlur();
        childProps.onBlur?.(e);
      },
      className: cn(className, childProps.className),
    });
  }

  return (
    <div
      aria-describedby={id}
      className={cn('cursor-pointer', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
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
          initial={TOOLTIP_ANIMATION_VARIANTS[side].initial}
          animate={TOOLTIP_ANIMATION_VARIANTS[side].animate}
          exit={TOOLTIP_ANIMATION_VARIANTS[side].initial}
          transition={TOOLTIP_TRANSITION}
          style={sideOffsetStyle}
          className={cn(
            'bg-foreground text-background absolute z-50 rounded-none px-2.5 py-1 text-xs whitespace-nowrap',
            TOOLTIP_POSITION_CLASSES[side],
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

const Tooltip = Object.assign(TooltipRoot, {
  Trigger: TooltipTrigger,
  Content: TooltipContent,
});

const TooltipProvider = Tooltip;

export { Tooltip, TooltipProvider };
