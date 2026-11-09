import { describe, expect, it } from 'vitest';
import { getNavigationIndex } from './collection';

describe('getNavigationIndex', () => {
  it('moves down and up a vertical list and wraps', () => {
    expect(getNavigationIndex('ArrowDown', 0, 3)).toBe(1);
    expect(getNavigationIndex('ArrowDown', 2, 3)).toBe(0);
    expect(getNavigationIndex('ArrowUp', 0, 3)).toBe(2);
    expect(getNavigationIndex('ArrowRight', 0, 3)).toBeNull();
  });

  it('stops at the edges when loop is off', () => {
    expect(getNavigationIndex('ArrowDown', 2, 3, { loop: false })).toBe(2);
    expect(getNavigationIndex('ArrowUp', 0, 3, { loop: false })).toBe(0);
  });

  it('flips horizontal arrows in rtl', () => {
    const horizontal = { orientation: 'horizontal' as const };
    expect(getNavigationIndex('ArrowRight', 0, 3, horizontal)).toBe(1);
    expect(getNavigationIndex('ArrowRight', 0, 3, { ...horizontal, rtl: true })).toBe(2);
    expect(getNavigationIndex('ArrowLeft', 0, 3, { ...horizontal, rtl: true })).toBe(1);
    expect(getNavigationIndex('ArrowDown', 0, 3, horizontal)).toBeNull();
  });

  it('jumps to the ends and enters from nothing', () => {
    expect(getNavigationIndex('Home', 2, 5)).toBe(0);
    expect(getNavigationIndex('End', 0, 5)).toBe(4);
    expect(getNavigationIndex('ArrowDown', -1, 5)).toBe(0);
    expect(getNavigationIndex('ArrowUp', -1, 5)).toBe(4);
    expect(getNavigationIndex('ArrowDown', 0, 0)).toBeNull();
  });
});
