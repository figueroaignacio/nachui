'use client';

import {
  Alert02Icon,
  AlertCircleIcon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  InformationCircleIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';

// --- CVA variants ---

const bannerVariants = cva(
  'relative flex w-full items-center justify-center gap-3 border-b px-4 py-2 text-sm',
  {
    variants: {
      variant: {
        default: 'bg-foreground text-background border-foreground',
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

// --- Types ---

type BannerVariant = NonNullable<VariantProps<typeof bannerVariants>['variant']>;

type BannerProps = VariantProps<typeof bannerVariants> & {
  ref?: React.Ref<HTMLDivElement>;
  icon?: React.ReactNode;
  onClose?: () => void;
  sticky?: boolean;
  className?: string;
  children?: React.ReactNode;
};

type DivWithRefProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

// --- Variant icons ---

const VARIANT_ICONS: Record<BannerVariant, typeof InformationCircleIcon | undefined> = {
  default: undefined,
  info: InformationCircleIcon,
  warning: Alert02Icon,
  danger: AlertCircleIcon,
  success: CheckmarkCircle01Icon,
};

// --- Animation constants ---

const BANNER_TRANSITION = {
  type: 'spring',
  damping: 30,
  stiffness: 400,
  mass: 0.5,
} as const;

const BANNER_EXIT = {
  opacity: 0,
  height: 0,
  paddingTop: 0,
  paddingBottom: 0,
  marginBottom: 0,
  overflow: 'hidden' as const,
} as const;

const BANNER_EXIT_TRANSITION = { duration: 0.2, ease: 'easeIn' } as const;

// --- Sub-components ---

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
      'shrink-0 rounded-md border border-current/20 px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors hover:bg-white/15',
      className,
    )}
    {...props}
  >
    {children}
  </a>
);
BannerAction.displayName = 'BannerAction';

// --- Root ---

const BannerRoot = ({
  className,
  variant = 'default',
  icon,
  onClose,
  sticky = false,
  children,
  ref,
}: BannerProps) => {
  const [visible, setVisible] = React.useState(true);
  const resolvedVariant: BannerVariant = variant ?? 'default';
  const role = resolvedVariant === 'danger' || resolvedVariant === 'warning' ? 'alert' : 'banner';
  const variantIcon = icon === undefined ? VARIANT_ICONS[resolvedVariant] : null;

  const handleClose = React.useCallback(() => {
    setVisible(false);
    onClose?.();
  }, [onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={ref}
          role={role}
          exit={{ ...BANNER_EXIT, transition: BANNER_EXIT_TRANSITION }}
          transition={BANNER_TRANSITION}
          className={cn(
            bannerVariants({ variant: resolvedVariant }),
            sticky && 'sticky top-0 z-50',
            className,
          )}
        >
          {(icon || variantIcon) && (
            <div aria-hidden="true" className="shrink-0 select-none">
              {icon ?? (variantIcon && <HugeiconsIcon icon={variantIcon} size={16} />)}
            </div>
          )}

          <div className="flex flex-1 items-center gap-3">{children}</div>

          <button
            type="button"
            onClick={handleClose}
            className="shrink-0 cursor-pointer rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
            aria-label="Dismiss banner"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
BannerRoot.displayName = 'Banner';

// --- Compound export ---

const Banner = Object.assign(BannerRoot, {
  Content: BannerContent,
  Title: BannerTitle,
  Description: BannerDescription,
  Action: BannerAction,
});

export { Banner, bannerVariants };
export type { BannerProps, BannerVariant };
