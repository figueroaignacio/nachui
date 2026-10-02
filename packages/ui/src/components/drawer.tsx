'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import {
  AnimatePresence,
  type HTMLMotionProps,
  motion,
  useDragControls,
  useMotionValue,
  useReducedMotion,
} from 'motion/react';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';
import { backdrop, reveal, slideVariants } from '../lib/motion';
import { Button, type ButtonProps } from './button';

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

function isTopmostLayer(node: HTMLElement | null, target: EventTarget | null) {
  if (!node) return false;
  const owner = target instanceof Element ? target.closest('[aria-modal="true"]') : null;
  if (owner) return owner === node;
  const layers = document.querySelectorAll('[aria-modal="true"]');
  return layers[layers.length - 1] === node;
}

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
  const openRef = React.useRef(open);
  const onOpenChangeRef = React.useRef(onOpenChange);

  React.useLayoutEffect(() => {
    openRef.current = open;
    onOpenChangeRef.current = onOpenChange;
  });

  const setOpen = React.useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      const next = typeof value === 'function' ? value(openRef.current) : value;
      openRef.current = next;
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChangeRef.current?.(next);
    },
    [isControlled],
  );

  React.useEffect(() => {
    if (!open) return;
    return lockPageScroll();
  }, [open]);

  const value = React.useMemo<DrawerContextProps>(
    () => ({ open, setOpen, id, hasTitle, setHasTitle, hasDescription, setHasDescription }),
    [open, setOpen, id, hasTitle, hasDescription],
  );

  return <DrawerContext value={value}>{children}</DrawerContext>;
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
      variants={shouldReduceMotion ? reveal : backdrop}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={DRAWER_OVERLAY_STYLE}
      className={cn('bg-overlay fixed inset-0 z-500 backdrop-blur-xs', className)}
      onClick={() => setOpen(false)}
    />
  );
};

// --- CVA ---

const drawerVariants = cva(
  'fixed z-500 flex flex-col overflow-hidden bg-background border shadow-lg rounded-2xl',
  {
    variants: {
      side: {
        bottom: 'bottom-3 left-3 right-3 max-h-[calc(100dvh-1.5rem)]',
        top: 'top-3 left-3 right-3 max-h-[calc(100dvh-1.5rem)]',
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
  const dragControls = useDragControls();
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe portal mount flag
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open) return;

    triggerRef.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      const content = contentRef.current;
      if (!content || !isTopmostLayer(content, e.target)) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;

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

    document.addEventListener('keydown', handleKeyDown);

    requestAnimationFrame(() => {
      const content = contentRef.current;
      if (content) {
        const focusable = content.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
        (focusable ?? content).focus();
      }
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
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
      if (isVertical) dragY.set(0);
      if (isHorizontal) dragX.set(0);
    }
  };

  if (!mounted) return null;

  const drawer = (
    <AnimatePresence>
      {open && (
        <>
          <DrawerOverlay />
          <motion.div
            ref={contentRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={hasTitle ? `${id}-title` : undefined}
            aria-describedby={hasDescription ? `${id}-description` : undefined}
            tabIndex={-1}
            drag={dragAxis}
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            dragElastic={dragElastic}
            dragConstraints={dragConstraints}
            onDragEnd={handleDragEnd}
            style={{
              ...(isVertical ? { y: dragY } : { x: dragX }),
              ...DRAWER_CONTENT_STYLE,
            }}
            variants={
              shouldReduceMotion ? reveal : slideVariants[side as keyof typeof slideVariants]
            }
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(drawerVariants({ side }), className)}
            {...props}
          >
            <div
              className="shrink-0 touch-none select-none"
              onPointerDown={(event) => dragControls.start(event)}
            >
              {showDragHandle && (
                <div aria-hidden="true" className="flex items-center justify-center py-2.5">
                  <div className="bg-muted-foreground/30 h-1 w-10 cursor-grab rounded-full active:cursor-grabbing" />
                </div>
              )}
              <div
                className={cn(
                  'flex justify-end px-4 pt-2 pb-0',
                  isVertical && 'mx-auto w-full max-w-lg',
                )}
              >
                <motion.button
                  type="button"
                  whileTap={shouldReduceMotion ? undefined : CLOSE_BUTTON_TAP}
                  onClick={() => setOpen(false)}
                  className="hover:bg-muted focus-visible:ring-ring rounded-full p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  aria-label="Close"
                >
                  <XIcon className="h-4 w-4" size={16} />
                </motion.button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className={cn('px-5 pt-2 pb-5', isVertical && 'mx-auto w-full max-w-lg')}>
                {children}
              </div>
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
