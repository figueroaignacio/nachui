import { defineCollection, defineConfig } from '@content-collections/core';
import { compileMDX } from '@content-collections/mdx';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode, { type LineElement } from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
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

function rehypeExtractToc(options: { callback: (toc: TocEntry[]) => void }) {
  return (tree: HastNode) => {
    const headings: { depth: number; id: string; text: string }[] = [];

    visit(tree, 'element', (node: HastNode) => {
      if (node.tagName && ['h2', 'h3'].includes(node.tagName)) {
        const id = node.properties?.id as string | undefined;
        if (!id) return;

        let text = '';
        visit(node, 'text', (textNode: HastNode) => {
          text += textNode.value || '';
        });

        headings.push({
          depth: parseInt(node.tagName.charAt(1), 10),
          id,
          text: text.trim(),
        });
      }
    });

    const toc: TocEntry[] = [];
    let currentH2: TocEntry | null = null;

    for (const heading of headings) {
      const entry: TocEntry = {
        title: heading.text,
        url: `#${heading.id}`,
      };

      if (heading.depth === 2) {
        currentH2 = entry;
        toc.push(entry);
      } else if (heading.depth === 3 && currentH2) {
        if (!currentH2.items) currentH2.items = [];
        currentH2.items.push(entry);
      } else {
        toc.push(entry);
      }
    }

    options.callback(toc);
  };
}

function createRehypePlugins(tocCallback: (toc: TocEntry[]) => void) {
  return [
    rehypeSlug,
    rehypeKatex,
    [
      rehypePrettyCode,
      {
        theme: 'one-dark-pro',
        keepBackground: false,
        onVisitLine(node: LineElement) {
          if (node.children.length === 0) {
            node.children = [{ type: 'text', value: ' ' }];
          }
        },
        onVisitHighlightedLine(node: LineElement) {
          if (!node.properties.className) {
            node.properties.className = [];
          }
          node.properties.className.push('line--highlighted');
        },
        onVisitHighlightedWord(node: LineElement) {
          node.properties.className = ['word--highlighted'];
        },
      },
    ],
    () => (tree: HastNode) => {
      visit(tree, (node: HastNode) => {
        if (node?.type === 'element' && node?.tagName === 'div') {
          if (node.properties && 'data-rehype-pretty-code-title' in node.properties) {
            node.properties['data-rehype-pretty-code-title'] = 'Code';
          }

          if (!node.properties || !('data-rehype-pretty-code-fragment' in node.properties)) {
            return;
          }

          const preElement = node.children?.at(-1);
          if (!preElement || preElement.tagName !== 'pre' || !preElement.properties) {
            return;
          }

          preElement.properties['__withMeta__'] = node.children?.at(0)?.tagName === 'div';

          if (node.__rawString__) {
            preElement.properties['__rawString__'] = node.__rawString__;
          }
          if (node.__src__) {
            preElement.properties['__src__'] = node.__src__;
          }
          if (node.__event__) {
            preElement.properties['__event__'] = node.__event__;
          }
          if (node.__style__) {
            preElement.properties['__style__'] = node.__style__;
          }
        }
      });
    },
    [
      rehypeAutolinkHeadings,
      {
        properties: {
          className: ['subheading-anchor'],
          ariaLabel: 'Link to section',
        },
      },
    ],
    [rehypeExtractToc, { callback: tocCallback }],
  ] as PluggableList;
}

const remarkPlugins = [remarkMath, remarkGfm];

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
    let tocEntries: TocEntry[] = [];

    const body = await compileMDX(context, document, {
      remarkPlugins,
      rehypePlugins: createRehypePlugins((toc) => {
        tocEntries = toc;
      }),
    });

    const slugFields = computeSlugFields(document._meta, document.locale);

    return {
      ...document,
      ...slugFields,
      body,
      raw: document.content,
      toc: {
        content: tocEntries,
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
  transform: async (document, context) => {
    let tocEntries: TocEntry[] = [];

    const body = await compileMDX(context, document, {
      remarkPlugins,
      rehypePlugins: createRehypePlugins((toc) => {
        tocEntries = toc;
      }),
    });

    const slug = document._meta.path;

    return {
      ...document,
      slug,
      body,
      raw: document.content,
      toc: {
        content: tocEntries,
        visible: true,
      },
    };
  },
});

export default defineConfig({
  content: [docs, skills],
});
