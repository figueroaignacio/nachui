'use client';

import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  AnimatePresence,
  type HTMLMotionProps,
  motion,
  useMotionValue,
  useReducedMotion,
} from 'motion/react';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';
import { Button, type ButtonProps } from './button';

// --- Animation constants (module level) ---

const slideVariants = {
  bottom: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '110%' },
  },
  top: {
    initial: { y: '-100%' },
    animate: { y: 0 },
    exit: { y: '-110%' },
  },
  left: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-110%' },
  },
  right: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '110%' },
  },
} as const;

const DRAWER_SPRING = { type: 'spring', damping: 32, stiffness: 320 } as const;

const DRAWER_OVERLAY_VARIANTS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} as const;

const DRAWER_OVERLAY_TRANSITION = { duration: 0.2 } as const;
const REDUCED_MOTION_PROPS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.12 },
} as const;
const DRAWER_OVERLAY_STYLE = { willChange: 'opacity' } as const;
const DRAWER_CONTENT_STYLE = { willChange: 'transform' } as const;
const CLOSE_BUTTON_TAP = { scale: 0.9 } as const;
const SWIPE_CLOSE_THRESHOLD = 80;

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');
function lockPageScroll() {
  const root = document.documentElement;
  const depth = Number(root.dataset.scrollLocked ?? '0');

  if (depth === 0) {
    const gutter = window.innerWidth - root.clientWidth;
    root.dataset.scrollLockedOverflow = document.body.style.overflow;
    if (gutter > 0) root.style.paddingRight = `${gutter}px`;
    document.body.style.overflow = 'hidden';
  }
  root.dataset.scrollLocked = String(depth + 1);

  return () => {
    const remaining = Number(root.dataset.scrollLocked ?? '1') - 1;
    if (remaining > 0) {
      root.dataset.scrollLocked = String(remaining);
      return;
    }

    document.body.style.overflow = root.dataset.scrollLockedOverflow ?? '';
    root.style.paddingRight = '';
    delete root.dataset.scrollLocked;
    delete root.dataset.scrollLockedOverflow;
  };
}

// --- Context ---

type DrawerContextProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  hasTitle: boolean;
  setHasTitle: (value: boolean) => void;
  hasDescription: boolean;
  setHasDescription: (value: boolean) => void;
};

const DrawerContext = React.createContext<DrawerContextProps | null>(null);

function useDrawerContext() {
  const ctx = React.use(DrawerContext);
  if (!ctx) throw new Error('Drawer components must be inside <Drawer>.');
  return ctx;
}

// --- Components ---

interface DrawerProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DrawerRoot = ({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: DrawerProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [hasTitle, setHasTitle] = React.useState(false);
  const [hasDescription, setHasDescription] = React.useState(false);
  const id = React.useId();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      if (!isControlled) {
        setUncontrolledOpen(value);
      }

      if (onOpenChange) {
        const newValue = typeof value === 'function' ? value(open) : value;
        onOpenChange(newValue);
      }
    },
    [isControlled, onOpenChange, open],
  );

  React.useEffect(() => {
    if (!open) return;
    return lockPageScroll();
  }, [open]);

  return (
    <DrawerContext
      value={{ open, setOpen, id, hasTitle, setHasTitle, hasDescription, setHasDescription }}
    >
      {children}
    </DrawerContext>
  );
};

const DrawerTrigger = ({ children, className, variant, size, onClick, ...props }: ButtonProps) => {
  const { open, setOpen } = useDrawerContext();

  return (
    <Button
      className={className}
      aria-haspopup="dialog"
      aria-expanded={open}
      onClick={(e) => {
        onClick?.(e);
        setOpen(true);
      }}
      variant={variant}
      size={size}
      {...props}
    >
      {children}
    </Button>
  );
};

const DrawerOverlay = ({ className }: { className?: string }) => {
  const { setOpen } = useDrawerContext();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? REDUCED_MOTION_PROPS.initial : DRAWER_OVERLAY_VARIANTS.initial}
      animate={shouldReduceMotion ? REDUCED_MOTION_PROPS.animate : DRAWER_OVERLAY_VARIANTS.animate}
      exit={shouldReduceMotion ? REDUCED_MOTION_PROPS.exit : DRAWER_OVERLAY_VARIANTS.exit}
      transition={shouldReduceMotion ? REDUCED_MOTION_PROPS.transition : DRAWER_OVERLAY_TRANSITION}
      style={DRAWER_OVERLAY_STYLE}
      className={cn('bg-overlay fixed inset-0 z-300 backdrop-blur-xs', className)}
      onClick={() => setOpen(false)}
    />
  );
};

// --- CVA ---

const drawerVariants = cva(
  'fixed z-300 bg-background border shadow-2xl overflow-auto rounded-2xl',
  {
    variants: {
      side: {
        bottom: 'bottom-3 left-3 right-3',
        top: 'top-3 left-3 right-3',
        left: 'left-3 top-3 bottom-3 w-[85vw] sm:w-96',
        right: 'right-3 top-3 bottom-3 w-[85vw] sm:w-96',
      },
    },
    defaultVariants: {
      side: 'bottom',
    },
  },
);

interface DrawerContentProps
  extends Omit<HTMLMotionProps<'div'>, 'children'>, VariantProps<typeof drawerVariants> {
  children: React.ReactNode;
  showDragHandle?: boolean;
}

const DrawerContent = ({
  children,
  className,
  side = 'bottom',
  showDragHandle = true,
  ...props
}: DrawerContentProps) => {
  const { open, setOpen, id, hasTitle, hasDescription } = useDrawerContext();
  const [mounted, setMounted] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);

  const dragY = useMotionValue(0);
  const dragX = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe portal mount flag
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open) return;

    triggerRef.current = document.activeElement as HTMLElement;

    const trapFocus = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const content = contentRef.current;
      if (!content) return;

      const focusable = Array.from(content.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('keydown', trapFocus);
    document.addEventListener('keydown', handleEscape);

    requestAnimationFrame(() => {
      const content = contentRef.current;
      if (content) {
        const focusable = content.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
        (focusable ?? content).focus();
      }
    });

    return () => {
      document.removeEventListener('keydown', trapFocus);
      document.removeEventListener('keydown', handleEscape);
      triggerRef.current?.focus();
    };
  }, [open, setOpen]);

  const isVertical = side === 'bottom' || side === 'top';
  const isHorizontal = side === 'left' || side === 'right';

  const dragAxis = isVertical ? 'y' : 'x';

  const dragConstraints = React.useMemo(() => {
    if (side === 'bottom') return { top: 0, bottom: 0 };
    if (side === 'top') return { top: 0, bottom: 0 };
    if (side === 'left') return { left: 0, right: 0 };
    if (side === 'right') return { left: 0, right: 0 };
    return {};
  }, [side]);

  const dragElastic = 0.15;

  const handleDragEnd = (_: unknown, info: { offset: { x: number; y: number } }) => {
    const { x, y } = info.offset;

    const shouldClose =
      (side === 'bottom' && y > SWIPE_CLOSE_THRESHOLD) ||
      (side === 'top' && -y > SWIPE_CLOSE_THRESHOLD) ||
      (side === 'right' && x > SWIPE_CLOSE_THRESHOLD) ||
      (side === 'left' && -x > SWIPE_CLOSE_THRESHOLD);

    if (shouldClose) {
      setOpen(false);
    } else {
      // Snap back
      if (isVertical) dragY.set(0);
      if (isHorizontal) dragX.set(0);
    }
  };

  if (!mounted) return null;

  const drawer = (
    <AnimatePresence>
      {open && (
        <>
          <DrawerOverlay className="z-300" />
          <motion.div
            ref={contentRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={hasTitle ? `${id}-title` : undefined}
            aria-describedby={hasDescription ? `${id}-description` : undefined}
            tabIndex={-1}
            drag={dragAxis}
            dragMomentum={false}
            dragElastic={dragElastic}
            dragConstraints={dragConstraints}
            onDragEnd={handleDragEnd}
            style={{
              ...(isVertical ? { y: dragY } : { x: dragX }),
              ...DRAWER_CONTENT_STYLE,
            }}
            initial={
              shouldReduceMotion
                ? REDUCED_MOTION_PROPS.initial
                : slideVariants[side as keyof typeof slideVariants].initial
            }
            animate={
              shouldReduceMotion
                ? REDUCED_MOTION_PROPS.animate
                : slideVariants[side as keyof typeof slideVariants].animate
            }
            exit={
              shouldReduceMotion
                ? REDUCED_MOTION_PROPS.exit
                : slideVariants[side as keyof typeof slideVariants].exit
            }
            transition={shouldReduceMotion ? REDUCED_MOTION_PROPS.transition : DRAWER_SPRING}
            className={cn(drawerVariants({ side }), className)}
            {...props}
          >
            {showDragHandle && (
              <div aria-hidden="true" className="flex shrink-0 items-center justify-center py-2.5">
                <div className="bg-muted-foreground/30 h-1 w-10 cursor-grab rounded-full active:cursor-grabbing" />
              </div>
            )}

            <div className={cn(isVertical && 'mx-auto w-full max-w-lg')}>
              {/* Close button */}
              <div className="flex justify-end px-4 pt-2 pb-0">
                <motion.button
                  whileTap={shouldReduceMotion ? undefined : CLOSE_BUTTON_TAP}
                  onClick={() => setOpen(false)}
                  className="hover:bg-muted rounded-full p-2 transition-colors"
                  aria-label="Close"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" size={16} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="px-5 pt-2 pb-5">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(drawer, document.body);
};

const DrawerClose = ({
  children,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { setOpen } = useDrawerContext();

  return (
    <button
      type="button"
      onClick={(e) => {
        onClick?.(e);
        setOpen(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
};

const DrawerHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn('mb-4', className)}>{children}</div>;
};

const DrawerTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { id, setHasTitle } = useDrawerContext();

  React.useEffect(() => {
    setHasTitle(true);
    return () => setHasTitle(false);
  }, [setHasTitle]);

  return (
    <h2 id={`${id}-title`} className={cn('text-xl font-semibold tracking-tight', className)}>
      {children}
    </h2>
  );
};

const DrawerDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { id, setHasDescription } = useDrawerContext();

  React.useEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);

  return (
    <p id={`${id}-description`} className={cn('text-muted-foreground mt-1 text-sm', className)}>
      {children}
    </p>
  );
};

const Drawer = Object.assign(DrawerRoot, {
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Header: DrawerHeader,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Close: DrawerClose,
});

export { Drawer };
