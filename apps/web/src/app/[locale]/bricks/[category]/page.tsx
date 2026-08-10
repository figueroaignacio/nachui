import { getAllCategorySlugs, getBrickCategory } from '@/features/bricks/lib/bricks-registry';
import { BrickCategoryView } from '@/features/bricks/views/brick-category-view';
import { buildAlternates, getAbsoluteUrl, locales } from '@/lib/domains';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ locale: string; category: string }>;
};

export default async function BricksCategoryPage({ params }: PageProps) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  const brickCategory = getBrickCategory(category);

  if (!brickCategory) {
    notFound();
  }

  return <BrickCategoryView category={brickCategory} />;
}

export function generateStaticParams() {
  const slugs = getAllCategorySlugs();
  return locales.flatMap((locale) =>
    slugs.map((category) => ({
      locale,
      category,
    })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, category } = await params;
  const brickCategory = getBrickCategory(category);

  if (!brickCategory) {
    return { title: 'Bricks' };
  }

  const canonicalUrl = getAbsoluteUrl(locale, `/bricks/${category}`);
  const count = brickCategory.bricks.length;
  const ogImageUrl =
    `${getAbsoluteUrl(locale, '/api/og/bricks')}` +
    `?name=${encodeURIComponent(brickCategory.name)}` +
    `&description=${encodeURIComponent(brickCategory.description)}` +
    `&count=${count}`;

  return {
    title: `${brickCategory.name} Bricks`,
    description: brickCategory.description,
    openGraph: {
      title: `${brickCategory.name} Bricks · NachUI`,
      description: brickCategory.description,
      type: 'website',
      locale,
      url: canonicalUrl,
      siteName: 'NachUI',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${brickCategory.name} Bricks · NachUI`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${brickCategory.name} Bricks · NachUI`,
      description: brickCategory.description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: buildAlternates(`/bricks/${category}`),
    },
  };
}
