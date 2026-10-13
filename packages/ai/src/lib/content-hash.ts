import { createHash } from 'node:crypto';

export type HashableDoc = {
  title: string;
  description: string;
  raw: string;
};

/** Everything besides the text that changes the stored vectors. */
export type EmbeddingSettings = {
  chunkerVersion: number;
  maxChunkSize: number;
  embeddingModel: string;
  dimensions: number;
  taskType: string;
};

/**
 * Hash stored with every chunk of a doc. It covers the content and the
 * chunking and embedding settings, so changing any of them re-embeds the doc
 * on the next ingest instead of leaving stale vectors behind.
 */
export function hashDocContent(doc: HashableDoc, settings: EmbeddingSettings): string {
  const payload = JSON.stringify({
    title: doc.title,
    description: doc.description,
    raw: doc.raw,
    chunkerVersion: settings.chunkerVersion,
    maxChunkSize: settings.maxChunkSize,
    embeddingModel: settings.embeddingModel,
    dimensions: settings.dimensions,
    taskType: settings.taskType,
  });

  return createHash('sha256').update(payload).digest('hex').slice(0, 16);
}
