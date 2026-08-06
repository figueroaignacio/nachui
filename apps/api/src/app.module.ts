import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './modules/chat/chat.module';
import { DocsModule } from './modules/docs/docs.module';
import { RagModule } from './modules/rag/rag.module';
import { RegistryModule } from './modules/registry/registry.module';
import { ThemesModule } from './modules/themes/themes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Generous global ceiling; the expensive LLM endpoint declares its own
    // stricter limit in ChatController.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    RegistryModule,
    ThemesModule,
    ChatModule,
    DocsModule,
    RagModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
