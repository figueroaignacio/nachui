import { SkipLink } from '@/components/common/skip-link';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Providers } from '@/components/providers';
import { ThemeInitScript } from '@/features/theme/components/theme-init-script';
import { routing } from '@/i18n/routing';
import { fontHeading, fontSans } from '@/lib/font';
import '@repo/ui/globals.css';
import { Container } from '@repo/ui/src/layout/container';
import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <ThemeInitScript />
      </head>
      <body className={`relative ${fontSans.variable} ${fontHeading.variable}`}>
        <SkipLink />
        <NextIntlClientProvider>
          <Providers>
            <Header />
            <main id="main-content">
              <Container size="fluid">{children}</Container>
            </main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'siteConfig' });
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/${locale}`
    : `https://nachui.tech/${locale}`;

  return {
    metadataBase: new URL(appUrl),
    title: {
      default: 'NachUI',
      template: `%s | NachUI`,
    },
    description: t('description'),
    openGraph: {
      title: 'NachUI',
      description: t('description'),
      siteName: 'NachUI',
      type: 'website',
      locale,
      url: appUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'NachUI',
      description: t('description'),
    },
    other: {
      'application/ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'NachUI',
        description: t('description'),
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
      }),
    },
  };
}
