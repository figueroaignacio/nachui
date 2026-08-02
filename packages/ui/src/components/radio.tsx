'use client';

import * as React from 'react';
import { cn } from '../lib/cn';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

function Radio({
  className,
  onCheckedChange,
  onChange,
  ref,
  ...props
}: RadioProps & { ref?: React.Ref<HTMLInputElement> }) {
  return (
    <div className={cn('relative flex shrink-0 items-center justify-center', className)}>
      <input
        type="radio"
        ref={ref}
        className="peer focus-visible:ring-ring border-primary checked:border-primary checked:bg-primary bg-background size-4 shrink-0 cursor-pointer appearance-none rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        onChange={(e) => {
          onChange?.(e);
          if (onCheckedChange) {
            onCheckedChange(e.target.checked);
          }
        }}
        {...props}
      />
      <div
        aria-hidden="true"
        className="bg-background pointer-events-none absolute size-1.5 rounded-full opacity-0 transition-opacity peer-checked:opacity-100"
      />
    </div>
  );
}
Radio.displayName = 'Radio';

export { Radio };
