import { describe, expect, it } from 'vitest';
import {
  backdrop,
  cascade,
  collapse,
  floatingOrigin,
  floatingVariants,
  reveal,
  slideVariants,
  springs,
  still,
  surface,
  type FloatingSide,
} from './motion';

const SIDES: FloatingSide[] = ['top', 'bottom', 'left', 'right'];

describe('motion presets', () => {
  it('drives state changes with springs, never durations', () => {
    for (const preset of Object.values(springs)) {
      expect(preset).toMatchObject({ type: 'spring' });
      expect(preset).not.toHaveProperty('duration');
    }
    expect(surface.visible).toMatchObject({ transition: { type: 'spring' } });
    expect(collapse.open).toMatchObject({ transition: { height: { type: 'spring' } } });
    expect(cascade.item.visible).toMatchObject({ transition: { type: 'spring' } });
  });

  it('keeps the reduced motion fallbacks to opacity only', () => {
    for (const state of Object.values(reveal)) {
      expect(Object.keys(state).filter((key) => key !== 'transition')).toEqual(['opacity']);
    }
    for (const state of Object.values(backdrop)) {
      expect(Object.keys(state).filter((key) => key !== 'transition')).toEqual(['opacity']);
    }
    expect(still).toEqual({ duration: 0 });
  });

  it('enters floating surfaces from the side of their trigger', () => {
    expect(floatingVariants.top.hidden).toMatchObject({ y: 10 });
    expect(floatingVariants.bottom.hidden).toMatchObject({ y: -10 });
    expect(floatingVariants.left.hidden).toMatchObject({ x: 10 });
    expect(floatingVariants.right.hidden).toMatchObject({ x: -10 });

    for (const side of SIDES) {
      expect(floatingVariants[side].visible).toMatchObject({ opacity: 1, scale: 1, x: 0, y: 0 });
    }
  });

  it('grows each floating surface out of the edge that faces its trigger', () => {
    expect(floatingOrigin).toEqual({
      top: 'origin-bottom',
      bottom: 'origin-top',
      left: 'origin-right',
      right: 'origin-left',
    });
  });

  it('slides panels in from their own edge and out past it', () => {
    expect(slideVariants.top.hidden).toEqual({ y: '-100%' });
    expect(slideVariants.bottom.hidden).toEqual({ y: '100%' });
    expect(slideVariants.left.hidden).toEqual({ x: '-100%' });
    expect(slideVariants.right.hidden).toEqual({ x: '100%' });

    for (const side of SIDES) {
      expect(slideVariants[side].visible).toMatchObject({ x: 0, y: 0 });
      expect(slideVariants[side].exit).toMatchObject(
        side === 'top' || side === 'bottom'
          ? { y: side === 'top' ? '-110%' : '110%' }
          : { x: side === 'left' ? '-110%' : '110%' },
      );
    }
  });

  it('animates only transform, opacity and filter, with height for collapsibles', () => {
    const allowed = new Set(['opacity', 'scale', 'x', 'y', 'filter', 'transition']);
    const presets = [
      reveal,
      backdrop,
      surface,
      ...Object.values(floatingVariants),
      ...Object.values(slideVariants),
      cascade.item,
    ];

    for (const preset of presets) {
      for (const state of Object.values(preset)) {
        for (const key of Object.keys(state)) expect(allowed).toContain(key);
      }
    }
    for (const state of Object.values(collapse)) {
      expect(Object.keys(state).sort()).toEqual(['height', 'opacity', 'transition']);
    }
  });
});
