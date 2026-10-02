'use client';

import { AnimatePresence, type HTMLMotionProps, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';
import { floatingOrigin, floatingVariants, reveal } from '../lib/motion';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function ChevronDownIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

const MENU_STYLE = { willChange: 'opacity, transform, filter' } as const;

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

// --- Item context ---

interface NavigationMenuItemContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
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
  }, [open]);

  const contextValue = React.useMemo(() => ({ open, setOpen, id, triggerRef }), [open, id]);

  const mergedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [ref],
  );

  return (
    <NavigationMenuItemContext value={contextValue}>
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
        'text-muted-foreground hover:text-foreground focus-visible:ring-ring ring-offset-background flex min-h-9 cursor-pointer items-center gap-1 rounded-md px-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        open && 'text-foreground',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon
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
  const contentRef = React.useRef<HTMLDivElement>(null);
  const shift = useViewportShift(contentRef, open);
  const style = React.useMemo(
    () => ({ ...MENU_STYLE, translate: shift ? `${shift}px` : undefined }),
    [shift],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={contentRef}
          id={id}
          variants={shouldReduceMotion ? reveal : floatingVariants.bottom}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={style}
          className={cn(
            'bg-popover text-popover-foreground border-border absolute top-full left-0 z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-md border p-1 shadow-md',
            floatingOrigin.bottom,
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
