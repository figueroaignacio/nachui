import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/cn';

const badgeVariants = cva(
  'inline-flex items-center justify-center gap-1 rounded-sm border px-2 py-0.5 text-[11px] font-medium tracking-wide whitespace-nowrap transition-colors [&>svg]:size-3 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground border-primary/20',
        secondary: 'bg-secondary text-secondary-foreground border-secondary-foreground/10',
        destructive: 'bg-destructive-surface text-destructive-text border-destructive-border',
        success: 'bg-success-surface text-success-text border-success-border',
        warning: 'bg-warning-surface text-warning-text border-warning-border',
        info: 'bg-info-surface text-info-text border-info-border',
        outline: 'text-foreground border-border bg-transparent',
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
