export const CHAT_ERROR_CODES = [
  'aborted',
  'rate_limit',
  'auth',
  'timeout',
  'upstream',
  'unknown',
] as const;

export type ChatErrorCode = (typeof CHAT_ERROR_CODES)[number];

export function formatChatError(code: ChatErrorCode, message: string): string {
  return `[nachui:${code}] ${message}`;
}

const MESSAGES: Record<ChatErrorCode, string> = {
  aborted: 'The request was cancelled.',
  rate_limit: 'The assistant is over its request budget. Try again in a minute.',
  auth: 'The assistant is not configured correctly on the server.',
  timeout: 'The model took too long to answer. Try again.',
  upstream: 'The model provider is unreachable right now. Try again shortly.',
  unknown: 'Something went wrong generating the response. Try again.',
};

export function chatErrorMessage(code: ChatErrorCode): string {
  return MESSAGES[code];
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === 'string' ? value : '';
}

function readStatus(source: Record<string, unknown>): number {
  for (const key of ['statusCode', 'status']) {
    const value = source[key];
    if (typeof value === 'number') return value;
  }
  return 0;
}

export function isAbortError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  const source = error as Record<string, unknown>;
  const name = readString(source, 'name');
  if (name === 'AbortError' || name === 'TimeoutError') return name === 'AbortError';
  return /\baborted\b/i.test(readString(source, 'message'));
}

export function classifyChatError(error: unknown): ChatErrorCode {
  if (typeof error !== 'object' || error === null) return 'unknown';

  const source = error as Record<string, unknown>;
  const status = readStatus(source);
  const name = readString(source, 'name');
  const text = `${readString(source, 'message')} ${readString(source, 'code')}`;

  if (status === 429 || /rate.?limit|quota|resource_exhausted|too many requests/i.test(text)) {
    return 'rate_limit';
  }
  if (
    status === 401 ||
    status === 403 ||
    /api[_ ]?key|unauthenticated|permission denied/i.test(text)
  ) {
    return 'auth';
  }
  if (name === 'TimeoutError' || /timed? ?out|etimedout|deadline exceeded/i.test(text)) {
    return 'timeout';
  }
  if (status >= 500 || /fetch failed|econnrefused|enotfound|socket hang up|network/i.test(text)) {
    return 'upstream';
  }
  return 'unknown';
}
