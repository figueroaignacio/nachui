import { PostView } from '@/features/blog/views/post-view';
import { ContentRepository } from '@/lib/content-repository';
import { buildAlternates, getAbsoluteUrl } from '@/lib/domains';
import { allPosts as posts } from 'content-collections';
import type { Locale } from 'next-intl';
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

export default async function PostPage({ params }: { params: Promise<PostPageProps> }) {
  const post = await getPostFromParams({ params });

  if (!post || !post.published) {
    notFound();
  }

  return <PostView post={post} />;
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
