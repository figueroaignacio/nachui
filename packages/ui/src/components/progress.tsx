'use client';

import { motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';

const INDETERMINATE_ANIMATE = { left: ['-33%', '100%'] };
const INDETERMINATE_TRANSITION = { repeat: Infinity, duration: 1.5, ease: 'easeInOut' } as const;
const DETERMINATE_INITIAL = { x: '-100%' } as const;
const DETERMINATE_TRANSITION = { type: 'spring', stiffness: 50, damping: 15 } as const;
const STILL_TRANSITION = { duration: 0 } as const;

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number | null;
  max?: number;
}

function Progress({
  className,
  value,
  max = 100,
  ref,
  ...props
}: ProgressProps & { ref?: React.Ref<HTMLDivElement> }) {
  const shouldReduceMotion = useReducedMotion();
  const safeMax = max > 0 ? max : 100;
  const clampedValue =
    value === null || value === undefined ? undefined : Math.min(Math.max(value, 0), safeMax);

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={clampedValue}
      className={cn('bg-secondary relative h-1 w-full overflow-hidden rounded-none', className)}
      {...props}
    >
      {clampedValue === undefined ? (
        <motion.div
          className={cn(
            'bg-primary absolute inset-y-0 rounded-full',
            shouldReduceMotion ? 'inset-x-0' : 'w-1/3',
          )}
          animate={shouldReduceMotion ? undefined : INDETERMINATE_ANIMATE}
          transition={shouldReduceMotion ? STILL_TRANSITION : INDETERMINATE_TRANSITION}
        />
      ) : (
        <motion.div
          className="bg-primary h-full w-full flex-1"
          initial={DETERMINATE_INITIAL}
          animate={{ x: `-${100 - (clampedValue / safeMax) * 100}%` }}
          transition={shouldReduceMotion ? STILL_TRANSITION : DETERMINATE_TRANSITION}
        />
      )}
    </div>
  );
}
Progress.displayName = 'Progress';

export { Progress };
