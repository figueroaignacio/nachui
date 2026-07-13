'use client';

import { motion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';

const INDETERMINATE_ANIMATE = { left: ['-33%', '100%'] };
const INDETERMINATE_TRANSITION = { repeat: Infinity, duration: 1.5, ease: 'easeInOut' } as const;
const DETERMINATE_INITIAL = { x: '-100%' } as const;
const DETERMINATE_TRANSITION = { type: 'spring', stiffness: 50, damping: 15 } as const;

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
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value ?? undefined}
      className={cn('bg-secondary relative h-1 w-full overflow-hidden rounded-none', className)}
      {...props}
    >
      {value === null || value === undefined ? (
        <motion.div
          className="bg-primary absolute inset-y-0 w-1/3 rounded-full"
          animate={INDETERMINATE_ANIMATE}
          transition={INDETERMINATE_TRANSITION}
        />
      ) : (
        <motion.div
          className="bg-primary h-full w-full flex-1"
          initial={DETERMINATE_INITIAL}
          animate={{ x: `-${100 - (value / max) * 100}%` }}
          transition={DETERMINATE_TRANSITION}
        />
      )}
    </div>
  );
}
Progress.displayName = 'Progress';

export { Progress };
