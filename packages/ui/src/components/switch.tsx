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
        'has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-background border-border/60 relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors has-disabled:cursor-not-allowed has-disabled:opacity-40 has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-offset-1 has-[:focus-visible]:outline-none',
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
