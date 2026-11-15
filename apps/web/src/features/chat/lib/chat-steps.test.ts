import type { UIMessage } from 'ai';
import { describe, expect, it } from 'vitest';

import { collectSources, toChatSteps } from './chat-steps';

type Parts = UIMessage['parts'];

const search = (state: string, extra: Record<string, unknown> = {}) =>
  ({
    type: 'tool-searchKnowledgeBase',
    toolCallId: `search-${state}`,
    state,
    input: { query: 'primary button' },
    ...extra,
  }) as unknown as Parts[number];

describe('toChatSteps', () => {
  it('maps a running search to an active step with its query', () => {
    const steps = toChatSteps([search('input-available')]);

    expect(steps).toEqual([
      {
        id: 'search-input-available',
        tool: 'searchKnowledgeBase',
        status: 'active',
        detail: 'primary button',
        pages: undefined,
      },
    ]);
  });

  it('keeps the pages a finished search found, once each and at most three', () => {
    const results = ['a', 'a', 'b', 'c', 'd'].map((slug) => ({
      title: slug.toUpperCase(),
      slug: `elements/ui/${slug}`,
      content: '',
      similarity: 1,
    }));
    const [step] = toChatSteps([search('output-available', { output: { found: true, results } })]);

    expect(step?.status).toBe('complete');
    expect(step?.pages?.map((page) => page.slug)).toEqual([
      'elements/ui/a',
      'elements/ui/b',
      'elements/ui/c',
    ]);
  });

  it('marks a failed call and ignores text and unknown tools', () => {
    const steps = toChatSteps([
      { type: 'text', text: 'hi' } as Parts[number],
      {
        type: 'tool-getComponentCode',
        toolCallId: 'code',
        state: 'output-error',
        input: { componentName: 'button' },
        errorText: 'boom',
      } as unknown as Parts[number],
      {
        type: 'tool-somethingElse',
        toolCallId: 'x',
        state: 'input-available',
        input: {},
      } as unknown as Parts[number],
    ]);

    expect(steps).toEqual([
      { id: 'code', tool: 'getComponentCode', status: 'error', detail: 'button', pages: undefined },
    ]);
  });
});

describe('collectSources', () => {
  it('joins the pages of every step without repeats', () => {
    const sources = collectSources([
      {
        id: '1',
        tool: 'searchKnowledgeBase',
        status: 'complete',
        pages: [{ title: 'A', slug: 'a' }],
      },
      {
        id: '2',
        tool: 'searchKnowledgeBase',
        status: 'complete',
        pages: [
          { title: 'A', slug: 'a' },
          { title: 'B', slug: 'b' },
        ],
      },
    ]);

    expect(sources).toEqual([
      { title: 'A', slug: 'a' },
      { title: 'B', slug: 'b' },
    ]);
  });
});
