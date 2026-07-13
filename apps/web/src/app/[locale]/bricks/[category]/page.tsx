import { BrickPreview } from '@/features/bricks/components/brick-preview';
import { BricksHero } from '@/features/bricks/components/bricks-hero';
import { BRICK_COMPONENTS } from '@/features/bricks/lib/brick-components';
import { getAllCategorySlugs, getBrickCategory } from '@/features/bricks/lib/bricks-registry';
import { getBrickSourceCode } from '@/features/bricks/lib/get-brick-source';
import { buildAlternates, getAbsoluteUrl, locales } from '@/lib/domains';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ locale: string; category: string }>;
};

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
      title: `${brickCategory.name} Bricks | NachUI`,
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
          alt: `${brickCategory.name} Bricks | NachUI`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${brickCategory.name} Bricks | NachUI`,
      description: brickCategory.description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: buildAlternates(`/bricks/${category}`),
    },
  };
}

export default async function BricksCategoryPage({ params }: PageProps) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  const brickCategory = getBrickCategory(category);

  if (!brickCategory) {
    notFound();
  }

  const bricksWithCode = await Promise.all(
    brickCategory.bricks.map(async (brick) => {
      const { files } = await getBrickSourceCode(category, brick.component);
      return { ...brick, files };
    }),
  );

  return (
    <div className="bg-background min-h-svh">
      <BricksHero activeSlug={category} />
      <div className="flex flex-col gap-16">
        {bricksWithCode.map((brick) => {
          const Component = BRICK_COMPONENTS[brick.component];

          if (!Component) {
            return null;
          }

          return (
            <BrickPreview
              key={brick.id}
              id={brick.id}
              name={brick.name}
              description={brick.description}
              files={brick.files}
            >
              <Component />
            </BrickPreview>
          );
        })}
      </div>
    </div>
  );
}
