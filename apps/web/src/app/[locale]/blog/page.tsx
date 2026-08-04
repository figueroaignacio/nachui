import { BlogView } from '@/features/blog/views/blog-view';
import type { Locale } from '@/i18n/routing';
import { buildAlternates, getAbsoluteUrl } from '@/lib/domains';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <BlogView />;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sections.blog' });
  const canonicalUrl = getAbsoluteUrl(locale, '/blog');

  return {
    title: 'Blog',
    description: t('subtitle'),
    openGraph: {
      title: 'Blog | NachUI',
      description: t('subtitle'),
      type: 'website',
      locale,
      url: canonicalUrl,
      siteName: 'NachUI',
      images: [
        {
          url: getAbsoluteUrl(locale, '/images/og/og-home.png'),
          width: 1200,
          height: 630,
          alt: 'Blog | NachUI',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Blog | NachUI',
      description: t('subtitle'),
      images: [getAbsoluteUrl(locale, '/images/og/og-home.png')],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: buildAlternates('/blog'),
    },
  };
}
