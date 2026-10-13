DELETE FROM "doc_chunks" AS "older" USING "doc_chunks" AS "newer" WHERE "older"."doc_slug" = "newer"."doc_slug" AND "older"."locale" = "newer"."locale" AND "older"."chunk_index" = "newer"."chunk_index" AND "older"."ctid" < "newer"."ctid";--> statement-breakpoint
CREATE UNIQUE INDEX "doc_chunks_doc_chunk_unique" ON "doc_chunks" USING btree ("doc_slug","locale","chunk_index");
