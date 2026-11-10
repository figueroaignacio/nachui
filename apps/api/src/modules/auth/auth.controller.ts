import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { StudioUser } from '@repo/db';
import type { Request, Response } from 'express';
import { GithubError } from '../github/github.client';
import {
  AuthService,
  OAuthError,
  SESSION_TTL_MS,
  STATE_TTL_MS,
  toPublicUser,
} from './auth.service';
import { OAUTH_COOKIE, parseCookies, serializeCookie, SESSION_COOKIE } from './cookies';
import { CurrentUser, SessionGuard } from './session.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  private setCookie(res: Response, name: string, value: string, maxAgeMs: number) {
    res.append(
      'Set-Cookie',
      serializeCookie(name, value, {
        maxAgeSeconds: maxAgeMs / 1000,
        secure: this.auth.secureCookies,
      }),
    );
  }

  @Get('github')
  signIn(@Query('next') next: unknown, @Res() res: Response) {
    const { url, nonce } = this.auth.authorizeUrl('login', next);
    this.setCookie(res, OAUTH_COOKIE, nonce, STATE_TTL_MS);
    res.redirect(url);
  }

  @Get('github/repo')
  @UseGuards(SessionGuard)
  connectRepos(@Query('next') next: unknown, @Res() res: Response) {
    const { url, nonce } = this.auth.authorizeUrl('repo', next);
    this.setCookie(res, OAUTH_COOKIE, nonce, STATE_TTL_MS);
    res.redirect(url);
  }

  @Get('github/callback')
  async callback(
    @Query('code') code: unknown,
    @Query('state') state: unknown,
    @Query('error') error: unknown,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const cookies = parseCookies(req.headers.cookie);
    this.setCookie(res, OAUTH_COOKIE, '', 0);

    if (typeof error === 'string') {
      res.redirect(this.auth.studioUrl(`/login?error=${encodeURIComponent('denied')}`));
      return;
    }

    try {
      const currentUser = await this.auth.userFromSession(cookies[SESSION_COOKIE]);
      const result = await this.auth.handleCallback({
        code,
        state,
        nonce: cookies[OAUTH_COOKIE],
        currentUser,
      });
      if (result.kind === 'login') {
        this.setCookie(res, SESSION_COOKIE, result.sessionToken, SESSION_TTL_MS);
      }
      res.redirect(result.redirect);
    } catch (err) {
      const reason =
        err instanceof OAuthError ? 'expired' : err instanceof GithubError ? 'github' : 'failed';
      res.redirect(this.auth.studioUrl(`/login?error=${reason}`));
    }
  }

  @Get('me')
  @UseGuards(SessionGuard)
  me(@CurrentUser() user: StudioUser) {
    return toPublicUser(user);
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.auth.signOut(parseCookies(req.headers.cookie)[SESSION_COOKIE]);
    if (this.auth.enabled) this.setCookie(res, SESSION_COOKIE, '', 0);
  }

  @Delete('github/repo')
  @HttpCode(204)
  @UseGuards(SessionGuard)
  async disconnectRepos(@CurrentUser() user: StudioUser) {
    await this.auth.disconnectRepos(user);
  }

  @Delete('account')
  @HttpCode(204)
  @UseGuards(SessionGuard)
  async deleteAccount(@CurrentUser() user: StudioUser, @Res({ passthrough: true }) res: Response) {
    await this.auth.deleteAccount(user);
    this.setCookie(res, SESSION_COOKIE, '', 0);
  }
}
