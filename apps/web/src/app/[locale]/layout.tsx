import { SkipLink } from '@/components/common/skip-link';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { PageFrame } from '@/components/layout/page-frame';
import { Providers } from '@/components/providers';
import { ThemeInitScript } from '@/components/common/theme-init-script';
import { routing } from '@/i18n/routing';
import { fontCode, fontHand, fontHeading, fontSans, fontSerif } from '@/lib/font';
import '@repo/ui/globals.css';

import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
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
  const t = await getTranslations({ locale, namespace: 'siteConfig' });

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'NachUI',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://nachui.tech',
    description: t('description'),
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Person',
      name: 'Ignacio Figueroa',
      url: 'https://ignaciofigueroa.dev',
    },
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <ThemeInitScript />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
      </head>
      <body
        className={`relative ${fontSans.variable} ${fontHeading.variable} ${fontSerif.variable} ${fontCode.variable} ${fontHand.variable}`}
      >
        <SkipLink />
        <NextIntlClientProvider>
          <Providers>
            <Header />
            <PageFrame>
              <main id="main-content">{children}</main>
            </PageFrame>
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
  const baseUrlVal = process.env.NEXT_PUBLIC_APP_URL || 'https://nachui.tech';
  const appUrl = `${baseUrlVal}/${locale}`;

  return {
    metadataBase: new URL(baseUrlVal),
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
  };
}
