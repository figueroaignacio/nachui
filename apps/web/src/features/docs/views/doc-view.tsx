import { MDXContent } from '@/components/mdx/mdx-content';
import { DocActions } from '@/features/docs/components/doc-actions';
import { DocsNavigationButtons } from '@/features/docs/components/docs-navigation-button';
import { DocsPagination } from '@/features/docs/components/docs-pagination';
import { IssueCta } from '@/features/docs/components/issue-cta';
import { MobileToc } from '@/features/docs/components/mobile-toc';
import { Toc } from '@/features/docs/components/toc';
import { GITHUB_REPO_URL, getAbsoluteUrl } from '@/lib/domains';
import { COMPONENT_REGISTRY } from '@repo/ui/registry';
import { Flex } from '@repo/ui/layout/flex';
import { Stack } from '@repo/ui/layout/stack';
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
      <Container size="md" className="px-0">
        <Stack as="article" className="w-full min-w-0">
          <div className="mt-8 mb-10 sm:mt-10 sm:mb-12">
            <MobileToc toc={tocContent} />
            <div>
              <p className="section-label mb-4">Documentation</p>
              <h1 className="font-heading text-foreground text-[2rem] leading-[1.05] font-semibold tracking-tight md:text-[2.5rem]">
                {doc.title}
              </h1>
              {doc.description && (
                <p className="text-muted-strong mt-4 text-[17px] leading-relaxed">
                  {doc.description}
                </p>
              )}
              <Flex
                wrap="wrap"
                align="center"
                justify="between"
                gap="3"
                className="border-border/40 mt-6 pt-5 pb-5"
              >
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
          <div className="min-w-0 flex-1">
            {doc.body ? <MDXContent code={doc.body} /> : <div>Error</div>}
          </div>
          <IssueCta pageTitle={doc.title} pageUrl={docUrl} />
          <DocsPagination currentPath={currentPath} />
        </Stack>
      </Container>
      <div className="hidden xl:block">
        <Toc toc={tocContent} />
      </div>
    </>
  );
}
