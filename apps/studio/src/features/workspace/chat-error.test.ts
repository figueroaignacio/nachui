import { describe, expect, it } from 'vitest';
import { readChatError } from './chat-error';

describe('readChatError', () => {
  it('reads the daily limit', () => {
    const error = new Error(
      JSON.stringify({
        statusCode: 429,
        error: 'limit',
        message: 'You used all 20 generations for today.',
      }),
    );
    expect(readChatError(error)).toEqual({
      kind: 'limit',
      message: 'You used all 20 generations for today. They reset at midnight UTC.',
    });
  });

  it('reads expired sessions, stream errors and anything else', () => {
    expect(readChatError(new Error(JSON.stringify({ statusCode: 401, message: 'x' })))?.kind).toBe(
      'auth',
    );
    expect(readChatError(new Error('[nachui:timeout] The model took too long to answer.'))).toEqual(
      {
        kind: 'other',
        message: 'The model took too long to answer.',
      },
    );
    expect(readChatError(new Error('boom'))?.kind).toBe('other');
    expect(readChatError(undefined)).toBeNull();
  });
});
