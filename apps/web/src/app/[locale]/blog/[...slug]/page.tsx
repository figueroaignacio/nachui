import { Typography } from '@repo/ui/components/typography';
import { BackButton } from '@/components/common/back-button';
import { DeveloperWatermark } from '@/components/layout/developer-watermark';
import { MDXContent } from '@/components/mdx/mdx-content';
import { allPosts as posts } from 'content-collections';
import { ContentRepository } from '@/lib/content-repository';
import { formatDateOnly } from '@/lib/format-date';
import { buildAlternates, getAbsoluteUrl } from '@/lib/domains';
import { Container } from '@repo/ui/layout/container';
import { Stack } from '@repo/ui/layout/stack';
import type { Locale } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next/types';

interface PostPageProps {
  slug: string[];
  locale?: Locale;
}

async function getPostFromParams({ params }: { params: Promise<PostPageProps> }) {
  const parameters = await params;
  const slug = parameters.slug?.join('/') || '';
  const locale = parameters.locale || 'en';

  return ContentRepository.getPostBySlug(slug, locale);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PostPageProps>;
}): Promise<Metadata> {
  const parameters = await params;

  const post = await getPostFromParams({ params });
  const locale = parameters.locale || 'en';
  const slugPath = parameters.slug?.join('/') || '';

  if (!post) {
    return {};
  }

  const canonicalUrl = getAbsoluteUrl(locale, `/blog/${slugPath}`);

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: `${post.title} | NachUI`,
      description: post.description,
      type: 'article',
      locale,
      url: canonicalUrl,
      siteName: 'NachUI',
      images: [
        {
          url: getAbsoluteUrl(locale, '/images/og/og-home.png'),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | NachUI`,
      description: post.description,
      images: [getAbsoluteUrl(locale, '/images/og/og-home.png')],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: buildAlternates(`/blog/${slugPath}`),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export async function generateStaticParams(): Promise<{ slug: string[]; locale: string }[]> {
  if (!Array.isArray(posts)) {
    console.error('posts is not an array!', typeof posts);
    return [];
  }

  return posts
    .filter((post) => post.slugAsParams && post.published)
    .map((post) => ({
      slug: post.slugAsParams.split('/').filter(Boolean),
      locale: post.locale || 'en',
    }));
}

export default async function PostPage({ params }: { params: Promise<PostPageProps> }) {
  const locale = await getLocale();
  const t = await getTranslations('sections.blog');
  const post = await getPostFromParams({ params });

  if (!post || !post.published) {
    notFound();
  }

  const parameters = await params;
  const slugPath = parameters.slug?.join('/') || '';
  const canonicalUrl = getAbsoluteUrl(locale, `/blog/${slugPath}`);

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: post.locale || 'en',
    author: {
      '@type': 'Person',
      name: 'Ignacio Figueroa',
      url: 'https://ignaciofigueroa.dev',
    },
    publisher: {
      '@type': 'Organization',
      name: 'NachUI',
      url: 'https://nachui.tech',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };

  return (
    <Container as="article" size="md" className="space-y-8 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <BackButton />
      <Typography variant="p">{formatDateOnly(post.date, locale)}</Typography>
      <Stack gap="1">
        <Typography variant="h1" className="text-3xl font-bold">
          {post.title}
        </Typography>
        <Typography variant="p" className="text-muted-foreground">
          {post.description}
        </Typography>
      </Stack>
      <div className="border-border space-y-3 border-b pb-3">
        <Typography variant="p">{t('postedBy')}</Typography>
        <DeveloperWatermark />
      </div>
      <MDXContent code={post.body} />
    </Container>
  );
}
