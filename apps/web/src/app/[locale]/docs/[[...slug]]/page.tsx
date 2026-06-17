import { MDXContent } from '@/components/mdx/mdx-content';
import { DocActions } from '@/features/docs/components/doc-actions';
import { DocsNavigationButtons } from '@/features/docs/components/docs-navigation-button';
import { DocsPagination } from '@/features/docs/components/docs-pagination';
import { IssueCta } from '@/features/docs/components/issue-cta';
import { MobileToc } from '@/features/docs/components/mobile-toc';
import { Toc } from '@/features/docs/components/toc';
import type { Locale } from '@/i18n/routing';
import { ContentRepository } from '@/lib/content-repository';
import { buildAlternates, getAbsoluteUrl } from '@/lib/domains';
import { Typography } from '@repo/ui/components/typography';
import { Flex } from '@repo/ui/layout/flex';
import { Stack } from '@repo/ui/layout/stack';
import { Container } from '@repo/ui/src/layout/container';
import { allDocs as docs } from 'content-collections';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type DocPageProps = {
  slug: string[];
  locale?: Locale;
};

async function getDocFromParams({ params }: { params: Promise<DocPageProps> }) {
  const parameters = await params;
  const slug = parameters.slug?.join('/') || '';
  const locale = parameters.locale || 'en';

  return ContentRepository.getDocBySlug(slug, locale);
}

export default async function DocPage({ params }: { params: Promise<DocPageProps> }) {
  const doc = await getDocFromParams({ params });

  if (!doc || !doc.published) {
    notFound();
  }

  const tocContent = Array.isArray(doc.toc?.content) ? doc.toc.content : [];
  const currentPath = `/docs${doc.slugAsParams ? `/${doc.slugAsParams}` : ''}`;

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
      '@id': getAbsoluteUrl(doc.locale || 'en', `/docs/${doc.slugAsParams}`),
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
          <Stack gap="1" className="mt-8 mb-10 sm:mt-10 sm:mb-12">
            <MobileToc toc={tocContent} />
            <Stack gap="3">
              <Typography
                variant="h1"
                className="font-heading text-foreground text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl"
              >
                {doc.title}
              </Typography>
              {doc.description && (
                <Typography
                  variant="p"
                  className="text-muted-foreground max-w-2xl text-base leading-relaxed sm:text-lg"
                >
                  {doc.description}
                </Typography>
              )}
            </Stack>
            <Flex wrap="wrap" align="center" justify="between" gap="3" className="mt-5 pb-5">
              <DocActions
                page={doc.title}
                url={getAbsoluteUrl(doc.locale || 'en', `/docs/${doc.slugAsParams}`)}
                filePath={doc.sourceFilePath}
                rawContent={doc.raw}
              />
              <DocsNavigationButtons currentPath={currentPath} />
            </Flex>
          </Stack>
          <div className="min-w-0 flex-1">
            {doc.body ? <MDXContent code={doc.body} /> : <div>Error</div>}
          </div>
          <IssueCta
            pageTitle={doc.title}
            pageUrl={getAbsoluteUrl(doc.locale || 'en', `/docs/${doc.slugAsParams}`)}
          />
          <DocsPagination currentPath={currentPath} />
        </Stack>
      </Container>
      <div className="hidden lg:block">
        <Toc toc={tocContent} />
      </div>
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<DocPageProps>;
}): Promise<Metadata> {
  const doc = await getDocFromParams({ params });
  const parameters = await params;
  const locale = parameters.locale || 'en';
  const slugPath = parameters.slug?.join('/') || '';

  if (!doc) {
    return { title: 'Documentation not found' };
  }

  const metaTitle = doc.title;
  const metaDescription = doc.description ?? '';
  const section = parameters.slug?.[0] ?? 'Docs';
  const canonicalUrl = getAbsoluteUrl(locale, `/docs/${slugPath}`);

  const ogUrl = new URL(getAbsoluteUrl(locale, '/api/og/docs'));
  ogUrl.searchParams.set('title', metaTitle);
  ogUrl.searchParams.set('description', metaDescription);
  ogUrl.searchParams.set('section', section);

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'article',
      locale,
      url: canonicalUrl,
      siteName: 'NachUI',
      images: [{ url: ogUrl.toString(), width: 1200, height: 630, alt: metaTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [ogUrl.toString()],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: buildAlternates(`/docs/${slugPath}`),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export async function generateStaticParams(): Promise<{ slug: string[]; locale: string }[]> {
  if (!Array.isArray(docs)) {
    console.error('docs is not an array!', typeof docs);
    return [];
  }

  return docs
    .filter((doc) => doc.slugAsParams && doc.published)
    .map((doc) => ({
      slug: doc.slugAsParams.split('/').filter(Boolean),
      locale: doc.locale || 'en',
    }));
}

export const revalidate = 3600;
