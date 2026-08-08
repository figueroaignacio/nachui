import { describe, expect, it } from 'vitest';
import { AA, contrast, measure, readTokens } from './contrast';

describe('token contrast', () => {
  it('reads the token layer, not the page-frame :root', () => {
    const light = readTokens(':root');
    expect(light.background).toBeDefined();
    expect(light.foreground).toBeDefined();
    expect(Object.keys(light).length).toBeGreaterThan(30);
  });

  it('measures a known pair correctly', () => {
    // Sanity check on the maths itself: black on white is 21:1.
    expect(contrast({ l: 1, c: 0, h: 0 }, { l: 0, c: 0, h: 0 })).toBeCloseTo(21, 0);
  });

  describe.each([':root', '.dark'] as const)('%s', (block) => {
    const results = measure(block);

    it('has pairs to check', () => {
      expect(results.length).toBeGreaterThan(20);
    });

    it('keeps every pair at or above its target', () => {
      const failures = results
        .filter((r) => r.ratio < r.min)
        .map((r) => `${r.name}: ${r.ratio.toFixed(2)} < ${r.min}`);
      expect(failures).toEqual([]);
    });

    it('never lets a feedback text token drop below AA on its own surface', () => {
      const onSurface = results.filter(
        (r) => r.name.includes('-text on') && r.name.includes('-surface'),
      );
      expect(onSurface.length).toBe(4);
      for (const r of onSurface) expect(r.ratio).toBeGreaterThanOrEqual(AA);
    });
  });
});
