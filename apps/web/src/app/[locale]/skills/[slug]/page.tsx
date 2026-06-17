import { BackButton } from '@/components/common/back-button';
import { CopyButton } from '@/components/mdx/copy-button';
import { MDXContent } from '@/components/mdx/mdx-content';
import { getSkillInstallCommand, getSkillSourceUrl } from '@/features/skills/lib/skills';
import { ContentRepository } from '@/lib/content-repository';
import { buildAlternates, getAbsoluteUrl, locales } from '@/lib/domains';
import { Container } from '@repo/ui/layout/container';
import { Typography } from '@repo/ui/src/components/typography';
import { Stack } from '@repo/ui/src/layout/stack';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export default async function SkillDetailPage({ params }: PageProps) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'components.skillDetail' });

  const skill = ContentRepository.getSkillBySlug(slug);
  if (!skill) {
    notFound();
  }

  const cliCommand = getSkillInstallCommand(skill.slug);
  const githubUrl = getSkillSourceUrl(skill.slug);

  return (
    <div className="bg-background min-h-svh">
      <Container size="md" className="px-0 py-10">
        <BackButton />
        <Stack className="border-border mt-6 mb-8 border-b pb-8" gap="4">
          <Typography variant="h1">{skill.name}</Typography>
          <p className="text-muted-foreground mb-6 font-mono text-base">
            figueroaignacio/ui-skills ·{' '}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline underline-offset-2 transition-colors"
            >
              {t('viewSource')}
            </a>
          </p>
          <div className="text-foreground bg-muted/30 border-border flex w-full max-w-lg items-center gap-3 rounded border px-4 py-2.5 font-mono text-sm">
            <span className="text-muted-foreground shrink-0">$</span>
            <code className="flex-1 truncate text-sm select-all">{cliCommand}</code>
            <CopyButton
              value={cliCommand}
              className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
            />
          </div>
        </Stack>
        <p className="text-muted-foreground mb-10 font-mono text-sm italic">
          {t('triggersWhen', { description: skill.description })}
        </p>
        <article className="prose prose-sm dark:prose-invert max-w-none">
          <MDXContent code={skill.body} />
        </article>
      </Container>
    </div>
  );
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
      title: `${skill.name} | NachUI`,
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
          alt: `${skill.name} | NachUI`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${skill.name} | NachUI`,
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
