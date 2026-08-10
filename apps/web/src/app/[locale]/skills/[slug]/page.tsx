import { SkillDetailView } from '@/features/skills/views/skill-detail-view';
import { ContentRepository } from '@/lib/content-repository';
import { buildAlternates, getAbsoluteUrl, locales } from '@/lib/domains';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export default async function SkillDetailPage({ params }: PageProps) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const skill = ContentRepository.getSkillBySlug(slug);
  if (!skill) {
    notFound();
  }

  return <SkillDetailView skill={skill} />;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const skill = ContentRepository.getSkillBySlug(slug);
  if (!skill) return { title: 'Skill Not Found' };

  const canonicalUrl = getAbsoluteUrl(locale, `/skills/${slug}`);

  const ogImageUrl = `${getAbsoluteUrl(locale, '/api/og/skills')}?name=${encodeURIComponent(skill.name)}&description=${encodeURIComponent(skill.description)}`;

  return {
    title: skill.name,
    description: skill.description,
    openGraph: {
      title: `${skill.name} · NachUI`,
      description: skill.description,
      type: 'article',
      locale,
      url: canonicalUrl,
      siteName: 'NachUI',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${skill.name} · NachUI`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${skill.name} · NachUI`,
      description: skill.description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: buildAlternates(`/skills/${slug}`),
    },
  };
}

export async function generateStaticParams() {
  const skills = ContentRepository.getSkills();
  return locales.flatMap((locale) =>
    skills.map((skill) => ({
      locale,
      slug: skill.slug,
    })),
  );
}
