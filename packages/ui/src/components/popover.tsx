'use client';

import { AnimatePresence, type HTMLMotionProps, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';
import { floatingOrigin, floatingVariants, reveal } from '../lib/motion';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function XIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

// --- Animation constants ---

const POPOVER_POSITION_CLASSES = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
} as const;

const POPOVER_STYLE = { willChange: 'opacity, transform, filter' } as const;

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

// --- Context ---

interface PopoverContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const PopoverContext = React.createContext<PopoverContextType | undefined>(undefined);

const usePopoverContext = () => {
  const context = React.use(PopoverContext);
  if (!context) {
    throw new Error('usePopoverContext must be used within a Popover');
  }
  return context;
};

// --- Components ---

interface PopoverProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PopoverRoot = ({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: PopoverProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const id = React.useId();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (newState: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newState);
      }
      onOpenChange?.(newState);
    },
    [isControlled, onOpenChange],
  );

  React.useEffect(() => {
    if (!open) return;

    const handlePointerDownOutside = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDownOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDownOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, setOpen]);

  return (
    <PopoverContext value={{ open, setOpen, id, triggerRef }}>
      <div ref={containerRef} className="relative inline-flex">
        {children}
      </div>
    </PopoverContext>
  );
};

interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const PopoverTrigger = ({
  asChild,
  onClick,
  ref,
  ...props
}: PopoverTriggerProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { open, setOpen, id, triggerRef } = usePopoverContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(!open);
    onClick?.(e);
  };

  const mergedRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    },
    [ref, triggerRef],
  );

  if (asChild && React.isValidElement(props.children)) {
    const child = props.children as React.ReactElement<Record<string, unknown>>;
    const childOnClick = child.props.onClick as
      | ((e: React.MouseEvent<HTMLButtonElement>) => void)
      | undefined;

    return React.cloneElement(child, {
      ref: mergedRef,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        childOnClick?.(e);
        handleClick(e);
      },
      'aria-expanded': open,
      'aria-haspopup': 'dialog',
      'aria-controls': open ? id : undefined,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      ref={mergedRef}
      aria-expanded={open}
      aria-haspopup="dialog"
      aria-controls={open ? id : undefined}
      {...props}
    />
  );
};
PopoverTrigger.displayName = 'PopoverTrigger';

const PopoverClose = ({
  asChild,
  onClick,
  ref,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}) => {
  const { setOpen } = usePopoverContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(false);
    onClick?.(e);
  };

  if (asChild && React.isValidElement(props.children)) {
    const child = props.children as React.ReactElement<Record<string, unknown>>;
    const childOnClick = child.props.onClick as
      | ((e: React.MouseEvent<HTMLButtonElement>) => void)
      | undefined;

    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        childOnClick?.(e);
        handleClick(e);
      },
    });
  }

  return <button type="button" onClick={handleClick} ref={ref} {...props} />;
};
PopoverClose.displayName = 'PopoverClose';

interface PopoverContentProps extends HTMLMotionProps<'div'> {
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  children?: React.ReactNode;
  showClose?: boolean;
}

const PopoverContent = ({
  side = 'bottom',
  sideOffset = 4,
  className,
  children,
  showClose = false,
  ...props
}: PopoverContentProps) => {
  const { open, id, setOpen } = usePopoverContext();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const shift = useViewportShift(contentRef, open);

  // Move focus into the popover when it opens so keyboard users can reach its content.
  React.useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      contentRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const sideOffsetStyle = React.useMemo(
    () => ({
      ...(side === 'top' && { marginBottom: sideOffset }),
      ...(side === 'bottom' && { marginTop: sideOffset }),
      ...(side === 'left' && { marginRight: sideOffset }),
      ...(side === 'right' && { marginLeft: sideOffset }),
      ...POPOVER_STYLE,
      translate: shiftTranslate(
        shift,
        side === 'top' || side === 'bottom',
        side === 'left' || side === 'right',
      ),
    }),
    [side, sideOffset, shift],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={contentRef}
          id={id}
          role="dialog"
          tabIndex={-1}
          variants={shouldReduceMotion ? reveal : floatingVariants[side]}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={sideOffsetStyle}
          className={cn(
            'bg-popover text-popover-foreground border-border absolute z-50 w-72 max-w-[calc(100vw-2rem)] rounded-md border p-4 shadow-md outline-none',
            POPOVER_POSITION_CLASSES[side],
            floatingOrigin[side],
            className,
          )}
          {...props}
        >
          {children}
          {showClose && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ring-offset-background focus-visible:ring-ring absolute top-1 right-1 rounded-md p-2 opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <XIcon className="h-4 w-4" size={16} />
              <span className="sr-only">Close</span>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
PopoverContent.displayName = 'PopoverContent';

const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: PopoverClose,
});

export { Popover };
