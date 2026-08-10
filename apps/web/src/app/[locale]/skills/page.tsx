import { SkillsView } from '@/features/skills/views/skills-view';
import { ContentRepository } from '@/lib/content-repository';
import { buildAlternates, getAbsoluteUrl } from '@/lib/domains';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ q?: string | string[] }>;
};

export default async function SkillsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const qRaw = (await searchParams)?.q;
  const initialQuery = Array.isArray(qRaw) ? (qRaw[0] ?? '') : (qRaw ?? '');

  const serializedSkills = ContentRepository.getSkills().map((skill) => ({
    slug: skill.slug,
    name: skill.name,
    description: skill.description,
  }));

  return <SkillsView initialSkills={serializedSkills} initialQuery={initialQuery} />;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'components.skillsList' });
  const canonicalUrl = getAbsoluteUrl(locale, '/skills');

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: `${t('title')} · NachUI`,
      description: t('description'),
      type: 'website',
      locale,
      url: canonicalUrl,
      siteName: 'NachUI',
      images: [
        {
          url: getAbsoluteUrl(locale, '/images/og/og-skills.png'),
          width: 1200,
          height: 630,
          alt: `${t('title')} · NachUI`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} · NachUI`,
      description: t('description'),
      images: [getAbsoluteUrl(locale, '/images/og/og-skills.png')],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: buildAlternates('/skills'),
    },
  };
}
