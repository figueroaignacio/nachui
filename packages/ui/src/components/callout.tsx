import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../lib/cn';

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

const calloutVariants = cva('flex w-full items-start gap-3 rounded-md border p-3.5 text-sm', {
  variants: {
    variant: {
      default: 'bg-surface-muted text-card-foreground border-border',
      info: 'bg-info-surface text-info-text border-info-border',
      warning: 'bg-warning-surface text-warning-text border-warning-border',
      danger: 'bg-destructive-surface text-destructive-text border-destructive-border',
      success: 'bg-success-surface text-success-text border-success-border',
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
      return <InfoIcon size={18} />;
    case 'warning':
      return <AlertTriangleIcon size={18} />;
    case 'danger':
      return <AlertCircleIcon size={18} />;
    case 'success':
      return <CheckCircleIcon size={18} />;
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
