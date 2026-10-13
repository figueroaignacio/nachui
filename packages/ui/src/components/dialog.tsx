'use client';

import { AnimatePresence, type HTMLMotionProps, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cloneElement } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';
import { focusFirst, isTopmostLayer, lockPageScroll, trapFocus, useIsClient } from '../lib/overlay';
import { backdrop, reveal, surface } from '../lib/motion';
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

const OVERLAY_STYLE = { willChange: 'opacity' } as const;
const DIALOG_STYLE = { willChange: 'opacity, transform, filter' } as const;

type DialogContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  hasTitle: boolean;
  setHasTitle: (value: boolean) => void;
  hasDescription: boolean;
  setHasDescription: (value: boolean) => void;
};

const DialogContext = React.createContext<DialogContextType | undefined>(undefined);

const useDialogContext = () => {
  const context = React.use(DialogContext);
  if (!context) {
    throw new Error('useDialogContext must be used within a Dialog');
  }
  return context;
};

interface DialogProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DialogRoot = ({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: DialogProps) => {
  const [open, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [hasTitle, setHasTitle] = React.useState(false);
  const [hasDescription, setHasDescription] = React.useState(false);
  const id = React.useId();

  const value = React.useMemo<DialogContextType>(
    () => ({ open, setOpen, id, hasTitle, setHasTitle, hasDescription, setHasDescription }),
    [open, setOpen, id, hasTitle, hasDescription],
  );

  return <DialogContext value={value}>{children}</DialogContext>;
};

interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DialogTrigger = ({
  asChild,
  onClick,
  ref,
  ...props
}: DialogTriggerProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { open, setOpen } = useDialogContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(true);
    onClick?.(e);
  };

  if (asChild && React.isValidElement(props.children)) {
    const child = props.children as React.ReactElement<Record<string, unknown>>;
    const childOnClick = child.props.onClick as
      | ((e: React.MouseEvent<HTMLButtonElement>) => void)
      | undefined;

    return cloneElement(child, {
      'aria-haspopup': 'dialog',
      'aria-expanded': open,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        childOnClick?.(e);
        handleClick(e);
      },
    });
  }

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={open}
      onClick={handleClick}
      ref={ref}
      {...props}
    />
  );
};
DialogTrigger.displayName = 'DialogTrigger';

interface DialogPortalProps {
  children: React.ReactNode;
}

const DialogPortal = ({ children }: DialogPortalProps) => {
  const mounted = useIsClient();

  if (!mounted) return null;

  return createPortal(children, document.body);
};

interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DialogClose = ({
  asChild,
  onClick,
  ref,
  ...props
}: DialogCloseProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { setOpen } = useDialogContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(false);
    onClick?.(e);
  };

  if (asChild && React.isValidElement(props.children)) {
    const child = props.children as React.ReactElement<Record<string, unknown>>;
    const childOnClick = child.props.onClick as
      | ((e: React.MouseEvent<HTMLButtonElement>) => void)
      | undefined;

    return cloneElement(child, {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        childOnClick?.(e);
        handleClick(e);
      },
    });
  }

  return <button type="button" onClick={handleClick} ref={ref} {...props} />;
};
DialogClose.displayName = 'DialogClose';

type DialogOverlayProps = HTMLMotionProps<'div'> & {
  className?: string;
};

const DialogOverlay = ({
  className,
  ref,
  ...props
}: DialogOverlayProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { setOpen } = useDialogContext();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      variants={shouldReduceMotion ? reveal : backdrop}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={OVERLAY_STYLE}
      className={cn('bg-overlay fixed inset-0 z-500', className)}
      onClick={() => setOpen(false)}
      {...props}
    />
  );
};
DialogOverlay.displayName = 'DialogOverlay';

interface DialogContentProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode;
}

const DialogContent = ({
  className,
  children,
  ref,
  ...props
}: DialogContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { id, open, setOpen, hasTitle, hasDescription } = useDialogContext();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

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
      trapFocus(e, content);
    };

    document.addEventListener('keydown', handleKeyDown);

    const frame = requestAnimationFrame(() => {
      if (contentRef.current) focusFirst(contentRef.current);
    });

    const releasePageScroll = lockPageScroll();

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
      releasePageScroll();
      triggerRef.current?.focus();
    };
  }, [open, setOpen]);

  return (
    <AnimatePresence mode="wait">
      {open && (
        <DialogPortal>
          <DialogOverlay />
          <motion.div
            ref={(node) => {
              contentRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={hasTitle ? `${id}-title` : undefined}
            aria-describedby={hasDescription ? `${id}-description` : undefined}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            variants={shouldReduceMotion ? reveal : surface}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={DIALOG_STYLE}
            className={cn(
              'bg-background fixed top-[50%] left-[50%] z-500 grid max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl translate-x-[-50%] translate-y-[-50%] gap-4 overflow-y-auto rounded-lg border p-6 shadow-lg outline-none',
              className,
            )}
            {...props}
          >
            {children}
            <DialogClose className="ring-offset-background focus-visible:ring-ring absolute top-2 right-2 rounded-sm p-2 opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none">
              <XIcon className="h-4 w-4" size={16} />
              <span className="sr-only">Close</span>
            </DialogClose>
          </motion.div>
        </DialogPortal>
      )}
    </AnimatePresence>
  );
};
DialogContent.displayName = 'DialogContent';

type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const DialogHeader = ({ className, ...props }: DialogHeaderProps) => {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
      {...props}
    />
  );
};
DialogHeader.displayName = 'DialogHeader';

type DialogFooterProps = React.HTMLAttributes<HTMLDivElement>;

const DialogFooter = ({ className, ...props }: DialogFooterProps) => {
  return (
    <div
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
      {...props}
    />
  );
};
DialogFooter.displayName = 'DialogFooter';

type DialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

const DialogTitle = ({
  className,
  children,
  ref,
  ...props
}: DialogTitleProps & { ref?: React.Ref<HTMLHeadingElement> }) => {
  const { id, setHasTitle } = useDialogContext();

  React.useEffect(() => {
    setHasTitle(true);
    return () => setHasTitle(false);
  }, [setHasTitle]);

  return (
    <h2
      id={`${id}-title`}
      ref={ref}
      className={cn('text-lg leading-none font-semibold tracking-tight', className)}
      {...props}
    >
      {children}
    </h2>
  );
};
DialogTitle.displayName = 'DialogTitle';

type DialogDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const DialogDescription = ({
  className,
  ref,
  ...props
}: DialogDescriptionProps & { ref?: React.Ref<HTMLParagraphElement> }) => {
  const { id, setHasDescription } = useDialogContext();

  React.useEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);

  return (
    <p
      id={`${id}-description`}
      ref={ref}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
};
DialogDescription.displayName = 'DialogDescription';

const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Close: DialogClose,
  Content: DialogContent,
  Header: DialogHeader,
  Footer: DialogFooter,
  Title: DialogTitle,
  Description: DialogDescription,
});

export { Dialog };
