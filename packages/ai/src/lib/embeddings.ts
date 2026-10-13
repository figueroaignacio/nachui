import { embed, embedMany } from 'ai';
import { google, GOOGLE_MODELS } from '../providers.js';

export const EMBEDDING_MODEL_ID = GOOGLE_MODELS.geminiEmbedding;
export const EMBEDDING_DIMENSIONS = 768;
export const DOCUMENT_TASK_TYPE = 'RETRIEVAL_DOCUMENT';
export const QUERY_TASK_TYPE = 'RETRIEVAL_QUERY';

const embeddingModel = google.embeddingModel(EMBEDDING_MODEL_ID);

/** Embeds a search query. Gemini tunes the vector for the retrieval side. */
export async function embedQuery(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: embeddingModel,
    value: text,
    providerOptions: {
      google: { outputDimensionality: EMBEDDING_DIMENSIONS, taskType: QUERY_TASK_TYPE },
    },
  });
  return embedding;
}

/** Embeds documentation chunks for storage. Pairs with `embedQuery`. */
export async function embedDocuments(texts: string[]): Promise<number[][]> {
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: texts,
    providerOptions: {
      google: { outputDimensionality: EMBEDDING_DIMENSIONS, taskType: DOCUMENT_TASK_TYPE },
    },
  });
  return embeddings;
}
