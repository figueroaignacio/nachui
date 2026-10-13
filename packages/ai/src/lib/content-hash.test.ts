import { describe, expect, it } from 'vitest';
import { hashDocContent, type EmbeddingSettings } from './content-hash.js';

const doc = { title: 'Button', description: 'Clickable', raw: '## Usage\nClick it.' };

const settings: EmbeddingSettings = {
  chunkerVersion: 1,
  maxChunkSize: 1500,
  embeddingModel: 'gemini-embedding-001',
  dimensions: 768,
  taskType: 'RETRIEVAL_DOCUMENT',
};

describe('hashDocContent', () => {
  it('is stable for the same input', () => {
    expect(hashDocContent(doc, settings)).toBe(hashDocContent({ ...doc }, { ...settings }));
    expect(hashDocContent(doc, settings)).toMatch(/^[0-9a-f]{16}$/);
  });

  it.each(['title', 'description', 'raw'] as const)('changes when the %s changes', (field) => {
    expect(hashDocContent({ ...doc, [field]: `${doc[field]}!` }, settings)).not.toBe(
      hashDocContent(doc, settings),
    );
  });

  it.each([
    ['chunkerVersion', 2],
    ['maxChunkSize', 1000],
    ['embeddingModel', 'text-embedding-005'],
    ['dimensions', 1536],
    ['taskType', 'SEMANTIC_SIMILARITY'],
  ] as const)('changes when %s changes', (key, value) => {
    expect(hashDocContent(doc, { ...settings, [key]: value })).not.toBe(
      hashDocContent(doc, settings),
    );
  });

  it('does not confuse content moved between fields', () => {
    const a = hashDocContent({ title: 'ab', description: 'c', raw: '' }, settings);
    const b = hashDocContent({ title: 'a', description: 'bc', raw: '' }, settings);
    expect(a).not.toBe(b);
  });
});
