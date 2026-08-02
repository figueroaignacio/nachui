import {
  Alert02Icon,
  AlertCircleIcon,
  CheckmarkCircle01Icon,
  InformationCircleIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../lib/cn';

const calloutVariants = cva('flex w-full items-start gap-3 rounded-md border p-3.5 text-sm', {
  variants: {
    variant: {
      default: 'bg-surface-muted text-card-foreground border-border',
      info: 'bg-info/8 text-info border-info/15',
      warning: 'bg-warning/8 text-warning border-warning/15',
      danger: 'bg-destructive/8 text-destructive border-destructive/15',
      success: 'bg-success/8 text-success border-success/15',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type CalloutProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof calloutVariants> & {
    ref?: React.Ref<HTMLDivElement>;
    icon?: React.ReactNode;
  };

type CalloutVariant = NonNullable<CalloutProps['variant']>;

const getDefaultIcon = (variant: CalloutVariant) => {
  switch (variant) {
    case 'info':
      return <HugeiconsIcon icon={InformationCircleIcon} size={18} />;
    case 'warning':
      return <HugeiconsIcon icon={Alert02Icon} size={18} />;
    case 'danger':
      return <HugeiconsIcon icon={AlertCircleIcon} size={18} />;
    case 'success':
      return <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} />;
    default:
      return null;
  }
};

type DivWithRefProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

const CalloutRoot = ({
  className,
  variant = 'default',
  icon,
  children,
  ref,
  ...props
}: CalloutProps) => {
  const resolvedVariant: CalloutVariant = variant ?? 'default';
  // Callouts are static content: "note" avoids the unnamed-region and
  // spurious-alert announcements of region/alert roles.
  const role = 'note';
  const resolvedIcon = icon ?? getDefaultIcon(resolvedVariant);

  return (
    <div
      ref={ref}
      role={role}
      className={cn(calloutVariants({ variant: resolvedVariant }), className)}
      {...props}
    >
      {resolvedIcon && (
        <div aria-hidden="true" className="mt-0.5 shrink-0 text-base select-none">
          {resolvedIcon}
        </div>
      )}
      <div className="flex-1 space-y-1">{children}</div>
    </div>
  );
};
CalloutRoot.displayName = 'Callout';

const CalloutTitle = ({ className, ref, ...props }: DivWithRefProps) => (
  <div
    ref={ref}
    className={cn('leading-none font-semibold tracking-tight', className)}
    {...props}
  />
);
CalloutTitle.displayName = 'CalloutTitle';

const CalloutContent = ({ className, ref, ...props }: DivWithRefProps) => (
  <div
    ref={ref}
    className={cn('text-muted-foreground/90 [&_p]:leading-relaxed', className)}
    {...props}
  />
);
CalloutContent.displayName = 'CalloutContent';

const Callout = Object.assign(CalloutRoot, {
  Title: CalloutTitle,
  Content: CalloutContent,
});

export { Callout, calloutVariants };
export type { CalloutProps };
