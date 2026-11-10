'use client';

import { springs, still } from '@repo/ui/lib/motion';
import { cn } from '@repo/ui/lib/cn';
import { motion, useReducedMotion } from 'motion/react';
import * as React from 'react';

/** A segmented switch whose highlight slides to the chosen view. */
export function ViewTabs<T extends string>({
  value,
  onValueChange,
  options,
  label,
  className,
}: {
  value: T;
  onValueChange: (value: T) => void;
  options: ReadonlyArray<{ value: T; label: string }>;
  label: string;
  className?: string;
}) {
  const id = React.useId();
  const reduced = useReducedMotion();

  return (
    <div
      role="group"
      aria-label={label}
      className={cn('border-border bg-surface-muted flex rounded-lg border p-0.5', className)}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onValueChange(option.value)}
            className={cn(
              'focus-visible:ring-ring relative h-7 flex-1 rounded-md px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
              active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {active ? (
              <motion.span
                layoutId={`${id}-indicator`}
                transition={reduced ? still : springs.smooth}
                className="bg-card border-border absolute inset-0 rounded-md border shadow-xs"
              />
            ) : null}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
