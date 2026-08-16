import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// gemini-2.5-* is closed to new API keys, so the chat runs on the current
// stable Flash. Verified against ListModels for this project's key.
export const GOOGLE_MODELS = {
  geminiFlash: 'gemini-3.7-flash',
  geminiPro: 'gemini-3.1-pro-preview',
  geminiEmbedding: 'gemini-embedding-001',
} as const;

export type GoogleModel = (typeof GOOGLE_MODELS)[keyof typeof GOOGLE_MODELS];
