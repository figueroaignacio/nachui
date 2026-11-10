import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { StudioUser } from '@repo/db';
import type { Request, Response } from 'express';
import { CurrentUser, SessionGuard } from '../auth/session.guard';
import { StudioService } from './studio.service';

@Controller('studio')
@UseGuards(SessionGuard)
export class StudioController {
  constructor(private readonly studio: StudioService) {}

  @Get('usage')
  usage(@CurrentUser() user: StudioUser) {
    return this.studio.usage(user);
  }

  @Get('projects')
  list(@CurrentUser() user: StudioUser) {
    return this.studio.listProjects(user);
  }

  @Post('projects')
  create(@CurrentUser() user: StudioUser, @Body() body: unknown) {
    const prompt =
      typeof body === 'object' && body !== null ? (body as { prompt?: unknown }).prompt : undefined;
    return this.studio.createProject(user, prompt);
  }

  @Get('projects/:id')
  project(@CurrentUser() user: StudioUser, @Param('id') id: string) {
    return this.studio.project(user, id);
  }

  @Patch('projects/:id')
  rename(@CurrentUser() user: StudioUser, @Param('id') id: string, @Body() body: unknown) {
    const name =
      typeof body === 'object' && body !== null ? (body as { name?: unknown }).name : undefined;
    return this.studio.rename(user, id, name);
  }

  @Delete('projects/:id')
  @HttpCode(204)
  async remove(@CurrentUser() user: StudioUser, @Param('id') id: string) {
    await this.studio.remove(user, id);
  }

  @Post('projects/:id/restore')
  restore(@CurrentUser() user: StudioUser, @Param('id') id: string, @Body() body: unknown) {
    const version =
      typeof body === 'object' && body !== null
        ? (body as { version?: unknown }).version
        : undefined;
    return this.studio.restore(user, id, version);
  }

  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @Post('projects/:id/chat')
  async chat(
    @CurrentUser() user: StudioUser,
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const abortController = new AbortController();
    req.on('close', () => abortController.abort());
    await this.studio.streamChat(user, id, body, res, abortController.signal);
  }

  @Get('projects/:id/export')
  exportPlan(
    @CurrentUser() user: StudioUser,
    @Param('id') id: string,
    @Query('baseDir') baseDir: unknown,
  ) {
    return this.studio.exportPlan(user, id, baseDir);
  }

  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post('projects/:id/pull-request')
  pullRequest(@CurrentUser() user: StudioUser, @Param('id') id: string, @Body() body: unknown) {
    return this.studio.openPullRequest(user, id, body);
  }

  @Get('github/repos')
  repos(@CurrentUser() user: StudioUser) {
    return this.studio.repos(user);
  }
}
