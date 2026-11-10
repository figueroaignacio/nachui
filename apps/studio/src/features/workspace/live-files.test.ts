import type { UIMessage } from 'ai';
import { describe, expect, it } from 'vitest';
import { liveFiles } from './live-files';

const message = (parts: unknown[]): UIMessage =>
  ({ id: 'a1', role: 'assistant', parts }) as UIMessage;

describe('liveFiles', () => {
  it('lays finished writes over the saved files', () => {
    const files = liveFiles(
      { 'screens/a.tsx': 'old', 'screens/b.tsx': 'b' },
      message([
        {
          type: 'tool-writeFile',
          state: 'output-available',
          input: { path: 'screens/a.tsx', content: 'new' },
          output: { ok: true },
        },
        {
          type: 'tool-writeFile',
          state: 'input-streaming',
          input: { path: 'screens/c.tsx', content: 'half' },
        },
        {
          type: 'tool-writeFile',
          state: 'output-available',
          input: { path: 'lib/cn.ts', content: 'x' },
          output: { ok: false },
        },
        { type: 'tool-deleteFile', state: 'input-available', input: { path: 'screens/b.tsx' } },
      ]),
    );
    expect(files).toEqual({ 'screens/a.tsx': 'new' });
  });

  it('leaves the files alone for user messages', () => {
    const saved = { 'screens/a.tsx': 'a' };
    expect(liveFiles(saved, { id: 'u', role: 'user', parts: [] } as UIMessage)).toBe(saved);
    expect(liveFiles(saved, undefined)).toBe(saved);
  });
});
