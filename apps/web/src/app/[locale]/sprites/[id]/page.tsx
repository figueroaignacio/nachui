import { CAST, findMember } from '@/features/sprites/lib/cast';
import { SpriteView } from '@/features/sprites/views/sprite-view';
import { buildAlternates, getAbsoluteUrl } from '@/lib/domains';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export function generateStaticParams() {
  return CAST.map((member) => ({ id: member.id }));
}

export default async function SpritePage({ params }: PageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <SpriteView id={id} />;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: 'sections.sprites' });
  const member = findMember(id);

  if (!member) return {};

  const name = t(`cast.${member.id}.name`);
  const note = t(`cast.${member.id}.note`);
  const canonicalUrl = getAbsoluteUrl(locale, `/sprites/${member.id}`);

  return {
    title: name,
    description: note,
    openGraph: {
      title: `${name} · NachUI`,
      description: note,
      type: 'website',
      locale,
      url: canonicalUrl,
      siteName: 'NachUI',
    },
    alternates: {
      canonical: canonicalUrl,
      languages: buildAlternates(`/sprites/${member.id}`),
    },
  };
}
