import { HomeView } from '@/features/landing/views/home-view';
import { buildAlternates, getAbsoluteUrl, getAssetUrl } from '@/lib/domains';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeView />;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'siteConfig' });
  const canonicalUrl = getAbsoluteUrl(locale, '/');

  return {
    title: {
      absolute: `NachUI · ${t('title')}`,
    },
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale,
      url: canonicalUrl,
      siteName: 'NachUI',
      images: [
        {
          url: getAssetUrl('/images/og/og-home.png'),
          width: 1200,
          height: 630,
          alt: t('description'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [getAssetUrl('/images/og/og-home.png')],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: buildAlternates('/'),
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
