'use client';

import { useReducedMotion } from 'motion/react';
import * as React from 'react';

const TYPE_MS = 42;
const DELETE_MS = 16;
const HOLD_MS = 1800;
const GAP_MS = 300;

/** Types each line out and deletes it again, to show what kind of prompt works. */
export function useTypedPlaceholder(lines: readonly string[], paused: boolean): string {
  const reduced = useReducedMotion();
  const [state, setState] = React.useState({ index: 0, length: 0, deleting: false });

  React.useEffect(() => {
    if (paused || reduced) return;
    const line = lines[state.index] ?? '';
    let delay = state.deleting ? DELETE_MS : TYPE_MS;
    let next = state;
    if (!state.deleting && state.length < line.length) {
      next = { ...state, length: state.length + 1 };
    } else if (!state.deleting) {
      next = { ...state, deleting: true };
      delay = HOLD_MS;
    } else if (state.length > 0) {
      next = { ...state, length: state.length - 1 };
    } else {
      next = { index: (state.index + 1) % lines.length, length: 0, deleting: false };
      delay = GAP_MS;
    }
    const timer = window.setTimeout(() => setState(next), delay);
    return () => window.clearTimeout(timer);
  }, [lines, paused, reduced, state]);

  if (reduced) return lines[0] ?? '';
  return (lines[state.index] ?? '').slice(0, state.length);
}
