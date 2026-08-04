import { AboutView } from '@/features/about/views/about-view';
import { buildAlternates, getAbsoluteUrl } from '@/lib/domains';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutView />;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sections.about' });
  const canonicalUrl = getAbsoluteUrl(locale, '/about');

  return {
    title: t('title'),
    description: t('subtitle'),
    openGraph: {
      title: `${t('title')} | NachUI`,
      description: t('subtitle'),
      type: 'website',
      locale,
      url: canonicalUrl,
      siteName: 'NachUI',
      images: [
        {
          url: getAbsoluteUrl(locale, '/images/og/og-about.png'),
          width: 1200,
          height: 630,
          alt: t('title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} | NachUI`,
      description: t('subtitle'),
      images: [getAbsoluteUrl(locale, '/images/og/og-about.png')],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: buildAlternates('/about'),
    },
  };
}
