import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import type { StudioUser } from '@repo/db';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { parseCookies, SESSION_COOKIE } from './cookies';

export type StudioRequest = Request & { studioUser?: StudioUser; sessionToken?: string };

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.auth.enabled) {
      throw new ServiceUnavailableException('NachUI Studio is not configured.');
    }
    const request = context.switchToHttp().getRequest<StudioRequest>();
    const token = parseCookies(request.headers.cookie)[SESSION_COOKIE];
    const user = await this.auth.userFromSession(token);
    if (!user) throw new UnauthorizedException('Sign in with GitHub to use the Studio.');
    request.studioUser = user;
    request.sessionToken = token;
    return true;
  }
}

export const CurrentUser = createParamDecorator((_: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<StudioRequest>();
  return request.studioUser as StudioUser;
});
