import { BricksView } from '@/features/bricks/views/bricks-view';
import { buildAlternates, getAbsoluteUrl, getAssetUrl } from '@/lib/domains';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function BricksPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <BricksView />;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sections.bricks' });
  const canonicalUrl = getAbsoluteUrl(locale, '/bricks');

  return {
    title: 'Bricks',
    description: t('description'),
    openGraph: {
      title: 'Bricks · NachUI',
      description: t('description'),
      type: 'website',
      locale,
      url: canonicalUrl,
      siteName: 'NachUI',
      images: [
        {
          url: getAssetUrl('/images/og/og-bricks.png'),
          width: 1200,
          height: 630,
          alt: 'Bricks · NachUI',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Bricks · NachUI',
      description: t('description'),
      images: [getAssetUrl('/images/og/og-bricks.png')],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: buildAlternates('/bricks'),
    },
  };
}
