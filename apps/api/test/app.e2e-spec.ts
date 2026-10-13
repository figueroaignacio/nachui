import { ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { DatabaseHealth, type DatabaseStatus } from '../src/common/health/database-health';

jest.mock('@repo/db', () => ({ db: {}, sql: () => '' }));

/**
 * Boots the HTTP shell (prefix, pipes, filter, throttler) around the root
 * controller with the database stubbed, so it runs without Postgres or Gemini.
 * The chat module is left out because jest cannot load the ESM-only `ai`.
 */
describe('App (e2e)', () => {
  let app: INestApplication<App>;
  const check = jest.fn<Promise<DatabaseStatus>, []>();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }])],
      controllers: [AppController],
      providers: [
        AppService,
        { provide: DatabaseHealth, useValue: { check } },
        { provide: APP_GUARD, useClass: ThrottlerGuard },
      ],
    }).compile();

    app = moduleRef.createNestApplication({ logger: false });
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1 serves the welcome banner', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1').expect(200);
    expect(res.text).toContain('/api/v1/health');
  });

  it('GET /api/v1/health is 200 when the database answers', async () => {
    check.mockResolvedValueOnce({ status: 'up', latencyMs: 3 });

    const res = await request(app.getHttpServer()).get('/api/v1/health').expect(200);
    expect(res.body).toMatchObject({ status: 'ok', database: { status: 'up' } });
  });

  it('GET /api/v1/health is 503 when the database is down', async () => {
    check.mockResolvedValueOnce({ status: 'down', latencyMs: 2000, error: 'timed out' });

    const res = await request(app.getHttpServer()).get('/api/v1/health').expect(503);
    expect(res.body).toMatchObject({ status: 'degraded', database: { status: 'down' } });
    expect(JSON.stringify(res.body)).not.toContain('timed out');
  });

  it('unknown routes get the shared error shape', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/nope').expect(404);
    expect(res.body).toMatchObject({ statusCode: 404, code: 'bad_request' });
  });
});
