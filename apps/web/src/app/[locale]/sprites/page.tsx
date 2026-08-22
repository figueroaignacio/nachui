import { SpritesView } from '@/features/sprites/views/sprites-view';
import { buildAlternates, getAbsoluteUrl } from '@/lib/domains';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SpritesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SpritesView />;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sections.sprites' });
  const canonicalUrl = getAbsoluteUrl(locale, '/sprites');

  return {
    title: t('title'),
    description: t('subtitle'),
    openGraph: {
      title: `${t('title')} · NachUI`,
      description: t('subtitle'),
      type: 'website',
      locale,
      url: canonicalUrl,
      siteName: 'NachUI',
    },
    alternates: {
      canonical: canonicalUrl,
      languages: buildAlternates('/sprites'),
    },
  };
}
