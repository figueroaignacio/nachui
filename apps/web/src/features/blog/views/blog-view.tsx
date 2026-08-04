import { AllPosts } from '@/features/blog/components/all-posts';
import { Typography } from '@repo/ui/components/typography';
import { Container } from '@repo/ui/layout/container';
import { Stack } from '@repo/ui/layout/stack';
import { getTranslations } from 'next-intl/server';

export async function BlogView() {
  const t = await getTranslations('sections.blog');

  return (
    <Container as="section" className="space-y-12 py-12">
      <Stack gap="1">
        <Typography variant="h1" className="text-2xl font-bold">
          Blog
        </Typography>
        <Typography variant="h2" className="text-muted-foreground text-lg">
          {t('subtitle')}
        </Typography>
      </Stack>
      <AllPosts />
    </Container>
  );
}
