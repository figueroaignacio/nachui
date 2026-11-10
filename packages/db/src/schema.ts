import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  vector,
} from 'drizzle-orm/pg-core';

export type ComponentFamily = 'ui' | 'layout' | 'ai' | 'hybrids' | 'icons';

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
    uniqueIndex('doc_chunks_doc_chunk_unique').on(table.docSlug, table.locale, table.chunkIndex),
  ],
);

export type DocChunk = typeof docChunks.$inferSelect;
export type NewDocChunk = typeof docChunks.$inferInsert;

export const studioUsers = pgTable('studio_users', {
  id: uuid('id').defaultRandom().primaryKey(),
  githubId: text('github_id').unique().notNull(),
  login: text('login').notNull(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  repoToken: text('repo_token'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type StudioUser = typeof studioUsers.$inferSelect;

export const studioSessions = pgTable(
  'studio_sessions',
  {
    tokenHash: text('token_hash').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => studioUsers.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [index('studio_sessions_user_idx').on(table.userId)],
);

export type StudioSession = typeof studioSessions.$inferSelect;

export type StudioFiles = Record<string, string>;

export const studioProjects = pgTable(
  'studio_projects',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => studioUsers.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    currentVersion: integer('current_version').default(0).notNull(),
    lastError: text('last_error'),
    pullRequestUrl: text('pull_request_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [index('studio_projects_user_idx').on(table.userId, table.updatedAt)],
);

export type StudioProject = typeof studioProjects.$inferSelect;

export const studioVersions = pgTable(
  'studio_versions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => studioProjects.id, { onDelete: 'cascade' }),
    number: integer('number').notNull(),
    files: jsonb('files').$type<StudioFiles>().notNull(),
    summary: text('summary'),
    messageId: text('message_id'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [uniqueIndex('studio_versions_project_number').on(table.projectId, table.number)],
);

export type StudioVersion = typeof studioVersions.$inferSelect;

export const studioThreads = pgTable('studio_threads', {
  projectId: uuid('project_id')
    .primaryKey()
    .references(() => studioProjects.id, { onDelete: 'cascade' }),
  messages: jsonb('messages').$type<unknown[]>().default([]).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const studioUsage = pgTable(
  'studio_usage',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => studioUsers.id, { onDelete: 'cascade' }),
    day: text('day').notNull(),
    generations: integer('generations').default(0).notNull(),
    tokens: integer('tokens').default(0).notNull(),
  },
  (table) => [uniqueIndex('studio_usage_user_day').on(table.userId, table.day)],
);

export type StudioUsage = typeof studioUsage.$inferSelect;
