import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseHealth } from './common/health/database-health';
import { validateEnv } from './config/env';
import { ChatModule } from './modules/chat/chat.module';
import { RegistryModule } from './modules/registry/registry.module';
import { ThemesModule } from './modules/themes/themes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    // Generous global ceiling; the expensive LLM endpoint declares its own
    // stricter limit in ChatController.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    RegistryModule,
    ThemesModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseHealth, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
