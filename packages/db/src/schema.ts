import { index, integer, jsonb, pgTable, text, timestamp, uuid, vector } from 'drizzle-orm/pg-core';

export type ComponentFamily = 'ui' | 'layout' | 'ai';

export const components = pgTable('components', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  code: text('code').notNull(),
  dependencies: jsonb('dependencies').$type<string[]>().default([]),
  registryDependencies: jsonb('registry_dependencies').$type<string[]>().default([]),
  type: text('type').$type<ComponentFamily>().default('ui'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Component = typeof components.$inferSelect;
export type NewComponent = typeof components.$inferInsert;

export const docChunks = pgTable(
  'doc_chunks',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    docSlug: text('doc_slug').notNull(),
    docTitle: text('doc_title').notNull(),
    locale: text('locale').$type<'en' | 'es'>().notNull(),
    chunkIndex: integer('chunk_index').notNull(),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 768 }).notNull(),
    contentHash: text('content_hash'),
    metadata: jsonb('metadata')
      .$type<{
        section?: string;
        description?: string;
      }>()
      .default({}),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('doc_chunks_embedding_idx').using('hnsw', table.embedding.op('vector_cosine_ops')),
    index('doc_chunks_locale_idx').on(table.locale),
    index('doc_chunks_slug_idx').on(table.docSlug),
  ],
);

export type DocChunk = typeof docChunks.$inferSelect;
export type NewDocChunk = typeof docChunks.$inferInsert;
