import { and, client, count, db, docChunks, eq, gte, max, min, sql } from '@repo/db';
import { CHUNKER_VERSION, chunkDocument, DEFAULT_MAX_CHUNK_SIZE } from '../lib/chunker.js';
import { hashDocContent, type EmbeddingSettings } from '../lib/content-hash.js';
import { parseDocsCatalog, type CatalogDoc } from '../lib/docs-catalog.js';
import {
  DOCUMENT_TASK_TYPE,
  EMBEDDING_DIMENSIONS,
  EMBEDDING_MODEL_ID,
  embedDocuments,
} from '../lib/embeddings.js';
import { getIngestEnv } from '../lib/env.js';

const EMBED_BATCH_SIZE = 5;
const EMBED_BATCH_DELAY_MS = 2000;
const DOC_DELAY_MS = 1000;
const MAX_ATTEMPTS = 5;

const EMBEDDING_SETTINGS: EmbeddingSettings = {
  chunkerVersion: CHUNKER_VERSION,
  maxChunkSize: DEFAULT_MAX_CHUNK_SIZE,
  embeddingModel: EMBEDDING_MODEL_ID,
  dimensions: EMBEDDING_DIMENSIONS,
  taskType: DOCUMENT_TASK_TYPE,
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const docKey = (doc: { slug: string; locale: string }) => `${doc.locale}:${doc.slug}`;

async function fetchDocs(frontendUrl: string): Promise<CatalogDoc[]> {
  const res = await fetch(`${frontendUrl}/api/docs`);
  if (!res.ok) throw new Error(`Failed to fetch docs: ${res.status}`);
  return parseDocsCatalog(await res.json());
}

/** Embeds in small batches with a pause in between to stay under Gemini's rate limit. */
async function embedInBatches(texts: string[]): Promise<number[][]> {
  const results: number[][] = [];
  const totalBatches = Math.ceil(texts.length / EMBED_BATCH_SIZE);

  for (let i = 0; i < texts.length; i += EMBED_BATCH_SIZE) {
    const batch = texts.slice(i, i + EMBED_BATCH_SIZE);
    const batchNum = Math.floor(i / EMBED_BATCH_SIZE) + 1;

    console.log(`    Batch ${batchNum}/${totalBatches} (${batch.length} chunks)`);

    for (let attempt = 1; ; attempt++) {
      try {
        results.push(...(await embedDocuments(batch)));
        break;
      } catch (error) {
        if (attempt >= MAX_ATTEMPTS) throw error;
        const waitMs = 30_000 * 2 ** (attempt - 1);
        console.log(
          `    Batch ${batchNum} failed (attempt ${attempt}/${MAX_ATTEMPTS}), retrying in ${waitMs / 1000}s`,
        );
        await sleep(waitMs);
      }
    }

    if (i + EMBED_BATCH_SIZE < texts.length) {
      await sleep(EMBED_BATCH_DELAY_MS);
    }
  }

  return results;
}

async function readStoredState(doc: CatalogDoc) {
  const [stored] = await db
    .select({
      count: count(),
      minHash: min(docChunks.contentHash),
      maxHash: max(docChunks.contentHash),
    })
    .from(docChunks)
    .where(and(eq(docChunks.docSlug, doc.slug), eq(docChunks.locale, doc.locale)));

  return {
    count: stored?.count ?? 0,
    hash: stored?.minHash === stored?.maxHash ? (stored?.minHash ?? null) : null,
  };
}

/** Embeds first, then swaps the doc's chunks in one transaction. */
async function ingestDoc(doc: CatalogDoc): Promise<'skipped' | number> {
  const chunks = chunkDocument(doc.raw, EMBEDDING_SETTINGS.maxChunkSize);
  const contentHash = hashDocContent(doc, EMBEDDING_SETTINGS);
  const stored = await readStoredState(doc);

  const unchanged = stored.count === chunks.length && stored.hash === contentHash;
  if (unchanged || (chunks.length === 0 && stored.count === 0)) {
    return 'skipped';
  }

  const embeddings = chunks.length > 0 ? await embedInBatches(chunks.map((c) => c.content)) : [];
  if (embeddings.length !== chunks.length) {
    throw new Error(`Got ${embeddings.length} embeddings for ${chunks.length} chunks`);
  }

  const now = new Date();
  const rows = chunks.map((chunk, i) => ({
    docSlug: doc.slug,
    docTitle: doc.title,
    locale: doc.locale,
    chunkIndex: chunk.index,
    content: chunk.content,
    embedding: embeddings[i]!,
    contentHash,
    metadata: { section: chunk.section, description: doc.description },
    updatedAt: now,
  }));

  await db.transaction(async (tx) => {
    if (rows.length > 0) {
      await tx
        .insert(docChunks)
        .values(rows)
        .onConflictDoUpdate({
          target: [docChunks.docSlug, docChunks.locale, docChunks.chunkIndex],
          set: {
            docTitle: sql`excluded.doc_title`,
            content: sql`excluded.content`,
            embedding: sql`excluded.embedding`,
            contentHash: sql`excluded.content_hash`,
            metadata: sql`excluded.metadata`,
            updatedAt: sql`excluded.updated_at`,
          },
        });
    }

    await tx
      .delete(docChunks)
      .where(
        and(
          eq(docChunks.docSlug, doc.slug),
          eq(docChunks.locale, doc.locale),
          gte(docChunks.chunkIndex, rows.length),
        ),
      );
  });

  return rows.length;
}

/** Deletes chunks of docs that are no longer in the published catalog. */
async function purgeRemovedDocs(docs: CatalogDoc[]): Promise<number> {
  const live = new Set(docs.map(docKey));
  const stored = await db
    .selectDistinct({ slug: docChunks.docSlug, locale: docChunks.locale })
    .from(docChunks);

  const stale = stored.filter((doc) => !live.has(docKey(doc)));

  for (const doc of stale) {
    console.log(`  Removing chunks of ${docKey(doc)}`);
    await db
      .delete(docChunks)
      .where(and(eq(docChunks.docSlug, doc.slug), eq(docChunks.locale, doc.locale)));
  }

  return stale.length;
}

async function ingest() {
  const env = getIngestEnv();

  console.log(`Fetching docs from ${env.FRONTEND_URL}/api/docs`);
  const docs = await fetchDocs(env.FRONTEND_URL);
  console.log(`Found ${docs.length} published docs\n`);

  if (docs.length === 0) {
    throw new Error('The catalog is empty. Refusing to continue, it would purge every chunk.');
  }

  let embedded = 0;
  let skipped = 0;
  let totalChunks = 0;

  for (const [index, doc] of docs.entries()) {
    console.log(`[${index + 1}/${docs.length}] ${doc.title} (${doc.locale})`);

    const result = await ingestDoc(doc);

    if (result === 'skipped') {
      console.log('  Unchanged, skipping\n');
      skipped++;
      continue;
    }

    console.log(`  Stored ${result} chunks\n`);
    embedded++;
    totalChunks += result;

    if (index < docs.length - 1) {
      await sleep(DOC_DELAY_MS);
    }
  }

  const purged = await purgeRemovedDocs(docs);

  console.log(
    `Done. Embedded: ${embedded} | Unchanged: ${skipped} | Purged: ${purged} | New chunks: ${totalChunks}`,
  );
}

ingest()
  .catch((err: unknown) => {
    console.error('Ingest failed:', err);
    process.exitCode = 1;
  })
  .finally(() => client.end());
