import { DocsFaq } from '@/features/docs/components/docs-faq';
import { Alert02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Callout } from '@repo/ui/components/callout';
import { Steps } from '@repo/ui/components/steps';
import { cn } from '@repo/ui/lib/cn';
import { Command } from '@repo/ui/src/components/command';
import { isValidElement } from 'react';
import { CodeBlockWrapper } from './code-block-wrapper';
import { CodeBlock } from './codeblock';
import { ComponentInstallTabs } from './component-install-tabs';
import { ComponentPreview } from './component-preview';
import { ComponentSource } from './component-source';
import { ComponentsList } from './components-list';
import {
  MdxAccordion,
  MdxAccordionContent,
  MdxAccordionItem,
  MdxAccordionTrigger,
  MdxFile,
  MdxFiles,
  MdxFolder,
  MdxTable,
  MdxTableBody,
  MdxTableCell,
  MdxTableHead,
  MdxTableHeader,
  MdxTableRow,
  MdxTabs,
  MdxTabsContent,
  MdxTabsList,
  MdxTabsTrigger,
} from './compound-components';
import { InlineCode } from './inline-code';
import { PackageManagerTabs } from './package-manager-tabs';

const headingStyles = {
  h1: 'font-heading mt-2 scroll-m-20 text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-foreground',
  h2: 'font-heading mt-12 sm:mt-16 scroll-m-20 text-2xl sm:text-3xl font-semibold leading-snug tracking-tight first:mt-0 border-b border-border/40 pb-4 text-foreground/95',
  h3: 'font-heading mt-10 sm:mt-12 mb-4 scroll-m-20 text-xl sm:text-2xl font-semibold tracking-tight text-foreground/90',
  h4: 'font-heading mt-8 sm:mt-10 scroll-m-20 text-lg sm:text-xl font-semibold tracking-tight text-foreground/90',
  h5: 'font-heading mt-8 scroll-m-20 text-base sm:text-lg font-medium text-foreground/80',
  h6: 'font-heading mt-8 scroll-m-20 text-sm font-medium tracking-wide uppercase text-muted-foreground',
} as const;

function createHeading(Tag: keyof typeof headingStyles) {
  return ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Tag className={cn(headingStyles[Tag], className)} {...props} />
  );
}

const H1 = createHeading('h1');
const H2 = createHeading('h2');
const H3 = createHeading('h3');
const H4 = createHeading('h4');
const H5 = createHeading('h5');
const H6 = createHeading('h6');

function Paragraph({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'text-foreground/80 text-base leading-7 sm:text-[17px] sm:leading-8',
        'not-first:mt-6',
        className,
      )}
      {...props}
    />
  );
}

function Link({ className, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        'text-primary decoration-primary/30 font-medium underline underline-offset-[5px]',
        'hover:decoration-primary/80 transition-all duration-200',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

function UnorderedList({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn('marker:text-primary/60 my-6 ml-5 list-disc space-y-3', className)}
      {...props}
    />
  );
}

function OrderedList({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) {
  return (
    <ol
      className={cn(
        'marker:text-foreground/70 my-6 ml-5 list-decimal space-y-3 marker:font-medium',
        className,
      )}
      {...props}
    />
  );
}

function ListItem({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li
      className={cn(
        'text-foreground/80 pl-1 text-base leading-7 sm:text-[17px] sm:leading-8',
        '[&>ol]:my-3 [&>ul]:my-3',
        className,
      )}
      {...props}
    />
  );
}

function Strong({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <strong className={cn('text-foreground font-semibold', className)} {...props} />;
}

function HorizontalRule({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className={cn('border-border/50 my-10 md:my-14', className)} {...props} />;
}

const PLAIN_TEXT_FENCES = new Set(['tree', 'txt', 'text', 'plaintext']);

export function Pre({ children }: { children: React.ReactNode }) {
  if (!isValidElement(children)) {
    return <pre className="overflow-x-auto">{children}</pre>;
  }

  // rehype-pretty-code replaces `class="language-x"` with `data-language`, so
  // read both: raw MDX gives the class, the processed tree gives the attribute.
  const childProps = children.props as {
    className?: string;
    'data-language'?: string;
    children?: React.ReactNode;
  };
  const language =
    childProps['data-language'] || childProps.className?.replace('language-', '') || 'tsx';

  const extractCode = (node: unknown): string => {
    if (!node) return '';
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(extractCode).join('');
    if (isValidElement(node)) {
      return extractCode((node.props as { children?: React.ReactNode }).children);
    }
    if (typeof node === 'object' && node !== null && 'value' in node) {
      return String((node as Record<string, unknown>).value);
    }
    return '';
  };
  const code = extractCode(childProps.children).trim();

  // Plain-text fences (composition trees, terminal output) are read as a shape,
  // not stepped through line by line — numbering them just adds noise.
  const isPlainText = PLAIN_TEXT_FENCES.has(language);

  return (
    <div className="my-6 w-full overflow-x-auto">
      <CodeBlock
        code={code}
        language={language}
        showLineNumbers={!isPlainText}
        className="min-w-0 shadow-sm"
      />
    </div>
  );
}

function Blockquote({ className, children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={cn(
        'border-primary/10 bg-primary/5 relative my-8 flex items-start gap-4 rounded-xl border p-5 sm:p-6',
        'text-foreground/90 hover:border-primary/20 hover:bg-primary/10 transition-colors',
        className,
      )}
      {...props}
    >
      <div className="bg-background mt-0.5 shrink-0 rounded-lg p-2 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
        <HugeiconsIcon icon={Alert02Icon} className="stroke-primary size-5" />
      </div>
      <div className="text-base leading-relaxed sm:text-[17px] [&>div]:mt-0 [&>p]:mt-0">
        {children}
      </div>
    </blockquote>
  );
}

function Image({ className, alt, src, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  if (!src) return null;
  return (
    <img
      src={src}
      className={cn('border-border/50 my-8 rounded-2xl border shadow-sm', className)}
      alt={alt || ''}
      sizes="100vw"
      style={{ width: '100%', height: 'auto' }}
      {...props}
    />
  );
}

export const mdxComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  a: Link,
  p: Paragraph,
  strong: Strong,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  code: InlineCode,
  pre: Pre,
  hr: HorizontalRule,
  blockquote: Blockquote,
  img: Image,
  table: MdxTable,
  thead: MdxTableHeader,
  tbody: MdxTableBody,
  tr: MdxTableRow,
  th: MdxTableHead,
  td: MdxTableCell,
  CodeBlockWrapper,
  Tabs: MdxTabs,
  TabsContent: MdxTabsContent,
  TabsTrigger: MdxTabsTrigger,
  TabsList: MdxTabsList,
  ComponentInstallTabs,
  ComponentPreview,
  ComponentsList,
  ComponentSource,
  PackageManagerTabs,
  Accordion: MdxAccordion,
  AccordionContent: MdxAccordionContent,
  AccordionItem: MdxAccordionItem,
  AccordionTrigger: MdxAccordionTrigger,
  Callout,
  Files: MdxFiles,
  Folder: MdxFolder,
  File: MdxFile,
  Steps,
  DocsFaq,
  Command,
};
