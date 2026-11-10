import './config/load-env';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import type { Env } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableShutdownHooks();

  const configService = app.get<ConfigService<Env, true>>(ConfigService);

  app.set('trust proxy', 'loopback');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  const frontendUrls = configService.get('FRONTEND_URLS', { infer: true });
  const portfolioUrl = configService.get('PORTFOLIO_URL', { infer: true });
  const studioUrl = configService.get('STUDIO_URL', { infer: true });

  app.enableCors({
    origin: [...frontendUrls, portfolioUrl, studioUrl, 'http://localhost:3000'].filter(
      (origin): origin is string => Boolean(origin),
    ),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  const port = configService.get('PORT', { infer: true });
  await app.listen(port);

  Logger.log(`Application is running on port ${port}`, 'Bootstrap');
}

bootstrap().catch((err) => {
  Logger.error('Failed to start application:', err, 'Bootstrap');
  process.exit(1);
});
