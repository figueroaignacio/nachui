'use client';

import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, type HTMLMotionProps, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';

// --- Animation constants ---

const MENU_ANIMATION = {
  initial: { opacity: 0, y: -5, scale: 0.98, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -5, scale: 0.98, filter: 'blur(4px)' },
} as const;

const MENU_TRANSITION = { duration: 0.18, ease: 'easeOut' } as const;
const MENU_STYLE = { willChange: 'opacity, transform, filter' } as const;
const REDUCED_MOTION_PROPS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.12 },
} as const;

const CLOSE_DELAY_MS = 150;

// --- Item context ---

interface NavigationMenuItemContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  scheduleClose: () => void;
  cancelClose: () => void;
  id: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const NavigationMenuItemContext = React.createContext<NavigationMenuItemContextType | undefined>(
  undefined,
);

const useNavigationMenuItem = () => {
  const context = React.use(NavigationMenuItemContext);
  if (!context) {
    throw new Error('NavigationMenu parts must be used within a NavigationMenu.Item');
  }
  return context;
};

// --- Components ---

const NavigationMenuRoot = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }) => (
  <nav ref={ref} className={cn('flex items-center gap-6', className)} {...props} />
);
NavigationMenuRoot.displayName = 'NavigationMenu';

const NavigationMenuItem = ({
  className,
  children,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) => {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = React.useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = React.useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }, [cancelClose]);

  React.useEffect(() => cancelClose, [cancelClose]);

  React.useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
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

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const mergedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [ref],
  );

  return (
    <NavigationMenuItemContext
      value={{ open, setOpen, scheduleClose, cancelClose, id, triggerRef }}
    >
      <div ref={mergedRef} className={cn('relative', className)} {...props}>
        {children}
      </div>
    </NavigationMenuItemContext>
  );
};
NavigationMenuItem.displayName = 'NavigationMenuItem';

const NavigationMenuTrigger = ({
  className,
  children,
  onClick,
  ref,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { open, setOpen, id, triggerRef } = useNavigationMenuItem();

  const mergedRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    },
    [ref, triggerRef],
  );

  return (
    <button
      type="button"
      ref={mergedRef}
      aria-expanded={open}
      aria-controls={open ? id : undefined}
      onClick={(e) => {
        setOpen(!open);
        onClick?.(e);
      }}
      className={cn(
        'text-muted-foreground hover:text-foreground focus-visible:ring-ring flex cursor-pointer items-center gap-1 rounded-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        open && 'text-foreground',
        className,
      )}
      {...props}
    >
      {children}
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        size={13}
        aria-hidden="true"
        className={cn('transition-transform duration-200', open && 'rotate-180')}
      />
    </button>
  );
};
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

const NavigationMenuContent = ({ className, children, ...props }: HTMLMotionProps<'div'>) => {
  const { open, id } = useNavigationMenuItem();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id={id}
          initial={shouldReduceMotion ? REDUCED_MOTION_PROPS.initial : MENU_ANIMATION.initial}
          animate={shouldReduceMotion ? REDUCED_MOTION_PROPS.animate : MENU_ANIMATION.animate}
          exit={shouldReduceMotion ? REDUCED_MOTION_PROPS.exit : MENU_ANIMATION.exit}
          transition={shouldReduceMotion ? REDUCED_MOTION_PROPS.transition : MENU_TRANSITION}
          style={MENU_STYLE}
          className={cn(
            'border-border bg-popover absolute top-full left-0 z-50 mt-2 w-72 rounded-lg border p-1.5 shadow-lg',
            className,
          )}
          {...props}
        >
          <span
            aria-hidden="true"
            className="border-border bg-popover absolute -top-[5.5px] left-5 size-2.5 rotate-45 rounded-[1px] border-t border-l"
          />
          {children as React.ReactNode}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
NavigationMenuContent.displayName = 'NavigationMenuContent';

interface NavigationMenuLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  badge?: React.ReactNode;
}

/**
 * A menu row: icon box, title with optional badge, and a muted description.
 * Pass `asChild` with a routing `<Link>` as the only child to keep client-side
 * (and locale-aware) navigation; the row content is injected into it.
 */
const NavigationMenuLink = ({
  asChild,
  icon,
  title,
  description,
  badge,
  className,
  children,
  onClick,
  ...props
}: NavigationMenuLinkProps) => {
  const { setOpen } = useNavigationMenuItem();

  const rowClassName = cn(
    'group/navlink hover:bg-muted focus-visible:ring-ring flex items-start gap-3 rounded-md px-2.5 py-2.5 transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
    className,
  );

  const content = (
    <>
      {icon && (
        <span className="border-border bg-background text-muted-foreground group-hover/navlink:text-foreground flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors">
          {icon}
        </span>
      )}
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className="text-foreground text-sm font-medium">{title}</span>
          {badge}
        </span>
        {description && (
          <span className="text-muted-foreground mt-0.5 block truncate text-xs">{description}</span>
        )}
      </span>
    </>
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    const childOnClick = child.props.onClick as ((e: React.MouseEvent) => void) | undefined;

    return React.cloneElement(
      child,
      {
        className: cn(rowClassName, child.props.className as string | undefined),
        onClick: (e: React.MouseEvent) => {
          childOnClick?.(e);
          setOpen(false);
        },
      },
      content,
    );
  }

  return (
    <a
      className={rowClassName}
      onClick={(e) => {
        onClick?.(e as React.MouseEvent<HTMLAnchorElement>);
        setOpen(false);
      }}
      {...props}
    >
      {content}
    </a>
  );
};
NavigationMenuLink.displayName = 'NavigationMenuLink';

const NavigationMenu = Object.assign(NavigationMenuRoot, {
  Item: NavigationMenuItem,
  Trigger: NavigationMenuTrigger,
  Content: NavigationMenuContent,
  Link: NavigationMenuLink,
});

export { NavigationMenu };
export type { NavigationMenuLinkProps };
