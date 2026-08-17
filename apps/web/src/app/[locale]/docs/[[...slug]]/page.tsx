import { DocView } from '@/features/docs/views/doc-view';
import type { Locale } from '@/i18n/routing';
import { ContentRepository } from '@/lib/content-repository';
import { buildAlternates, getAbsoluteUrl, getAssetUrl } from '@/lib/domains';
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

  return <DocView doc={doc} />;
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

  const ogUrl = new URL(getAssetUrl('/api/og/docs'));
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
