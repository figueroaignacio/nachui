import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsObject } from 'class-validator';
import { CHAT_LIMITS } from '@repo/ai';

/**
 * First line of defense, before the body reaches the AI SDK. The thorough
 * checks (roles, part types, text size, tool schemas) run in
 * `ChatService.validateMessages`, which needs the agent's tools.
 */
export class CreateChatDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(CHAT_LIMITS.maxMessages)
  @IsObject({ each: true })
  messages!: unknown[];
}
