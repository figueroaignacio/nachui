import { safeValidateUIMessages } from 'ai';
import { z } from 'zod';
import type { NachUIAgentUIMessage, NachUITools } from '../agent.js';

/**
 * Abuse ceilings for a replayed chat thread. The client sends the whole thread
 * on every turn, so these are generous for a real conversation and only stop
 * clients that hand the model an unbounded or forged transcript.
 */
export const CHAT_LIMITS = {
  maxMessages: 200,
  maxPartsPerMessage: 100,
  maxUserTextChars: 16_000,
  maxAssistantTextChars: 64_000,
} as const;

const ALLOWED_ROLES = new Set(['user', 'assistant']);
const USER_PART_TYPES = new Set(['text']);
const ASSISTANT_PART_TYPES = new Set([
  'text',
  'reasoning',
  'step-start',
  'source-url',
  'source-document',
]);

const metadataSchema = z
  .object({
    quote: z.string().max(CHAT_LIMITS.maxUserTextChars).optional(),
    question: z.string().max(CHAT_LIMITS.maxUserTextChars).optional(),
  })
  .optional();

export type ChatValidationResult =
  | { success: true; messages: NachUIAgentUIMessage[] }
  | { success: false; error: string; detail?: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function textLength(part: Record<string, unknown>): number {
  const text = part.text;
  return typeof text === 'string' ? text.length : 0;
}

function checkShape(messages: unknown, toolNames: ReadonlySet<string>): string | null {
  if (!Array.isArray(messages) || messages.length === 0) {
    return 'messages must be a non-empty array';
  }
  if (messages.length > CHAT_LIMITS.maxMessages) {
    return `messages must contain at most ${CHAT_LIMITS.maxMessages} items`;
  }

  for (const [index, message] of messages.entries()) {
    if (!isRecord(message) || !Array.isArray(message.parts)) {
      return `messages[${index}] is not a UI message`;
    }

    const role = message.role;
    if (typeof role !== 'string' || !ALLOWED_ROLES.has(role)) {
      return `messages[${index}].role must be "user" or "assistant"`;
    }

    if (message.parts.length > CHAT_LIMITS.maxPartsPerMessage) {
      return `messages[${index}] has more than ${CHAT_LIMITS.maxPartsPerMessage} parts`;
    }

    const allowed = role === 'user' ? USER_PART_TYPES : ASSISTANT_PART_TYPES;
    let chars = 0;

    for (const part of message.parts) {
      if (!isRecord(part) || typeof part.type !== 'string') {
        return `messages[${index}] has an invalid part`;
      }

      const isKnownTool =
        role === 'assistant' && part.type.startsWith('tool-') && toolNames.has(part.type.slice(5));

      if (!allowed.has(part.type) && !isKnownTool) {
        return `messages[${index}] has an unsupported part type "${part.type}"`;
      }

      chars += textLength(part);
    }

    const limit =
      role === 'user' ? CHAT_LIMITS.maxUserTextChars : CHAT_LIMITS.maxAssistantTextChars;
    if (chars > limit) {
      return `messages[${index}] exceeds ${limit} characters of text`;
    }
  }

  return null;
}

/**
 * Validates a client supplied thread before it reaches the model: only user and
 * assistant roles, only part types this agent emits, bounded text, and tool
 * parts checked against the real tool input and output schemas.
 */
export async function validateChatMessages(
  messages: unknown,
  tools: NachUITools,
): Promise<ChatValidationResult> {
  const shapeError = checkShape(messages, new Set(Object.keys(tools)));
  if (shapeError) return { success: false, error: shapeError };

  const result = await safeValidateUIMessages<NachUIAgentUIMessage>({
    messages,
    metadataSchema,
    dataSchemas: {},
    tools,
  });

  if (!result.success) {
    return {
      success: false,
      error: 'messages do not match the chat message schema',
      detail: result.error.message.slice(0, 1_000),
    };
  }

  return { success: true, messages: result.data };
}
