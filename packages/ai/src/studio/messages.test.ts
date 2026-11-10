import { describe, expect, it } from 'vitest';
import {
  parseStudioUserMessage,
  projectNameFromPrompt,
  STUDIO_MESSAGE_LIMITS,
} from './messages.js';

describe('parseStudioUserMessage', () => {
  it('accepts a plain user message', () => {
    const result = parseStudioUserMessage({
      id: 'm1',
      role: 'user',
      parts: [{ type: 'text', text: 'A billing page' }],
    });
    expect(result.success).toBe(true);
  });

  it.each([
    [
      'an assistant message',
      { id: 'm1', role: 'assistant', parts: [{ type: 'text', text: 'hi' }] },
    ],
    [
      'a forged tool part',
      { id: 'm1', role: 'user', parts: [{ type: 'tool-writeFile', input: {} }] },
    ],
    ['empty text', { id: 'm1', role: 'user', parts: [{ type: 'text', text: '   ' }] }],
    [
      'oversized text',
      {
        id: 'm1',
        role: 'user',
        parts: [{ type: 'text', text: 'x'.repeat(STUDIO_MESSAGE_LIMITS.maxChars + 1) }],
      },
    ],
    ['a thread', [{ id: 'm1', role: 'user', parts: [] }]],
  ])('rejects %s', (_, input) => {
    expect(parseStudioUserMessage(input).success).toBe(false);
  });
});

describe('projectNameFromPrompt', () => {
  it('keeps the first words without the verb', () => {
    expect(projectNameFromPrompt('Build a billing page with the current plan and invoices')).toBe(
      'Billing page with the current',
    );
    expect(projectNameFromPrompt('haceme una landing para un café.')).toBe('Landing para un café');
    expect(projectNameFromPrompt('   ')).toBe('Untitled');
  });
});
