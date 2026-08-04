'use client';

import { CodeBlock } from '@/components/mdx/codeblock';
import { InlineCode } from '@/components/mdx/inline-code';
import { Table } from '@repo/ui/components/table';
import { Typography } from '@repo/ui/components/typography';
import { isValidElement } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  content: string;
}

export function ChatMarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="hide-scrollbar max-w-full overflow-x-hidden">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <Typography
              variant="h1"
              className="text-foreground wrap-break-words mt-8 mb-4 text-3xl font-bold tracking-tight first:mt-0"
            >
              {children}
            </Typography>
          ),
          h2: ({ children }) => (
            <Typography
              variant="h2"
              className="text-foreground wrap-break-words mt-8 mb-4 text-2xl font-semibold tracking-tight first:mt-0"
            >
              {children}
            </Typography>
          ),
          h3: ({ children }) => (
            <Typography
              variant="h3"
              className="text-foreground wrap-break-words mt-6 mb-3 text-xl font-semibold tracking-tight"
            >
              {children}
            </Typography>
          ),
          h4: ({ children }) => (
            <Typography
              variant="h4"
              className="text-foreground wrap-break-words mt-4 mb-2 text-lg font-semibold tracking-tight"
            >
              {children}
            </Typography>
          ),
          p: ({ children }) => (
            <Typography
              variant="p"
              className="text-foreground wrap-break-words mb-4 leading-7 not-first:mt-4"
            >
              {children}
            </Typography>
          ),
          ul: ({ children }) => (
            <ul className="text-foreground wrap-break-words my-6 ml-6 list-disc space-y-2 [&>li]:pl-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="text-foreground wrap-break-words my-6 ml-6 list-decimal space-y-2 [&>li]:pl-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-foreground wrap-break-words leading-7 [&>p]:my-1">{children}</li>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary wrap-break-words hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-primary/30 bg-muted/40 text-muted-foreground my-6 border-l-4 pl-6 italic [&>p]:my-1">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-border my-8" />,
          strong: ({ children }) => (
            <strong className="text-foreground wrap-break-words font-semibold">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="text-foreground/90 wrap-break-words italic">{children}</em>
          ),
          table: ({ children }) => (
            <div className="my-6 w-full overflow-y-auto rounded-md border shadow-sm">
              <Table>{children}</Table>
            </div>
          ),
          thead: ({ children }) => <Table.Header>{children}</Table.Header>,
          tbody: ({ children }) => <Table.Body>{children}</Table.Body>,
          tr: ({ children }) => <Table.Row className="hover:bg-muted/50">{children}</Table.Row>,
          th: ({ children }) => (
            <Table.Head className="text-foreground px-4 py-3 text-left font-bold">
              {children}
            </Table.Head>
          ),
          td: ({ children }) => (
            <Table.Cell className="px-4 py-3 align-top leading-6">{children}</Table.Cell>
          ),
          pre: ({ children }) => {
            const child = isValidElement(children)
              ? (children.props as { className?: string; children?: React.ReactNode })
              : null;
            if (!child) return <pre className="overflow-x-auto">{children}</pre>;
            const language = child.className?.replace('language-', '') || 'tsx';
            const extractCode = (node: unknown): string => {
              if (!node) return '';
              if (typeof node === 'string') return node;
              if (Array.isArray(node)) return node.map(extractCode).join('');
              return '';
            };
            const code = extractCode(child.children).trim();
            return (
              <div className="w-full overflow-x-auto">
                <CodeBlock code={code} language={language} className="min-w-0" />
              </div>
            );
          },
          code: ({ children }) => <InlineCode>{children}</InlineCode>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
