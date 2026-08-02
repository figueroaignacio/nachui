'use client';

import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/cn';

const selectVariants = cva(
  'border-input placeholder:text-muted-foreground focus-visible:ring-ring flex w-full appearance-none rounded-md border bg-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20',
  {
    variants: {
      size: {
        sm: 'h-8 px-2.5 py-1 pr-9 text-xs',
        default: 'h-9 px-3 py-1 pr-10 text-sm',
        lg: 'h-10 px-4 py-2 pr-10 text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

type SelectSize = VariantProps<typeof selectVariants>['size'];

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  wrapperClassName?: string;
  size?: SelectSize;
}

function Select({
  className,
  wrapperClassName,
  size,
  children,
  ref,
  ...props
}: SelectProps & { ref?: React.Ref<HTMLSelectElement> }) {
  return (
    <div className={cn('relative flex w-full items-center', wrapperClassName)}>
      <select ref={ref} className={cn(selectVariants({ size }), className)} {...props}>
        {children}
      </select>
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        aria-hidden="true"
        className="text-muted-foreground pointer-events-none absolute right-3 size-4"
        size={16}
      />
    </div>
  );
}
Select.displayName = 'Select';

export { Select, selectVariants };
