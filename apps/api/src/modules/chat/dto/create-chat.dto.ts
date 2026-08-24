import { ArrayMaxSize, ArrayNotEmpty, IsArray } from 'class-validator';
import type { UIMessage } from 'ai';

/**
 * The client replays the whole thread on every turn, so the only bound worth
 * setting is an abuse ceiling: high enough that a real conversation never hits
 * it, low enough that nobody can hand the model an unbounded transcript.
 */
const MAX_MESSAGES = 200;

export class CreateChatDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(MAX_MESSAGES)
  messages!: UIMessage[];
}
