'use client';

import { motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';

const SHIMMER_ANIMATE = { backgroundPosition: ['200% center', '-200% center'] };
const SHIMMER_STYLE = {
  backgroundSize: '200% 100%',
  backgroundRepeat: 'no-repeat',
} as const;

type MotionSafeProps<T> = Omit<
  React.HTMLAttributes<T>,
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
>;

interface ShimmerProps extends MotionSafeProps<HTMLElement> {
  as?: React.ElementType;
  duration?: number;
  spread?: number;
}

const Shimmer = ({
  as = 'p',
  className,
  children,
  duration = 2,
  spread = 2,
  style,
  ref,
  ...props
}: ShimmerProps & { ref?: React.Ref<HTMLElement> }) => {
  const shouldReduceMotion = useReducedMotion();
  const MotionText = React.useMemo(() => motion.create(as as 'p'), [as]);

  const length = typeof children === 'string' ? children.length : 12;
  const highlight = Math.max(length * spread, 16);

  if (shouldReduceMotion) {
    const Static = as;
    return (
      <Static ref={ref} className={cn('text-muted-foreground', className)} style={style} {...props}>
        {children}
      </Static>
    );
  }

  return (
    <MotionText
      ref={ref as React.Ref<HTMLParagraphElement>}
      className={cn('bg-clip-text text-transparent', className)}
      style={{
        ...SHIMMER_STYLE,
        backgroundImage: `linear-gradient(90deg, var(--muted-foreground) calc(50% - ${highlight}px), var(--foreground), var(--muted-foreground) calc(50% + ${highlight}px))`,
        ...style,
      }}
      animate={SHIMMER_ANIMATE}
      transition={{ duration, ease: 'linear', repeat: Infinity }}
      {...props}
    >
      {children}
    </MotionText>
  );
};

Shimmer.displayName = 'Shimmer';

export { Shimmer };
export type { ShimmerProps };
