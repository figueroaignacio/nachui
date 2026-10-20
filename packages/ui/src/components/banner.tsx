'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { AnimatePresence, type HTMLMotionProps, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';
import { springs } from '../lib/motion';
import { assignRef, getFocusable } from '../lib/overlay';
import { useControllableState } from '../lib/use-controllable-state';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function AlertCircleIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7.5V13" />
      <path d="M12 16.5h.01" />
    </svg>
  );
}

function AlertTriangleIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="M10.3 4.2 2.9 17a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4.5" />
      <path d="M12 16.5h.01" />
    </svg>
  );
}

function CheckCircleIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <circle cx="12" cy="12" r="9.5" />
      <path d="m8 12 2.7 2.7L16 9.3" />
    </svg>
  );
}

function InfoIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 11v5.5" />
      <path d="M12 7.5h.01" />
    </svg>
  );
}

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

const bannerVariants = cva(
  'relative flex w-full items-center justify-center gap-3 border-b px-4 py-2 text-sm rounded-md',
  {
    variants: {
      variant: {
        default: 'bg-inverse text-inverse-foreground border-inverse',
        info: 'bg-info text-info-foreground border-info',
        warning: 'bg-warning text-warning-foreground border-warning',
        danger: 'bg-destructive text-destructive-foreground border-destructive',
        success: 'bg-success text-success-foreground border-success',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type BannerVariant = NonNullable<VariantProps<typeof bannerVariants>['variant']>;

type BannerRole = 'region' | 'status' | 'alert';

type BannerProps = Omit<HTMLMotionProps<'div'>, 'children' | 'role' | 'ref'> &
  VariantProps<typeof bannerVariants> & {
    ref?: React.Ref<HTMLDivElement>;
    icon?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onClose?: () => void;
    sticky?: boolean;
    dismissible?: boolean;
    dismissLabel?: string;
    role?: BannerRole;
    label?: string;
    className?: string;
    children?: React.ReactNode;
  };

type DivWithRefProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

const VARIANT_ICONS: Record<BannerVariant, React.ComponentType<IconProps> | undefined> = {
  default: undefined,
  info: InfoIcon,
  warning: AlertTriangleIcon,
  danger: AlertCircleIcon,
  success: CheckCircleIcon,
};

const BANNER_INITIAL = { opacity: 0, y: -8 } as const;
const BANNER_ANIMATE = { opacity: 1, y: 0 } as const;
const BANNER_TRANSITION = { ...springs.smooth, opacity: { duration: 0.2 } };

const BANNER_EXIT = {
  opacity: 0,
  height: 0,
  paddingTop: 0,
  paddingBottom: 0,
  marginBottom: 0,
  overflow: 'hidden' as const,
} as const;

const BANNER_EXIT_TRANSITION = { duration: 0.2, ease: 'easeIn' } as const;
const REDUCED_MOTION_PROPS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.12 },
} as const;

const BannerContent = ({ className, ref, ...props }: DivWithRefProps) => (
  <div ref={ref} className={cn('flex-1 space-y-2', className)} {...props} />
);
BannerContent.displayName = 'BannerContent';

const BannerTitle = ({ className, ref, ...props }: DivWithRefProps) => (
  <div
    ref={ref}
    className={cn('leading-none font-semibold tracking-tight', className)}
    {...props}
  />
);
BannerTitle.displayName = 'BannerTitle';

const BannerDescription = ({ className, ref, ...props }: DivWithRefProps) => (
  <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
);
BannerDescription.displayName = 'BannerDescription';

type BannerActionProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  ref?: React.Ref<HTMLAnchorElement>;
};

const BannerAction = ({ className, children, ref, ...props }: BannerActionProps) => (
  <a
    ref={ref}
    className={cn(
      'shrink-0 rounded-md border border-current/20 px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors hover:bg-current/10 focus-visible:ring-2 focus-visible:ring-current focus-visible:outline-none',
      className,
    )}
    {...props}
  >
    {children}
  </a>
);
BannerAction.displayName = 'BannerAction';

function findFocusAfter(node: HTMLElement) {
  const candidates = getFocusable(document.body).filter((element) => !node.contains(element));
  const next = candidates.find(
    (element) => node.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING,
  );
  return next ?? candidates.at(-1) ?? null;
}

const BannerRoot = ({
  className,
  variant = 'default',
  icon,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  onClose,
  sticky = false,
  dismissible = true,
  dismissLabel = 'Dismiss banner',
  role = 'region',
  label = 'Announcement',
  children,
  ref,
  ...props
}: BannerProps) => {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const shouldReduceMotion = useReducedMotion();
  const resolvedVariant: BannerVariant = variant ?? 'default';
  const VariantIcon = icon === undefined ? VARIANT_ICONS[resolvedVariant] : null;
  const nodeRef = React.useRef<HTMLDivElement | null>(null);
  const focusTargetRef = React.useRef<HTMLElement | null>(null);
  const ariaLabel =
    props['aria-label'] ?? (role === 'region' && !props['aria-labelledby'] ? label : undefined);

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      nodeRef.current = node;
      assignRef(ref, node);
    },
    [ref],
  );

  const handleClose = React.useCallback(() => {
    const node = nodeRef.current;
    focusTargetRef.current =
      node && node.contains(document.activeElement) ? findFocusAfter(node) : null;
    setOpen(false);
    onClose?.();
  }, [onClose, setOpen]);

  React.useEffect(() => {
    const target = focusTargetRef.current;
    focusTargetRef.current = null;
    if (open || !target?.isConnected) return;
    const active = document.activeElement;
    const focusIsLost =
      !active || active === document.body || (nodeRef.current?.contains(active) ?? false);
    if (focusIsLost) target.focus();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          {...props}
          ref={setRefs}
          role={role}
          aria-label={ariaLabel}
          initial={shouldReduceMotion ? REDUCED_MOTION_PROPS.initial : BANNER_INITIAL}
          animate={shouldReduceMotion ? REDUCED_MOTION_PROPS.animate : BANNER_ANIMATE}
          exit={
            shouldReduceMotion
              ? { ...BANNER_EXIT, transition: REDUCED_MOTION_PROPS.transition }
              : { ...BANNER_EXIT, transition: BANNER_EXIT_TRANSITION }
          }
          transition={shouldReduceMotion ? REDUCED_MOTION_PROPS.transition : BANNER_TRANSITION}
          className={cn(
            bannerVariants({ variant: resolvedVariant }),
            sticky && 'sticky top-0 z-50',
            className,
          )}
        >
          {(icon || VariantIcon) && (
            <div aria-hidden="true" className="shrink-0 select-none">
              {icon ?? (VariantIcon && <VariantIcon size={16} />)}
            </div>
          )}

          <div className="flex flex-1 items-center gap-3">{children}</div>

          {dismissible && (
            <button
              type="button"
              onClick={handleClose}
              className="focus-visible:ring-ring -m-1.5 shrink-0 cursor-pointer rounded-md p-2.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:outline-none"
              aria-label={dismissLabel}
            >
              <XIcon size={14} aria-hidden="true" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
BannerRoot.displayName = 'Banner';

const Banner = Object.assign(BannerRoot, {
  Content: BannerContent,
  Title: BannerTitle,
  Description: BannerDescription,
  Action: BannerAction,
});

export { Banner, bannerVariants };
export type { BannerProps, BannerVariant };
