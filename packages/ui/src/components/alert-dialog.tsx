'use client';

import { AnimatePresence, type HTMLMotionProps, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cloneElement } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';
import { backdrop, reveal, surface } from '../lib/motion';
import {
  assignRef,
  focusFirst,
  lockPageScroll,
  trapFocus,
  useIsClient,
  useLayer,
} from '../lib/overlay';
import { useControllableState } from '../lib/use-controllable-state';
import { Button, type ButtonProps } from './button';

const OVERLAY_STYLE = { willChange: 'opacity' } as const;
const CONTENT_STYLE = { willChange: 'opacity, transform, filter' } as const;
const CANCEL_SELECTOR = '[data-slot="alert-dialog-cancel"]';

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

function isThenable(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as PromiseLike<unknown>).then === 'function'
  );
}

type AlertDialogContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  requestClose: () => void;
  pending: boolean;
  runAction: (promise: PromiseLike<unknown>) => void;
  id: string;
  hasTitle: boolean;
  setHasTitle: (value: boolean) => void;
  hasDescription: boolean;
  setHasDescription: (value: boolean) => void;
};

const AlertDialogContext = React.createContext<AlertDialogContextType | undefined>(undefined);

const useAlertDialogContext = () => {
  const context = React.use(AlertDialogContext);
  if (!context) {
    throw new Error('AlertDialog parts must be used within AlertDialog');
  }
  return context;
};

interface AlertDialogProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AlertDialogRoot = ({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: AlertDialogProps) => {
  const [open, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [pending, setPending] = React.useState(false);
  const [hasTitle, setHasTitle] = React.useState(false);
  const [hasDescription, setHasDescription] = React.useState(false);
  const pendingRef = React.useRef(false);
  const mountedRef = React.useRef(true);
  const id = React.useId();

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const requestClose = React.useCallback(() => {
    if (pendingRef.current) return;
    setOpen(false);
  }, [setOpen]);

  const runAction = React.useCallback(
    (promise: PromiseLike<unknown>) => {
      pendingRef.current = true;
      setPending(true);
      const settle = (close: boolean) => {
        pendingRef.current = false;
        if (!mountedRef.current) return;
        setPending(false);
        if (close) setOpen(false);
      };
      promise.then(
        () => settle(true),
        () => settle(false),
      );
    },
    [setOpen],
  );

  const value = React.useMemo<AlertDialogContextType>(
    () => ({
      open,
      setOpen,
      requestClose,
      pending,
      runAction,
      id,
      hasTitle,
      setHasTitle,
      hasDescription,
      setHasDescription,
    }),
    [open, setOpen, requestClose, pending, runAction, id, hasTitle, hasDescription],
  );

  return <AlertDialogContext value={value}>{children}</AlertDialogContext>;
};
AlertDialogRoot.displayName = 'AlertDialog';

interface AlertDialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

const AlertDialogTrigger = ({
  asChild,
  onClick,
  children,
  ref,
  ...props
}: AlertDialogTriggerProps) => {
  const { open, setOpen } = useAlertDialogContext();
  const slot = asChild && React.isValidElement<SlotChildProps>(children) ? children : null;
  const composedRef = useComposedRef<HTMLButtonElement>(ref, slot?.props.ref);
  const state = open ? 'open' : 'closed';

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) setOpen(true);
  };

  if (slot) {
    return cloneElement(slot, {
      ...mergeSlotProps({ ...props, onClick: handleClick }, slot.props),
      'aria-haspopup': 'dialog',
      'aria-expanded': open,
      'data-state': state,
      'data-slot': 'alert-dialog-trigger',
      ref: composedRef,
    });
  }

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={open}
      data-state={state}
      data-slot="alert-dialog-trigger"
      onClick={handleClick}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
};
AlertDialogTrigger.displayName = 'AlertDialogTrigger';

const AlertDialogPortal = ({ children }: { children: React.ReactNode }) => {
  const mounted = useIsClient();
  if (!mounted) return null;
  return createPortal(children, document.body);
};

interface AlertDialogContentProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode;
  overlayClassName?: string;
}

const AlertDialogContent = ({
  className,
  overlayClassName,
  children,
  ref,
  ...props
}: AlertDialogContentProps) => {
  const { id, open, requestClose, pending, hasTitle, hasDescription } = useAlertDialogContext();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const composedRef = useComposedRef<HTMLDivElement>(contentRef, ref);
  const layer = useLayer(open, true, contentRef);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  React.useEffect(() => {
    if (!open) return;

    triggerRef.current = document.activeElement as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      const content = contentRef.current;
      if (!content) return;

      if (event.key === 'Escape') {
        if (!layer.isTopmost()) return;
        event.preventDefault();
        const cancel = content.querySelector<HTMLElement>(CANCEL_SELECTOR);
        if (cancel && !cancel.matches(':disabled, [aria-disabled="true"]')) cancel.click();
        else requestClose();
        return;
      }
      if (layer.isTopmostModal() && !layer.isInsideUpperLayer(event.target)) {
        trapFocus(event, content);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const frame = requestAnimationFrame(() => {
      const content = contentRef.current;
      if (!content) return;
      if (!document.getElementById(titleId)) {
        console.error('AlertDialog.Content needs an AlertDialog.Title to name the dialog.');
      }
      if (!document.getElementById(descriptionId)) {
        console.error('AlertDialog.Content needs an AlertDialog.Description to explain it.');
      }
      const preferred =
        content.querySelector<HTMLElement>('[data-autofocus], [autofocus]') ??
        content.querySelector<HTMLElement>(`${CANCEL_SELECTOR}:not(:disabled)`);
      if (preferred) preferred.focus();
      else focusFirst(content);
    });

    const releasePageScroll = lockPageScroll();

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
      releasePageScroll();
      triggerRef.current?.focus();
    };
  }, [open, requestClose, layer, titleId, descriptionId]);

  return (
    <AnimatePresence mode="wait">
      {open && (
        <AlertDialogPortal>
          <motion.div
            data-slot="alert-dialog-overlay"
            data-state="open"
            variants={shouldReduceMotion ? reveal : backdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={OVERLAY_STYLE}
            className={cn('bg-overlay fixed inset-0 z-500', overlayClassName)}
          />
          <motion.div
            ref={composedRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={hasTitle ? titleId : undefined}
            aria-describedby={hasDescription ? descriptionId : undefined}
            aria-busy={pending || undefined}
            data-slot="alert-dialog-content"
            data-state="open"
            tabIndex={-1}
            variants={shouldReduceMotion ? reveal : surface}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={CONTENT_STYLE}
            className={cn(
              'bg-popover text-popover-foreground fixed inset-0 z-500 m-auto grid h-fit max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md gap-5 overflow-y-auto rounded-lg border p-6 shadow-lg outline-none',
              className,
            )}
            {...props}
          >
            {children}
          </motion.div>
        </AlertDialogPortal>
      )}
    </AnimatePresence>
  );
};
AlertDialogContent.displayName = 'AlertDialogContent';

type AlertDialogHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

const AlertDialogHeader = ({ className, ...props }: AlertDialogHeaderProps) => (
  <div
    data-slot="alert-dialog-header"
    className={cn('flex flex-col gap-2 text-center sm:text-start', className)}
    {...props}
  />
);
AlertDialogHeader.displayName = 'AlertDialogHeader';

type AlertDialogFooterProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

const AlertDialogFooter = ({ className, ...props }: AlertDialogFooterProps) => (
  <div
    data-slot="alert-dialog-footer"
    className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
    {...props}
  />
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

type AlertDialogTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  ref?: React.Ref<HTMLHeadingElement>;
};

const AlertDialogTitle = ({ className, children, ...props }: AlertDialogTitleProps) => {
  const { id, setHasTitle } = useAlertDialogContext();

  React.useEffect(() => {
    setHasTitle(true);
    return () => setHasTitle(false);
  }, [setHasTitle]);

  return (
    <h2
      id={`${id}-title`}
      data-slot="alert-dialog-title"
      className={cn('text-lg leading-tight font-semibold', className)}
      {...props}
    >
      {children}
    </h2>
  );
};
AlertDialogTitle.displayName = 'AlertDialogTitle';

type AlertDialogDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & {
  ref?: React.Ref<HTMLParagraphElement>;
};

const AlertDialogDescription = ({ className, ...props }: AlertDialogDescriptionProps) => {
  const { id, setHasDescription } = useAlertDialogContext();

  React.useEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);

  return (
    <p
      id={`${id}-description`}
      data-slot="alert-dialog-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
};
AlertDialogDescription.displayName = 'AlertDialogDescription';

type AlertDialogCancelProps = ButtonProps & {
  asChild?: boolean;
};

const AlertDialogCancel = ({
  asChild,
  variant = 'outline',
  disabled,
  onClick,
  children,
  ref,
  ...props
}: AlertDialogCancelProps) => {
  const { requestClose, pending } = useAlertDialogContext();
  const slot = asChild && React.isValidElement<SlotChildProps>(children) ? children : null;
  const composedRef = useComposedRef<HTMLButtonElement>(
    ref as React.Ref<HTMLButtonElement> | undefined,
    slot?.props.ref,
  );
  const isDisabled = disabled || pending;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) requestClose();
  };

  if (slot) {
    return cloneElement(slot, {
      ...mergeSlotProps({ ...props, onClick: handleClick } as Record<string, unknown>, slot.props),
      disabled: isDisabled || undefined,
      'data-slot': 'alert-dialog-cancel',
      ref: composedRef,
    });
  }

  return (
    <Button
      ref={ref}
      variant={variant}
      disabled={isDisabled}
      data-slot="alert-dialog-cancel"
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
};
AlertDialogCancel.displayName = 'AlertDialogCancel';

type AlertDialogActionProps = Omit<ButtonProps, 'onClick'> & {
  asChild?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | PromiseLike<unknown>;
};

const AlertDialogAction = ({
  asChild,
  variant = 'default',
  onClick,
  children,
  ref,
  ...props
}: AlertDialogActionProps) => {
  const { setOpen, pending, runAction } = useAlertDialogContext();
  const slot = asChild && React.isValidElement<SlotChildProps>(children) ? children : null;
  const composedRef = useComposedRef<HTMLButtonElement>(
    ref as React.Ref<HTMLButtonElement> | undefined,
    slot?.props.ref,
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (pending) {
      event.preventDefault();
      return;
    }
    const childClick = slot?.props.onClick as
      | ((event: React.MouseEvent<HTMLButtonElement>) => unknown)
      | undefined;
    const results = [childClick?.(event), onClick?.(event)];
    if (event.defaultPrevented) return;
    const promise = results.find(isThenable);
    if (promise) runAction(promise);
    else setOpen(false);
  };

  if (slot) {
    return cloneElement(slot, {
      ...mergeSlotProps(props as Record<string, unknown>, slot.props),
      onClick: handleClick,
      'aria-busy': pending || undefined,
      'aria-disabled': pending || undefined,
      'data-pending': pending ? '' : undefined,
      'data-slot': 'alert-dialog-action',
      ref: composedRef,
    });
  }

  return (
    <Button
      ref={ref}
      variant={variant}
      loading={pending}
      data-pending={pending ? '' : undefined}
      data-slot="alert-dialog-action"
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
};
AlertDialogAction.displayName = 'AlertDialogAction';

const AlertDialog = Object.assign(AlertDialogRoot, {
  Trigger: AlertDialogTrigger,
  Content: AlertDialogContent,
  Header: AlertDialogHeader,
  Footer: AlertDialogFooter,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Cancel: AlertDialogCancel,
  Action: AlertDialogAction,
});

export { AlertDialog };
export type {
  AlertDialogActionProps,
  AlertDialogCancelProps,
  AlertDialogContentProps,
  AlertDialogDescriptionProps,
  AlertDialogFooterProps,
  AlertDialogHeaderProps,
  AlertDialogProps,
  AlertDialogTitleProps,
  AlertDialogTriggerProps,
};
