import { describe, expect, it } from 'vitest';
import { computeFloatingPosition } from './floating';

const viewport = { width: 400, height: 800 };
const size = { width: 200, height: 100 };

function anchorAt(top: number, left: number, width = 80, height = 32) {
  return { top, left, width, height, right: left + width, bottom: top + height };
}

describe('computeFloatingPosition', () => {
  it('places the content on the requested side when it fits', () => {
    const position = computeFloatingPosition(anchorAt(100, 160), size, viewport, {
      side: 'bottom',
      sideOffset: 8,
    });

    expect(position.side).toBe('bottom');
    expect(position.top).toBe(140);
    expect(position.left).toBe(100);
  });

  it('flips to the opposite side when the requested one has no room', () => {
    const position = computeFloatingPosition(anchorAt(740, 160), size, viewport, {
      side: 'bottom',
    });

    expect(position.side).toBe('top');
    expect(position.top).toBe(740 - 8 - 100);
  });

  it('keeps the content inside the viewport padding on the cross axis', () => {
    const start = computeFloatingPosition(anchorAt(100, 0, 20), size, viewport, {
      side: 'bottom',
      padding: 8,
    });
    const end = computeFloatingPosition(anchorAt(100, 390, 10), size, viewport, {
      side: 'bottom',
      padding: 8,
    });

    expect(start.left).toBe(8);
    expect(end.left).toBe(400 - 200 - 8);
  });

  it('aligns to the start and end edges of the anchor', () => {
    const start = computeFloatingPosition(anchorAt(100, 120), size, viewport, { align: 'start' });
    const end = computeFloatingPosition(anchorAt(100, 220), size, viewport, { align: 'end' });

    expect(start.left).toBe(120);
    expect(end.left).toBe(300 - 200);
  });

  it('reports the room left on the resolved side', () => {
    const position = computeFloatingPosition(anchorAt(100, 160), size, viewport, {
      side: 'bottom',
      sideOffset: 8,
      padding: 8,
    });

    expect(position.availableHeight).toBe(800 - 132 - 8 - 8);
  });
});
