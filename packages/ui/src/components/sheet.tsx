'use client';

import { AnimatePresence, type HTMLMotionProps, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';
import {
  assignRef,
  focusFirst,
  lockPageScroll,
  trapFocus,
  useIsClient,
  useLayer,
} from '../lib/overlay';
import { backdrop, reveal, slideVariants, springs, tap } from '../lib/motion';
import { useControllableState } from '../lib/use-controllable-state';

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

type SheetSide = 'top' | 'bottom' | 'left' | 'right';
type SheetSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const SIDE_CLASSES: Record<SheetSide, string> = {
  right:
    'inset-y-0 right-0 h-full border-l pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]',
  left: 'inset-y-0 left-0 h-full border-r pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]',
  top: 'inset-x-0 top-0 w-full border-b pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]',
  bottom:
    'inset-x-0 bottom-0 w-full border-t pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]',
};

const CLOSE_TOP: Record<SheetSide, string> = {
  right: 'top-[calc(1rem+env(safe-area-inset-top))]',
  left: 'top-[calc(1rem+env(safe-area-inset-top))]',
  top: 'top-[calc(1rem+env(safe-area-inset-top))]',
  bottom: 'top-4',
};

const CLOSE_RIGHT: Record<SheetSide, string> = {
  right: 'right-[calc(1rem+env(safe-area-inset-right))]',
  left: 'right-4',
  top: 'right-[calc(1rem+env(safe-area-inset-right))]',
  bottom: 'right-[calc(1rem+env(safe-area-inset-right))]',
};

type SlotChildProps = Record<string, unknown> & { ref?: React.Ref<HTMLElement> };

function mergeSlotProps(own: Record<string, unknown>, child: SlotChildProps) {
  const merged: Record<string, unknown> = { ...own, ...child };
  for (const [key, ownValue] of Object.entries(own)) {
    const childValue = child[key];
    if (
      /^on[A-Z]/.test(key) &&
      typeof ownValue === 'function' &&
      typeof childValue === 'function'
    ) {
      merged[key] = (...args: unknown[]) => {
        childValue(...args);
        ownValue(...args);
      };
    }
  }
  if (own.className || child.className) {
    merged.className = cn(
      own.className as string | undefined,
      child.className as string | undefined,
    );
  }
  if (own.style || child.style) {
    merged.style = { ...(own.style as object | undefined), ...(child.style as object | undefined) };
  }
  return merged;
}

function useComposedRef<T extends HTMLElement>(
  first: React.Ref<T> | undefined,
  second: React.Ref<T> | React.Ref<HTMLElement> | undefined,
) {
  return React.useCallback(
    (node: T | null) => {
      assignRef(first, node);
      assignRef(second as React.Ref<T> | undefined, node);
    },
    [first, second],
  );
}

const HORIZONTAL_SIZE: Record<SheetSize, string> = {
  sm: 'w-80',
  md: 'w-96',
  lg: 'w-[32rem]',
  xl: 'w-[40rem]',
  full: 'w-full',
};

const VERTICAL_SIZE: Record<SheetSize, string> = {
  sm: 'max-h-[40dvh]',
  md: 'max-h-[60dvh]',
  lg: 'max-h-[80dvh]',
  xl: 'max-h-[92dvh]',
  full: 'h-dvh',
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
  const [open, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [hasTitle, setHasTitle] = React.useState(false);
  const [hasDescription, setHasDescription] = React.useState(false);
  const id = React.useId();

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
  const slot = asChild && React.isValidElement<SlotChildProps>(children) ? children : null;
  const composedRef = useComposedRef<HTMLButtonElement>(ref, slot?.props.ref);

  const a11y = {
    'aria-haspopup': 'dialog' as const,
    'aria-expanded': open,
    'aria-controls': `${id}-content`,
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    setOpen(true);
  };

  if (slot) {
    return React.cloneElement(slot, {
      ...mergeSlotProps({ ...props, onClick: handleClick }, slot.props),
      ...a11y,
      ref: composedRef,
    });
  }

  return (
    <button ref={ref} type="button" onClick={handleClick} {...a11y} {...props}>
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
      className={cn('bg-overlay fixed inset-0 z-500 backdrop-blur-xs', className)}
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
  const mounted = useIsClient();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const composedRef = useComposedRef<HTMLDivElement>(contentRef, ref);
  const layer = useLayer(open, true);
  const restoreRef = React.useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement as HTMLElement;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      const content = contentRef.current;
      if (!content) return;

      if (event.key === 'Escape') {
        if (!layer.isTopmost()) return;
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (layer.isTopmostModal() && !layer.isInsideUpperLayer(event.target))
        trapFocus(event, content);
    };

    document.addEventListener('keydown', onKeyDown);

    const frame = requestAnimationFrame(() => {
      if (contentRef.current) focusFirst(contentRef.current);
    });

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);
      restoreRef.current?.focus();
    };
  }, [open, setOpen, layer]);

  if (!mounted) return null;

  const horizontal = side === 'left' || side === 'right';

  const sheet = (
    <AnimatePresence>
      {open && (
        <>
          <SheetOverlay />
          <motion.div
            ref={composedRef}
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
              'bg-background border-border fixed z-500 flex max-w-full flex-col shadow-lg outline-none',
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
                className={cn(
                  'text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring absolute z-10 rounded-full p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  CLOSE_TOP[side],
                  CLOSE_RIGHT[side],
                )}
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
  children,
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
    >
      {children}
    </h2>
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
  const slot = asChild && React.isValidElement<SlotChildProps>(children) ? children : null;
  const composedRef = useComposedRef<HTMLButtonElement>(ref, slot?.props.ref);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    setOpen(false);
  };

  if (slot) {
    return React.cloneElement(slot, {
      ...mergeSlotProps({ ...props, onClick: handleClick }, slot.props),
      ref: composedRef,
    });
  }

  return (
    <button ref={ref} type="button" onClick={handleClick} {...props}>
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
