import { decrypt, encrypt, hashToken, randomToken, signState, verifyState } from './crypto';

const SECRET = 's'.repeat(32);

describe('studio crypto', () => {
  it('makes unguessable tokens and stable hashes', () => {
    const token = randomToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(randomToken()).not.toBe(token);
    expect(hashToken(token)).toBe(hashToken(token));
    expect(hashToken(token)).not.toContain(token);
  });

  it('round trips encrypted text and rejects tampering or the wrong secret', () => {
    const sealed = encrypt('gho_token', SECRET);
    expect(sealed.startsWith('v1.')).toBe(true);
    expect(decrypt(sealed, SECRET)).toBe('gho_token');
    expect(decrypt(sealed, 'x'.repeat(32))).toBeNull();
    const parts = sealed.split('.');
    parts[3] = Buffer.from('other').toString('base64url');
    expect(decrypt(parts.join('.'), SECRET)).toBeNull();
    expect(decrypt('garbage', SECRET)).toBeNull();
  });

  it('verifies signed state and refuses edits and expired state', () => {
    const state = signState({ nonce: 'n', purpose: 'login', next: '/' }, SECRET, 60_000);
    expect(verifyState(state, SECRET)).toMatchObject({ nonce: 'n', purpose: 'login', next: '/' });

    const [body, signature] = state.split('.');
    const forged = Buffer.from(
      JSON.stringify({ nonce: 'n', purpose: 'repo', next: '/', exp: Date.now() + 1000 }),
    ).toString('base64url');
    expect(verifyState(`${forged}.${signature}`, SECRET)).toBeNull();
    expect(verifyState(`${body}.${signature}x`, SECRET)).toBeNull();
    expect(verifyState(state, 'x'.repeat(32))).toBeNull();
    expect(verifyState(signState({ nonce: 'n' }, SECRET, -1), SECRET)).toBeNull();
  });
});
