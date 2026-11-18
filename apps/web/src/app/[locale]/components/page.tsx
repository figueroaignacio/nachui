import { CatalogView } from '@/features/catalog/views/catalog-view';
import { buildAlternates, getAbsoluteUrl, getAssetUrl } from '@/lib/domains';
import type { Locale } from '@/lib/constants';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function ComponentsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CatalogView />;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sections.catalog' });
  const canonicalUrl = getAbsoluteUrl(locale, '/components');

  return {
    title: t('title'),
    description: t('metaDescription'),
    openGraph: {
      title: `${t('title')} · NachUI`,
      description: t('metaDescription'),
      type: 'website',
      locale,
      url: canonicalUrl,
      siteName: 'NachUI',
      images: [
        {
          url: getAssetUrl('/images/og/og-home.png'),
          width: 1200,
          height: 630,
          alt: `${t('title')} · NachUI`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} · NachUI`,
      description: t('metaDescription'),
      images: [getAssetUrl('/images/og/og-home.png')],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: buildAlternates('/components'),
    },
  };
}
