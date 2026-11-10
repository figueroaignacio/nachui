export type ChatFailure = { kind: 'limit' | 'auth' | 'other'; message: string };

/** The transport puts the response body in the error message; read it back. */
export function readChatError(error: Error | undefined): ChatFailure | null {
  if (!error) return null;
  try {
    const data = JSON.parse(error.message) as {
      statusCode?: number;
      error?: string;
      message?: unknown;
    };
    const message = typeof data.message === 'string' ? data.message : 'Something went wrong.';
    if (data.statusCode === 429 && data.error === 'limit') {
      return { kind: 'limit', message: `${message} They reset at midnight UTC.` };
    }
    if (data.statusCode === 429)
      return { kind: 'other', message: 'Too many messages in a row. Wait a minute.' };
    if (data.statusCode === 401)
      return { kind: 'auth', message: 'Your session ended. Sign in again.' };
    return { kind: 'other', message };
  } catch {
    const tagged = /^\[nachui:[a-z_]+\]\s*(.*)$/s.exec(error.message);
    return { kind: 'other', message: tagged?.[1] ?? 'The Studio could not answer. Try again.' };
  }
}
