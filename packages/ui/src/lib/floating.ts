import * as React from 'react';
import { createPortal } from 'react-dom';
import type { FloatingSide } from './motion';
import { useIsClient } from './overlay';

export type FloatingAlign = 'start' | 'center' | 'end';

export interface FloatingPoint {
  x: number;
  y: number;
}

interface UseFloatingOptions {
  open: boolean;
  anchorRef?: React.RefObject<HTMLElement | null>;
  floatingRef: React.RefObject<HTMLElement | null>;
  point?: FloatingPoint | null;
  side?: FloatingSide;
  align?: FloatingAlign;
  sideOffset?: number;
  alignOffset?: number;
  padding?: number;
}

interface FloatingPosition {
  top: number;
  left: number;
  side: FloatingSide;
  availableWidth: number;
  availableHeight: number;
}

const OPPOSITE: Record<FloatingSide, FloatingSide> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

function viewportSize() {
  const root = document.documentElement;
  return {
    width: root.clientWidth || window.innerWidth,
    height: root.clientHeight || window.innerHeight,
  };
}

export function computeFloatingPosition(
  anchor: Pick<DOMRect, 'top' | 'left' | 'right' | 'bottom' | 'width' | 'height'>,
  floating: { width: number; height: number },
  viewport: { width: number; height: number },
  {
    side = 'bottom',
    align = 'center',
    sideOffset = 8,
    alignOffset = 0,
    padding = 8,
  }: Pick<UseFloatingOptions, 'side' | 'align' | 'sideOffset' | 'alignOffset' | 'padding'> = {},
): FloatingPosition {
  const space: Record<FloatingSide, number> = {
    top: anchor.top - sideOffset - padding,
    bottom: viewport.height - anchor.bottom - sideOffset - padding,
    left: anchor.left - sideOffset - padding,
    right: viewport.width - anchor.right - sideOffset - padding,
  };
  const vertical = side === 'top' || side === 'bottom';
  const needed = vertical ? floating.height : floating.width;
  const opposite = OPPOSITE[side];
  const resolved = space[side] < needed && space[opposite] > space[side] ? opposite : side;

  let top = 0;
  let left = 0;

  if (resolved === 'top') top = anchor.top - sideOffset - floating.height;
  if (resolved === 'bottom') top = anchor.bottom + sideOffset;
  if (resolved === 'left') left = anchor.left - sideOffset - floating.width;
  if (resolved === 'right') left = anchor.right + sideOffset;

  if (vertical) {
    if (align === 'start') left = anchor.left + alignOffset;
    else if (align === 'end') left = anchor.right - floating.width - alignOffset;
    else left = anchor.left + anchor.width / 2 - floating.width / 2 + alignOffset;
    left = clamp(left, padding, viewport.width - floating.width - padding);
    top = clamp(top, padding, viewport.height - floating.height - padding);
  } else {
    if (align === 'start') top = anchor.top + alignOffset;
    else if (align === 'end') top = anchor.bottom - floating.height - alignOffset;
    else top = anchor.top + anchor.height / 2 - floating.height / 2 + alignOffset;
    top = clamp(top, padding, viewport.height - floating.height - padding);
    left = clamp(left, padding, viewport.width - floating.width - padding);
  }

  return {
    top: Math.round(top),
    left: Math.round(left),
    side: resolved,
    availableWidth: Math.max(
      0,
      Math.floor(vertical ? viewport.width - padding * 2 : space[resolved]),
    ),
    availableHeight: Math.max(
      0,
      Math.floor(vertical ? space[resolved] : viewport.height - padding * 2),
    ),
  };
}

export function useFloating({
  open,
  anchorRef,
  floatingRef,
  point,
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
  alignOffset = 0,
  padding = 8,
}: UseFloatingOptions) {
  const [position, setPosition] = React.useState<FloatingPosition | null>(null);
  const pointX = point?.x;
  const pointY = point?.y;

  React.useLayoutEffect(() => {
    if (!open) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const floating = floatingRef.current;
      if (!floating) return;
      const anchor =
        pointX !== undefined && pointY !== undefined
          ? { top: pointY, bottom: pointY, left: pointX, right: pointX, width: 0, height: 0 }
          : anchorRef?.current?.getBoundingClientRect();
      if (!anchor) return;
      const next = computeFloatingPosition(
        anchor,
        { width: floating.offsetWidth, height: floating.offsetHeight },
        viewportSize(),
        { side, align, sideOffset, alignOffset, padding },
      );
      setPosition((previous) =>
        previous &&
        previous.top === next.top &&
        previous.left === next.left &&
        previous.side === next.side &&
        previous.availableHeight === next.availableHeight &&
        previous.availableWidth === next.availableWidth
          ? previous
          : next,
      );
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();

    window.addEventListener('scroll', schedule, { capture: true, passive: true });
    window.addEventListener('resize', schedule);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    if (floatingRef.current) observer?.observe(floatingRef.current);
    if (anchorRef?.current) observer?.observe(anchorRef.current);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule, { capture: true });
      window.removeEventListener('resize', schedule);
      observer?.disconnect();
    };
  }, [open, anchorRef, floatingRef, pointX, pointY, side, align, sideOffset, alignOffset, padding]);

  const style = React.useMemo(
    () =>
      ({
        position: 'fixed',
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        visibility: position ? undefined : 'hidden',
        '--available-width': position ? `${position.availableWidth}px` : undefined,
        '--available-height': position ? `${position.availableHeight}px` : undefined,
      }) as React.CSSProperties,
    [position],
  );

  return { style, side: position?.side ?? side };
}

export function FloatingPortal({ children }: { children: React.ReactNode }) {
  const isClient = useIsClient();
  if (!isClient) return null;
  return createPortal(children, document.body);
}
