'use client';

import { animate, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';

const SHIMMER_KEYFRAMES = { backgroundPosition: ['100% center', '0% center'] };
const SHIMMER_STYLE = {
  backgroundSize: '250% 100%',
  backgroundRepeat: 'no-repeat',
} as const;

interface ShimmerProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  duration?: number;
  spread?: number;
}

function assignRef<T>(ref: React.Ref<T> | undefined, node: T) {
  if (typeof ref === 'function') ref(node);
  else if (ref) ref.current = node;
}

const Shimmer = ({
  as: Tag = 'p',
  className,
  children,
  duration = 2,
  spread = 2,
  style,
  ref,
  ...props
}: ShimmerProps & { ref?: React.Ref<HTMLElement> }) => {
  const shouldReduceMotion = useReducedMotion();
  const nodeRef = React.useRef<HTMLElement | null>(null);

  const mergedRef = React.useCallback(
    (node: HTMLElement | null) => {
      nodeRef.current = node;
      assignRef(ref, node);
    },
    [ref],
  );

  React.useEffect(() => {
    const node = nodeRef.current;
    if (!node || shouldReduceMotion) return;
    const controls = animate(node, SHIMMER_KEYFRAMES, {
      duration,
      ease: 'linear',
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [duration, shouldReduceMotion]);

  const length = typeof children === 'string' ? children.length : 12;
  const highlight = Math.max(length * spread, 16);

  if (shouldReduceMotion) {
    return (
      <Tag
        ref={mergedRef}
        className={cn('text-muted-foreground', className)}
        style={style}
        {...props}
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      ref={mergedRef}
      className={cn('bg-clip-text text-transparent', className)}
      style={{
        ...SHIMMER_STYLE,
        backgroundImage: `linear-gradient(90deg, var(--muted-foreground) calc(50% - ${highlight}px), var(--foreground), var(--muted-foreground) calc(50% + ${highlight}px))`,
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
};

Shimmer.displayName = 'Shimmer';

export { Shimmer };
export type { ShimmerProps };
