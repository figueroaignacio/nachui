import { Module } from '@nestjs/common';
import { RagModule } from '../rag/rag.module';
import { RegistryModule } from '../registry/registry.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [RagModule, RegistryModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
