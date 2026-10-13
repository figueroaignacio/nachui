import { describe, expect, it } from 'vitest';
import { chunkDocument } from './chunker.js';

describe('chunkDocument', () => {
  it('returns no chunks for empty content', () => {
    expect(chunkDocument('')).toEqual([]);
    expect(chunkDocument('   \n\n  ')).toEqual([]);
  });

  it('splits on level 2 and 3 headings and keeps the section title', () => {
    const raw = [
      'Intro text.',
      '## Usage',
      'Use it.',
      '### Props',
      'A table.',
      '#### Deep',
      'x',
    ].join('\n');

    const chunks = chunkDocument(raw);

    expect(chunks.map((c) => c.section)).toEqual([undefined, 'Usage', 'Props']);
    expect(chunks[2]?.content).toContain('#### Deep');
  });

  it('numbers chunks sequentially from zero', () => {
    const raw = '## A\none\n\n## B\ntwo\n\n## C\nthree';
    expect(chunkDocument(raw).map((c) => c.index)).toEqual([0, 1, 2]);
  });

  it('splits long sections by paragraph without exceeding the limit', () => {
    const paragraph = 'word '.repeat(40).trim();
    const raw = `## Long\n\n${Array.from({ length: 10 }, () => paragraph).join('\n\n')}`;

    const chunks = chunkDocument(raw, 500);

    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.section).toBe('Long');
      expect(chunk.content.length).toBeLessThanOrEqual(500);
    }
    expect(chunks.map((c) => c.index)).toEqual(chunks.map((_, i) => i));
  });

  it('keeps a single oversized paragraph whole rather than cutting it', () => {
    const huge = 'x'.repeat(2000);
    const chunks = chunkDocument(`## Big\n\n${huge}`, 500);

    expect(chunks.some((c) => c.content.includes(huge))).toBe(true);
  });
});
