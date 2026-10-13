import { tool, type Tool, type UIToolInvocation } from 'ai';
import { z } from 'zod';

export const DOC_LOCALES = ['en', 'es'] as const;
export type DocLocale = (typeof DOC_LOCALES)[number];

export const MAX_SEARCH_QUERY_LENGTH = 500;
export const MAX_SEARCH_TOP_K = 20;

export type KnowledgeBaseResult = {
  title: string;
  slug: string;
  content: string;
  section?: string | null;
  similarity: number;
};

export type KnowledgeBaseSearchParams = {
  query: string;
  locale: DocLocale;
  topK: number;
};

/** Data access the tool needs. The API wires it to its RAG service. */
export type SearchKnowledgeBase = (
  params: KnowledgeBaseSearchParams,
) => Promise<KnowledgeBaseResult[]>;

const inputSchema = z.object({
  query: z.string().min(1).max(MAX_SEARCH_QUERY_LENGTH).describe('The search query'),
  locale: z.enum(DOC_LOCALES).optional().default('en'),
  topK: z.number().int().min(1).max(MAX_SEARCH_TOP_K).optional().default(5),
});

const outputSchema = z.discriminatedUnion('found', [
  z.object({
    found: z.literal(true),
    results: z.array(
      z.object({
        title: z.string(),
        slug: z.string(),
        content: z.string(),
        section: z.string().nullish(),
        similarity: z.number(),
      }),
    ),
  }),
  z.object({ found: z.literal(false), message: z.string() }),
]);

export type SearchKnowledgeBaseInput = z.infer<typeof inputSchema>;
export type SearchKnowledgeBaseOutput = z.infer<typeof outputSchema>;
export type SearchKnowledgeBaseTool = Tool<SearchKnowledgeBaseInput, SearchKnowledgeBaseOutput>;

export function createSearchKnowledgeBaseTool(
  search: SearchKnowledgeBase,
): SearchKnowledgeBaseTool {
  return tool({
    description:
      'Search NachUI documentation using semantic search. Use for ANY question about components, props, usage, or concepts.',
    inputSchema,
    outputSchema,
    execute: async ({ query, locale, topK }): Promise<SearchKnowledgeBaseOutput> => {
      try {
        const results = await search({ query, locale, topK });

        if (results.length === 0) {
          return { found: false, message: `No relevant docs found for "${query}"` };
        }

        return { found: true, results };
      } catch (error) {
        console.error('[searchKnowledgeBase] error:', error);
        return { found: false, message: 'Search failed.' };
      }
    },
  });
}

export type SearchKnowledgeBaseToolInvocation = UIToolInvocation<SearchKnowledgeBaseTool>;
