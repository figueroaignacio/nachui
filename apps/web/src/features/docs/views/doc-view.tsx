import { MDXContent } from '@/components/mdx/mdx-content';
import { DocActions } from '@/features/docs/components/doc-actions';
import { DocsPagination } from '@/features/docs/components/docs-pagination';
import { IssueCta } from '@/features/docs/components/issue-cta';
import { Toc } from '@/features/docs/components/toc';
import { GITHUB_REPO_URL, getAbsoluteUrl } from '@/lib/domains';
import { Callout } from '@repo/ui/components/callout';
import { Stack } from '@repo/ui/layout/stack';
import { COMPONENT_REGISTRY } from '@repo/ui/registry';
import { Container } from '@repo/ui/src/layout/container';
import type { Doc } from 'content-collections';

type DocViewProps = {
  doc: Doc;
};

export function DocView({ doc }: DocViewProps) {
  const tocContent = Array.isArray(doc.toc?.content) ? doc.toc.content : [];
  const currentPath = `/docs${doc.slugAsParams ? `/${doc.slugAsParams}` : ''}`;
  const docUrl = getAbsoluteUrl(doc.locale || 'en', `/docs/${doc.slugAsParams}`);
  const crumbs = [
    'docs',
    ...doc.slugAsParams.split('/').filter((part) => part && part !== 'elements'),
  ];

  // Element pages are named after their registry entry, so the last slug
  // segment resolves to the component's source file. Other pages get nothing.
  const componentPath =
    COMPONENT_REGISTRY[doc.slugAsParams.split('/').at(-1) as keyof typeof COMPONENT_REGISTRY];
  const sourceUrl = componentPath ? `${GITHUB_REPO_URL}/blob/main/${componentPath}` : undefined;

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: doc.title,
    description: doc.description,
    inLanguage: doc.locale || 'en',
    publisher: {
      '@type': 'Organization',
      name: 'NachUI',
      url: 'https://nachui.tech',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': docUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }}
      />
      <Container size="md" className="px-0">
        <Stack as="article" className="w-full min-w-0">
          <div className="mt-4 mb-12">
            <div>
              <p className="text-muted-foreground flex flex-wrap items-center gap-2 font-mono text-xs">
                {crumbs.map((crumb, index) => (
                  <span key={`${crumb}-${index}`} className="flex items-center gap-2">
                    {index > 0 && <span aria-hidden="true">/</span>}
                    <span className={index === crumbs.length - 1 ? 'text-foreground' : undefined}>
                      {crumb}
                    </span>
                  </span>
                ))}
              </p>
              <h1 className="font-heading text-foreground mt-5 text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.85] font-black tracking-[-0.075em] break-words uppercase">
                {doc.title}
                <span
                  aria-hidden="true"
                  className="bg-brand ml-[0.05em] inline-block size-[0.16em]"
                />
              </h1>
              {doc.description && (
                <p className="text-foreground mt-6 max-w-[46ch] text-lg leading-snug font-semibold tracking-[-0.02em] text-pretty">
                  {doc.description}
                </p>
              )}
              {doc.label && (
                <span className="border-brand text-brand mt-5 inline-flex rounded-full border px-2.5 py-0.5 font-mono text-[11px]">
                  {doc.label}
                </span>
              )}
              <div className="mt-5 xl:hidden">
                <DocActions
                  page={doc.title}
                  url={docUrl}
                  filePath={doc.sourceFilePath}
                  rawContent={doc.raw}
                  rawPath={`/${doc.locale || 'en'}${currentPath}.md`}
                  sourceUrl={sourceUrl}
                />
              </div>
            </div>
          </div>
          <div data-doc-prose className="min-w-0 flex-1">
            {doc.body ? (
              <MDXContent code={doc.body} />
            ) : (
              <Callout variant="danger">
                <Callout.Title>Unable to render this page</Callout.Title>
              </Callout>
            )}
          </div>
          <IssueCta pageTitle={doc.title} pageUrl={docUrl} />
          <DocsPagination currentPath={currentPath} />
        </Stack>
      </Container>
      <div data-doc-toc className="hidden xl:block">
        <Toc
          toc={tocContent}
          footer={
            <DocActions
              layout="rail"
              page={doc.title}
              url={docUrl}
              filePath={doc.sourceFilePath}
              rawContent={doc.raw}
              rawPath={`/${doc.locale || 'en'}${currentPath}.md`}
              sourceUrl={sourceUrl}
            />
          }
        />
      </div>
    </>
  );
}
