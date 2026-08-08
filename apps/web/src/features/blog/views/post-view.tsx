import { BackButton } from '@/components/common/back-button';
import { DeveloperWatermark } from '@/components/layout/developer-watermark';
import { MDXContent } from '@/components/mdx/mdx-content';
import { getAbsoluteUrl } from '@/lib/domains';
import { formatDateOnly } from '@/lib/format-date';
import { Typography } from '@repo/ui/components/typography';
import { Container } from '@repo/ui/layout/container';
import { Stack } from '@repo/ui/layout/stack';
import type { Post } from 'content-collections';
import { getLocale, getTranslations } from 'next-intl/server';

type PostViewProps = {
  post: Post;
};

export async function PostView({ post }: PostViewProps) {
  const locale = await getLocale();
  const t = await getTranslations('sections.blog');

  const canonicalUrl = getAbsoluteUrl(locale, `/blog/${post.slugAsParams}`);

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
      <div className="border-border space-y-3 border-b border-dashed pb-3">
        <Typography variant="p">{t('postedBy')}</Typography>
        <DeveloperWatermark />
      </div>
      <MDXContent code={post.body} />
    </Container>
  );
}
