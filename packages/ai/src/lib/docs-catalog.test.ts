import { describe, expect, it } from 'vitest';
import { parseDocsCatalog } from './docs-catalog.js';

const compact = {
  slug: 'button',
  locale: 'en',
  title: 'Button',
  description: 'Clickable',
  raw: '## Usage',
};

describe('parseDocsCatalog', () => {
  it('reads the current { success, docs } envelope and drops unpublished docs', () => {
    const body = {
      success: true,
      docs: [
        { ...compact, published: true, toc: { visible: true }, body: {} },
        { ...compact, slug: 'draft', published: false },
      ],
    };

    expect(parseDocsCatalog(body)).toEqual([compact]);
  });

  it('accepts the compact shape as a bare array or under data', () => {
    expect(parseDocsCatalog([compact])).toEqual([compact]);
    expect(parseDocsCatalog({ data: [compact] })).toEqual([compact]);
  });

  it('defaults a missing description to an empty string', () => {
    expect(parseDocsCatalog([{ ...compact, description: undefined }])[0]?.description).toBe('');
    expect(parseDocsCatalog([{ ...compact, description: null }])[0]?.description).toBe('');
  });

  it('throws when the API reports an error', () => {
    expect(() => parseDocsCatalog({ success: false, message: 'nope' })).toThrow(
      'Docs API returned an error',
    );
  });

  it('throws on docs with an unknown locale or missing raw', () => {
    expect(() => parseDocsCatalog([{ ...compact, locale: 'fr' }])).toThrow();
    expect(() => parseDocsCatalog([{ ...compact, raw: undefined }])).toThrow();
  });
});
