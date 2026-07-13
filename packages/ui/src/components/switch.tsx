'use client';

import * as React from 'react';
import { cn } from '../lib/cn';

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

function Switch({
  className,
  onCheckedChange,
  onChange,
  ref,
  ...props
}: SwitchProps & { ref?: React.Ref<HTMLInputElement> }) {
  return (
    <label
      className={cn(
        'focus-within:ring-ring focus-within:ring-offset-background border-border/60 relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors focus-within:ring-1 focus-within:ring-offset-1 focus-within:outline-none has-disabled:cursor-not-allowed has-disabled:opacity-40',
        className,
      )}
    >
      <input
        type="checkbox"
        role="switch"
        ref={ref}
        className="peer sr-only"
        onChange={(e) => {
          onChange?.(e);
          onCheckedChange?.(e.target.checked);
        }}
        {...props}
      />
      <div
        aria-hidden="true"
        className="bg-muted peer-checked:bg-primary/70 pointer-events-none absolute inset-x-0 h-full w-full rounded-full transition-colors"
      />
      <span
        aria-hidden="true"
        className="bg-foreground/60 peer-checked:bg-primary-foreground pointer-events-none z-10 block h-3.5 w-3.5 translate-x-0.5 rounded-full shadow-sm ring-0 transition-transform peer-checked:translate-x-4"
      />
    </label>
  );
}
Switch.displayName = 'Switch';

export { Switch };
