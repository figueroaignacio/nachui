import { defineCollection, defineConfig } from '@content-collections/core';
import GithubSlugger from 'github-slugger';
import { compileMDX } from '@content-collections/mdx';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { z } from 'zod';

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

type TocEntry = {
  title: string;
  url: string;
  items?: TocEntry[];
};

/** Strips the inline markdown that never survives into a heading's text. */
function cleanHeadingText(raw: string) {
  return raw
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * Builds the table of contents straight from the markdown source.
 *
 * It used to ride along with the MDX compilation as a rehype plugin, but
 * `compileMDX` is cached: on a cache hit the plugins never run, the callback
 * never fires, and every document ends up with an empty toc — which is why it
 * only ever appeared on a cold build.
 */
function extractToc(content: string) {
  const slugger = new GithubSlugger();
  const headings: { depth: number; id: string; text: string }[] = [];
  let inFence = false;

  for (const line of content.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = line.match(/^(#{2,3})\s+(.*\S)\s*$/);
    if (!match) continue;

    const text = cleanHeadingText(match[2] ?? '');
    if (!text) continue;

    // rehype-slug uses the same slugger, so these ids match the rendered ones.
    headings.push({ depth: match[1]?.length ?? 2, id: slugger.slug(text), text });
  }

  const toc: TocEntry[] = [];
  let currentH2: TocEntry | null = null;

  for (const heading of headings) {
    const entry: TocEntry = { title: heading.text, url: `#${heading.id}` };

    if (heading.depth === 2) {
      currentH2 = entry;
      toc.push(entry);
    } else if (heading.depth === 3 && currentH2) {
      currentH2.items ??= [];
      currentH2.items.push(entry);
    } else {
      toc.push(entry);
    }
  }

  return toc;
}

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

const localeSchema = z.enum(['en', 'es']).default('en');
const labelSchema = z.enum(['New', 'Updated']).optional();

function computeSlugFields(meta: { filePath: string; path: string }, locale: string) {
  const slugParts = meta.path.split('/');
  const cleanedSlug = slugParts.filter((part) => part !== 'en' && part !== 'es').join('/');

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
    date: z.coerce.date().default(new Date()),
    label: labelSchema,
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

    return {
      ...document,
      ...slugFields,
      body,
      raw: document.content,
      toc: {
        content: extractToc(document.content),
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
