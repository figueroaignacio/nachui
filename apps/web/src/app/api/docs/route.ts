import { ContentRepository } from '@/lib/content-repository';

// The collection is fixed at build time, so the catalog is rendered once.
export const dynamic = 'force-static';

/**
 * Published docs as markdown, for the RAG ingest (`packages/ai` ingest
 * script) and anyone else who wants the whole catalog in one request.
 */
export function GET() {
  const docs = ContentRepository.getDocs()
    .filter((doc) => doc.published)
    .map(({ slug, locale, title, description, raw }) => ({
      slug,
      locale,
      title,
      description,
      raw,
    }));

  return Response.json({ success: true, docs });
}
