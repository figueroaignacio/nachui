export type ChatErrorCode =
  | 'aborted'
  | 'offline'
  | 'rate_limit'
  | 'auth'
  | 'timeout'
  | 'upstream'
  | 'unknown';

export const DISPLAYED_CHAT_ERROR_CODES = [
  'offline',
  'rate_limit',
  'auth',
  'timeout',
  'upstream',
  'unknown',
] as const;

const TOKEN = /\[nachui:([a-z_]+)\]/;

const KNOWN = new Set<string>([
  'aborted',
  'offline',
  'rate_limit',
  'auth',
  'timeout',
  'upstream',
  'unknown',
]);

export function classifyChatError(error: Error | undefined): ChatErrorCode | null {
  if (!error) return null;

  const message = error.message ?? '';

  const tagged = TOKEN.exec(message);
  if (tagged?.[1] && KNOWN.has(tagged[1])) {
    return tagged[1] as ChatErrorCode;
  }

  if (error.name === 'AbortError' || /\baborted\b/i.test(message)) return 'aborted';

  if (typeof navigator !== 'undefined' && navigator.onLine === false) return 'offline';

  if (/\b429\b|rate.?limit|too many requests/i.test(message)) return 'rate_limit';
  if (/\b401\b|\b403\b|unauthori[sz]ed|api[_ ]?key/i.test(message)) return 'auth';
  if (/timed? ?out|timeout/i.test(message)) return 'timeout';
  if (/\b5\d\d\b|failed to fetch|networkerror|load failed/i.test(message)) return 'upstream';

  return 'unknown';
}

export function isDisplayedChatError(code: ChatErrorCode | null): boolean {
  return code !== null && code !== 'aborted';
}
