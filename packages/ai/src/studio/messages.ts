import { z } from 'zod';

export const STUDIO_MESSAGE_LIMITS = {
  maxChars: 8_000,
  maxParts: 4,
} as const;

const userMessageSchema = z.object({
  id: z.string().min(1).max(100),
  role: z.literal('user'),
  parts: z
    .array(
      z.object({
        type: z.literal('text'),
        text: z.string().trim().min(1).max(STUDIO_MESSAGE_LIMITS.maxChars),
      }),
    )
    .min(1)
    .max(STUDIO_MESSAGE_LIMITS.maxParts),
});

export type StudioUserMessage = z.infer<typeof userMessageSchema>;

export type StudioMessageResult =
  | { success: true; message: StudioUserMessage }
  | { success: false; error: string };

/**
 * The Studio keeps the thread in the database, so a client only ever sends the
 * new user message. Anything else in the payload is rejected.
 */
export function parseStudioUserMessage(input: unknown): StudioMessageResult {
  const result = userMessageSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: z.prettifyError(result.error) };
  }
  return { success: true, message: result.data };
}

/** First words of the first prompt, used to name a new project. */
export function projectNameFromPrompt(prompt: string): string {
  const words = prompt
    .replace(/\s+/g, ' ')
    .trim()
    .replace(
      /^(?:build|make|create|design|add|haceme|hacé|crea|creá|armá|arma)\s+(?:me\s+)?(?:(?:una|un|an|the|a)\s+)?/i,
      '',
    )
    .split(' ')
    .slice(0, 5)
    .join(' ')
    .replace(/[.,:;!?]+$/, '');
  if (!words) return 'Untitled';
  return words.charAt(0).toUpperCase() + words.slice(1);
}
