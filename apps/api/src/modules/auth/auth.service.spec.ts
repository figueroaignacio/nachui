jest.mock('@repo/db', () => ({}), { virtual: true });

import type { StudioUser } from '@repo/db';
import type { StudioConfig } from '../../config/env';
import type { GithubClient } from '../github/github.client';
import type { AuthRepository } from './auth.repository';
import { AuthService, OAuthError } from './auth.service';
import { decrypt, hashToken } from './crypto';

const config: StudioConfig = {
  apiUrl: 'http://localhost:3001',
  studioUrl: 'http://localhost:3002',
  githubClientId: 'client-id',
  githubClientSecret: 'client-secret',
  secret: 's'.repeat(32),
  dailyLimit: 20,
};

const user = {
  id: 'u1',
  login: 'octo',
  name: null,
  avatarUrl: null,
  repoToken: null,
} as StudioUser;

function setup() {
  const repository = {
    upsertUser: jest.fn(() => Promise.resolve(user)),
    createSession: jest.fn(() => Promise.resolve(undefined)),
    findUserBySession: jest.fn(() => Promise.resolve(user)),
    deleteSession: jest.fn(() => Promise.resolve(undefined)),
    setRepoToken: jest.fn(() => Promise.resolve(undefined)),
    deleteUser: jest.fn(() => Promise.resolve(undefined)),
  };
  const github = {
    exchangeCode: jest.fn(() => Promise.resolve('gho_token')),
    getUser: jest.fn(() =>
      Promise.resolve({ id: 42, login: 'octo', name: 'Octo', avatar_url: 'https://a' }),
    ),
  };
  const service = new AuthService(config, repository, github as unknown as GithubClient);
  return { service, repository, github };
}

function stateFrom(url: string): string {
  return new URL(url).searchParams.get('state') as string;
}

describe('AuthService', () => {
  it('asks GitHub only for the profile on sign in, and for repos later', () => {
    const { service } = setup();
    const login = new URL(service.authorizeUrl('login', '/p/1').url);
    expect(login.origin).toBe('https://github.com');
    expect(login.searchParams.get('client_id')).toBe('client-id');
    expect(login.searchParams.get('scope')).toBe('read:user');
    expect(login.searchParams.get('redirect_uri')).toBe(
      'http://localhost:3001/api/v1/auth/github/callback',
    );
    expect(new URL(service.authorizeUrl('repo', '/').url).searchParams.get('scope')).toBe(
      'read:user repo',
    );
  });

  it('signs in: upserts the user and stores only the hash of the session', async () => {
    const { service, repository } = setup();
    const { url, nonce } = service.authorizeUrl('login', '/p/1');
    const result = await service.handleCallback({
      code: 'c',
      state: stateFrom(url),
      nonce,
      currentUser: null,
    });

    expect(result.kind).toBe('login');
    if (result.kind !== 'login') return;
    expect(result.redirect).toBe('http://localhost:3002/p/1');
    expect(repository.upsertUser).toHaveBeenCalledWith({
      githubId: '42',
      login: 'octo',
      name: 'Octo',
      avatarUrl: 'https://a',
    });
    expect(repository.createSession).toHaveBeenCalledWith(
      'u1',
      hashToken(result.sessionToken),
      expect.any(Date),
    );
  });

  it('rejects a callback from another browser or with a forged state', async () => {
    const { service } = setup();
    const { url } = service.authorizeUrl('login', '/');
    await expect(
      service.handleCallback({
        code: 'c',
        state: stateFrom(url),
        nonce: 'other',
        currentUser: null,
      }),
    ).rejects.toBeInstanceOf(OAuthError);
    await expect(
      service.handleCallback({ code: 'c', state: 'forged.state', nonce: 'n', currentUser: null }),
    ).rejects.toBeInstanceOf(OAuthError);
  });

  it('stores the repo token encrypted for the signed in user', async () => {
    const { service, repository } = setup();
    const { url, nonce } = service.authorizeUrl('repo', '/p/1');
    const result = await service.handleCallback({
      code: 'c',
      state: stateFrom(url),
      nonce,
      currentUser: user,
    });

    expect(result).toEqual({ kind: 'repo', redirect: 'http://localhost:3002/p/1' });
    const [, sealed] = repository.setRepoToken.mock.calls[0] as unknown as [string, string];
    expect(sealed).not.toContain('gho_token');
    expect(decrypt(sealed, config.secret)).toBe('gho_token');
  });

  it('needs a session to connect repos', async () => {
    const { service } = setup();
    const { url, nonce } = service.authorizeUrl('repo', '/');
    await expect(
      service.handleCallback({ code: 'c', state: stateFrom(url), nonce, currentUser: null }),
    ).rejects.toBeInstanceOf(OAuthError);
  });

  it('is off without config', async () => {
    const service = new AuthService(null, {} as AuthRepository, {} as GithubClient);
    expect(service.enabled).toBe(false);
    await expect(service.userFromSession('token')).resolves.toBeNull();
    expect(() => service.authorizeUrl('login', '/')).toThrow('not configured');
  });
});
