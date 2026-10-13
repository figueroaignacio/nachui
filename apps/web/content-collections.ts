import { defineCollection, defineConfig } from '@content-collections/core';
import { compileMDX } from '@content-collections/mdx';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { z } from 'zod';

import { extractToc } from './src/features/docs/lib/extract-toc';
import { DEFAULT_LOCALE, LOCALES } from './src/shared/lib/constants';

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
  [key: string]: unknown;
};

type CompileMDXOptions = NonNullable<Parameters<typeof compileMDX>[2]>;
type PluggableList = NonNullable<CompileMDXOptions['rehypePlugins']>;

/**
 * Lifts a fence's `title="..."` meta onto its `<pre>` as `data-title`, the only
 * part of the meta the docs use. Highlighting happens when `Pre` renders, so
 * this is all the build has to do for code blocks.
 */
function rehypeCodeTitle() {
  return (tree: HastNode) => {
    visit(tree, (node: HastNode) => {
      if (node.type !== 'element' || node.tagName !== 'pre') return;

      const code = node.children?.[0];
      if (code?.tagName !== 'code') return;

      const meta = (code.data as { meta?: string } | undefined)?.meta;
      const title = meta?.match(/title="([^"]*)"/)?.[1];
      if (title) {
        node.properties ??= {};
        node.properties['dataTitle'] = title;
      }
    });
  };
}

function createRehypePlugins() {
  return [
    rehypeSlug,
    rehypeCodeTitle,
    [
      rehypeAutolinkHeadings,
      {
        properties: {
          className: ['subheading-anchor'],
          ariaLabel: 'Link to section',
        },
      },
    ],
  ] as PluggableList;
}

const remarkPlugins = [remarkGfm];

const localeSchema = z.enum(LOCALES).default(DEFAULT_LOCALE);

function computeSlugFields(meta: { filePath: string; path: string }, locale: string) {
  const slugParts = meta.path.split('/');
  const cleanedSlug = slugParts
    .filter((part) => !(LOCALES as readonly string[]).includes(part))
    .join('/');

  return {
    slug: cleanedSlug,
    slugAsParams: cleanedSlug,
    localeSlug: `${locale}/${cleanedSlug}`,
    sourceFilePath: meta.filePath,
  };
}

const docs = defineCollection({
  name: 'docs',
  directory: 'src/content/docs',
  include: '**/*.mdx',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.boolean().default(false),
    date: z.coerce.date().optional(),
    locale: localeSchema,
    content: z.string(),
    toc: z
      .object({
        visible: z.boolean().default(true),
      })
      .default({ visible: true }),
  }),
  transform: async (document, context) => {
    const body = await compileMDX(context, document, {
      remarkPlugins,
      rehypePlugins: createRehypePlugins(),
    });

    const slugFields = computeSlugFields(document._meta, document.locale);
    const { content, ...frontmatter } = document;

    return {
      ...frontmatter,
      ...slugFields,
      body,
      raw: content,
      toc: {
        content: extractToc(content),
        visible: document.toc?.visible ?? true,
      },
    };
  },
});

const skills = defineCollection({
  name: 'skills',
  directory: 'src/content/skills',
  include: 'nachui-*.md',
  schema: z.object({
    name: z.string(),
    description: z.string(),
  }),
  // Skills are documented as a list on /docs/concepts/skills, not as pages of
  // their own, so only the frontmatter is needed. The bodies live in
  // figueroaignacio/ui-skills and are never rendered here.
  transform: (document) => ({
    ...document,
    slug: document._meta.path,
  }),
});

export default defineConfig({
  content: [docs, skills],
});
