import { chatErrorMessage, classifyChatError, formatChatError, isAbortError } from './chat-error';

describe('classifyChatError', () => {
  it.each([
    [{ statusCode: 429 }, 'rate_limit'],
    [{ message: 'RESOURCE_EXHAUSTED: quota exceeded' }, 'rate_limit'],
    [{ status: 401 }, 'auth'],
    [{ message: 'API key not valid' }, 'auth'],
    [{ name: 'TimeoutError', message: 'x' }, 'timeout'],
    [{ code: 'ETIMEDOUT' }, 'timeout'],
    [{ statusCode: 503 }, 'upstream'],
    [{ message: 'fetch failed' }, 'upstream'],
    [{ message: 'something odd' }, 'unknown'],
  ] as const)('maps %j to %s', (error, code) => {
    expect(classifyChatError(error)).toBe(code);
  });

  it('treats non-objects as unknown', () => {
    expect(classifyChatError('boom')).toBe('unknown');
    expect(classifyChatError(null)).toBe('unknown');
  });

  it('checks the status before the message', () => {
    expect(classifyChatError({ statusCode: 429, message: 'fetch failed' })).toBe('rate_limit');
  });
});

describe('isAbortError', () => {
  it('recognizes aborts but not timeouts', () => {
    expect(isAbortError({ name: 'AbortError' })).toBe(true);
    expect(isAbortError({ message: 'The operation was aborted' })).toBe(true);
    expect(isAbortError({ name: 'TimeoutError', message: 'aborted' })).toBe(false);
    expect(isAbortError(undefined)).toBe(false);
  });
});

describe('formatChatError', () => {
  it('prefixes the code so the web client can classify it', () => {
    expect(formatChatError('auth', chatErrorMessage('auth'))).toBe(
      '[nachui:auth] The assistant is not configured correctly on the server.',
    );
  });
});
