import { MDXContent } from '@/components/mdx/mdx-content';
import { DocActions } from '@/features/docs/components/doc-actions';
import { DocsNavigationButtons } from '@/features/docs/components/docs-navigation-button';
import { DocsPagination } from '@/features/docs/components/docs-pagination';
import { IssueCta } from '@/features/docs/components/issue-cta';
import { MobileToc } from '@/features/docs/components/mobile-toc';
import { Toc } from '@/features/docs/components/toc';
import { GITHUB_REPO_URL, getAbsoluteUrl } from '@/lib/domains';
import { Flex } from '@repo/ui/layout/flex';
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
      <Container size="lg" className="px-0">
        <Stack as="article" className="w-full min-w-0">
          {/* Direct child of the article on purpose: a sticky element only
              travels inside its own parent's box. */}
          <MobileToc toc={tocContent} />
          <div className="mt-6 mb-8">
            <div>
              <h1 className="font-heading text-foreground text-[2.125rem] leading-tight font-semibold tracking-tight">
                {doc.title}
              </h1>
              {doc.description && (
                <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">
                  {doc.description}
                </p>
              )}
              <Flex wrap="wrap" align="center" justify="between" gap="3" className="mt-5">
                <DocActions
                  page={doc.title}
                  url={docUrl}
                  filePath={doc.sourceFilePath}
                  rawContent={doc.raw}
                  rawPath={`/${doc.locale || 'en'}${currentPath}.md`}
                  sourceUrl={sourceUrl}
                />
                <DocsNavigationButtons currentPath={currentPath} />
              </Flex>
            </div>
          </div>
          <div data-doc-prose className="min-w-0 flex-1">
            {doc.body ? <MDXContent code={doc.body} /> : <div>Error</div>}
          </div>
          <IssueCta pageTitle={doc.title} pageUrl={docUrl} />
          <DocsPagination currentPath={currentPath} />
        </Stack>
      </Container>
      <div data-doc-toc className="hidden xl:block">
        <Toc toc={tocContent} />
      </div>
    </>
  );
}
