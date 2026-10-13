import { Module } from '@nestjs/common';
import { RagRepository } from './rag.repository';
import { RagService } from './rag.service';

/**
 * Semantic search over the ingested docs. It has no HTTP surface: the chat
 * agent calls `RagService` in process, so the per-call Gemini embedding cost
 * stays behind the chat endpoint's throttle.
 */
@Module({
  providers: [RagService, RagRepository],
  exports: [RagService],
})
export class RagModule {}
