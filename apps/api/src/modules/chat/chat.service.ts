import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { createNachUIAgent, validateChatMessages } from '@repo/ai';
import type { NachUIAgent, NachUIAgentUIMessage } from '@repo/ai';
import { pipeAgentUIStreamToResponse } from 'ai';
import type { Response } from 'express';
import { RegistryRepository } from '../registry/registry.repository';
import { RagService } from '../rag/rag.service';
import { chatErrorMessage, classifyChatError, formatChatError, isAbortError } from './chat-error';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly agent: NachUIAgent;

  constructor(ragService: RagService, registryRepository: RegistryRepository) {
    this.agent = createNachUIAgent({
      searchKnowledgeBase: ({ query, locale, topK }) => ragService.search(query, locale, topK),
      getComponent: (name) => registryRepository.resolve(name),
    });
  }

  /** Rejects forged or oversized threads with a 400 before any model call. */
  async validateMessages(messages: unknown): Promise<NachUIAgentUIMessage[]> {
    const result = await validateChatMessages(messages, this.agent.tools);

    if (!result.success) {
      this.logger.warn(`Rejected chat payload: ${result.error}. ${result.detail ?? ''}`.trim());
      throw new BadRequestException(result.error);
    }

    return result.messages;
  }

  async streamChat(
    messages: NachUIAgentUIMessage[],
    res: Response,
    abortSignal?: AbortSignal,
  ): Promise<void> {
    await pipeAgentUIStreamToResponse({
      response: res,
      agent: this.agent,
      uiMessages: messages,
      abortSignal,
      onStepEnd: ({ usage, toolCalls }) => {
        this.logger.log(
          `Step finished | Tokens: ${usage?.inputTokens ?? 0}in/${usage?.outputTokens ?? 0}out`,
        );
        for (const call of toolCalls ?? []) {
          this.logger.log(`Tool: ${call.toolName}`);
        }
      },
      onError: (err: unknown) => {
        if (isAbortError(err)) {
          this.logger.log('Chat stream aborted by the client');
          return formatChatError('aborted', chatErrorMessage('aborted'));
        }

        const error = err instanceof Error ? err : new Error(String(err));
        const code = classifyChatError(err);

        this.logger.error(`Chat stream error [${code}]: ${error.message}`, error.stack);

        return formatChatError(code, chatErrorMessage(code));
      },
    });
  }
}
