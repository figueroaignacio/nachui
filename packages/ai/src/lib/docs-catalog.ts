import { z } from 'zod';
import { DOC_LOCALES } from '../tools/search-knowledge-base-tool.js';

/**
 * The fields ingest needs from the web app's `GET /api/docs`. Extra fields are
 * ignored, so both the compact shape and the older full doc objects parse.
 */
const catalogDocSchema = z.object({
  slug: z.string().min(1),
  locale: z.enum(DOC_LOCALES),
  title: z.string(),
  description: z
    .string()
    .nullish()
    .transform((value) => value ?? ''),
  raw: z.string(),
  published: z.boolean().optional(),
});

const catalogSchema = z.union([
  z.array(catalogDocSchema),
  z.object({ docs: z.array(catalogDocSchema) }).transform((body) => body.docs),
  z.object({ data: z.array(catalogDocSchema) }).transform((body) => body.data),
]);

export type CatalogDoc = {
  slug: string;
  locale: (typeof DOC_LOCALES)[number];
  title: string;
  description: string;
  raw: string;
};

/** Parses the catalog body and drops docs explicitly marked unpublished. */
export function parseDocsCatalog(body: unknown): CatalogDoc[] {
  if (typeof body === 'object' && body !== null && 'success' in body && body.success === false) {
    throw new Error('Docs API returned an error');
  }

  const result = catalogSchema.safeParse(body);
  if (!result.success) {
    throw new Error(`Unexpected docs catalog shape:\n${z.prettifyError(result.error)}`);
  }

  return result.data
    .filter((doc) => doc.published !== false)
    .map(({ slug, locale, title, description, raw }) => ({
      slug,
      locale,
      title,
      description,
      raw,
    }));
}
