import type { Transition, Variants } from 'motion/react';

const spring = (stiffness: number, damping: number, mass: number): Transition => ({
  type: 'spring',
  stiffness,
  damping,
  mass,
});

export const springs = {
  snappy: spring(550, 22, 0.6),
  smooth: spring(380, 24, 0.8),
  gentle: spring(200, 20, 1),
};

export const still: Transition = { duration: 0 };

export const tap = { scale: 0.94 };

export const reveal: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.12 } },
  exit: { opacity: 0, transition: { duration: 0.08 } },
};

export type FloatingSide = 'top' | 'bottom' | 'left' | 'right';

const ENTER_OFFSET = 10;
const EXIT_OFFSET = 4;

const towards = (side: FloatingSide, distance: number) => {
  switch (side) {
    case 'top':
      return { y: distance };
    case 'bottom':
      return { y: -distance };
    case 'left':
      return { x: distance };
    case 'right':
      return { x: -distance };
  }
};

const floating = (side: FloatingSide): Variants => ({
  hidden: { opacity: 0, scale: 0.85, filter: 'blur(6px)', ...towards(side, ENTER_OFFSET) },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    x: 0,
    y: 0,
    transition: { ...springs.smooth, opacity: { duration: 0.16 }, filter: { duration: 0.2 } },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    filter: 'blur(4px)',
    ...towards(side, EXIT_OFFSET),
    transition: { duration: 0.12, ease: 'easeIn' },
  },
});

export const floatingVariants: Record<FloatingSide, Variants> = {
  top: floating('top'),
  bottom: floating('bottom'),
  left: floating('left'),
  right: floating('right'),
};

export const floatingOrigin: Record<FloatingSide, string> = {
  top: 'origin-bottom',
  bottom: 'origin-top',
  left: 'origin-right',
  right: 'origin-left',
};

export const backdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const surface: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 16, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { ...springs.gentle, opacity: { duration: 0.18 }, filter: { duration: 0.25 } },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 12,
    filter: 'blur(8px)',
    transition: { duration: 0.16, ease: 'easeIn' },
  },
};

const offscreen = (side: FloatingSide, amount: string) => {
  switch (side) {
    case 'top':
      return { y: `-${amount}` };
    case 'bottom':
      return { y: amount };
    case 'left':
      return { x: `-${amount}` };
    case 'right':
      return { x: amount };
  }
};

const slide = (side: FloatingSide): Variants => ({
  hidden: offscreen(side, '100%'),
  visible: { x: 0, y: 0, transition: springs.gentle },
  exit: { ...offscreen(side, '110%'), transition: { duration: 0.2, ease: 'easeIn' } },
});

export const slideVariants: Record<FloatingSide, Variants> = {
  top: slide('top'),
  bottom: slide('bottom'),
  left: slide('left'),
  right: slide('right'),
};

export const collapse: Variants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: { height: springs.snappy, opacity: { duration: 0.1 } },
  },
  open: {
    height: 'auto',
    opacity: 1,
    transition: { height: springs.smooth, opacity: { duration: 0.2, delay: 0.04 } },
  },
};

export const collapseInner: Variants = {
  closed: { y: -10, scale: 0.97, filter: 'blur(4px)', transition: { duration: 0.12 } },
  open: { y: 0, scale: 1, filter: 'blur(0px)', transition: springs.smooth },
};

export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { ...springs.snappy, opacity: { duration: 0.1 } } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.1, ease: 'easeIn' } },
};

export const cascade = {
  list: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.035, delayChildren: 0.02 } },
  },
  item: {
    hidden: { opacity: 0, y: 8, scale: 0.9, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: springs.snappy },
  },
} satisfies Record<string, Variants>;
