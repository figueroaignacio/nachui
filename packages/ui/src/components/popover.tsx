'use client';

import { AnimatePresence, type HTMLMotionProps, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';
import { FloatingPortal, useFloating } from '../lib/floating';
import { floatingOrigin, floatingVariants, reveal } from '../lib/motion';
import { assignRef, getFocusable, useLayer } from '../lib/overlay';
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

const POPOVER_STYLE = { willChange: 'opacity, transform, filter' } as const;

type PopoverSide = 'top' | 'bottom' | 'left' | 'right';

function nextFocusableAfter(anchor: HTMLElement, skip: HTMLElement) {
  return getFocusable(document.body).find(
    (element) =>
      !skip.contains(element) &&
      !anchor.contains(element) &&
      Boolean(anchor.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING),
  );
}

interface PopoverContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  close: () => void;
  id: string;
  triggerId: string | undefined;
  registerTrigger: (node: HTMLButtonElement | null) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const PopoverContext = React.createContext<PopoverContextType | undefined>(undefined);

const usePopoverContext = () => {
  const context = React.use(PopoverContext);
  if (!context) {
    throw new Error('usePopoverContext must be used within a Popover');
  }
  return context;
};

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
  const [open, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const id = React.useId();
  const containerRef = React.useRef<HTMLSpanElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [triggerId, setTriggerId] = React.useState<string | undefined>(undefined);
  const layer = useLayer(open, false, contentRef);

  const registerTrigger = React.useCallback((node: HTMLButtonElement | null) => {
    triggerRef.current = node;
    setTriggerId(node?.id || undefined);
  }, []);

  const close = React.useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, [setOpen]);

  React.useEffect(() => {
    if (!open) return;

    const handlePointerDownOutside = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (containerRef.current?.contains(target)) return;
      if (contentRef.current?.contains(target)) return;
      if (layer.isInsideUpperLayer(target)) return;
      setOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented || !layer.isTopmost()) return;
      event.preventDefault();
      close();
    };

    document.addEventListener('pointerdown', handlePointerDownOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDownOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, setOpen, close, layer]);

  const context = React.useMemo(
    () => ({ open, setOpen, close, id, triggerId, registerTrigger, triggerRef, contentRef }),
    [open, setOpen, close, id, triggerId, registerTrigger],
  );

  return (
    <PopoverContext value={context}>
      <span ref={containerRef} className="relative inline-flex">
        {children}
      </span>
    </PopoverContext>
  );
};

interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

type SlotChildProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.Ref<HTMLElement>;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
};

const PopoverTrigger = ({
  asChild,
  onClick,
  onKeyDown,
  children,
  className,
  style,
  ref,
  ...props
}: PopoverTriggerProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { open, setOpen, close, id, registerTrigger, contentRef } = usePopoverContext();
  const childRef = React.isValidElement(children)
    ? (children.props as SlotChildProps).ref
    : undefined;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (open) close();
    else setOpen(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.key !== 'Tab' || event.shiftKey || !open) return;
    const content = contentRef.current;
    if (!content) return;
    event.preventDefault();
    (getFocusable(content)[0] ?? content).focus();
  };

  const mergedRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      registerTrigger(node);
      assignRef(ref, node);
      assignRef(childRef as React.Ref<HTMLButtonElement | null> | undefined, node);
    },
    [ref, childRef, registerTrigger],
  );

  const shared = {
    id: props.id ?? `${id}-trigger`,
    'aria-expanded': open,
    'aria-haspopup': 'dialog' as const,
    'aria-controls': open ? id : undefined,
    'data-state': open ? 'open' : 'closed',
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<SlotChildProps>;
    const childProps = child.props;

    return React.cloneElement(child, {
      ...props,
      ...childProps,
      ...shared,
      id: childProps.id ?? shared.id,
      ref: mergedRef,
      className: cn(className, childProps.className),
      style: style || childProps.style ? { ...style, ...childProps.style } : undefined,
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        childProps.onClick?.(event);
        handleClick(event);
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => {
        childProps.onKeyDown?.(event);
        handleKeyDown(event);
      },
    } as SlotChildProps);
  }

  return (
    <button
      type="button"
      className={className}
      style={style}
      {...props}
      {...shared}
      ref={mergedRef}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </button>
  );
};
PopoverTrigger.displayName = 'PopoverTrigger';

const PopoverClose = ({
  asChild,
  onClick,
  children,
  className,
  style,
  ref,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}) => {
  const { close } = usePopoverContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) close();
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<SlotChildProps>;
    const childProps = child.props;
    const childRef = childProps.ref;

    return React.cloneElement(child, {
      ...props,
      ...childProps,
      ref: (node: HTMLButtonElement | null) => {
        assignRef(ref, node);
        assignRef(childRef as React.Ref<HTMLButtonElement | null> | undefined, node);
      },
      className: cn(className, childProps.className),
      style: style || childProps.style ? { ...style, ...childProps.style } : undefined,
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        childProps.onClick?.(event);
        handleClick(event);
      },
    } as SlotChildProps);
  }

  return (
    <button
      type="button"
      className={className}
      style={style}
      {...props}
      ref={ref}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
PopoverClose.displayName = 'PopoverClose';

interface PopoverContentProps extends HTMLMotionProps<'div'> {
  side?: PopoverSide;
  sideOffset?: number;
  children?: React.ReactNode;
  showClose?: boolean;
  closeLabel?: string;
}

const PopoverPanel = ({
  side: preferredSide = 'bottom',
  sideOffset = 4,
  className,
  children,
  showClose = false,
  closeLabel = 'Close',
  style,
  onKeyDown,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: PopoverContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { id, close, setOpen, triggerId, triggerRef, contentRef } = usePopoverContext();
  const shouldReduceMotion = useReducedMotion();
  const floating = useFloating({
    open: true,
    anchorRef: triggerRef,
    floatingRef: contentRef,
    side: preferredSide,
    sideOffset,
  });
  const side = floating.side;

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => {
      contentRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [contentRef]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.key !== 'Tab') return;
    const content = contentRef.current;
    const trigger = triggerRef.current;
    if (!content || !trigger) return;

    const focusable = getFocusable(content);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey) {
      if (active === content || active === first || !first) {
        event.preventDefault();
        trigger.focus();
      }
      return;
    }

    if (active === last || !last) {
      event.preventDefault();
      setOpen(false);
      (nextFocusableAfter(trigger, content) ?? trigger).focus();
    }
  };

  return (
    <motion.div
      ref={(node: HTMLDivElement | null) => {
        contentRef.current = node;
        assignRef(ref, node);
      }}
      id={id}
      role="dialog"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy ?? (ariaLabel ? undefined : triggerId)}
      tabIndex={-1}
      data-side={side}
      variants={shouldReduceMotion ? reveal : floatingVariants[side]}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ ...POPOVER_STYLE, ...style, ...floating.style }}
      onKeyDown={handleKeyDown}
      className={cn(
        'bg-popover text-popover-foreground border-border z-500 max-h-(--available-height) w-72 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-md border p-4 shadow-md outline-none',
        floatingOrigin[side],
        className,
      )}
      {...props}
    >
      {children}
      {showClose && (
        <button
          type="button"
          onClick={close}
          className="ring-offset-background focus-visible:ring-ring absolute top-1 right-1 rounded-md p-2 opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <XIcon className="h-4 w-4" size={16} />
          <span className="sr-only">{closeLabel}</span>
        </button>
      )}
    </motion.div>
  );
};

const PopoverContent = (props: PopoverContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { open } = usePopoverContext();

  return (
    <FloatingPortal>
      <AnimatePresence>{open && <PopoverPanel {...props} />}</AnimatePresence>
    </FloatingPortal>
  );
};
PopoverContent.displayName = 'PopoverContent';

const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: PopoverClose,
});

export { Popover };
export type { PopoverProps, PopoverTriggerProps, PopoverContentProps, PopoverSide };
