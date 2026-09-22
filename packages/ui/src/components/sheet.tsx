'use client';

import { AnimatePresence, type HTMLMotionProps, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';
import { backdrop, reveal, slideVariants, springs, tap } from '../lib/motion';

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

type SheetSide = 'top' | 'bottom' | 'left' | 'right';
type SheetSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const SIDE_CLASSES: Record<SheetSide, string> = {
  right: 'inset-y-0 right-0 h-full border-l',
  left: 'inset-y-0 left-0 h-full border-r',
  top: 'inset-x-0 top-0 w-full border-b',
  bottom: 'inset-x-0 bottom-0 w-full border-t',
};

const HORIZONTAL_SIZE: Record<SheetSize, string> = {
  sm: 'w-80',
  md: 'w-96',
  lg: 'w-[32rem]',
  xl: 'w-[40rem]',
  full: 'w-screen',
};

const VERTICAL_SIZE: Record<SheetSize, string> = {
  sm: 'max-h-[40vh]',
  md: 'max-h-[60vh]',
  lg: 'max-h-[80vh]',
  xl: 'max-h-[92vh]',
  full: 'h-screen',
};

const OVERLAY_STYLE = { willChange: 'opacity' } as const;
const PANEL_STYLE = { willChange: 'transform' } as const;

interface SheetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
  hasTitle: boolean;
  setHasTitle: (value: boolean) => void;
  hasDescription: boolean;
  setHasDescription: (value: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue | null>(null);

const useSheetContext = (): SheetContextValue => {
  const context = React.use(SheetContext);
  if (!context) {
    throw new Error('Sheet components must be used within Sheet');
  }
  return context;
};

interface SheetProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface SheetTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

interface SheetContentProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  side?: SheetSide;
  size?: SheetSize;
  showClose?: boolean;
  closeLabel?: string;
}

type SheetSectionProps = React.HTMLAttributes<HTMLDivElement>;
type SheetTitleProps = React.HTMLAttributes<HTMLHeadingElement>;
type SheetDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;
interface SheetCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const SheetRoot = ({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: SheetProps) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [hasTitle, setHasTitle] = React.useState(false);
  const [hasDescription, setHasDescription] = React.useState(false);
  const id = React.useId();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  React.useEffect(() => {
    if (!open) return;
    return lockPageScroll();
  }, [open]);

  const value = React.useMemo<SheetContextValue>(
    () => ({ open, setOpen, id, hasTitle, setHasTitle, hasDescription, setHasDescription }),
    [open, setOpen, id, hasTitle, hasDescription],
  );

  return <SheetContext value={value}>{children}</SheetContext>;
};

SheetRoot.displayName = 'Sheet';

const SheetTrigger = ({
  asChild = false,
  children,
  onClick,
  ref,
  ...props
}: SheetTriggerProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { open, setOpen, id } = useSheetContext();

  const a11y = {
    'aria-haspopup': 'dialog' as const,
    'aria-expanded': open,
    'aria-controls': `${id}-content`,
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...a11y,
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        (children.props as { onClick?: (e: React.MouseEvent<HTMLElement>) => void }).onClick?.(
          event,
        );
        setOpen(true);
      },
    } as React.HTMLAttributes<HTMLElement>);
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={(event) => {
        onClick?.(event);
        setOpen(true);
      }}
      {...a11y}
      {...props}
    >
      {children}
    </button>
  );
};

SheetTrigger.displayName = 'SheetTrigger';

const SheetOverlay = ({ className }: { className?: string }) => {
  const { setOpen } = useSheetContext();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={shouldReduceMotion ? reveal : backdrop}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={OVERLAY_STYLE}
      className={cn('bg-overlay fixed inset-0 z-300 backdrop-blur-xs', className)}
      onClick={() => setOpen(false)}
    />
  );
};

const SheetContent = ({
  children,
  className,
  side = 'right',
  size = 'md',
  showClose = true,
  closeLabel = 'Close',
  ref,
  ...props
}: SheetContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { open, setOpen, id, hasTitle, hasDescription } = useSheetContext();
  const [mounted, setMounted] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const restoreRef = React.useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe portal mount flag
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement as HTMLElement;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;

      const content = contentRef.current;
      if (!content) return;
      const focusable = Array.from(content.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    requestAnimationFrame(() => {
      const content = contentRef.current;
      if (!content) return;
      (content.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? content).focus();
    });

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      restoreRef.current?.focus();
    };
  }, [open, setOpen]);

  if (!mounted) return null;

  const horizontal = side === 'left' || side === 'right';

  const sheet = (
    <AnimatePresence>
      {open && (
        <>
          <SheetOverlay />
          <motion.div
            ref={(node) => {
              contentRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
            }}
            id={`${id}-content`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={hasTitle ? `${id}-title` : undefined}
            aria-describedby={hasDescription ? `${id}-description` : undefined}
            tabIndex={-1}
            data-side={side}
            data-size={size}
            variants={shouldReduceMotion ? reveal : slideVariants[side]}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={PANEL_STYLE}
            className={cn(
              'bg-background border-border fixed z-300 flex max-w-full flex-col shadow-2xl outline-none',
              SIDE_CLASSES[side],
              horizontal ? HORIZONTAL_SIZE[size] : VERTICAL_SIZE[size],
              className,
            )}
            {...props}
          >
            {showClose && (
              <motion.button
                type="button"
                aria-label={closeLabel}
                onClick={() => setOpen(false)}
                whileTap={shouldReduceMotion ? undefined : tap}
                transition={springs.snappy}
                className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring absolute top-4 right-4 z-10 rounded-full p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <XIcon size={16} />
              </motion.button>
            )}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(sheet, document.body);
};

SheetContent.displayName = 'SheetContent';

const SheetHeader = ({
  className,
  ref,
  ...props
}: SheetSectionProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return <div ref={ref} className={cn('flex flex-col gap-1 p-6 pr-14', className)} {...props} />;
};

SheetHeader.displayName = 'SheetHeader';

const SheetBody = ({
  className,
  ref,
  ...props
}: SheetSectionProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return <div ref={ref} className={cn('flex-1 overflow-y-auto px-6 pb-6', className)} {...props} />;
};

SheetBody.displayName = 'SheetBody';

const SheetFooter = ({
  className,
  ref,
  ...props
}: SheetSectionProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      className={cn(
        'border-border mt-auto flex items-center justify-end gap-2 border-t px-6 py-4',
        className,
      )}
      {...props}
    />
  );
};

SheetFooter.displayName = 'SheetFooter';

const SheetTitle = ({
  className,
  ref,
  ...props
}: SheetTitleProps & { ref?: React.Ref<HTMLHeadingElement> }) => {
  const { id, setHasTitle } = useSheetContext();

  React.useEffect(() => {
    setHasTitle(true);
    return () => setHasTitle(false);
  }, [setHasTitle]);

  return (
    <h2
      ref={ref}
      id={`${id}-title`}
      className={cn('text-lg leading-tight font-semibold tracking-tight', className)}
      {...props}
    />
  );
};

SheetTitle.displayName = 'SheetTitle';

const SheetDescription = ({
  className,
  ref,
  ...props
}: SheetDescriptionProps & { ref?: React.Ref<HTMLParagraphElement> }) => {
  const { id, setHasDescription } = useSheetContext();

  React.useEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);

  return (
    <p
      ref={ref}
      id={`${id}-description`}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
};

SheetDescription.displayName = 'SheetDescription';

const SheetClose = ({
  asChild = false,
  children,
  onClick,
  ref,
  ...props
}: SheetCloseProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { setOpen } = useSheetContext();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        (children.props as { onClick?: (e: React.MouseEvent<HTMLElement>) => void }).onClick?.(
          event,
        );
        setOpen(false);
      },
    } as React.HTMLAttributes<HTMLElement>);
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={(event) => {
        onClick?.(event);
        setOpen(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
};

SheetClose.displayName = 'SheetClose';

const Sheet = Object.assign(SheetRoot, {
  Trigger: SheetTrigger,
  Content: SheetContent,
  Header: SheetHeader,
  Body: SheetBody,
  Footer: SheetFooter,
  Title: SheetTitle,
  Description: SheetDescription,
  Close: SheetClose,
});

export { Sheet };
export type {
  SheetCloseProps,
  SheetContentProps,
  SheetDescriptionProps,
  SheetProps,
  SheetSectionProps,
  SheetSide,
  SheetSize,
  SheetTitleProps,
  SheetTriggerProps,
};
