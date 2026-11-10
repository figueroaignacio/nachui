'use client';

import { reveal, springs } from '@repo/ui/lib/motion';
import { useReducedMotion, type Variants } from 'motion/react';

const STAGGER = 0.035;
const STAGGER_CAP = 9;

/** Pops into focus: blur and a small scale on the way in, settling with the smooth spring. */
export const focusIn: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.97, filter: 'blur(6px)' },
  visible: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      ...springs.smooth,
      delay: Math.min(index, STAGGER_CAP) * STAGGER,
      opacity: { duration: 0.18, delay: Math.min(index, STAGGER_CAP) * STAGGER },
      filter: { duration: 0.22, delay: Math.min(index, STAGGER_CAP) * STAGGER },
    },
  }),
};

/** Larger surfaces, like the rendered preview, arrive on the gentle spring. */
export const landIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { ...springs.gentle, opacity: { duration: 0.2 }, filter: { duration: 0.25 } },
  },
};

export function useEntrance(variants: Variants = focusIn): Variants {
  return useReducedMotion() ? reveal : variants;
}
