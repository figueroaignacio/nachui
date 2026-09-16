import { IconsView } from '@/features/icons/views/icons-view';
import { buildAlternates, getAbsoluteUrl } from '@/lib/domains';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function IconsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <IconsView />;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sections.icons' });
  const canonicalUrl = getAbsoluteUrl(locale, '/icons');

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
      languages: buildAlternates('/icons'),
    },
  };
}
