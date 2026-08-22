import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { partsFromSeed, Sprite } from './sprite';

const svgOf = (ui: React.ReactElement) => render(ui).container.innerHTML;

describe('partsFromSeed', () => {
  it('is deterministic', () => {
    expect(partsFromSeed('nacho')).toEqual(partsFromSeed('nacho'));
  });

  it('spreads different seeds across different parts', () => {
    const seeds = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const combos = new Set(seeds.map((s) => JSON.stringify(partsFromSeed(s))));
    expect(combos.size).toBeGreaterThan(1);
  });

  it('only ever picks parts that exist', () => {
    for (const seed of ['', 'x', 'a very long seed string', '123', 'ñ']) {
      const parts = partsFromSeed(seed);
      expect(Object.values(parts).every((v) => v !== undefined)).toBe(true);
    }
  });
});

describe('Sprite', () => {
  it('draws the same markup for the same seed', () => {
    expect(svgOf(<Sprite seed="nacho" />)).toBe(svgOf(<Sprite seed="nacho" />));
  });

  it('draws different markup for different seeds', () => {
    expect(svgOf(<Sprite seed="nacho" />)).not.toBe(svgOf(<Sprite seed="mate" />));
  });

  it('changes its grid with the state', () => {
    expect(svgOf(<Sprite seed="nacho" state="bust" />)).toContain('viewBox="0 0 24 24"');
    expect(svgOf(<Sprite seed="nacho" state="work" />)).toContain('viewBox="0 0 32 30"');
  });

  it('lets an explicit part beat the seed', () => {
    const forced = svgOf(<Sprite seed="nacho" parts={{ skin: 'umber' }} />);
    expect(forced).toContain('#8A5A3C');
  });

  it('only lights the screen in the working states', () => {
    expect(svgOf(<Sprite seed="nacho" state="idle" />)).not.toContain('sprite-glow');
    expect(svgOf(<Sprite seed="nacho" state="work" />)).toContain('sprite-glow');
  });

  it('carries its state on the class so the stylesheet can find it', () => {
    expect(svgOf(<Sprite seed="nacho" state="walk" />)).toContain('sprite-walk');
  });
});

describe('part combinations that would clash', () => {
  it('lights a visor instead of leaving it blindfold-dark', () => {
    expect(svgOf(<Sprite seed="x" parts={{ eyes: 'visor' }} />)).toContain('#A8E6D7');
  });

  it('never puts glasses on a visor', () => {
    const svg = svgOf(<Sprite seed="x" parts={{ eyes: 'visor', accessory: 'glasses' }} />);
    expect(svg).not.toContain('M11 9h2v1h-2Z');
  });
});
