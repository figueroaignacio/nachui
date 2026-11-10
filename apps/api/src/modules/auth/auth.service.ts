import { Inject, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import type { StudioUser } from '@repo/db';
import { GithubClient } from '../github/github.client';
import { AuthRepository } from './auth.repository';
import { safeNextPath } from './cookies';
import { decrypt, encrypt, hashToken, randomToken, signState, verifyState } from './crypto';
import { STUDIO_CONFIG, type MaybeStudioConfig } from './studio-config';

export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const STATE_TTL_MS = 10 * 60 * 1000;

export type OAuthPurpose = 'login' | 'repo';

type OAuthState = { nonce: string; purpose: OAuthPurpose; next: string };

export type PublicUser = {
  id: string;
  login: string;
  name: string | null;
  avatarUrl: string | null;
  hasRepoAccess: boolean;
};

export function toPublicUser(user: StudioUser): PublicUser {
  return {
    id: user.id,
    login: user.login,
    name: user.name,
    avatarUrl: user.avatarUrl,
    hasRepoAccess: Boolean(user.repoToken),
  };
}

export type CallbackResult =
  | { kind: 'login'; sessionToken: string; redirect: string }
  | { kind: 'repo'; redirect: string };

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(STUDIO_CONFIG) private readonly config: MaybeStudioConfig,
    private readonly repository: AuthRepository,
    private readonly github: GithubClient,
  ) {}

  get enabled(): boolean {
    return this.config !== null;
  }

  private get settings() {
    if (!this.config) throw new ServiceUnavailableException('NachUI Studio is not configured.');
    return this.config;
  }

  get secureCookies(): boolean {
    return this.settings.studioUrl.startsWith('https://');
  }

  get callbackUrl(): string {
    return `${this.settings.apiUrl}/api/v1/auth/github/callback`;
  }

  studioUrl(path = '/'): string {
    return `${this.settings.studioUrl.replace(/\/$/, '')}${safeNextPath(path)}`;
  }

  /** Where to send the browser, and the nonce to keep in a short cookie. */
  authorizeUrl(purpose: OAuthPurpose, next: unknown): { url: string; nonce: string } {
    const { githubClientId, secret } = this.settings;
    const nonce = randomToken(16);
    const state = signState({ nonce, purpose, next: safeNextPath(next) }, secret, STATE_TTL_MS);
    const params = new URLSearchParams({
      client_id: githubClientId,
      redirect_uri: this.callbackUrl,
      scope: purpose === 'repo' ? 'read:user repo' : 'read:user',
      state,
      allow_signup: 'true',
    });
    return { url: `https://github.com/login/oauth/authorize?${params}`, nonce };
  }

  async handleCallback(input: {
    code: unknown;
    state: unknown;
    nonce: string | undefined;
    currentUser: StudioUser | null;
  }): Promise<CallbackResult> {
    const { secret, githubClientId, githubClientSecret } = this.settings;
    const state =
      typeof input.state === 'string' ? verifyState<OAuthState>(input.state, secret) : null;

    if (!state || !input.nonce || state.nonce !== input.nonce || typeof input.code !== 'string') {
      throw new OAuthError('The sign in link expired or was opened in another browser.');
    }

    const token = await this.github.exchangeCode({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
      code: input.code,
      redirectUri: this.callbackUrl,
    });

    if (state.purpose === 'repo') {
      if (!input.currentUser) throw new OAuthError('Sign in before connecting a repository.');
      await this.repository.setRepoToken(input.currentUser.id, encrypt(token, secret));
      return { kind: 'repo', redirect: this.studioUrl(state.next) };
    }

    const profile = await this.github.getUser(token);
    const user = await this.repository.upsertUser({
      githubId: String(profile.id),
      login: profile.login,
      name: profile.name,
      avatarUrl: profile.avatar_url,
    });
    const sessionToken = randomToken();
    await this.repository.createSession(
      user.id,
      hashToken(sessionToken),
      new Date(Date.now() + SESSION_TTL_MS),
    );
    this.logger.log(`Signed in ${user.login}`);
    return { kind: 'login', sessionToken, redirect: this.studioUrl(state.next) };
  }

  async userFromSession(token: string | undefined): Promise<StudioUser | null> {
    if (!token || !this.enabled) return null;
    return this.repository.findUserBySession(hashToken(token));
  }

  async signOut(token: string | undefined): Promise<void> {
    if (token) await this.repository.deleteSession(hashToken(token));
  }

  repoToken(user: StudioUser): string | null {
    return user.repoToken ? decrypt(user.repoToken, this.settings.secret) : null;
  }

  async disconnectRepos(user: StudioUser): Promise<void> {
    await this.repository.setRepoToken(user.id, null);
  }

  async deleteAccount(user: StudioUser): Promise<void> {
    await this.repository.deleteUser(user.id);
  }
}

export class OAuthError extends Error {}
