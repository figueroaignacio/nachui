'use client';

import { useEffect, type RefObject } from 'react';

const REACH = 340;
const AIM = 90;

function aim(distance: number): string {
  return Math.max(-1, Math.min(1, distance / AIM)).toFixed(2);
}

export function useGaze(ref: RefObject<SVGSVGElement | null>, enabled = true): void {
  useEffect(() => {
    const node = ref.current;
    if (!enabled || !node) return;
    if (!window.matchMedia('(hover: hover)').matches) return;

    let pointer: { x: number; y: number } | null = null;
    let frame = 0;

    const settle = () => {
      frame = 0;
      if (!pointer) return;

      const box = node.getBoundingClientRect();
      const dx = pointer.x - (box.left + box.width / 2);
      const dy = pointer.y - (box.top + box.height / 2);

      if (Math.hypot(dx, dy) > REACH) {
        delete node.dataset.gaze;
        return;
      }

      node.dataset.gaze = 'true';
      node.style.setProperty('--gaze-x', aim(dx));
      node.style.setProperty('--gaze-y', aim(dy));
      frame = requestAnimationFrame(settle);
    };

    const track = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(settle);
    };

    window.addEventListener('pointermove', track, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', track);
      delete node.dataset.gaze;
    };
  }, [enabled, ref]);
}
