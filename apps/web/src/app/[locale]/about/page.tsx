import { Typography } from '@repo/ui/components/typography';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { Container } from '@repo/ui/layout/container';
import { Flex } from '@repo/ui/layout/flex';
import { Stack } from '@repo/ui/layout/stack';
import { buildAlternates, getAbsoluteUrl } from '@/lib/domains';
import type { Metadata } from 'next';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('sections.about');

  const actions = [
    {
      label: 'ignaciofigueroa.dev',
      href: 'https://ignaciofigueroa.dev',
    },
    {
      label: 'github.com/figueroaignacio',
      href: 'https://github.com/figueroaignacio',
    },
    {
      label: 'in/figueroa-ignacio',
      href: 'https://www.linkedin.com/in/figueroa-ignacio/',
    },
  ];

  const profileSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: 'Ignacio Figueroa',
      description: t('subtitle'),
      image: 'https://github.com/figueroaignacio.png',
      sameAs: [
        'https://ignaciofigueroa.dev',
        'https://github.com/figueroaignacio',
        'https://www.linkedin.com/in/figueroa-ignacio/',
      ],
    },
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      className="bg-background relative min-h-svh overflow-hidden py-24"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
      />
      <Container as="section" size="lg" className="z-10 max-w-3xl">
        <div className="relative mb-8">
          <Image
            src="https://github.com/figueroaignacio.png"
            alt="Ignacio Figueroa"
            width={120}
            height={120}
            className="border-border relative z-10 rounded-full border shadow-md"
          />
        </div>
        <Typography
          variant="h1"
          className="text-foreground mb-4 text-4xl font-extrabold tracking-tight md:text-5xl"
        >
          {t('title')}
        </Typography>
        <Typography
          variant="h2"
          className="text-muted-foreground mb-12 text-xl font-medium md:text-2xl"
        >
          {t('subtitle')}
        </Typography>
        <Stack gap="6" className="text-foreground/80 max-w-2xl text-left text-lg leading-relaxed">
          <Typography variant="p">{t('content1')}</Typography>
          <Typography variant="p">{t('content2')}</Typography>
          <Typography variant="p">{t('content3')}</Typography>
          <Typography variant="p">{t('content4')}</Typography>
        </Stack>
        <Flex wrap="wrap" className="border-border mt-16 w-full space-x-3 border-t pt-8">
          {actions.map((action) => (
            <a
              key={action.href}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground underline transition-colors"
            >
              {action.label}
            </a>
          ))}
        </Flex>
      </Container>
    </Flex>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sections.about' });
  const canonicalUrl = getAbsoluteUrl(locale, '/about');

  return {
    title: t('title'),
    description: t('subtitle'),
    openGraph: {
      title: `${t('title')} | NachUI`,
      description: t('subtitle'),
      type: 'website',
      locale,
      url: canonicalUrl,
      siteName: 'NachUI',
      images: [
        {
          url: getAbsoluteUrl(locale, '/images/og/og-about.png'),
          width: 1200,
          height: 630,
          alt: t('title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} | NachUI`,
      description: t('subtitle'),
      images: [getAbsoluteUrl(locale, '/images/og/og-about.png')],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: buildAlternates('/about'),
    },
  };
}
