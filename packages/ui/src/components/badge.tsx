import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/cn';

const badgeVariants = cva(
  'inline-flex items-center justify-center gap-1 rounded-sm px-2 py-0.5 text-[11px] font-medium tracking-wide whitespace-nowrap transition-colors [&>svg]:size-3 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground inset-shadow-xs',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs',
        destructive: 'bg-destructive-surface text-destructive-text',
        success: 'bg-success-surface text-success-text',
        warning: 'bg-warning-surface text-warning-text',
        info: 'bg-info-surface text-info-text',
        outline: 'text-foreground bg-card shadow-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

const Badge = ({
  className,
  variant,
  ref,
  ...props
}: BadgeProps & { ref?: React.Ref<HTMLSpanElement> }) => {
  return <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />;
};

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
