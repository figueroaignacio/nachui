'use client';

import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import * as React from 'react';
import { cn } from '../lib/cn';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  wrapperClassName?: string;
}

function Select({
  className,
  wrapperClassName,
  children,
  ref,
  ...props
}: SelectProps & { ref?: React.Ref<HTMLSelectElement> }) {
  return (
    <div className={cn('relative flex w-full items-center', wrapperClassName)}>
      <select
        ref={ref}
        className={cn(
          'border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full appearance-none rounded-md border bg-transparent px-3 py-2 pr-10 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
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

export { Select };
