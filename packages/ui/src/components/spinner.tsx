import { Loading03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/cn';

const spinnerVariants = cva('animate-spin inline-flex items-center justify-center', {
  variants: {
    size: {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    },
    variant: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      success: 'text-success-text',
      destructive: 'text-destructive-text',
      warning: 'text-warning-text',
      info: 'text-info-text',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof spinnerVariants> {}

function Spinner({
  className,
  size,
  variant,
  ref,
  ...props
}: SpinnerProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      role="status"
      aria-label="Loading"
      aria-live="polite"
      className={cn(spinnerVariants({ size, variant }), className)}
      {...props}
    >
      <HugeiconsIcon icon={Loading03Icon} className="h-full w-full" />
    </div>
  );
}
Spinner.displayName = 'Spinner';

export { Spinner, spinnerVariants };
