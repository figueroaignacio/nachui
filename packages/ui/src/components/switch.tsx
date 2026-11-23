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
        'has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-background relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors has-disabled:cursor-not-allowed has-disabled:opacity-40 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:outline-none',
        'before:absolute before:-inset-x-1 before:-inset-y-1 before:rounded-full pointer-coarse:before:-inset-x-1.5 pointer-coarse:before:-inset-y-3',
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
        className="bg-well peer-checked:bg-primary/70 pointer-events-none absolute -inset-px rounded-full inset-shadow-sm transition-colors"
      />
      <span
        aria-hidden="true"
        className="bg-foreground/60 peer-checked:bg-primary-foreground pointer-events-none z-10 block h-3.5 w-3.5 translate-x-0.5 rounded-full ring-0 inset-shadow-xs transition-transform peer-checked:translate-x-4.5 motion-reduce:transition-none"
      />
    </label>
  );
}
Switch.displayName = 'Switch';

export { Switch };
