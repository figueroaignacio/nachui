import {
  getAllGallerySlugs,
  getGalleryComponent,
  humanize,
} from '@/features/gallery/lib/gallery-registry';
import { GalleryComponentView } from '@/features/gallery/views/gallery-component-view';
import { buildAlternates, getAbsoluteUrl, getAssetUrl, locales } from '@/lib/domains';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

type DocsNavItem = { title: string; href: string; description?: string };
type DocsNavSection = { title: string; items: DocsNavItem[] };

export default async function GalleryComponentPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const entry = getGalleryComponent(slug);
  if (!entry) {
    notFound();
  }

  return <GalleryComponentView slug={slug} />;
}

export function generateStaticParams() {
  return locales.flatMap((locale) => getAllGallerySlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const entry = getGalleryComponent(slug);

  if (!entry) {
    return { title: 'Components' };
  }

  const tDocs = await getTranslations({ locale, namespace: 'docs' });
  const sections = tDocs.raw('navigation') as DocsNavSection[];
  const doc = sections
    .flatMap((section) => section.items)
    .find((item) => item.href === entry.docsHref);

  const title = doc?.title ?? humanize(slug);
  const t = await getTranslations({ locale, namespace: 'sections.gallery' });
  const description = doc?.description ?? t('metaDescription');
  const canonicalUrl = getAbsoluteUrl(locale, `/components/${slug}`);

  return {
    title: `${title} Examples`,
    description,
    openGraph: {
      title: `${title} · NachUI`,
      description,
      type: 'website',
      locale,
      url: canonicalUrl,
      siteName: 'NachUI',
      images: [
        {
          url: getAssetUrl('/images/og/og-home.png'),
          width: 1200,
          height: 630,
          alt: `${title} · NachUI`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} · NachUI`,
      description,
      images: [getAssetUrl('/images/og/og-home.png')],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: buildAlternates(`/components/${slug}`),
    },
  };
}
