import { ConfigService } from '@nestjs/config';
import { studioConfig, type Env, type StudioConfig } from '../../config/env';

export const STUDIO_CONFIG = Symbol('STUDIO_CONFIG');

export type MaybeStudioConfig = StudioConfig | null;

export const studioConfigProvider = {
  provide: STUDIO_CONFIG,
  inject: [ConfigService],
  useFactory: (config: ConfigService<Env, true>): MaybeStudioConfig =>
    studioConfig({
      PORT: config.get('PORT', { infer: true }),
      API_URL: config.get('API_URL', { infer: true }),
      STUDIO_URL: config.get('STUDIO_URL', { infer: true }),
      GITHUB_CLIENT_ID: config.get('GITHUB_CLIENT_ID', { infer: true }),
      GITHUB_CLIENT_SECRET: config.get('GITHUB_CLIENT_SECRET', { infer: true }),
      STUDIO_SECRET: config.get('STUDIO_SECRET', { infer: true }),
      STUDIO_DAILY_LIMIT: config.get('STUDIO_DAILY_LIMIT', { infer: true }),
    } as Env),
};
