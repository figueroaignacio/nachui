import { ThemesView } from '@/features/themes/views/themes-view';
import { buildAlternates, getAbsoluteUrl } from '@/lib/domains';
import type { Locale } from '@/lib/constants';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function ThemesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ThemesView />;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sections.themes' });
  const canonicalUrl = getAbsoluteUrl(locale, '/themes');

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
      languages: buildAlternates('/themes'),
    },
  };
}
