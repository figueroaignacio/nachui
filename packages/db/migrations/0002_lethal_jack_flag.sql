CREATE EXTENSION IF NOT EXISTS vector;--> statement-breakpoint
CREATE TABLE "doc_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doc_slug" text NOT NULL,
	"doc_title" text NOT NULL,
	"locale" text NOT NULL,
	"chunk_index" integer NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(768) NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "doc_chunks_embedding_idx" ON "doc_chunks" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "doc_chunks_locale_idx" ON "doc_chunks" USING btree ("locale");--> statement-breakpoint
CREATE INDEX "doc_chunks_slug_idx" ON "doc_chunks" USING btree ("doc_slug");