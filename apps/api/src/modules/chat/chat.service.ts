import { Injectable, Logger } from '@nestjs/common';
import { nachUIAgent } from '@repo/ai';
import { pipeAgentUIStreamToResponse } from 'ai';
import type { Response } from 'express';
import { chatErrorMessage, classifyChatError, formatChatError, isAbortError } from './chat-error';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  async streamChat(messages: unknown[], res: Response, abortSignal?: AbortSignal): Promise<void> {
    await pipeAgentUIStreamToResponse({
      response: res,
      agent: nachUIAgent,
      uiMessages: messages,
      abortSignal,
      onStepFinish: ({ usage, toolCalls }) => {
        this.logger.log(
          `Step finished | Tokens: ${usage?.inputTokens ?? 0}in/${usage?.outputTokens ?? 0}out`,
        );
        if (toolCalls && toolCalls.length > 0) {
          for (const call of toolCalls) {
            this.logger.log(`Tool: ${call.toolName}`);
          }
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
